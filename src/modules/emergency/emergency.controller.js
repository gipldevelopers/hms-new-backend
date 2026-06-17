const emergencyService = require("./emergency.service");

/**
 * Helper: resolve branchId from request with fallback.
 */
const getBranchId = async (req) => {
  const raw = req.body?.branchId || req.query?.branchId || req.branchId || req.user?.branchId;
  return emergencyService.resolveBranchId(raw);
};

/**
 * GET /api/emergency
 * List emergency registrations with search, filters, and pagination.
 * Query: search, priority, status, page, limit
 */
const getList = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const result = await emergencyService.getEmergencyList(branchId, req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("[Emergency] getList error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/emergency/stats
 * Dashboard stats for emergency module.
 */
const getStats = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const data = await emergencyService.getEmergencyStats(branchId);
    res.json({ success: true, data });
  } catch (error) {
    console.error("[Emergency] getStats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/emergency/:id
 * Get a single emergency registration by patient ID.
 */
const getById = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const data = await emergencyService.getEmergencyById(branchId, req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("[Emergency] getById error:", error);
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/emergency
 * Create a new emergency registration.
 * Body: { name, age, gender, contact, arrivalMode, triagePriority, emergencyType, arrivalTime, isDraft }
 */
const create = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const data = await emergencyService.createEmergencyRegistration(branchId, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("[Emergency] create error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/emergency/:id
 * Update an existing emergency registration (partial update).
 */
const update = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const data = await emergencyService.updateEmergencyRegistration(branchId, req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    console.error("[Emergency] update error:", error);
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/emergency/:id/confirm
 * Confirm a draft registration → sets status to "Emergency".
 */
const confirm = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const data = await emergencyService.confirmEmergencyRegistration(branchId, req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("[Emergency] confirm error:", error);
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/emergency/:id
 * Delete an emergency registration.
 */
const remove = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    await emergencyService.deleteEmergencyRegistration(branchId, req.params.id);
    res.json({ success: true, message: "Emergency registration deleted." });
  } catch (error) {
    console.error("[Emergency] delete error:", error);
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/emergency/emergency-analytics
 * Get dynamic metrics, capacity statuses, and triage board for Emergency Analytics.
 */
const getEmergencyAnalytics = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const data = await emergencyService.getEmergencyAnalytics(branchId);
    res.json({ success: true, data });
  } catch (error) {
    console.error("[Emergency] getEmergencyAnalytics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getList, getStats, getById, create, update, confirm, remove, getEmergencyAnalytics };

