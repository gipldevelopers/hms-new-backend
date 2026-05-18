const tokensService = require("./tokens.service");

const getBranchId = async (req) => {
  const raw = req.body?.branchId || req.query?.branchId || req.branchId || req.user?.branchId;
  return tokensService.resolveBranchId(raw);
};

/** GET /api/tokens/stats — today's stats + next token preview */
const getStats = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await tokensService.getTodayStats(branchId);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** GET /api/tokens/patients — all patients with today's token annotation */
const getPatients = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await tokensService.getPatientsForTokening(branchId, req.query);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** GET /api/tokens/today — today's generated tokens */
const getTodayTokens = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await tokensService.getTodayTokens(branchId, req.query);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** GET /api/tokens/history — full token history with optional date filter */
const getHistory = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await tokensService.getTokenHistory(branchId, req.query);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** POST /api/tokens/generate — generate a token for a patient, optionally with appointment data */
const generate = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { patientId, notes, appointmentData } = req.body;
    if (!patientId) return res.status(400).json({ success: false, message: "patientId is required." });
    const data = await tokensService.generateToken(branchId, patientId, notes, appointmentData || null);
    res.status(201).json({ success: true, data });
  } catch (e) {
    const status = e.message.includes("already has token") ? 409 : 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

/** PATCH /api/tokens/:id/status — update token status */
const updateStatus = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { status } = req.body;
    const allowed = ["Waiting", "Called", "Completed", "Skipped"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(", ")}` });
    }
    const data = await tokensService.updateTokenStatus(branchId, req.params.id, status);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** GET /api/tokens/prefix — get current branch prefix */
const getPrefix = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const prefix = await tokensService.getBranchPrefix(branchId);
    res.json({ success: true, data: { prefix } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/** PATCH /api/tokens/prefix — update branch prefix (branch admin only) */
const updatePrefix = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { prefix } = req.body;
    if (!prefix) return res.status(400).json({ success: false, message: "prefix is required." });
    const data = await tokensService.updateBranchPrefix(branchId, prefix);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

module.exports = { getStats, getPatients, getTodayTokens, getHistory, generate, updateStatus, getPrefix, updatePrefix };
