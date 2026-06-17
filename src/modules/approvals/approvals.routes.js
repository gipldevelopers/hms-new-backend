const express = require("express");
const router = express.Router();
const ctrl = require("./approvals.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Apply authentication & authorization middlewares
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "HOSPITAL_INVENTORY", "STAFF", "RECEPTION", "PHARMACY", "LABORATORY"));
router.use(auditLogger("HOSPITAL_INVENTORY"));

router.get("/", ctrl.getPurchaseRequests);
router.get("/:id", ctrl.getPurchaseRequestDetails);
router.post("/", ctrl.createPurchaseRequest);
router.put("/:id", ctrl.updatePurchaseRequest);
router.delete("/:id", ctrl.deletePurchaseRequest);

module.exports = router;
