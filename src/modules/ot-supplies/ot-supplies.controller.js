const service = require("./ot-supplies.service");
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

const getConsumptions = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }
    const filter = { search: req.query.search };
    const consumptions = await service.getConsumptions(branchId, filter);
    res.json({ success: true, data: consumptions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const logConsumption = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }

    const userName = req.user?.name || "System Admin";
    const data = req.body;

    const result = await service.logConsumption(branchId, data, userName);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getSupplies = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }
    const filter = { search: req.query.search };
    const supplies = await service.getSupplies(branchId, filter);
    res.json({ success: true, data: supplies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createSupplyItem = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }
    const data = req.body;
    const supply = await service.createSupplyItem(branchId, data);
    res.status(201).json({ success: true, data: supply });
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

const deleteConsumption = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    const { id } = req.params;

    if (!branchId) {
      return res.status(400).json({ success: false, error: "Active branch context required." });
    }

    const result = await service.deleteConsumption(branchId, id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getConsumptions,
  logConsumption,
  getSupplies,
  createSupplyItem,
  getDashboardStats,
  deleteConsumption
};

