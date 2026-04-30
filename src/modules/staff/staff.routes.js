const express = require("express");
const router = express.Router();
const staffController = require("./staff.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Protection & Logging
router.use(auth);
router.use(auditLogger("STAFF_MANAGEMENT"));

// Administrative Routes
router.get("/", authorize("SUPERADMIN", "BRANCH_ADMIN"), staffController.getAllStaff);
router.post("/", authorize("SUPERADMIN", "BRANCH_ADMIN"), staffController.createStaff);

// Patient Assignment Management (Admins Only)
router.get("/:id/patients", authorize("SUPERADMIN", "BRANCH_ADMIN"), staffController.getStaffAssignments);
router.post("/:id/patients", authorize("SUPERADMIN", "BRANCH_ADMIN"), staffController.assignPatients);

// Staff-Specific Routes (Accessible by clinical staff)
router.get("/my-patients", authorize("STAFF", "DOCTOR", "NURSE", "SUPERADMIN", "BRANCH_ADMIN"), staffController.getMyPatients);

module.exports = router;
