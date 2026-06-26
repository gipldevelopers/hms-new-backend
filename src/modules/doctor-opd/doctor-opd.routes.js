const express = require("express");
const router = express.Router();
const ctrl = require("./doctor-opd.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");
const validate = require("../../middleware/validate");
const val = require("./doctor-opd.validation");

// Apply authentication and authorization
router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "DOCTOR", "STAFF"));
router.use(auditLogger("DOCTOR_OPD"));

// OPD Patient List
router.get("/patients", validate(val.getOPDPatients), ctrl.getOPDPatients);
router.get("/stats", validate(val.getStats), ctrl.getStats);
router.get("/dashboard", ctrl.getDashboardData);
router.post("/appointments", ctrl.createAppointment);

// Patient Details & Consultation
router.get("/patients/:appointmentId", validate(val.getPatientDetails), ctrl.getPatientDetails);
router.post("/consultation/:appointmentId", validate(val.saveConsultation), ctrl.saveConsultation);

// Prescription Management
router.post("/prescription/:consultationId", validate(val.addPrescription), ctrl.addPrescription);
router.post("/prescription/:prescriptionId/items", validate(val.addMedicine), ctrl.addMedicine);
router.patch("/prescription/items/:itemId", ctrl.updateMedicine);
router.delete("/prescription/items/:itemId", validate(val.deleteMedicine), ctrl.deleteMedicine);

// Medicines
router.get("/medicines", ctrl.getMedicines);

// Alerts
router.get("/alerts", ctrl.getAlerts);
router.get("/alerts/:id", ctrl.getAlertDetails);
router.post("/alerts/:id/acknowledge", validate(val.acknowledgeAlert), ctrl.acknowledgeAlert);

// Reports
router.get("/reports", ctrl.getReports);

// Schedule
router.get("/schedule", validate(val.getSchedule), ctrl.getSchedule);
router.post("/schedule/leave", validate(val.createLeave), ctrl.createLeave);

module.exports = router;

