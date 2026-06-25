const express = require("express");
const router  = express.Router();
const ctrl    = require("./appointments.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");
const validate = require("../../middleware/validate");
const val = require("./appointments.validation");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "RECEPTION", "STAFF", "DOCTOR"));
router.use(auditLogger("OPD_APPOINTMENTS"));

// Read
router.get("/stats",                validate(val.getStats), ctrl.getStats);
router.get("/",                     validate(val.getList), ctrl.getList);
router.get("/patients",             validate(val.searchPatients), ctrl.searchPatients);
router.get("/doctors",              validate(val.getDoctors), ctrl.getDoctors);
router.get("/departments",          validate(val.getDepartments), ctrl.getDepartments);
router.get("/slots",                validate(val.getBookedSlots), ctrl.getBookedSlots);
router.get("/patient/:patientId",   validate(val.getPatientSummary), ctrl.getPatientSummary);

// Write
router.post("/",                  validate(val.book), ctrl.book);
router.patch("/:id/status",       validate(val.updateStatus), ctrl.updateStatus);
router.patch("/:id/reschedule",   validate(val.reschedule), ctrl.reschedule);

module.exports = router;
