const express = require("express");
const router = express.Router();
const pharmacyController = require("./pharmacy.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF"));

router.get("/inventory", pharmacyController.getInventoryList);
router.get("/inventory/:id", pharmacyController.getInventoryItem);
router.post("/inventory", pharmacyController.createInventoryItem);
router.put("/inventory/:id", pharmacyController.updateInventoryItem);
router.delete("/inventory/:id", pharmacyController.deleteInventoryItem);

module.exports = router;
