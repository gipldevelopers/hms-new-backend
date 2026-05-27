const express = require("express");
const router = express.Router();
const ctrl = require("./billing.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);

router.get("/opd-records", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getOPDBillingRecords);
router.get("/opd-details", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.getOPDBillingDetails);
router.post("/collect-payment", authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF"), ctrl.collectOPDPayment);

module.exports = router;
