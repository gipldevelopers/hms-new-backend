const wardsService = require("./wards.service");
const prisma = require("../../database/prisma");

const getOverview = async (req, res) => {
  try {
    let branchId = req.query.branchId || req.user.branchId;
    
    // Check if the assigned branch is initialized
    if (branchId) {
      const branch = await prisma.branch.findUnique({ where: { id: branchId } });
      if (!branch || !branch.isDbInitialized) branchId = null; // Force fallback if not ready
    }

    // Fallback to the first initialized branch if needed
    if (!branchId) {
      const firstBranch = await prisma.branch.findFirst({
        where: { isDbInitialized: true }
      });
      if (firstBranch) branchId = firstBranch.id;
    }
    
    if (!branchId) return res.status(400).json({ error: "No initialized branches found. Please contact Super Admin." });
    
    const overview = await wardsService.getDepartmentsOverview(branchId);
    res.json(overview);
  } catch (error) {
    console.error("Error in getOverview:", error);
    res.status(500).json({ error: error.message });
  }
};

const syncDepartments = async (req, res) => {
  try {
    let branchId = req.body.branchId || req.user.branchId;
    const { departments } = req.body;
    
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
    if (!departments) return res.status(400).json({ error: "Departments data is required" });
    
    const result = await wardsService.syncDepartments(branchId, departments);
    res.json(result);
  } catch (error) {
    console.error("Error in syncDepartments:", error);
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
    
    const stats = await wardsService.getStats(branchId);
    res.json(stats);
  } catch (error) {
    console.error("Error in getStats:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    let branchId = req.query.branchId || req.user.branchId;
    const { id } = req.params;
    
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
    
    await wardsService.deleteDepartment(branchId, id);
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error in deleteDepartment:", error);
    res.status(500).json({ error: error.message });
  }
};

const toggleStatus = async (req, res) => {
  try {
    let branchId = req.body.branchId || req.user.branchId;
    const { id } = req.params;
    const { active } = req.body;
    
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    if (active === undefined) return res.status(400).json({ error: "Status (active) is required" });
    
    const result = await wardsService.toggleDepartmentStatus(branchId, id, active);
    res.json(result);
  } catch (error) {
    console.error("Error in toggleStatus:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOverview,
  syncDepartments,
  getStats,
  deleteDepartment,
  toggleStatus
};
