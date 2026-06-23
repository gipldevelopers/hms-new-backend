const express = require("express");
const router = express.Router();
const ctrl = require("./billing.controller");
const { auth, authorize } = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const val = require("./billing.validation");

router.use(auth);

// OPD billing
router.get("/opd-records",   authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getOPDBillingRecords), ctrl.getOPDBillingRecords);
router.get("/opd-details",   authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getOPDBillingDetails), ctrl.getOPDBillingDetails);
router.post("/collect-payment", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.collectOPDPayment), ctrl.collectOPDPayment);

// IPD billing
router.get("/ipd-records",             authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getIPDBillingRecords), ctrl.getIPDBillingRecords);
router.get("/ipd-details/:admissionId", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getIPDBillingDetails), ctrl.getIPDBillingDetails);

// Bill creation
router.get("/service-catalog", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF", "RECEPTION"), validate(val.getServiceCatalog), ctrl.getServiceCatalog);
router.post("/create",         authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF", "RECEPTION"), validate(val.createBill), ctrl.createBill);
router.get("/invoice/:billId", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getInvoiceById), ctrl.getInvoiceById);

// Payment management
router.get("/all-payments",    authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getAllPayments), ctrl.getAllPayments);
router.get("/payment-summary", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getPaymentSummary), ctrl.getPaymentSummary);

// Payment Transactions
router.post("/:billId/payments", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.collectInstallmentPayment), ctrl.collectInstallmentPayment);
router.get("/:billId/payments",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getBillPayments), ctrl.getBillPayments);

// Refunds
router.post("/:billId/refunds", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.processRefund), ctrl.processRefund);
router.get("/refunds",           authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.listRefunds), ctrl.listRefunds);

// Insurance Claims
router.post("/claims",     authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.submitClaim), ctrl.submitClaim);
router.get("/claims/:id",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getClaim), ctrl.getClaim);
router.put("/claims/:id",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.updateClaim), ctrl.updateClaim);
router.get("/claims",      authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.listClaims), ctrl.listClaims);

// Discount Requests
router.post("/discounts",     authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.submitDiscountRequest), ctrl.submitDiscountRequest);
router.get("/discounts/:id",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getDiscountRequest), ctrl.getDiscountRequest);
router.put("/discounts/:id",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.updateDiscountRequest), ctrl.updateDiscountRequest);
router.get("/discounts",      authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.listDiscountRequests), ctrl.listDiscountRequests);

// Tariffs
router.get("/tariffs",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.listTariffs), ctrl.listTariffs);
router.post("/tariffs", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.upsertTariff), ctrl.upsertTariff);

// Reports / Insights
router.get("/reports", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getFinanceReports), ctrl.getFinanceReports);
router.get("/alerts",  authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), validate(val.getFinanceAlerts), ctrl.getFinanceAlerts);

module.exports = router;
