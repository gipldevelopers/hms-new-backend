const express = require("express");
const router = express.Router();
const ctrl = require("./stock-transfer.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Apply authentication & authorization middlewares
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "HOSPITAL_INVENTORY", "STAFF"));
router.use(auditLogger("HOSPITAL_INVENTORY"));

router.get("/", ctrl.getTransfers);
router.post("/", ctrl.createTransfer);

module.exports = router;
