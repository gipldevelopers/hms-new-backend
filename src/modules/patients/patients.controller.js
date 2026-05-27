const patientsService = require("./patients.service");
const prisma = require("../../database/prisma");

const resolveBranchId = async (req) => {
  let branchId = req.query.branchId || req.body.branchId || req.user.branchId;

  // If a branch is explicitly requested, don't fallback to another branch if it's not initialized
  const explicitBranchId = req.query.branchId || req.body.branchId;
  if (explicitBranchId) {
    const branch = await prisma.branch.findUnique({ where: { id: explicitBranchId } });
    if (!branch || !branch.isDbInitialized) {
      return null; // Explicit branch was not initialized
    }
    return explicitBranchId;
  }

  // If we have a patient ID, find which branch owns this patient
  const patientId = req.params.id || req.body.patientId || req.query.patientId;
  if (!branchId && patientId) {
    const globPatient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (globPatient && globPatient.branchId) {
      branchId = globPatient.branchId;
    }
  }

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

  return branchId;
};

const getPatientsList = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.json([]);

    const patients = await patientsService.getAllPatients(branchId);
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatientDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = await resolveBranchId(req);
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
    const branchId = await resolveBranchId(req);
    console.log("--- Create Patient Start ---");
    console.log("Branch ID:", branchId);
    console.log("Request Body Keys:", Object.keys(req.body));

    if (!branchId) {
      console.warn("Create patient failed: Branch ID is missing");
      return res.status(400).json({ error: "Branch ID is required. Please check your session or branch selection." });
    }

    const patient = await patientsService.createPatient(branchId, req.body);
    console.log("Patient created successfully:", patient.id);
    res.status(201).json(patient);
  } catch (error) {
    console.error("CRITICAL: Create patient error:", error);
    const errorMessage = error.message || "Unknown database error";
    res.status(500).json({ 
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = await resolveBranchId(req);
    console.log("--- Update Patient Start ---");
    console.log("ID:", id, "Branch ID:", branchId);

    if (!branchId) {
      console.warn("Update patient failed: Branch ID is missing");
      return res.status(400).json({ error: "Branch ID is required to update a patient." });
    }

    const patient = await patientsService.updatePatient(branchId, id, req.body);
    console.log("Patient updated successfully:", id);
    res.json(patient);
  } catch (error) {
    console.error("CRITICAL: Update patient error:", error);
    const errorMessage = error.message || "Unknown database error";
    res.status(500).json({ 
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "Branch ID is required." });

    await patientsService.deletePatient(branchId, id);
    res.json({ message: "Patient deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatientPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "Branch ID is required." });

    const userId = req.user?.id;
    const userName = req.user?.name || "Staff";

    const prescription = await patientsService.getOrCreatePatientPrescription(branchId, id, userId, userName);
    res.json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPatientNotesList = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "Branch ID is required." });

    const notes = await patientsService.getPatientNotes(branchId, id);
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createPatientNoteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "Branch ID is required." });

    const { content, fileUrl } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Note content is required." });
    }

    // Determine author role
    let authorRole = req.user?.role || "Staff";
    if (req.user?.consoleRoles && Array.isArray(req.user.consoleRoles) && req.user.consoleRoles.length > 0) {
      authorRole = req.user.consoleRoles[0];
    }

    const noteData = {
      authorId: req.user?.id,
      authorName: req.user?.name || "Staff",
      authorRole,
      content,
      fileUrl
    };

    const note = await patientsService.createPatientNote(branchId, id, noteData);
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getPatientsList,
  getPatientDetails,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientPrescription,
  getPatientNotesList,
  createPatientNoteRecord
};
