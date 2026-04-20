const express = require("express");
const router = express.Router();
const auditLogController = require("./audit-logs.controller");
const { auth, authorize } = require("../../middleware/auth");

router.get("/", auth, authorize("SUPERADMIN"), auditLogController.getAuditLogs);

module.exports = router;
