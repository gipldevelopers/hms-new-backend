const express = require("express");
const router = express.Router();
const admissionsController = require("./admissions.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Applied to all mutation routes in this module
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF"));
router.use(auditLogger("ADMISSIONS_MANAGEMENT"));

router.get("/overview", admissionsController.getOverview);
router.get("/stats", admissionsController.getStats);
router.post("/", admissionsController.createAdmission);
router.patch("/:id", admissionsController.updateAdmission);
router.delete("/:id", admissionsController.deleteAdmission);

module.exports = router;
