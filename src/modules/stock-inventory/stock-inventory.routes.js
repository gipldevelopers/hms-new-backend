const express = require("express");
const router = express.Router();
const ctrl = require("./stock-inventory.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Apply authentication & authorization middlewares matching patient & pharmacy layouts
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "HOSPITAL_INVENTORY", "STAFF"));
router.use(auditLogger("HOSPITAL_INVENTORY"));

// Stats route must be defined BEFORE the /:id route to prevent pattern mismatch
router.get("/dashboard/stats", ctrl.getDashboardStats);

// Core CRUD Endpoints
router.get("/", ctrl.getItems);
router.get("/:id", ctrl.getItemDetails);
router.post("/", ctrl.createItem);
router.put("/:id", ctrl.updateItem);
router.delete("/:id", ctrl.deleteItem);

// Stock Adjustments (Log transactional addition/usage changes)
router.post("/:id/stock", ctrl.adjustStock);

module.exports = router;
