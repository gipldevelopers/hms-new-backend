const patientsService = require("./patients.service");

const prisma = require("../../database/prisma");

const getPatientsList = async (req, res) => {
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
