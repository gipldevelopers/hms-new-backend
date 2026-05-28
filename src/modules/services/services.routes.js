const express = require("express");
const router = express.Router();
const ctrl = require("./services.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "DOCTOR", "STAFF", "LABORATORY"));
router.use(auditLogger("SERVICES"));

router.get("/", ctrl.listRequests);
router.get("/:id", ctrl.getRequestById);
router.post("/", ctrl.createRequest);
router.patch("/:id/status", ctrl.updateRequestStatus);

module.exports = router;
