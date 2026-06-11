const service = require("./purchase.service");
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
 * Get all purchase orders
 */
const getPurchaseOrders = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const orders = await service.getPurchaseOrders(branchId);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error in getPurchaseOrders controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get single purchase order details
 */
const getPurchaseOrderDetails = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const order = await service.getPurchaseOrderDetails(branchId, req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error in getPurchaseOrderDetails controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Create a new purchase order
 */
const createPurchaseOrder = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const order = await service.createPurchaseOrder(branchId, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error("Error in createPurchaseOrder controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update an existing purchase order
 */
const updatePurchaseOrder = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const order = await service.updatePurchaseOrder(branchId, req.params.id, req.body);
    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error in updatePurchaseOrder controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete a purchase order
 */
const deletePurchaseOrder = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const result = await service.deletePurchaseOrder(branchId, req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in deletePurchaseOrder controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getPurchaseOrders,
  getPurchaseOrderDetails,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder
};
