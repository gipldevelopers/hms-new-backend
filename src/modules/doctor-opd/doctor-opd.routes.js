const express = require("express");
const router = express.Router();
const ctrl = require("./doctor-opd.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Apply authentication and authorization
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "DOCTOR", "STAFF"));
router.use(auditLogger("DOCTOR_OPD"));

// OPD Patient List
router.get("/patients", ctrl.getOPDPatients);
router.get("/stats", ctrl.getStats);

// Patient Details & Consultation
router.get("/patients/:appointmentId", ctrl.getPatientDetails);
router.post("/consultation/:appointmentId", ctrl.saveConsultation);

// Prescription Management
router.post("/prescription/:consultationId", ctrl.addPrescription);
router.post("/prescription/:prescriptionId/items", ctrl.addMedicine);
router.patch("/prescription/items/:itemId", ctrl.updateMedicine);
router.delete("/prescription/items/:itemId", ctrl.deleteMedicine);

// Medicines
router.get("/medicines", ctrl.getMedicines);

module.exports = router;
