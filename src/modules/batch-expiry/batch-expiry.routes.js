const express = require("express");
const router = express.Router();
const ctrl = require("./batch-expiry.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");
const validate = require("../../middleware/validate");
const validation = require("./batch-expiry.validation");

// Apply authentication & authorization middlewares
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "HOSPITAL_INVENTORY", "STAFF"));
router.use(auditLogger("HOSPITAL_INVENTORY"));

router.get("/", ctrl.getBatches);
router.post("/return", validate(validation.processReturnValidation), ctrl.processReturn);

module.exports = router;
