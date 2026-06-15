const service = require("./department-inventory.service");
const prisma = require("../../database/prisma");

const resolveBranchId = async (req) => {
  let branchId = req.query.branchId || req.body.branchId || req.user?.branchId;

  if (branchId) {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (branch && branch.isDbInitialized) return branchId;
  }

  // Fallback to first active initialized branch
  const firstBranch = await prisma.branch.findFirst({
    where: { isDbInitialized: true }
  });

  return firstBranch?.id || null;
};

const getItems = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }

    const filters = {
      search: req.query.search,
      category: req.query.category,
      status: req.query.status
    };

    const items = await service.getItems(branchId, filters);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getItemDetails = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    const { id } = req.params;

    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }

    const item = await service.getItemDetails(branchId, id);
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }

    const userName = req.user?.name || "System Admin";
    const item = await service.createItem(branchId, req.body, userName);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    const { id } = req.params;

    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }

    const userName = req.user?.name || "System Admin";
    const item = await service.updateItem(branchId, id, req.body, userName);
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const adjustStock = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    const { id } = req.params;

    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }

    const userName = req.user?.name || "System Admin";
    const item = await service.adjustStock(branchId, id, req.body, userName);
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    const { id } = req.params;

    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }

    await service.deleteItem(branchId, id);
    res.json({ success: true, data: { success: true } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }

    const stats = await service.getDashboardStats(branchId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
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
