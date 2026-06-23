const express = require("express");
const router = express.Router();
const controller = require("./ot-supplies.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Protect all routes with authentication
router.use(auth);

// Restrict to specific roles and setup audit logger category
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "HOSPITAL_INVENTORY", "STAFF"));
router.use(auditLogger("HOSPITAL_INVENTORY"));

// Define routes
router.get("/", controller.getConsumptions);
router.post("/", controller.logConsumption);
router.get("/items", controller.getSupplies);
router.post("/items", controller.createSupplyItem);
router.get("/stats", controller.getDashboardStats);
router.delete("/:id", controller.deleteConsumption);

module.exports = router;
