const staffService = require("./staff.service");

const getAllStaff = async (req, res) => {
  try {
    const { branchId } = req.query;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    const staff = await staffService.getAllStaff(branchId);
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStaff = async (req, res) => {
  res.status(400).json({ error: "Direct staff creation is disabled. Please use User Management to provision personnel." });
};

const getStaffAssignments = async (req, res) => {
  try {
    const { branchId } = req.query;
    const { id: staffId } = req.params;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });

    const assignments = await staffService.getStaffAssignments(branchId, staffId);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignPatients = async (req, res) => {
  try {
    const { branchId } = req.query;
    const { id: staffId } = req.params;
    const { patientIds } = req.body;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });

    const result = await staffService.assignPatientsToStaff(branchId, staffId, patientIds);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyPatients = async (req, res) => {
  try {
    const branchId = req.query.branchId || req.user.branchId;
    const staffId = req.user.id;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });

    const assignments = await staffService.getStaffAssignments(branchId, staffId);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStaff,
  createStaff,
  getStaffAssignments,
  assignPatients,
  getMyPatients
};
