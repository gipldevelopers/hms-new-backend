const { getTenantClient, mainDb } = require("../../database/tenant-manager");
const crypto = require("crypto");

/**
 * Get all inventory items for a branch with filters
 */
const getItems = async (branchId, filters = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const { search, category, status } = filters;

  const where = {};

  if (category && category !== "All") {
    where.category = category;
  }

  if (status && status !== "All") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { supplier: { contains: search, mode: "insensitive" } }
    ];
  }

  const items = await tenantDb.inventoryItem.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });

  return items;
};

/**
 * Get single item details with stock history
 */
const getItemDetails = async (branchId, itemId) => {
  const tenantDb = await getTenantClient(branchId);

  const item = await tenantDb.inventoryItem.findUnique({
    where: { id: itemId },
    include: {
      stockHistory: {
        orderBy: { dateTime: "desc" }
      }
    }
  });

  if (!item) {
    throw new Error("Inventory item not found");
  }

  return item;
};

/**
 * Create a new inventory item and log initial stock history
 */
const createItem = async (branchId, data, userName) => {
  const tenantDb = await getTenantClient(branchId);
  const itemId = crypto.randomUUID();

  const itemData = {
    id: itemId,
    name: data.name,
    sku: data.sku,
    category: data.category,
    qty: data.qty,
    expiry: data.expiry,
    status: data.status || "In Stock",
    supplier: data.supplier || "",
    minThreshold: data.minThreshold || "5",
    notes: data.notes || "",
    unitPrice: parseFloat(data.unitPrice) || 0.0
  };

  // Create in tenant DB
  const item = await tenantDb.inventoryItem.create({
    data: itemData
  });

  // Create in main DB (including branchId)
  await mainDb.inventoryItem.create({
    data: {
      ...itemData,
      branchId
    }
  });

  // Parse initial quantity number
  const qtyNumber = parseInt(data.qty) || 0;
  const historyId = crypto.randomUUID();
  const historyData = {
    id: historyId,
    itemId: itemId,
    type: "Initial Stock",
    qtyChanged: `+${qtyNumber}`,
    user: userName || "System Admin",
    notes: data.notes || "Initial stock entry upon creation"
  };

  // Create in tenant DB
  await tenantDb.inventoryStockHistory.create({
    data: historyData
  });

  // Create in main DB (including branchId)
  await mainDb.inventoryStockHistory.create({
    data: {
      ...historyData,
      branchId
    }
  });

  return item;
};

/**
 * Update an existing inventory item
 */
const updateItem = async (branchId, itemId, data, userName) => {
  const tenantDb = await getTenantClient(branchId);

  // Fetch current item details to compare quantity
  const currentItem = await tenantDb.inventoryItem.findUnique({
    where: { id: itemId }
  });

  if (!currentItem) {
    throw new Error("Inventory item not found");
  }

  // Parse current and new quantity details
  const currentQtyVal = parseFloat(currentItem.qty) || 0;
  const currentUnit = currentItem.qty.replace(/^[0-9.\s]+/, "") || "Units";

  const newQtyVal = parseFloat(data.qty) || 0;
  const newUnit = data.qty.replace(/^[0-9.\s]+/, "") || currentUnit;

  // Determine status based on quantity value
  let computedStatus = "In Stock";
  if (newQtyVal === 0) {
    computedStatus = "Out of Stock";
  } else if (newQtyVal < 500) {
    computedStatus = "LOW";
  }

  // Update in Tenant DB
  const item = await tenantDb.inventoryItem.update({
    where: { id: itemId },
    data: {
      name: data.name,
      sku: data.sku,
      category: data.category,
      qty: data.qty,
      expiry: data.expiry,
      status: computedStatus,
      supplier: data.supplier,
      minThreshold: data.minThreshold || "500",
      notes: data.notes,
      unitPrice: parseFloat(data.unitPrice) || 0.0
    }
  });

  // Update in Main DB (using upsert for self-healing/resilience)
  const updateData = {
    name: data.name,
    sku: data.sku,
    category: data.category,
    qty: data.qty,
    expiry: data.expiry,
    status: computedStatus,
    supplier: data.supplier,
    minThreshold: data.minThreshold || "500",
    notes: data.notes,
    unitPrice: parseFloat(data.unitPrice) || 0.0
  };
  await mainDb.inventoryItem.upsert({
    where: { id: itemId },
    update: updateData,
    create: {
      id: itemId,
      branchId,
      ...updateData
    }
  });

  // If the quantity has changed, log it to the Stock Transaction History!
  if (currentQtyVal !== newQtyVal) {
    const diff = newQtyVal - currentQtyVal;
    const type = diff > 0 ? "Addition" : "Usage";
    const prefix = diff > 0 ? "+" : "";

    const historyId = crypto.randomUUID();
    const historyData = {
      id: historyId,
      itemId: itemId,
      type: type,
      qtyChanged: `${prefix}${diff.toFixed(2).replace(/\.00$/, "")}`,
      user: userName || "System Admin",
      notes: data.notes || `Stock quantity manually updated from ${currentItem.qty} to ${data.qty}`
    };

    await tenantDb.inventoryStockHistory.create({
      data: historyData
    });

    await mainDb.inventoryStockHistory.create({
      data: {
        ...historyData,
        branchId
      }
    });
  }

  return item;
};

