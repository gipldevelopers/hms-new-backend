const admissionsService = require("./admissions.service");
const prisma = require("../../database/prisma");

/**
 * Helper: resolve branchId with explicit check and fallback
 */
const resolveBranchId = async (req) => {
  let branchId = req.query.branchId || req.body.branchId || req.user.branchId;

  // If a branch is explicitly requested, don't fallback to another branch if it's not initialized
  const explicitBranchId = req.query.branchId || req.body.branchId;
  if (explicitBranchId) {
    const branch = await prisma.branch.findUnique({ where: { id: explicitBranchId } });
    if (!branch || !branch.isDbInitialized) {
      return null; // Explicit branch was not initialized
    }
    return explicitBranchId;
  }

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

  return branchId;
};

const getOverview = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      // If no valid/initialized branch was found, return empty array
      return res.json([]);
    }
    
    const overview = await admissionsService.getAdmissionsOverview(branchId, req.query);
    res.json(overview);
  } catch (error) {
    console.error("Error in getOverview:", error);
    res.status(500).json({ error: error.message });
  }
};

const createAdmission = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "Branch is not initialized or does not exist." });
    
    const result = await admissionsService.createAdmission(branchId, req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in createAdmission:", error);
    res.status(500).json({ error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      // If branch not initialized, return empty stats
      return res.json({ todayAdmissions: 0, todayDischarges: 0, inProgress: 0, pending: 0 });
    }
    
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
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "Branch is not initialized or does not exist." });
    
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
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "Branch is not initialized or does not exist." });
    
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
