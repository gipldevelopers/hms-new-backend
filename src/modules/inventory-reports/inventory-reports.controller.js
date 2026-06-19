const service = require("./inventory-reports.service");
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
 * Get all inventory report statistics
 */
const getReportsStats = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const data = await service.getReportsStats(branchId);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error in getReportsStats controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getReportsStats
};
