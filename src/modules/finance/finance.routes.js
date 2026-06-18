const express = require("express");
const router  = express.Router();
const ctrl    = require("./finance.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "FINANCE", "STAFF", "RECEPTION"));

router.get("/dashboard/stats",           ctrl.getDashboardStats);
router.get("/dashboard/recent-invoices", ctrl.getRecentInvoices);
router.get("/dashboard/running-bills",   ctrl.getRunningBills);
router.get("/dashboard/alerts",          ctrl.getDashboardAlerts);

module.exports = router;
