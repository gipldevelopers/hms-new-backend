const express = require("express");
const router = express.Router();
const wardsController = require("./wards.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Applied to all mutation routes in this module
router.use(auth);

// Overview and Stats accessible by Staff for clinical operations
router.get("/overview", authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF"), wardsController.getOverview);
router.get("/stats", authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF"), wardsController.getStats);
router.get("/occupancy-analytics", authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF", "REPORTS"), wardsController.getOccupancyAnalytics);


// Management routes restricted to Admins
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN"));
router.use(auditLogger("INFRASTRUCTURE"));

router.post("/sync", wardsController.syncDepartments);
router.patch("/:id/status", wardsController.toggleStatus);
router.delete("/:id", wardsController.deleteDepartment);

module.exports = router;
