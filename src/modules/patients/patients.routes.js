const express = require("express");
const router = express.Router();
const patientsController = require("./patients.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF", "RECEPTION", "DOCTOR", "FINANCE"));

router.get("/search", patientsController.searchPatients);
router.get("/", patientsController.getPatientsList);
router.get("/:id", patientsController.getPatientDetails);
router.get("/:id/prescription", patientsController.getPatientPrescription);
router.get("/:id/notes", patientsController.getPatientNotesList);
router.post("/:id/notes", patientsController.createPatientNoteRecord);
router.post("/", patientsController.createPatient);
router.put("/:id", patientsController.updatePatient);
router.patch("/:id", patientsController.updatePatient);
router.delete("/:id", patientsController.deletePatient);

module.exports = router;
