const express = require("express");
const router = express.Router();
const ctrl = require("./purchase.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Apply authentication & authorization middlewares
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "HOSPITAL_INVENTORY", "STAFF"));
router.use(auditLogger("HOSPITAL_INVENTORY"));

router.get("/", ctrl.getPurchaseOrders);
router.get("/:id", ctrl.getPurchaseOrderDetails);
router.post("/", ctrl.createPurchaseOrder);
router.put("/:id", ctrl.updatePurchaseOrder);
router.delete("/:id", ctrl.deletePurchaseOrder);

module.exports = router;
