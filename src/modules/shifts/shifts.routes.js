const express = require("express");
const router = express.Router();
const shiftsController = require("./shifts.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Protection & Logging
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN"));
router.use(auditLogger("SHIFT_MANAGEMENT"));

// Shift Templates
router.get("/templates", shiftsController.getAllTemplates);
router.post("/templates", shiftsController.createTemplate);
router.put("/templates/:id", shiftsController.updateTemplate);
router.delete("/templates/:id", shiftsController.deleteTemplate);

// Shift Roster
router.get("/roster", shiftsController.getRoster);
router.post("/roster", shiftsController.createRosterEntry);
router.put("/roster/:id", shiftsController.updateRosterEntry);
router.delete("/roster/:id", shiftsController.deleteRosterEntry);

module.exports = router;
