const svc = require("./finance.service");

const getBranchId = async (req) => {
  const raw = req.query.branchId || req.body?.branchId || req.user?.branchId;
  return svc.resolveBranchId(raw);
};

/**
 * GET /api/finance/dashboard/stats
 */
const getDashboardStats = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.getDashboardStats(branchId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getDashboardStats error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * GET /api/finance/dashboard/recent-invoices
 */
const getRecentInvoices = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const limit = parseInt(req.query.limit) || 8;
    const data  = await svc.getRecentInvoices(branchId, limit);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getRecentInvoices error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * GET /api/finance/dashboard/running-bills
 */
const getRunningBills = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const limit = parseInt(req.query.limit) || 10;
    const data  = await svc.getRunningBills(branchId, limit);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getRunningBills error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * GET /api/finance/dashboard/alerts
 */
const getDashboardAlerts = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.getDashboardAlerts(branchId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getDashboardAlerts error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = {
  getDashboardStats,
  getRecentInvoices,
  getRunningBills,
  getDashboardAlerts
};
