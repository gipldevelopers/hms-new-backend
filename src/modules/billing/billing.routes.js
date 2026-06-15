const express = require("express");
const router = express.Router();
const ctrl = require("./billing.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);

// OPD billing
router.get("/opd-records",   authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getOPDBillingRecords);
router.get("/opd-details",   authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getOPDBillingDetails);
router.post("/collect-payment", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.collectOPDPayment);

// Invoice
router.get("/invoice/:billId", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getInvoiceById);

// Payment management
router.get("/all-payments",    authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getAllPayments);
router.get("/payment-summary", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getPaymentSummary);

module.exports = router;
