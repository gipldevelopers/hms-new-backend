const service = require("./stock-transfer.service");
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
 * Get all transfers
 */
const getTransfers = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const transfers = await service.getTransfers(branchId);
    res.json({ success: true, data: transfers });
  } catch (error) {
    console.error("Error in getTransfers controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Create a new transfer
 */
const createTransfer = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const userName = req.user?.name || "System Admin";
    const transfer = await service.createTransfer(branchId, req.body, userName);
    res.status(201).json({ success: true, data: transfer });
  } catch (error) {
    console.error("Error in createTransfer controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete a transfer
 */
const deleteTransfer = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const { id } = req.params;
    const userName = req.user?.name || "System Admin";

    await service.deleteTransfer(branchId, id, userName);
    res.json({ success: true, message: "Stock transfer deleted and stock reverted successfully." });
  } catch (error) {
    console.error("Error in deleteTransfer controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getTransfers,
  createTransfer,
  deleteTransfer
};
