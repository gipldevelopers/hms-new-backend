const express = require("express");
const router = express.Router();
const ctrl = require("./inventory-reports.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Apply authentication & authorization middlewares matching the inventory layout
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "HOSPITAL_INVENTORY", "STAFF"));
router.use(auditLogger("HOSPITAL_INVENTORY"));

// Define stats route
router.get("/stats", ctrl.getReportsStats);

module.exports = router;
