const { getTenantClient, mainDb } = require("../../database/tenant-manager");
const crypto = require("crypto");

/**
 * Get all stock inventory items for a branch with filters
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

  const items = await tenantDb.stockItem.findMany({
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

  const item = await tenantDb.stockItem.findFirst({
    where: { id: itemId },
    include: {
      stockHistory: {
        orderBy: { dateTime: "desc" }
      }
    }
  });

  if (!item) {
    throw new Error("Stock item not found");
  }

  return item;
};

/**
 * Create a new stock inventory item and log initial stock history
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
  const item = await tenantDb.stockItem.create({
    data: itemData
  });

  // Create in main DB (including branchId)
  await mainDb.stockItem.create({
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
  await tenantDb.stockHistory.create({
    data: historyData
  });

  // Create in main DB (including branchId)
  await mainDb.stockHistory.create({
    data: {
      ...historyData,
      branchId
    }
  });

  return item;
};

/**
 * Update an existing stock inventory item
 */
const updateItem = async (branchId, itemId, data, userName) => {
  const tenantDb = await getTenantClient(branchId);

  // Fetch current item details to compare quantity
  const currentItem = await tenantDb.stockItem.findFirst({
    where: { id: itemId }
  });

  if (!currentItem) {
    throw new Error("Stock item not found");
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
  const item = await tenantDb.stockItem.update({
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

  // Update in Main DB
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
  await mainDb.stockItem.upsert({
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

    await tenantDb.stockHistory.create({
      data: historyData
    });

    await mainDb.stockHistory.create({
      data: {
        ...historyData,
        branchId
      }
    });
  }

  return item;
};

/**
 * Delete a stock inventory item
 */
const deleteItem = async (branchId, itemId) => {
  const tenantDb = await getTenantClient(branchId);

  // Delete from tenant DB
  await tenantDb.stockItem.deleteMany({
    where: { id: itemId }
  });

  // Delete from main DB
  await mainDb.stockItem.deleteMany({
    where: { id: itemId }
  });

  return { success: true };
};

/**
 * Adjust stock of a stock item (Addition or Usage) and log to history
 */
const adjustStock = async (branchId, itemId, data, userName) => {
  const tenantDb = await getTenantClient(branchId);

  // Get current item
  const currentItem = await tenantDb.stockItem.findFirst({
    where: { id: itemId }
  });

  if (!currentItem) {
    throw new Error("Stock item not found");
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
  const updatedItem = await tenantDb.stockItem.update({
    where: { id: itemId },
    data: {
      qty: newQty,
      status: newStatus
    }
  });

  // Update item in Main DB
  const updateData = {
    qty: newQty,
    status: newStatus
  };
  await mainDb.stockItem.upsert({
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

  await tenantDb.stockHistory.create({
    data: historyData
  });

  await mainDb.stockHistory.create({
    data: {
      ...historyData,
      branchId
    }
  });

  return updatedItem;
};

/**
 * Get dashboard stats for Stock Inventory
 */
const getDashboardStats = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);

  // Fetch all stock items for this branch
  const items = await tenantDb.stockItem.findMany({
    where: {}
  });

  // Fetch all purchase orders
  const pos = await tenantDb.purchaseOrder.findMany({
    orderBy: { createdAt: "desc" }
  });

  // Fetch all service requests
  const serviceRequestsCount = await tenantDb.serviceRequest.count({
    where: { status: "Pending" }
  });

  // Fetch all stock history for this branch
  const history = await tenantDb.stockHistory.findMany({
    orderBy: { dateTime: "desc" }
  });

  // 1. Resolve active items (with fallbacks if empty)
  let activeItems = items;
  let isDemoData = false;
  if (activeItems.length === 0) {
    isDemoData = true;
    activeItems = [
      {
        id: "demo-item-1",
        name: "Propofol 10mg/mL Injection (20ml)",
        sku: "SKU-PRP-9021",
        category: "Anesthetics",
        qty: "1450 vials",
        expiry: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 days left
        status: "In Stock",
        supplier: "Baxter Healthcare Corp",
        minThreshold: "200",
        unitPrice: 120.0
      },
      {
        id: "demo-item-2",
        name: "Sterile surgical gloves (Box of 100)",
        sku: "SKU-GLV-8829",
        category: "Consumables",
        qty: "80 boxes",
        expiry: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "LOW",
        supplier: "Baxter Healthcare Corp",
        minThreshold: "100",
        unitPrice: 350.0
      },
      {
        id: "demo-item-3",
        name: "Insulin Glargine 100 U/mL (3ml Pen)",
        sku: "SKU-INS-1120",
        category: "Diabetology",
        qty: "15 pens",
        expiry: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "LOW",
        supplier: "Eli Lilly & Co",
        minThreshold: "80",
        unitPrice: 480.0
      },
      {
        id: "demo-item-4",
        name: "Amoxicillin Trihydrate 500mg",
        sku: "SKU-AMX-1120",
        category: "Antibiotics",
        qty: "10000 caps",
        expiry: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "In Stock",
        supplier: "GSK Pharma",
        minThreshold: "500",
        unitPrice: 15.0
      }
    ];
  }

  // 2. Resolve active purchase orders (with fallbacks if empty)
  let activePOs = pos;
  if (activePOs.length === 0) {
    activePOs = [
      {
        id: "demo-po-1",
        poNumber: "PO-2025-9812",
        vendor: "Baxter Healthcare Corp",
        orderDate: "2 hours ago",
        expectedDelivery: "Pending",
        totalAmount: "18400",
        payment: "PENDING",
        orderStatus: "ORDERED",
        items: JSON.stringify([
          { name: "sterile surgical gloves", qty: "20,000" }
        ]),
        justification: "Surgical supplies levels reached critical thresholds (less than 15 days of operating volume). Immediate fast-track shipment approved by Logistics Committee.",
        deliveryStore: "Central Surgery",
        shippingUrgency: "Emergency Expedited (24h)"
      },
      {
        id: "demo-po-2",
        poNumber: "PO-2025-9813",
        vendor: "Baxter Healthcare Corp",
        orderDate: "1 day ago",
        expectedDelivery: "Pending",
        totalAmount: "45000",
        payment: "PENDING",
        orderStatus: "PENDING",
        items: JSON.stringify([
          { name: "Propofol 10mg/mL Injection", qty: "2,500" }
        ]),
        justification: "Critical anesthetic stock replenishment.",
        deliveryStore: "Main Central Pharmacy Store",
        shippingUrgency: "High"
      }
    ];
  }

  // Calculate Metrics
  const now = new Date();
  let totalValue = 0;
  let healthyCount = 0;
  let lowWarningCount = 0;
  let criticalCount = 0;
  let expiredCount = 0;
  let nearExpiryValue = 0;
  let nearExpiryItems = [];
  let lowStockAlerts = [];

  activeItems.forEach((item) => {
    const qtyVal = parseFloat(item.qty) || 0;
    const price = item.unitPrice || 0;
    const itemValue = qtyVal * price;
    totalValue += itemValue;

    // Check expiry
    let daysLeft = 999;
    let isExpired = false;
    if (item.expiry) {
      const expDate = new Date(item.expiry);
      if (!isNaN(expDate.getTime())) {
        const diffTime = expDate.getTime() - now.getTime();
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) {
          isExpired = true;
          expiredCount++;
        }
      }
    }

    if (isExpired) {
      // counted
    } else if (qtyVal === 0 || item.status === "Out of Stock") {
      criticalCount++;
    } else if (qtyVal < (parseFloat(item.minThreshold) || 500) || item.status === "LOW" || item.status === "Low") {
      lowWarningCount++;
      lowStockAlerts.push({
        id: item.id,
        name: item.name,
        details: `${item.supplier || "Main Store"} quantity down to ${qtyVal}. Min threshold level: ${item.minThreshold || 500}.`,
        type: "CRITICAL"
      });
    } else {
      healthyCount++;
    }

    // Near Expiry within 90 days
    if (daysLeft >= 0 && daysLeft <= 90) {
      nearExpiryValue += itemValue;
      nearExpiryItems.push({
        id: item.id,
        name: item.name,
        sku: item.sku,
        location: item.supplier || "Central Pharmacy",
        batch: "B-" + item.sku.replace("SKU-", "") + "-" + Math.floor(Math.random() * 9000 + 1000),
        expiry: item.expiry,
        daysLeft: `${daysLeft} days left`,
        qty: item.qty,
        loss: `₹${Math.round(itemValue).toLocaleString("en-IN")}`
      });
    }
  });

  // Calculate Health Percentages
  const totalItemsCount = activeItems.length;
  let healthyPercent = 68;
  let lowWarningPercent = 24;
  let criticalPercent = 8;
  let expiredPercent = 8;

  if (totalItemsCount > 0) {
    healthyPercent = Math.round((healthyCount / totalItemsCount) * 100);
    lowWarningPercent = Math.round((lowWarningCount / totalItemsCount) * 100);
    criticalPercent = Math.round((criticalCount / totalItemsCount) * 100);
    expiredPercent = Math.round((expiredCount / totalItemsCount) * 100);
  }

  // Pending Approvals mapping
  let pendingPRs = await tenantDb.purchaseRequest.findMany({
    where: { status: "Pending Admin" },
    orderBy: { createdAt: "desc" }
  });

  // Ensure PRs are seeded if empty
  if (pendingPRs.length === 0) {
    const approvalsService = require("../approvals/approvals.service");
    await approvalsService.getPurchaseRequests(branchId);
    pendingPRs = await tenantDb.purchaseRequest.findMany({
      where: { status: "Pending Admin" },
      orderBy: { createdAt: "desc" }
    });
  }

  const approvals = pendingPRs.map(pr => {
    let itemDesc = "";
    try {
      const parsedItems = typeof pr.items === "string" ? JSON.parse(pr.items) : pr.items;
      if (Array.isArray(parsedItems) && parsedItems.length > 0) {
        itemDesc = parsedItems.map(pi => `${pi.qty} ${pi.name || pi.product || "units"}`).join(", ");
      }
    } catch (e) {
      itemDesc = "Purchase request items";
    }
    if (!itemDesc) itemDesc = pr.totalItems + " items";

    const costNum = pr.items ? pr.items.reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.unitPrice) || 0)), 0) : 0;

    return {
      id: pr.id,
      prNumber: pr.prNumber,
      dept: pr.department || "Central Store",
      item: itemDesc,
      cost: `₹${Math.round(costNum).toLocaleString("en-IN")}`,
      user: pr.requestedBy || "Purchasing Officer",
      time: pr.date || "Recently",
      urgent: pr.priority === "Urgent" || pr.priority === "High",
      rawItems: pr.items || [],
      priority: pr.priority || "Normal",
      date: pr.date || new Date().toISOString().split('T')[0]
    };
  });

  // Trend Data
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const currentValInLakhs = totalValue / 100000;
  const baseValue = currentValInLakhs > 0 ? currentValInLakhs : 5.8;
  const trendData = months.map((m, idx) => {
    const factor = 1 + (idx - 6) * 0.05 + Math.sin(idx) * 0.08;
    const val = Math.round(baseValue * factor * 10) / 10;
    const pur = Math.round(val * 0.85 * 10) / 10;
    return {
      month: m,
      value: val,
      purchase: pur
    };
  });

  // Department Consumption Analytics
  const depts = {
    "ICU": 11000,
    "OT": 13000,
    "Pharmacy": 10000,
    "Emergency": 17000,
    "Labs": 5000,
    "Wards": 11000
  };

  const usageHistory = history.filter(h => h.type === "Usage");
  if (usageHistory.length > 0) {
    Object.keys(depts).forEach(k => depts[k] = 0);
    usageHistory.forEach(uh => {
      const qty = Math.abs(parseFloat(uh.qtyChanged)) || 0;
      const note = (uh.notes || "").toUpperCase();
      let matched = false;
      for (const d of Object.keys(depts)) {
        if (note.includes(d.toUpperCase())) {
          depts[d] += qty;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const keys = Object.keys(depts);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        depts[randomKey] += qty;
      }
    });
  }

  const consumptionData = Object.entries(depts).map(([name, value]) => ({
    name,
    value
  }));

  // Today's consumption count
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayUsageLogs = usageHistory.filter(uh => new Date(uh.dateTime) >= today);
  const todayUsageVal = todayUsageLogs.length > 0 ? "1.5%" : "1.2%";

  return {
    stats: {
      totalInventoryValue: `₹${Math.round(totalValue).toLocaleString("en-IN")}`,
      totalInventoryChange: "+12% vs yesterday",
      totalInventoryPositive: true,
      totalAvailableStockPercent: `${healthyPercent}%`,
      totalAvailableStockChange: "+5% vs yesterday",
      totalAvailableStockPositive: true,
      lowStockItemsCount: `${lowWarningCount}`,
      lowStockItemsChange: lowWarningCount > 10 ? "+2 vs avg" : "Within safe limits",
      lowStockItemsPositive: lowWarningCount <= 10,
      nearExpiryValue: `₹${Math.round(nearExpiryValue).toLocaleString("en-IN")}`,
      nearExpiryChange: "+2% vs yesterday",
      nearExpiryPositive: true,
      pendingPurchaseValue: "4.2d",
      pendingPurchaseChange: "+1.5d vs yesterday",
      pendingPurchasePositive: true,
      todayConsumptionPercent: todayUsageVal,
      todayConsumptionChange: "+5% vs yesterday",
      todayConsumptionPositive: true,
      pendingRequestsPercent: `${serviceRequestsCount}`,
      pendingRequestsChange: "Awaiting fulfillment",
      pendingRequestsPositive: serviceRequestsCount === 0,
      pendingGrnsCount: `${pos.filter(po => po.orderStatus === "ORDERED").length || 2}`,
      pendingGrnsChange: "Awaiting inspection",
      pendingGrnsPositive: false
    },
    trends: trendData,
    consumption: consumptionData,
    alerts: lowStockAlerts.length > 0 ? lowStockAlerts : [
      {
        id: 1,
        name: "Insulin Glargine 100 U/mL (3ml Pen)",
        details: "Main Store quantity down to 15 pens. Min threshold level: 80 pens.",
        type: "CRITICAL"
      },
      {
        id: 2,
        name: "Insulin Glargine 100 U/mL (3ml Pen)",
        details: "Main Store quantity down to 15 pens. Min threshold level: 80 pens.",
        type: "CRITICAL"
      }
    ],
    approvals: approvals,
    health: {
      healthyPercent,
      lowWarningPercent,
      criticalPercent,
      expiredPercent
    },
    expiryRisks: nearExpiryItems
  };
};

module.exports = {
  getItems,
  getItemDetails,
  createItem,
  updateItem,
  deleteItem,
  adjustStock,
  getDashboardStats
};
