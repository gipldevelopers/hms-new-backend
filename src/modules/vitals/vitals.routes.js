const express = require("express");
const router = express.Router();
const vitalsController = require("./vitals.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF", "DOCTOR"));

// Overview & stats
router.get("/overview", vitalsController.getVitalsOverview);
router.get("/stats", vitalsController.getVitalsStats);

// Patient-specific vitals history
router.get("/patient/:patientId", vitalsController.getPatientVitals);

// Real options for filters
router.get("/filters", vitalsController.getVitalsFilters);

// Single record CRUD
router.get("/:id", vitalsController.getVitalsById);
router.post("/", vitalsController.createVitals);
router.patch("/:id", vitalsController.updateVitals);
router.delete("/:id", vitalsController.deleteVitals);

module.exports = router;
