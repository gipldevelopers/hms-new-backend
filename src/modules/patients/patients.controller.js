const patientsService = require("./patients.service");
const prisma = require("../../database/prisma");

const getPatientsList = async (req, res) => {
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

    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    const patients = await patientsService.getAllPatients(branchId);
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatientDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = req.query.branchId || req.user.branchId;

    if (!branchId) return res.status(400).json({ error: "Branch ID is required." });

    const patient = await patientsService.getPatientById(branchId, id);
    if (!patient) return res.status(404).json({ error: "Patient not found." });

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPatient = async (req, res) => {
  try {
    const branchId = req.body.branchId || req.user.branchId;
    console.log("Create patient request for branch:", branchId, "Body:", req.body);

    if (!branchId) {
      console.warn("Create patient failed: Branch ID is missing");
      return res.status(400).json({ error: "Branch ID is required." });
    }

    const patient = await patientsService.createPatient(branchId, req.body);
    res.status(201).json(patient);
  } catch (error) {
    console.error("Create patient error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = req.body.branchId || req.user.branchId;
    console.log("Update patient request for id:", id, "branch:", branchId, "Body:", req.body);

    if (!branchId) {
      console.warn("Update patient failed: Branch ID is missing");
      return res.status(400).json({ error: "Branch ID is required." });
    }

    const patient = await patientsService.updatePatient(branchId, id, req.body);
    res.json(patient);
  } catch (error) {
    console.error("Update patient error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = req.query.branchId || req.user.branchId;

    if (!branchId) return res.status(400).json({ error: "Branch ID is required." });

    await patientsService.deletePatient(branchId, id);
    res.json({ message: "Patient deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPatientsList,
  getPatientDetails,
  createPatient,
  updatePatient,
  deletePatient
};
