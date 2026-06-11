const { getTenantClient, mainDb } = require("../../database/tenant-manager");
const crypto = require("crypto");

/**
 * Helper to parse the flexible expiry date from string
 */
const parseExpiryDate = (expiryStr, createdAt) => {
  const createdDate = new Date(createdAt || Date.now());

  if (!expiryStr) {
    const d = new Date(createdDate);
    d.setMonth(d.getMonth() + 12);
    return d;
  }

  // Check for relative months format, e.g. "24 Months", "24 months", "12 Month"
  const monthMatch = expiryStr.match(/(\d+)\s*month/i);
  if (monthMatch) {
    const months = parseInt(monthMatch[1], 10);
    const d = new Date(createdDate);
    d.setDate(d.getDate() + (months * 30));
    return d;
  }

  // Clean date string
  const cleanStr = expiryStr.split("(")[0].trim();
  const parsed = Date.parse(cleanStr);
  if (!isNaN(parsed)) {
    return new Date(parsed);
  }

  // Fallback: 12 months
  const d = new Date(createdDate);
  d.setMonth(d.getMonth() + 12);
  return d;
};

/**
 * Get categorized batches
 */
const getBatches = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  const items = await tenantDb.stockItem.findMany({
    orderBy: { createdAt: "desc" }
  });

  const now = new Date();

  const expired = [];
  const expiring30 = [];
  const expiring60 = [];
  const healthy = [];

  for (const item of items) {
    const expiryDate = parseExpiryDate(item.expiry, item.createdAt);

    // Days diff
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Qty and unit parsing
    const qtyMatch = item.qty.match(/^([\d.,]+)\s*(.*)$/);
    const qtyNumber = qtyMatch ? parseFloat(qtyMatch[1].replace(/,/g, "")) : 0;
    const unit = qtyMatch ? qtyMatch[2].trim() : "Units";

    // Value estimation
    const val = qtyNumber * (item.unitPrice || 0);
    const valueStr = `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Expiry date format
    const formattedExpiryDate = expiryDate.toISOString().substring(0, 7);

    // MFG Date format
    const mfgDate = new Date(item.createdAt);
    const formattedMfgDate = mfgDate.toISOString().substring(0, 7);

    // Map cabinet & room
    let room = "Main Store";
    let cabinet = "Pallet Main-3";
    const cat = (item.category || "").toLowerCase();
    if (cat.includes("anesthetic")) {
      room = "Anesthesia Vault";
      cabinet = "Vault Fridge A";
    } else if (cat.includes("surgical")) {
      room = "O.T. Recovery Unit";
      cabinet = "O.T. Cabinet 4";
    } else if (cat.includes("antibiotic")) {
      room = "Central Pharmacy";
      cabinet = "Cabinet C-2";
    } else if (cat.includes("fluid")) {
      room = "Cold Storage A";
      cabinet = "Fridge B-3";
    }

    const mapped = {
      id: item.id,
      name: item.name,
      code: item.sku,
      mfg: formattedMfgDate,
      expiry: formattedExpiryDate,
      qty: `${qtyNumber} ${unit}`,
      qtyVal: qtyNumber,
      unit: unit,
      cabinet,
      value: valueStr,
      category: item.category,
      room,
      unitPrice: item.unitPrice,
      supplier: item.supplier || "Baxter Healthcare",
      minThreshold: item.minThreshold || "500",
      notes: item.notes || ""
    };

    if (diffDays < 0) {
      mapped.status = "Expired";
      mapped.valueLoss = valueStr;
      expired.push(mapped);
    } else if (diffDays <= 30) {
      mapped.status = `Near Expiry (30d)`;
      mapped.expiry = `${formattedExpiryDate} (In ${diffDays} days)`;
      expiring30.push(mapped);
    } else if (diffDays <= 60) {
      mapped.status = `Near Expiry (60d)`;
      mapped.expiry = `${formattedExpiryDate} (In ${diffDays} days)`;
      expiring60.push(mapped);
    } else {
      const remainingYears = (diffDays / 365).toFixed(1);
      mapped.status = remainingYears >= 1 ? `Safe (${Math.floor(remainingYears)}+ Year${Math.floor(remainingYears) > 1 ? 's' : ''})` : `Safe (${diffDays} Days)`;
      healthy.push(mapped);
    }
  }

  return {
    expired,
    expiring30,
    expiring60,
    healthy
  };
};

/**
 * Return inventory items to vendor
 */
const processReturn = async (branchId, returnData, userName) => {
  const { itemId, returnQty, returnNote, vendor, reason, settlementMode } = returnData;
  const tenantDb = await getTenantClient(branchId);

  const currentItem = await tenantDb.stockItem.findFirst({
    where: { id: itemId }
  });

  if (!currentItem) {
    throw new Error("Stock item not found");
  }

  const qtyToDeductVal = parseFloat(returnQty) || 0;
  if (qtyToDeductVal <= 0) {
    throw new Error("Invalid return quantity");
  }

  const qtyMatch = currentItem.qty.match(/^([\d.,]+)\s*(.*)$/);
  const currentQtyVal = qtyMatch ? parseFloat(qtyMatch[1].replace(/,/g, "")) : 0;
  const unit = qtyMatch ? qtyMatch[2].trim() : "Units";

  if (qtyToDeductVal > currentQtyVal) {
    throw new Error("Return quantity cannot exceed current stock quantity");
  }

  const newQtyVal = currentQtyVal - qtyToDeductVal;
  const newQty = `${newQtyVal} ${unit}`;

  let newStatus = "In Stock";
  if (newQtyVal === 0) {
    newStatus = "Out of Stock";
  } else if (newQtyVal < 500) {
    newStatus = "LOW";
  }

  const updatedItem = await tenantDb.stockItem.update({
    where: { id: itemId },
    data: {
      qty: newQty,
      status: newStatus
    }
  });

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

  const historyId = crypto.randomUUID();
  const historyData = {
    id: historyId,
    itemId: itemId,
    type: "Usage",
    qtyChanged: `-${qtyToDeductVal}`,
    user: userName || "System Admin",
    notes: returnNote || `Vendor return: ${qtyToDeductVal} ${unit} returned to ${vendor} due to ${reason} (${settlementMode})`
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

  // Create BatchReturn record in tenant DB
  await tenantDb.batchReturn.create({
    data: {
      itemId,
      qtyReturned: qtyToDeductVal,
      vendor: vendor || "Unknown Supplier",
      reason: reason || "Returned to vendor",
      settlementMode: settlementMode || "Refund",
      notes: returnNote || ""
    }
  });

  // Create BatchReturn record in main DB
  await mainDb.batchReturn.create({
    data: {
      itemId,
      qtyReturned: qtyToDeductVal,
      vendor: vendor || "Unknown Supplier",
      reason: reason || "Returned to vendor",
      settlementMode: settlementMode || "Refund",
      notes: returnNote || "",
      branchId
    }
  });

  return updatedItem;
};

module.exports = {
  getBatches,
  processReturn
};
