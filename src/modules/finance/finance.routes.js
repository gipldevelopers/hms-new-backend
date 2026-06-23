const express = require("express");
const router  = express.Router();
const ctrl    = require("./finance.controller");
const { auth, authorize } = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const val = require("./finance.validation");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF", "RECEPTION"));

router.get("/dashboard/stats",           validate(val.getDashboardStats), ctrl.getDashboardStats);
router.get("/dashboard/recent-invoices", validate(val.getRecentInvoices), ctrl.getRecentInvoices);
router.get("/dashboard/running-bills",   validate(val.getRunningBills), ctrl.getRunningBills);
router.get("/dashboard/alerts",          validate(val.getDashboardAlerts), ctrl.getDashboardAlerts);

module.exports = router;
