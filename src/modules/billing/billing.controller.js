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
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
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

/**
 * GET /api/billing/invoice/:billId
 * Returns full invoice data for a single bill
 */
const getInvoiceById = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const { billId } = req.params;
    if (!billId) return res.status(400).json({ success: false, message: "billId is required." });

    const data = await svc.getInvoiceById(branchId, billId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getInvoiceById error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

/**
 * GET /api/billing/all-payments
 * Returns all bills as a flat payment list for the payment management page
 */
const getAllPayments = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const data = await svc.getAllPayments(branchId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getAllPayments error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * GET /api/billing/payment-summary
 * Returns aggregated stat card values for the payment management page
 */
const getPaymentSummary = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const data = await svc.getPaymentSummary(branchId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getPaymentSummary error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * GET /api/billing/ipd-records
 * Returns all IPD admissions with billing summary for the branch
 */
const getIPDBillingRecords = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const data = await svc.getIPDBillingRecords(branchId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getIPDBillingRecords error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * GET /api/billing/ipd-details/:admissionId
 * Returns full IPD billing detail for a single admission
 */
const getIPDBillingDetails = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });

    const { admissionId } = req.params;
    if (!admissionId) return res.status(400).json({ success: false, message: "admissionId is required." });

    const data = await svc.getIPDBillingDetails(branchId, admissionId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getIPDBillingDetails error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

/**
 * GET /api/billing/service-catalog
 * Returns all billable services for the Create Bill form
 */
const getServiceCatalog = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.getServiceCatalog(branchId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getServiceCatalog error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * POST /api/billing/create
 * Creates a new OPD or IPD bill record
 */
const createBill = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.createBill(branchId, req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    console.error("createBill error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const collectInstallmentPayment = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { billId } = req.params;
    const data = await svc.collectInstallmentPayment(branchId, billId, req.body, req.user?.name || "System");
    res.json({ success: true, data });
  } catch (e) {
    console.error("collectInstallmentPayment error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const getBillPayments = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { billId } = req.params;
    const data = await svc.getBillPayments(branchId, billId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getBillPayments error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const processRefund = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { billId } = req.params;
    const data = await svc.processRefund(branchId, billId, req.body, req.user?.name || "System");
    res.json({ success: true, data });
  } catch (e) {
    console.error("processRefund error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const listRefunds = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.listRefunds(branchId, req.query);
    res.json({ success: true, data });
  } catch (e) {
    console.error("listRefunds error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const submitClaim = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.submitClaim(branchId, req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    console.error("submitClaim error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const getClaim = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { id } = req.params;
    const data = await svc.getClaim(branchId, id);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getClaim error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const updateClaim = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { id } = req.params;
    const data = await svc.updateClaim(branchId, id, req.body);
    res.json({ success: true, data });
  } catch (e) {
    console.error("updateClaim error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const listClaims = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.listClaims(branchId, req.query);
    res.json({ success: true, data });
  } catch (e) {
    console.error("listClaims error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const submitDiscountRequest = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.submitDiscountRequest(branchId, req.body, req.user?.name || "System");
    res.status(201).json({ success: true, data });
  } catch (e) {
    console.error("submitDiscountRequest error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const getDiscountRequest = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { id } = req.params;
    const data = await svc.getDiscountRequest(branchId, id);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getDiscountRequest error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const updateDiscountRequest = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { id } = req.params;
    const data = await svc.updateDiscountRequest(branchId, id, req.body, req.user?.name || "System");
    res.json({ success: true, data });
  } catch (e) {
    console.error("updateDiscountRequest error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const listDiscountRequests = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.listDiscountRequests(branchId, req.query);
    res.json({ success: true, data });
  } catch (e) {
    console.error("listDiscountRequests error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const listTariffs = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.listTariffs(branchId, req.query);
    res.json({ success: true, data });
  } catch (e) {
    console.error("listTariffs error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const upsertTariff = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.upsertTariff(branchId, req.body);
    res.json({ success: true, data });
  } catch (e) {
    console.error("upsertTariff error:", e);
    const status = e.statusCode || 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const getFinanceReports = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.getFinanceReports(branchId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getFinanceReports error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const getFinanceAlerts = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.getFinanceAlerts(branchId);
    res.json({ success: true, data });
  } catch (e) {
    console.error("getFinanceAlerts error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = {
  getOPDBillingRecords,
  getOPDBillingDetails,
  collectOPDPayment,
  getInvoiceById,
  getAllPayments,
  getPaymentSummary,
  getIPDBillingRecords,
  getIPDBillingDetails,
  getServiceCatalog,
  createBill,
  collectInstallmentPayment,
  getBillPayments,
  processRefund,
  listRefunds,
  submitClaim,
  getClaim,
  updateClaim,
  listClaims,
  submitDiscountRequest,
  getDiscountRequest,
  updateDiscountRequest,
  listDiscountRequests,
  listTariffs,
  upsertTariff,
  getFinanceReports,
  getFinanceAlerts
};
