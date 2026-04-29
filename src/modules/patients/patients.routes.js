const express = require("express");
const router = express.Router();
const patientsController = require("./patients.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF"));

router.get("/", patientsController.getPatientsList);

module.exports = router;
