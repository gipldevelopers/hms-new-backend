const service = require("./supplier.service");
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
 * Get all suppliers
 */
const getSuppliers = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const suppliers = await service.getSuppliers(branchId);
    res.json({ success: true, data: suppliers });
  } catch (error) {
    console.error("Error in getSuppliers controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get single supplier details
 */
const getSupplierDetails = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const supplier = await service.getSupplierDetails(branchId, req.params.id);
    res.json({ success: true, data: supplier });
  } catch (error) {
    console.error("Error in getSupplierDetails controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Create a new supplier
 */
const createSupplier = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const supplier = await service.createSupplier(branchId, req.body);
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    console.error("Error in createSupplier controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update an existing supplier
 */
const updateSupplier = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const supplier = await service.updateSupplier(branchId, req.params.id, req.body);
    res.json({ success: true, data: supplier });
  } catch (error) {
    console.error("Error in updateSupplier controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete a supplier
 */
const deleteSupplier = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const result = await service.deleteSupplier(branchId, req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in deleteSupplier controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get supplier dashboard statistics
 */
const getSupplierStats = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, error: "No active or initialized branch found." });
    }

    const stats = await service.getSupplierStats(branchId);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error in getSupplierStats controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplierDetails,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierStats
};
