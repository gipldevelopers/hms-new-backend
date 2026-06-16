const { getTenantClient, mainDb } = require("../../database/tenant-manager");
const crypto = require("crypto");

/**
 * Get all stock transfers for a branch
 */
const getTransfers = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  const transfers = await tenantDb.stockTransfer.findMany({
    orderBy: { createdAt: "desc" }
  });
  return transfers;
};

/**
 * Create a new stock transfer, deduct item quantities, and log history
 */
const createTransfer = async (branchId, payload, userName) => {
  const tenantDb = await getTenantClient(branchId);
  
  const transferId = payload.transferId || `TX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const { source, destination, items = [], notes } = payload;

  if (items.length === 0) {
    throw new Error("Cannot transfer empty items list");
  }

  // 1. Process each item: update quantity in both tenantDb and mainDb
  for (const transferItem of items) {
    // Try to find in stockItem first
    let dbItem = await tenantDb.stockItem.findFirst({
      where: {
        OR: [
          { id: transferItem.id },
          { sku: transferItem.sku }
        ]
      }
    });

    let isDepartmentItem = false;
    if (!dbItem) {
      // Try to find in departmentInventory
      dbItem = await tenantDb.departmentInventory.findFirst({
        where: {
          OR: [
            { id: transferItem.id },
            { sku: transferItem.sku }
          ]
        }
      });
      if (dbItem) {
        isDepartmentItem = true;
      }
    }

    if (!dbItem) {
      throw new Error(`Stock item not found: ${transferItem.name || transferItem.sku}`);
    }

    const currentQtyVal = parseFloat(dbItem.qty) || 0;
    const transferQtyVal = parseFloat(transferItem.qty) || 0;

    if (transferQtyVal <= 0) {
      continue; // Skip items with no qty transferred
    }

    if (currentQtyVal < transferQtyVal) {
      throw new Error(`Insufficient stock for ${dbItem.name}. Available: ${currentQtyVal}, Requested: ${transferQtyVal}`);
    }

    // Parse unit
    const unitMatch = dbItem.qty.match(/[a-zA-Z\s/]+$/);
    const unit = unitMatch ? unitMatch[0] : "";

    const newQtyVal = currentQtyVal - transferQtyVal;
    const newQtyString = `${newQtyVal} ${unit}`.trim();

    // Determine status
    let computedStatus = "In Stock";
    const minThresholdVal = parseFloat(dbItem.minThreshold) || 5;
    if (newQtyVal === 0) {
      computedStatus = "Out of Stock";
    } else if (newQtyVal < minThresholdVal) {
      computedStatus = "LOW";
    }

    if (isDepartmentItem) {
      // Update in Tenant DB
      await tenantDb.departmentInventory.update({
        where: { id: dbItem.id },
        data: {
          qty: newQtyString,
          status: computedStatus
        }
      });

      // Update in Main DB
      await mainDb.departmentInventory.update({
        where: { id: dbItem.id },
        data: {
          qty: newQtyString,
          status: computedStatus
        }
      });

      // Log History in Tenant DB
      const historyId = crypto.randomUUID();
      const historyData = {
        id: historyId,
        itemId: dbItem.id,
        type: "Usage",
        qtyChanged: `-${transferQtyVal}`,
        user: userName || "System Admin",
        notes: notes || `Transferred ${transferQtyVal} ${unit} to ${destination}`
      };

      await tenantDb.departmentInventoryHistory.create({
        data: historyData
      });

      // Log History in Main DB
      await mainDb.departmentInventoryHistory.create({
        data: {
          ...historyData,
          branchId
        }
      });
    } else {
      // Update in Tenant DB
      await tenantDb.stockItem.update({
        where: { id: dbItem.id },
        data: {
          qty: newQtyString,
          status: computedStatus
        }
      });

      // Update in Main DB
      await mainDb.stockItem.update({
        where: { id: dbItem.id },
        data: {
          qty: newQtyString,
          status: computedStatus
        }
      });

      // Log Stock History in Tenant DB
      const historyId = crypto.randomUUID();
      const historyData = {
        id: historyId,
        itemId: dbItem.id,
        type: "Usage",
        qtyChanged: `-${transferQtyVal}`,
        user: userName || "System Admin",
        notes: notes || `Transferred ${transferQtyVal} ${unit} to ${destination}`
      };

      await tenantDb.stockHistory.create({
        data: historyData
      });

      // Log Stock History in Main DB
      await mainDb.stockHistory.create({
        data: {
          ...historyData,
          branchId
        }
      });
    }
  }

  // 2. Create the StockTransfer entry
  const transferUUID = crypto.randomUUID();
  const transferRecord = {
    id: transferUUID,
    transferId,
    source,
    destination,
    date: payload.date ? new Date(payload.date) : new Date(),
    totalItems: items.length,
    items: items, // Saved as JSON
    notes: notes || ""
  };

  // Create in Tenant DB
  const createdTransfer = await tenantDb.stockTransfer.create({
    data: transferRecord
  });

  // Create in Main DB
  await mainDb.stockTransfer.create({
    data: {
      ...transferRecord,
      branchId
    }
  });

  return createdTransfer;
};

module.exports = {
  getTransfers,
  createTransfer
};
