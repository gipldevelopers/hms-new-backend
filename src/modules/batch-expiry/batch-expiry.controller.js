const service = require("./batch-expiry.service");
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
 * Get categorized batches
 */
const getBatches = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const batches = await service.getBatches(branchId);
    res.json({ success: true, data: batches });
  } catch (error) {
    console.error("Error in getBatches controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Process vendor return
 */
const processReturn = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const userName = req.user?.name || "System Admin";
    const result = await service.processReturn(branchId, req.body, userName);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in processReturn controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getBatches,
  processReturn
};
