const svc = require("./doctor-opd.service");

const getBranchId = async (req) => {
  const raw = req.body?.branchId || req.query?.branchId || req.branchId || req.user?.branchId;
  return svc.resolveBranchId(raw);
};

/**
 * GET /api/doctor-opd/patients - Get today's OPD patient list
 */
const getOPDPatients = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        message: "No initialized branch found." 
      });
    }

    const filters = {
      search: req.query.search,
      status: req.query.status,
      doctorId: req.query.doctorId || req.user?.id // Filter by logged-in doctor
    };

    const patients = await svc.getTodayOPDPatients(branchId, filters);
    
    res.json({ 
      success: true, 
      data: patients 
    });
  } catch (e) {
    console.error("Error fetching OPD patients:", e);
    res.status(500).json({ 
      success: false, 
      message: e.message 
    });
  }
};

/**
 * GET /api/doctor-opd/patients/:appointmentId - Get patient details for consultation
 */
const getPatientDetails = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        message: "No initialized branch found." 
      });
    }

    const { appointmentId } = req.params;
    const details = await svc.getOPDPatientDetails(branchId, appointmentId);
    
    res.json({ 
      success: true, 
      data: details 
    });
  } catch (e) {
    console.error("Error fetching patient details:", e);
    const status = e.message.includes("not found") ? 404 : 500;
    res.status(status).json({ 
      success: false, 
      message: e.message 
    });
  }
};

/**
 * POST /api/doctor-opd/consultation/:appointmentId - Create or update consultation
 */
const saveConsultation = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        message: "No initialized branch found." 
      });
    }

    const { appointmentId } = req.params;
    const userId = req.user?.id;
    const userName = req.user?.name || "Doctor";

    const consultation = await svc.saveConsultation(
      branchId, 
      appointmentId, 
      req.body,
      userId,
      userName
    );
    
    res.json({ 
      success: true, 
      data: consultation,
      message: "Consultation saved successfully"
    });
  } catch (e) {
    console.error("Error saving consultation:", e);
    const status = e.message.includes("not found") ? 404 : 400;
    res.status(status).json({ 
      success: false, 
      message: e.message 
    });
  }
};

/**
 * POST /api/doctor-opd/prescription/:consultationId - Add prescription to consultation
 */
const addPrescription = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        message: "No initialized branch found." 
      });
    }

    const { consultationId } = req.params;
    const userId = req.user?.id;
    const userName = req.user?.name || "Doctor";

    const prescription = await svc.addPrescription(
      branchId, 
      consultationId, 
      req.body,
      userId,
      userName
    );
    
    res.json({ 
      success: true, 
      data: prescription,
      message: "Prescription created successfully"
    });
  } catch (e) {
    console.error("Error adding prescription:", e);
    const status = e.message.includes("not found") ? 404 : 400;
    res.status(status).json({ 
      success: false, 
      message: e.message 
    });
  }
};

/**
 * POST /api/doctor-opd/prescription/:prescriptionId/items - Add medicine to prescription
 */
const addMedicine = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        message: "No initialized branch found." 
      });
    }

    const { prescriptionId } = req.params;

    // Validate required fields
    if (!req.body.medicineName || !req.body.dosage || !req.body.timing || !req.body.duration) {
      return res.status(400).json({
        success: false,
        message: "Medicine name, dosage, timing, and duration are required"
      });
    }

    const item = await svc.addMedicineToPrescription(branchId, prescriptionId, req.body);
    
    res.status(201).json({ 
      success: true, 
      data: item,
      message: "Medicine added successfully"
    });
  } catch (e) {
    console.error("Error adding medicine:", e);
    const status = e.message.includes("not found") ? 404 : 400;
    res.status(status).json({ 
      success: false, 
      message: e.message 
    });
  }
};

/**
 * PATCH /api/doctor-opd/prescription/items/:itemId - Update prescription item
 */
const updateMedicine = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        message: "No initialized branch found." 
      });
    }

    const { itemId } = req.params;
    const item = await svc.updatePrescriptionItem(branchId, itemId, req.body);
    
    res.json({ 
      success: true, 
      data: item,
      message: "Medicine updated successfully"
    });
  } catch (e) {
    console.error("Error updating medicine:", e);
    res.status(400).json({ 
      success: false, 
      message: e.message 
    });
  }
};

/**
 * DELETE /api/doctor-opd/prescription/items/:itemId - Delete prescription item
 */
const deleteMedicine = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        message: "No initialized branch found." 
      });
    }

    const { itemId } = req.params;
    await svc.deletePrescriptionItem(branchId, itemId);
    
    res.json({ 
      success: true,
      message: "Medicine removed successfully"
    });
  } catch (e) {
    console.error("Error deleting medicine:", e);
    res.status(400).json({ 
      success: false, 
      message: e.message 
    });
  }
};

/**
 * GET /api/doctor-opd/medicines - Get medicines from pharmacy
 */
const getMedicines = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        message: "No initialized branch found." 
      });
    }

    const search = req.query.search || "";
    const medicines = await svc.getMedicines(branchId, search);
    
    res.json({ 
      success: true, 
      data: medicines 
    });
  } catch (e) {
    console.error("Error fetching medicines:", e);
    res.status(500).json({ 
      success: false, 
      message: e.message 
    });
  }
};

/**
 * GET /api/doctor-opd/stats - Get OPD statistics
 */
const getStats = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        message: "No initialized branch found." 
      });
    }

    const doctorId = req.query.doctorId || req.user?.id;
    const stats = await svc.getOPDStats(branchId, doctorId);
    
    res.json({ 
      success: true, 
      data: stats 
    });
  } catch (e) {
    console.error("Error fetching stats:", e);
    res.status(500).json({ 
      success: false, 
      message: e.message 
    });
  }
};

module.exports = {
  getOPDPatients,
  getPatientDetails,
  saveConsultation,
  addPrescription,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicines,
  getStats
};
