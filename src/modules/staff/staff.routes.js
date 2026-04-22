const express = require("express");
const router = express.Router();
const staffController = require("./staff.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Protection & Logging
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN"));
router.use(auditLogger("STAFF_MANAGEMENT"));

router.get("/", staffController.getAllStaff);
router.post("/", staffController.createStaff);

module.exports = router;
