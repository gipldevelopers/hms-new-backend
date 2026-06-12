const express = require("express");
const router = express.Router();
const ctrl = require("./supplier.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Apply authentication & authorization middlewares
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "HOSPITAL_INVENTORY", "STAFF"));
router.use(auditLogger("HOSPITAL_INVENTORY"));

router.get("/", ctrl.getSuppliers);
router.get("/stats/summary", ctrl.getSupplierStats);
router.get("/:id", ctrl.getSupplierDetails);
router.post("/", ctrl.createSupplier);
router.put("/:id", ctrl.updateSupplier);
router.delete("/:id", ctrl.deleteSupplier);

module.exports = router;
