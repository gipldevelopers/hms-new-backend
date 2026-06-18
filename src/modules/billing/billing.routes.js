const express = require("express");
const router = express.Router();
const ctrl = require("./billing.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);

// OPD billing
router.get("/opd-records",   authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getOPDBillingRecords);
router.get("/opd-details",   authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getOPDBillingDetails);
router.post("/collect-payment", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.collectOPDPayment);

// IPD billing
router.get("/ipd-records",             authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getIPDBillingRecords);
router.get("/ipd-details/:admissionId", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getIPDBillingDetails);

// Bill creation
router.get("/service-catalog", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF", "RECEPTION"), ctrl.getServiceCatalog);
router.post("/create",         authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF", "RECEPTION"), ctrl.createBill);
router.get("/invoice/:billId", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getInvoiceById);

// Payment management
router.get("/all-payments",    authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getAllPayments);
router.get("/payment-summary", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getPaymentSummary);

// Payment Transactions
router.post("/:billId/payments", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.collectInstallmentPayment);
router.get("/:billId/payments",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getBillPayments);

// Refunds
router.post("/:billId/refunds", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.processRefund);
router.get("/refunds",           authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.listRefunds);

// Insurance Claims
router.post("/claims",     authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.submitClaim);
router.get("/claims/:id",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getClaim);
router.put("/claims/:id",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.updateClaim);
router.get("/claims",      authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.listClaims);

// Discount Requests
router.post("/discounts",     authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.submitDiscountRequest);
router.get("/discounts/:id",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getDiscountRequest);
router.put("/discounts/:id",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.updateDiscountRequest);
router.get("/discounts",      authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.listDiscountRequests);

// Tariffs
router.get("/tariffs",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.listTariffs);
router.post("/tariffs", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.upsertTariff);

// Reports / Insights
router.get("/reports", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getFinanceReports);
router.get("/alerts",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getFinanceAlerts);

module.exports = router;
