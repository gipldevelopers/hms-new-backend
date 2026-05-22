const express = require("express");
const router = express.Router();
const pharmacyController = require("./pharmacy.controller");
const queueCtrl = require("./pharmacy-queue.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);

// ── Prescription Queue (Pharmacy workflow) ──────────────────────────────────
router.get("/queue",              authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF", "DOCTOR"), queueCtrl.getQueue);
router.get("/queue/stats",        authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF", "DOCTOR"), queueCtrl.getStats);
router.get("/queue/:id",          authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF", "DOCTOR"), queueCtrl.getById);
router.patch("/queue/:id/status", authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF"),           queueCtrl.updateStatus);
router.patch("/queue/:id/items",  authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF"),           queueCtrl.toggleItem);
router.post("/queue/:id/dispense",authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF"),           queueCtrl.dispense);

// ── Inventory ───────────────────────────────────────────────────────────────
// Read-only: Doctors and Reception can view inventory (for prescriptions)
router.get("/inventory",     authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF", "DOCTOR", "RECEPTION"), pharmacyController.getInventoryList);
router.get("/inventory/:id", authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF", "DOCTOR", "RECEPTION"), pharmacyController.getInventoryItem);

// Write: Only pharmacy staff and admins can modify inventory
router.post("/inventory",      authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF"), pharmacyController.createInventoryItem);
router.put("/inventory/:id",   authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF"), pharmacyController.updateInventoryItem);
router.delete("/inventory/:id",authorize("SUPERADMIN", "BRANCH_ADMIN", "PHARMACY", "STAFF"), pharmacyController.deleteInventoryItem);

module.exports = router;
