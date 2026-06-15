const { getTenantClient, mainDb } = require("../../database/tenant-manager");
const crypto = require("crypto");

/**
 * Get all department inventory items for a branch with filters
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

  const items = await tenantDb.departmentInventory.findMany({
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

  const item = await tenantDb.departmentInventory.findFirst({
    where: { id: itemId },
    include: {
      stockHistory: {
        orderBy: { dateTime: "desc" }
      }
    }
  });

  if (!item) {
    throw new Error("Department inventory item not found");
  }

  return item;
};

/**
 * Create a new department inventory item and log initial stock history
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
    minThreshold: data.minThreshold || "10",
    notes: data.notes || "",
    unitPrice: parseFloat(data.unitPrice) || 0.0,
    unit: data.unit || null
  };

  // Create in tenant DB
  const item = await tenantDb.departmentInventory.create({
    data: itemData
  });

  // Create in main DB
  await mainDb.departmentInventory.create({
    data: {
      ...itemData,
      branchId
    }
  });

  // Parse initial quantity
  const qtyVal = parseFloat(data.qty) || 0;
  const historyId = crypto.randomUUID();
  const historyData = {
    id: historyId,
    itemId: itemId,
    type: "Initial Stock",
    qtyChanged: `+${qtyVal}`,
    user: userName || "System Admin",
    notes: data.notes || "Initial stock entry upon creation"
  };

  // Create history in tenant DB
  await tenantDb.departmentInventoryHistory.create({
    data: historyData
  });

  // Create history in main DB
  await mainDb.departmentInventoryHistory.create({
    data: {
      ...historyData,
      branchId
    }
  });

  return item;
};

/**
 * Update an existing department inventory item
 */
const updateItem = async (branchId, itemId, data, userName) => {
  const tenantDb = await getTenantClient(branchId);

  const currentItem = await tenantDb.departmentInventory.findFirst({
    where: { id: itemId }
  });

  if (!currentItem) {
    throw new Error("Department inventory item not found");
  }

  const currentQtyVal = parseFloat(currentItem.qty) || 0;
  const newQtyVal = parseFloat(data.qty) || 0;

  // Status calculation
  const parsedThreshold = parseFloat(data.minThreshold) || 10;
  let computedStatus = "In Stock";
  if (newQtyVal === 0) {
    computedStatus = "Out of Stock";
  } else if (newQtyVal <= parsedThreshold) {
    computedStatus = "Low";
  }

  const itemData = {
    name: data.name,
    sku: data.sku,
    category: data.category,
    qty: data.qty,
    expiry: data.expiry,
    status: computedStatus,
    supplier: data.supplier || "",
    minThreshold: data.minThreshold || "10",
    notes: data.notes || "",
    unitPrice: parseFloat(data.unitPrice) || 0.0,
    unit: data.unit || null
  };

  // Update in Tenant DB
  const item = await tenantDb.departmentInventory.update({
    where: { id: itemId },
    data: itemData
  });

  // Update in Main DB
  await mainDb.departmentInventory.upsert({
    where: { id: itemId },
    update: itemData,
    create: {
      id: itemId,
      branchId,
      ...itemData
    }
  });

  // Log to history if quantity changed
  if (currentQtyVal !== newQtyVal) {
    const diff = newQtyVal - currentQtyVal;
    const type = diff > 0 ? "Addition" : "Usage";
    const prefix = diff > 0 ? "+" : "";

    const historyId = crypto.randomUUID();
    const historyData = {
      id: historyId,
      itemId: itemId,
      type,
      qtyChanged: `${prefix}${diff}`,
      user: userName || "System Admin",
      notes: data.notes || `Stock updated from ${currentQtyVal} to ${newQtyVal}`
    };

    // Tenant DB history
    await tenantDb.departmentInventoryHistory.create({
      data: historyData
    });

    // Main DB history
    await mainDb.departmentInventoryHistory.create({
      data: {
        ...historyData,
        branchId
      }
    });
  }

  return item;
};

/**
 * Adjust stock of a department item (Addition/Usage)
 */
const adjustStock = async (branchId, itemId, data, userName) => {
  const tenantDb = await getTenantClient(branchId);

  const item = await tenantDb.departmentInventory.findFirst({
    where: { id: itemId }
  });

  if (!item) {
    throw new Error("Department inventory item not found");
  }

  const currentQty = parseFloat(item.qty) || 0;
  const change = parseFloat(data.qtyChanged) || 0;
  const isUsage = data.type === "Usage";
  
  const finalChange = isUsage ? -Math.abs(change) : Math.abs(change);
  const newQty = Math.max(0, currentQty + finalChange);

  // Status calculation
  const parsedThreshold = parseFloat(item.minThreshold) || 10;
  let computedStatus = "In Stock";
  if (newQty === 0) {
    computedStatus = "Out of Stock";
  } else if (newQty <= parsedThreshold) {
    computedStatus = "Low";
  }

  // Update Item in Tenant DB
  const updatedItem = await tenantDb.departmentInventory.update({
    where: { id: itemId },
    data: {
      qty: String(newQty),
      status: computedStatus
    }
  });

  // Update Item in Main DB
  await mainDb.departmentInventory.update({
    where: { id: itemId },
    data: {
      qty: String(newQty),
      status: computedStatus
    }
  });

  // Log to transaction history
  const historyId = crypto.randomUUID();
  const prefix = finalChange > 0 ? "+" : "";
  const historyData = {
    id: historyId,
    itemId: itemId,
    type: data.type || (finalChange > 0 ? "Addition" : "Usage"),
    qtyChanged: `${prefix}${finalChange}`,
    user: userName || "System Admin",
    notes: data.notes || `${data.type} adjustment of ${change}`
  };

  await tenantDb.departmentInventoryHistory.create({
    data: historyData
  });

  await mainDb.departmentInventoryHistory.create({
    data: {
      ...historyData,
      branchId
    }
  });

  return updatedItem;
};

/**
 * Delete a department inventory item
 */
const deleteItem = async (branchId, itemId) => {
  const tenantDb = await getTenantClient(branchId);

  // Delete from Tenant DB (cascade will handle histories)
  await tenantDb.departmentInventory.delete({
    where: { id: itemId }
  });

  // Delete from Main DB
  await mainDb.departmentInventory.delete({
    where: { id: itemId }
  }).catch(() => {}); // ignore if already deleted or missing

  return true;
};

/**
 * Get dashboard stats for department inventory
 */
const getDashboardStats = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);

  const items = await tenantDb.departmentInventory.findMany();

  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.status === "Low" || item.status === "LOW").length;
  const outOfStockItems = items.filter(item => item.status === "Out of Stock" || parseFloat(item.qty) === 0).length;
  
  // Count unique categories
  const categories = new Set(items.map(item => item.category)).size;

  return {
    totalItems,
    lowStockItems,
    outOfStockItems,
    categories
  };
};

module.exports = {
  getItems,
  getItemDetails,
  createItem,
  updateItem,
  adjustStock,
  deleteItem,
  getDashboardStats
};
