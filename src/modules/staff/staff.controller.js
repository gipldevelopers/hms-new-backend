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
  try {
    const { branchId } = req.body;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    const staff = await staffService.createStaff(branchId, req.body);
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStaff,
  createStaff
};
