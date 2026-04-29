const patientsService = require("./patients.service");

const getPatientsList = async (req, res) => {
  try {
    const branchId = req.query.branchId || req.user.branchId;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });

    const patients = await patientsService.getAllPatients(branchId);
    res.json(patients);
  } catch (error) {
    console.error("Error in getPatientsList:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPatientsList
};
