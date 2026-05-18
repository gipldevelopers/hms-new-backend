const express = require("express");
const router  = express.Router();
const ctrl    = require("./appointments.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "RECEPTION", "STAFF", "DOCTOR"));
router.use(auditLogger("OPD_APPOINTMENTS"));

// Read
router.get("/stats",                ctrl.getStats);
router.get("/",                     ctrl.getList);
router.get("/patients",             ctrl.searchPatients);
router.get("/doctors",              ctrl.getDoctors);
router.get("/departments",          ctrl.getDepartments);
router.get("/slots",                ctrl.getBookedSlots);
router.get("/patient/:patientId",   ctrl.getPatientSummary);

// Write
router.post("/",                  ctrl.book);
router.patch("/:id/status",       ctrl.updateStatus);
router.patch("/:id/reschedule",   ctrl.reschedule);

module.exports = router;
