const service = require("./hospital-inventory.service");
const prisma = require("../../database/prisma");

/**
 * Helper to resolve the correct branch ID with superadmin fallback
 */
const resolveBranchId = async (req) => {
  let branchId = req.query.branchId || req.body.branchId || req.user?.branchId;

  if (branchId) {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (branch && branch.isDbInitialized) return branchId;
  }

  // Fallback to first initialized branch
  const firstBranch = await prisma.branch.findFirst({
    where: { isDbInitialized: true }
  });
  
  return firstBranch?.id || null;
};

/**
 * Get all inventory items
 */
const getItems = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const filters = {
      search: req.query.search,
      category: req.query.category,
      status: req.query.status
    };

    const items = await service.getItems(branchId, filters);
    res.json({ success: true, data: items });
  } catch (error) {
    console.error("Error in getItems controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get single item details with history
 */
const getItemDetails = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const { id } = req.params;
    const item = await service.getItemDetails(branchId, id);
    res.json({ success: true, data: item });
  } catch (error) {
    console.error("Error in getItemDetails controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Create a new item
 */
const createItem = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const userName = req.user?.name || "System Admin";
    const item = await service.createItem(branchId, req.body, userName);
    res.status(211).json({ success: true, data: item });
  } catch (error) {
    console.error("Error in createItem controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update an existing item
 */
const updateItem = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const { id } = req.params;
    const userName = req.user?.name || "System Admin";
    const item = await service.updateItem(branchId, id, req.body, userName);
    res.json({ success: true, data: item });
  } catch (error) {
    console.error("Error in updateItem controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete an inventory item
 */
const deleteItem = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const { id } = req.params;
    const result = await service.deleteItem(branchId, id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in deleteItem controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Adjust stock quantity and log transaction
 */
const adjustStock = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const { id } = req.params;
    const userName = req.user?.name || "System Admin";
    const updatedItem = await service.adjustStock(branchId, id, req.body, userName);
    res.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("Error in adjustStock controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getItems,
  getItemDetails,
  createItem,
  updateItem,
  deleteItem,
  adjustStock
};
