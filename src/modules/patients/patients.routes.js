const express = require("express");
const router = express.Router();
const patientsController = require("./patients.controller");
const { auth, authorize } = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const val = require("./patients.validation");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF", "RECEPTION", "DOCTOR", "FINANCE"));

router.get("/search", validate(val.searchPatients), patientsController.searchPatients);
router.get("/", validate(val.getPatientsList), patientsController.getPatientsList);
router.get("/:id", validate(val.getPatientDetails), patientsController.getPatientDetails);
router.get("/:id/prescription", validate(val.getPatientPrescription), patientsController.getPatientPrescription);
router.get("/:id/notes", validate(val.getPatientNotesList), patientsController.getPatientNotesList);
router.post("/:id/notes", validate(val.createPatientNoteRecord), patientsController.createPatientNoteRecord);
router.post("/", validate(val.createPatient), patientsController.createPatient);
router.put("/:id", validate(val.updatePatient), patientsController.updatePatient);
router.patch("/:id", validate(val.updatePatient), patientsController.updatePatient);
router.delete("/:id", validate(val.deletePatient), patientsController.deletePatient);

module.exports = router;
