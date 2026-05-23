const svc = require("./pharmacy-queue.service");

const getBranchId = async (req) => {
  const raw = req.body?.branchId || req.query?.branchId || req.branchId || req.user?.branchId;
  return svc.resolveBranchId(raw);
};

const getQueue = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.getPrescriptionQueue(branchId, req.query);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getQueue error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const getStats = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.getPrescriptionQueueStats(branchId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getStats error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const getById = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.getPrescriptionById(branchId, req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    const status = e.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { status, notes } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "status is required." });
    const pharmacistName = req.user?.name || null;
    const data = await svc.updatePrescriptionStatus(branchId, req.params.id, status, pharmacistName, notes);
    res.json({ success: true, data });
  } catch (e) {
    const code = e.message.includes("not found") ? 404 : e.message.includes("Invalid") ? 400 : 500;
    res.status(code).json({ success: false, message: e.message });
  }
};

const toggleItem = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { itemId, picked } = req.body;
    if (!itemId || picked === undefined) {
      return res.status(400).json({ success: false, message: "itemId and picked are required." });
    }
    const data = await svc.toggleItemPicked(branchId, req.params.id, itemId, picked);
    res.json({ success: true, data });
  } catch (e) {
    const code = e.message.includes("not found") ? 404 : 500;
    res.status(code).json({ success: false, message: e.message });
  }
};

const dispense = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const pharmacistName = req.user?.name || null;
    const data = await svc.dispensePrescription(branchId, req.params.id, req.body, pharmacistName);
    res.json({ success: true, data });
  } catch (e) {
    const code = e.message.includes("not found") ? 404 : 500;
    res.status(code).json({ success: false, message: e.message });
  }
};

module.exports = { getQueue, getStats, getById, updateStatus, toggleItem, dispense };
