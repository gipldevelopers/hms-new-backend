const service = require("./approvals.service");
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
 * Get all purchase requests
 */
const getPurchaseRequests = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const requests = await service.getPurchaseRequests(branchId);
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error in getPurchaseRequests controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get single purchase request details
 */
const getPurchaseRequestDetails = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const request = await service.getPurchaseRequestDetails(branchId, req.params.id);
    res.json({ success: true, data: request });
  } catch (error) {
    console.error("Error in getPurchaseRequestDetails controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Create a new purchase request
 */
const createPurchaseRequest = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const request = await service.createPurchaseRequest(branchId, req.body);
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error("Error in createPurchaseRequest controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update an existing purchase request
 */
const updatePurchaseRequest = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const request = await service.updatePurchaseRequest(branchId, req.params.id, req.body);
    res.json({ success: true, data: request });
  } catch (error) {
    console.error("Error in updatePurchaseRequest controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete a purchase request
 */
const deletePurchaseRequest = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const result = await service.deletePurchaseRequest(branchId, req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in deletePurchaseRequest controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getPurchaseRequests,
  getPurchaseRequestDetails,
  createPurchaseRequest,
  updatePurchaseRequest,
  deletePurchaseRequest
};
