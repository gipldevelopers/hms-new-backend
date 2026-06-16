const express = require("express");
const router = express.Router();
const controller = require("./department-inventory.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Protect all routes with authentication
router.use(auth);

// Restrict to specific roles and setup audit logger category
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "HOSPITAL_INVENTORY", "STAFF"));
router.use(auditLogger("HOSPITAL_INVENTORY"));

// Define routes
router.get("/", controller.getItems);
router.get("/dashboard/stats", controller.getDashboardStats);
router.get("/:id", controller.getItemDetails);
router.post("/", controller.createItem);
router.put("/:id", controller.updateItem);
router.post("/:id/stock", controller.adjustStock);
router.delete("/:id", controller.deleteItem);

module.exports = router;
