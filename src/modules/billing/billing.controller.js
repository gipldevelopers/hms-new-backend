const svc = require("./billing.service");

const getBranchId = async (req) => {
  const raw = req.body?.branchId || req.query?.branchId || req.branchId || req.user?.branchId;
  return svc.resolveBranchId(raw);
};

const getOPDBillingRecords = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    
    const data = await svc.getOPDBillingRecords(branchId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getOPDBillingRecords error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const getOPDBillingDetails = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    
    const data = await svc.getOPDBillingDetails(branchId, req.query);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getOPDBillingDetails error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const collectOPDPayment = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    
    const data = await svc.collectOPDPayment(branchId, req.body);
    res.json({ success: true, data });
  } catch (e) {
    console.error("collectOPDPayment error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = {
  getOPDBillingRecords,
  getOPDBillingDetails,
  collectOPDPayment
};
