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
router.get("/dashboard", ctrl.getDashboardData);
router.post("/appointments", ctrl.createAppointment);

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

// Alerts
router.get("/alerts", ctrl.getAlerts);
router.get("/alerts/:id", ctrl.getAlertDetails);
router.post("/alerts/:id/acknowledge", ctrl.acknowledgeAlert);

// Reports
router.get("/reports", ctrl.getReports);

// Schedule
router.get("/schedule", ctrl.getSchedule);
router.post("/schedule/leave", ctrl.createLeave);

module.exports = router;

