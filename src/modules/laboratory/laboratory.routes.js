const express = require("express");
const router = express.Router();
const ctrl = require("./laboratory.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "DOCTOR", "STAFF", "LABORATORY"));
router.use(auditLogger("LABORATORY"));

router.get("/patients", ctrl.searchPatients);
router.get("/tests", ctrl.listTests);
router.get("/clinical-options", ctrl.getClinicalOptions);
router.get("/test-orders", ctrl.listOrders);
router.post("/test-orders", ctrl.createOrder);
router.get("/test-orders/:id", ctrl.getOrder);
router.patch("/test-orders/:id/tests/:testId/status", ctrl.updateTestStatus);

module.exports = router;
