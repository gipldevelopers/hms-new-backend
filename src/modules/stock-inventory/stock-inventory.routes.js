const express = require("express");
const router = express.Router();
const ctrl = require("./stock-inventory.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");
const validate = require("../../middleware/validate");
const validation = require("./stock-inventory.validation");

// Apply authentication & authorization middlewares matching patient & pharmacy layouts
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "HOSPITAL_INVENTORY", "STAFF"));
router.use(auditLogger("HOSPITAL_INVENTORY"));

// Stats route must be defined BEFORE the /:id route to prevent pattern mismatch
router.get("/dashboard/stats", ctrl.getDashboardStats);

// Core CRUD Endpoints
router.get("/", ctrl.getItems);
router.get("/:id", ctrl.getItemDetails);
router.post("/", validate(validation.createItemValidation), ctrl.createItem);
router.put("/:id", validate(validation.updateItemValidation), ctrl.updateItem);
router.delete("/:id", ctrl.deleteItem);

// Stock Adjustments (Log transactional addition/usage changes)
router.post("/:id/stock", validate(validation.adjustStockValidation), ctrl.adjustStock);

module.exports = router;
