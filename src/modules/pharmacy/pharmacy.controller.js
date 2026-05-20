const { getTenantClient } = require("../../database/tenant-manager");

const getInventoryList = async (req, res) => {
  try {
    const branchId = req.query.branchId || req.user.branchId;
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID is required." });
    }

    const tenantDb = await getTenantClient(branchId);
    const items = await tenantDb.pharmacyItem.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = req.query.branchId || req.user.branchId;
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID is required." });
    }

    const tenantDb = await getTenantClient(branchId);
    const item = await tenantDb.pharmacyItem.findUnique({
      where: { id }
    });

    if (!item) {
      return res.status(404).json({ success: false, error: "Inventory item not found." });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    const branchId = req.body.branchId || req.user.branchId;
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID is required." });
    }

    const { medicineName, type, mfg, quantity, expiryDate, notes, rackId, storageType } = req.body;

    if (!medicineName || !type) {
      return res.status(400).json({ error: "Medicine Name and Type are required." });
    }

    // Determine status based on quantity
    const qty = parseInt(quantity) || 0;
    let status = "IN STOCK";
    if (qty === 0) {
      status = "OUT OF STOCK";
    } else if (qty < 500) {
      status = "LOW";
    }

    const tenantDb = await getTenantClient(branchId);
    const newItem = await tenantDb.pharmacyItem.create({
      data: {
        medicineName,
        type,
        mfg: mfg || null,
        quantity: qty,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        notes: notes || null,
        rackId: rackId || null,
        storageType: storageType || "Cold Storage",
        status
      }
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = req.body.branchId || req.user.branchId;
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID is required." });
    }

    const { medicineName, type, mfg, quantity, expiryDate, notes, rackId, storageType } = req.body;

    const qty = parseInt(quantity);
    const updateData = {};
    
    if (medicineName !== undefined) updateData.medicineName = medicineName;
    if (type !== undefined) updateData.type = type;
    if (mfg !== undefined) updateData.mfg = mfg || null;
    if (quantity !== undefined) {
      updateData.quantity = qty;
      let status = "IN STOCK";
      if (qty === 0) {
        status = "OUT OF STOCK";
      } else if (qty < 500) {
        status = "LOW";
      }
      updateData.status = status;
    }
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (notes !== undefined) updateData.notes = notes || null;
    if (rackId !== undefined) updateData.rackId = rackId || null;
    if (storageType !== undefined) updateData.storageType = storageType || "Cold Storage";

    const tenantDb = await getTenantClient(branchId);
    const updatedItem = await tenantDb.pharmacyItem.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = req.query.branchId || req.user.branchId;
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID is required." });
    }

    const tenantDb = await getTenantClient(branchId);
    await tenantDb.pharmacyItem.delete({
      where: { id }
    });

    res.json({ success: true, message: "Inventory item deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getInventoryList,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
};
