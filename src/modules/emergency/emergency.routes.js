const express = require("express");
const router = express.Router();
const emergencyController = require("./emergency.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Auth + role guard for all routes
router.use(auth);

// Emergency Analytics (accessible by Reports Manager as well)
router.get("/emergency-analytics", authorize("SUPERADMIN", "BRANCH_ADMIN", "RECEPTION", "STAFF", "REPORTS"), emergencyController.getEmergencyAnalytics);

router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "RECEPTION", "STAFF"));
router.use(auditLogger("EMERGENCY_REGISTRATION"));

// List & stats
router.get("/", emergencyController.getList);
router.get("/stats", emergencyController.getStats);

// Single record
router.get("/:id", emergencyController.getById);

// Create new emergency registration
router.post("/", emergencyController.create);

// Update (edit details)
router.patch("/:id", emergencyController.update);

// Confirm a draft registration
router.post("/:id/confirm", emergencyController.confirm);

// Delete
router.delete("/:id", emergencyController.remove);

module.exports = router;
