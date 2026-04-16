const assignmentService = require('./assignments.service');

const getBranchAssignments = async (req, res) => {
  try {
    const { branchId } = req.query;
    if (!branchId) {
      return res.status(400).json({ success: false, message: "Branch ID is required" });
    }
    const assignments = await assignmentService.getAssignmentsByBranch(branchId);
    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const saveAssignments = async (req, res) => {
  try {
    const { branchId, masterDataIds, templateIds } = req.body;
    if (!branchId) {
      return res.status(400).json({ success: false, message: "Branch ID is required" });
    }
    
    await assignmentService.updateAssignments(
      branchId, 
      masterDataIds || [], 
      templateIds || []
    );
    
    res.json({ success: true, message: "Assignments updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBranchAssignments,
  saveAssignments
};
