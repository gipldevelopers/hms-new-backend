const branchService = require("./branch.service");

const createBranch = async (req, res) => {
  try {
    const branch = await branchService.createBranch(req.body);
    res.status(201).json({ success: true, data: branch });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllBranches = async (req, res) => {
  try {
    const branches = await branchService.getAllBranches(req.query);
    res.status(200).json({ success: true, data: branches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBranchById = async (req, res) => {
  try {
    const branch = await branchService.getBranchById(req.params.id);
    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
    res.status(200).json({ success: true, data: branch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBranch = async (req, res) => {
  try {
    const branch = await branchService.updateBranch(req.params.id, req.body);
    res.status(200).json({ success: true, data: branch });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteBranch = async (req, res) => {
  try {
    await branchService.deleteBranch(req.params.id);
    res.status(200).json({ success: true, message: "Branch deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await branchService.getBranchStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const initTables = async (req, res) => {
  try {
    await branchService.initTables(req.params.id);
    res.status(200).json({ success: true, message: "Tables push successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const syncAllBranches = async (req, res) => {
  try {
    const results = await branchService.syncAll();
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSchemaInfo = async (req, res) => {
  try {
    const info = await branchService.getSchemaInfo();
    res.status(200).json({ success: true, data: info });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getStats,
  initTables,
  syncAllBranches,
  getSchemaInfo
};
