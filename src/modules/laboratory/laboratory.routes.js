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
router.patch("/test-orders/:id/status", ctrl.updateOrderStatus);
router.patch("/test-orders/:id/tests/:testId/status", ctrl.updateTestStatus);

// Critical Values
router.get("/critical-values", ctrl.listCriticalValues);
router.post("/critical-values", ctrl.createCriticalValue);
router.post("/critical-values/:id/acknowledge", ctrl.acknowledgeCriticalValue);
router.put("/critical-values/:id", ctrl.updateCriticalValue);
router.patch("/critical-values/:id", ctrl.updateCriticalValue);

module.exports = router;