/**
 * Delete an inventory item
 */
const deleteItem = async (branchId, itemId) => {
  const tenantDb = await getTenantClient(branchId);

  // Delete from tenant DB
  await tenantDb.inventoryItem.delete({
    where: { id: itemId }
  });

  // Delete from main DB
  await mainDb.inventoryItem.deleteMany({
    where: { id: itemId }
  });

  return { success: true };
};

/**
 * Adjust stock of an item (Addition or Usage) and log to history
 */
const adjustStock = async (branchId, itemId, data, userName) => {
  const tenantDb = await getTenantClient(branchId);

  // Get current item
  const currentItem = await tenantDb.inventoryItem.findUnique({
    where: { id: itemId }
  });

  if (!currentItem) {
    throw new Error("Inventory item not found");
  }

  // Parse quantities
  const currentQtyVal = parseFloat(currentItem.qty) || 0;
  const currentUnit = currentItem.qty.replace(/^[0-9.\s]+/, "") || "Units";

  const changeVal = parseFloat(data.qtyChanged) || 0;

  // Calculate new quantity
  let newQtyVal = currentQtyVal;
  let prefix = "";
  if (data.type === "Addition") {
    newQtyVal += Math.abs(changeVal);
    prefix = "+";
  } else if (data.type === "Usage") {
    newQtyVal -= Math.abs(changeVal);
    if (newQtyVal < 0) newQtyVal = 0;
    prefix = "-";
  }

  const newQty = `${newQtyVal} ${currentUnit}`;

  // Determine new status based on qty value (0 = Out of Stock, <500 = LOW, >=500 = In Stock)
  let newStatus = "In Stock";
  if (newQtyVal === 0) {
    newStatus = "Out of Stock";
  } else if (newQtyVal < 500) {
    newStatus = "LOW";
  }

  // Update item in Tenant DB
  const updatedItem = await tenantDb.inventoryItem.update({
    where: { id: itemId },
    data: {
      qty: newQty,
      status: newStatus
    }
  });

  // Update item in Main DB (using upsert for self-healing)
  const updateData = {
    qty: newQty,
    status: newStatus
  };
  await mainDb.inventoryItem.upsert({
    where: { id: itemId },
    update: updateData,
    create: {
      id: itemId,
      branchId,
      name: currentItem.name,
      sku: currentItem.sku,
      category: currentItem.category,
      expiry: currentItem.expiry,
      supplier: currentItem.supplier || "",
      minThreshold: currentItem.minThreshold || "500",
      notes: currentItem.notes || "",
      unitPrice: currentItem.unitPrice || 0.0,
      ...updateData
    }
  });

  // Log stock history
  const historyId = crypto.randomUUID();
  const historyData = {
    id: historyId,
    itemId: itemId,
    type: data.type,
    qtyChanged: `${prefix}${Math.abs(changeVal)}`,
    user: userName || "System Admin",
    notes: data.notes || ""
  };

  await tenantDb.inventoryStockHistory.create({
    data: historyData
  });

  await mainDb.inventoryStockHistory.create({
    data: {
      ...historyData,
      branchId
    }
  });

  return updatedItem;
};

module.exports = {
  getItems,
  getItemDetails,
  createItem,
  updateItem,
  deleteItem,
  adjustStock
};