const express = require("express");
const router = express.Router();
const ctrl = require("./batch-expiry.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Apply authentication & authorization middlewares
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "HOSPITAL_INVENTORY", "STAFF"));
router.use(auditLogger("HOSPITAL_INVENTORY"));

router.get("/", ctrl.getBatches);
router.post("/return", ctrl.processReturn);

module.exports = router;
