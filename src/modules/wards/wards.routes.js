const express = require("express");
const router = express.Router();
const wardsController = require("./wards.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Applied to all mutation routes in this module
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN"));
router.use(auditLogger("INFRASTRUCTURE"));

router.get("/overview", wardsController.getOverview);
router.get("/stats", wardsController.getStats);
router.post("/sync", wardsController.syncDepartments);
router.patch("/:id/status", wardsController.toggleStatus);
router.delete("/:id", wardsController.deleteDepartment);

module.exports = router;
