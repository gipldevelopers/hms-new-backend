const express = require("express");
const router = express.Router();
const admissionsController = require("./admissions.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");
const validate = require("../../middleware/validate");
const val = require("./admissions.validation");

// Applied to all mutation routes in this module
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF", "RECEPTION", "DOCTOR"));
router.use(auditLogger("ADMISSIONS_MANAGEMENT"));

router.get("/overview", validate(val.getOverview), admissionsController.getOverview);
router.get("/stats", validate(val.getStats), admissionsController.getStats);
router.post("/", validate(val.createAdmission), admissionsController.createAdmission);
router.patch("/:id", validate(val.updateAdmission), admissionsController.updateAdmission);
router.delete("/:id", validate(val.deleteAdmission), admissionsController.deleteAdmission);

module.exports = router;
