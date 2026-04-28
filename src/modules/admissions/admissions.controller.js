const admissionsService = require("./admissions.service");
const prisma = require("../../database/prisma");

const getOverview = async (req, res) => {
  try {
    let branchId = req.query.branchId || req.user.branchId;
    
    if (branchId) {
      const branch = await prisma.branch.findUnique({ where: { id: branchId } });
      if (!branch || !branch.isDbInitialized) branchId = null;
    }

    if (!branchId) {
      const firstBranch = await prisma.branch.findFirst({
        where: { isDbInitialized: true }
      });
      if (firstBranch) branchId = firstBranch.id;
    }
    
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });
    
    const overview = await admissionsService.getAdmissionsOverview(branchId, req.query);
    res.json(overview);
  } catch (error) {
    console.error("Error in getOverview:", error);
    res.status(500).json({ error: error.message });
  }
};

const createAdmission = async (req, res) => {
  try {
    let branchId = req.body.branchId || req.query.branchId || req.user.branchId;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    const result = await admissionsService.createAdmission(branchId, req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in createAdmission:", error);
    res.status(500).json({ error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    let branchId = req.query.branchId || req.user.branchId;
    
    if (branchId) {
      const branch = await prisma.branch.findUnique({ where: { id: branchId } });
      if (!branch || !branch.isDbInitialized) branchId = null;
    }

    if (!branchId) {
      const firstBranch = await prisma.branch.findFirst({
        where: { isDbInitialized: true }
      });
      if (firstBranch) branchId = firstBranch.id;
    }
    
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    const stats = await admissionsService.getStats(branchId);
    res.json(stats);
  } catch (error) {
    console.error("Error in getStats:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    let branchId = req.body.branchId || req.query.branchId || req.user.branchId;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    const result = await admissionsService.updateAdmission(branchId, id, req.body);
    res.json(result);
  } catch (error) {
    console.error("Error in updateAdmission:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    let branchId = req.query.branchId || req.user.branchId;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    const result = await admissionsService.deleteAdmission(branchId, id);
    res.json(result);
  } catch (error) {
    console.error("Error in deleteAdmission:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOverview,
  createAdmission,
  updateAdmission,
  deleteAdmission,
  getStats
};
