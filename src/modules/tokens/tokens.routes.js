const express = require("express");
const router = express.Router();
const tokensController = require("./tokens.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

router.use(auth);
router.use(auditLogger("TOKEN_MANAGEMENT"));

// Read routes — reception + staff + admins
router.get("/stats",    authorize("SUPERADMIN", "BRANCH_ADMIN", "RECEPTION", "STAFF"), tokensController.getStats);
router.get("/patients", authorize("SUPERADMIN", "BRANCH_ADMIN", "RECEPTION", "STAFF"), tokensController.getPatients);
router.get("/today",    authorize("SUPERADMIN", "BRANCH_ADMIN", "RECEPTION", "STAFF"), tokensController.getTodayTokens);
router.get("/history",  authorize("SUPERADMIN", "BRANCH_ADMIN", "RECEPTION", "STAFF"), tokensController.getHistory);
router.get("/prefix",   authorize("SUPERADMIN", "BRANCH_ADMIN", "RECEPTION", "STAFF"), tokensController.getPrefix);

// Generate token
router.post("/generate", authorize("SUPERADMIN", "BRANCH_ADMIN", "RECEPTION", "STAFF"), tokensController.generate);

// Update token status
router.patch("/:id/status", authorize("SUPERADMIN", "BRANCH_ADMIN", "RECEPTION", "STAFF"), tokensController.updateStatus);

// Prefix management — branch admin only
router.patch("/prefix", authorize("SUPERADMIN", "BRANCH_ADMIN"), tokensController.updatePrefix);

module.exports = router;
