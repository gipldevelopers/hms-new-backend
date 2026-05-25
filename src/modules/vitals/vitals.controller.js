const vitalsService = require("./vitals.service");
const prisma = require("../../database/prisma");

/**
 * Helper: resolve branchId with fallback to first initialized branch
 */
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
  const patientId = req.params.patientId || req.body.patientId || req.query.patientId;
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
    const firstBranch = await prisma.branch.findFirst({ where: { isDbInitialized: true } });
    if (firstBranch) branchId = firstBranch.id;
  }

  return branchId;
};

/**
 * GET /api/vitals/overview
 * Returns all admitted patients with their latest vitals
 */
const getVitalsOverview = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.json([]);

    const data = await vitalsService.getVitalsOverview(branchId, req.query);
    res.json(data);
  } catch (error) {
    console.error("Error in getVitalsOverview:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/vitals/stats
 * Returns stats: totalPatients, critical, abnormal, overdue
 */
const getVitalsStats = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.json({ totalPatients: 0, critical: 0, abnormal: 0, overdue: 0 });

    const stats = await vitalsService.getVitalsStats(branchId);
    res.json(stats);
  } catch (error) {
    console.error("Error in getVitalsStats:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/vitals/patient/:patientId
 * Returns vitals history for a specific patient
 */
const getPatientVitals = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    const { patientId } = req.params;
    const data = await vitalsService.getPatientVitals(branchId, patientId, req.query);
    res.json(data);
  } catch (error) {
    console.error("Error in getPatientVitals:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/vitals/:id
 * Returns a single vitals record
 */
const getVitalsById = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    const record = await vitalsService.getVitalsById(branchId, req.params.id);
    if (!record) return res.status(404).json({ error: "Vitals record not found" });
    res.json(record);
  } catch (error) {
    console.error("Error in getVitalsById:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/vitals
 * Create a new vitals record
 */
const createVitals = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    if (!req.body.patientId) return res.status(400).json({ error: "patientId is required" });

    const record = await vitalsService.createVitals(branchId, req.body);
    res.status(201).json(record);
  } catch (error) {
    console.error("Error in createVitals:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * PATCH /api/vitals/:id
 * Update an existing vitals record
 */
const updateVitals = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    const record = await vitalsService.updateVitals(branchId, req.params.id, req.body);
    res.json(record);
  } catch (error) {
    console.error("Error in updateVitals:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/vitals/:id
 * Delete a vitals record
 */
const deleteVitals = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    await vitalsService.deleteVitals(branchId, req.params.id);
    res.json({ success: true, message: "Vitals record deleted" });
  } catch (error) {
    console.error("Error in deleteVitals:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/vitals/filters
 * Returns list of dynamic wards and staff members for filters
 */
const getVitalsFilters = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    const filters = await vitalsService.getVitalsFilters(branchId);
    res.json(filters);
  } catch (error) {
    console.error("Error in getVitalsFilters:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getVitalsOverview,
  getVitalsStats,
  getPatientVitals,
  getVitalsById,
  createVitals,
  updateVitals,
  deleteVitals,
  getVitalsFilters,
};
