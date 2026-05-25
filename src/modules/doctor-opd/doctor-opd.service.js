const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");
const crypto = require("crypto");

const resolveBranchId = async (branchId) => {
  if (branchId) {
    const b = await prisma.branch.findUnique({ where: { id: branchId } });
    if (b && b.isDbInitialized) return branchId;
  }
  const first = await prisma.branch.findFirst({ where: { isDbInitialized: true } });
  return first?.id || null;
};

const todayRange = () => {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end   = new Date(); end.setHours(23, 59, 59, 999);
  return { start, end };
};

/**
 * Get today's OPD patient list (patients with appointments and tokens)
 */
const getTodayOPDPatients = async (branchId, filters = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = todayRange();
  const { search, status, doctorId } = filters;

  // Build where clause for appointments
  const where = { 
    dateTime: { gte: start, lte: end },
    status: { in: ["SCHEDULED", "CHECKED_IN", "WAITING", "COMPLETED"] }
  };
  
  if (doctorId) where.doctorId = doctorId;
  if (status && status !== "All") where.status = status;

  // Get appointments with patient details
  let appointments = await tenantDb.appointment.findMany({
    where,
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          age: true,
          gender: true,
          contact: true,
          bloodGroup: true,
        }
      }
    },
    orderBy: { dateTime: "asc" }
  });

  // Get tokens for these patients
  const patientIds = appointments.map(a => a.patientId);
  const tokens = await tenantDb.token.findMany({
    where: {
      patientId: { in: patientIds },
      date: { gte: start, lte: end }
    }
  });

  // Map tokens to appointments
  const tokenMap = {};
  tokens.forEach(t => {
    tokenMap[t.patientId] = t;
  });

  // Combine data
  let opdList = appointments.map(appt => ({
    id: appt.id,
    appointmentId: appt.id,
    patientId: appt.patientId,
    patient: appt.patient,
    doctorId: appt.doctorId,
    doctorName: appt.doctorName,
    departmentId: appt.departmentId,
    departmentName: appt.departmentName,
    dateTime: appt.dateTime,
    tokenNumber: appt.tokenNumber,
    token: tokenMap[appt.patientId] || null,
    fee: appt.fee,
    status: appt.status,
    notes: appt.notes,
    createdAt: appt.createdAt
  }));

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    opdList = opdList.filter(item =>
      item.patient?.name?.toLowerCase().includes(searchLower) ||
      item.patient?.contact?.includes(search) ||
      item.tokenNumber?.toLowerCase().includes(searchLower)
    );
  }

  return opdList;
};

/**
 * Get OPD patient details by appointment ID
 */
const getOPDPatientDetails = async (branchId, appointmentId) => {
  const tenantDb = await getTenantClient(branchId);

  // Get appointment with patient details
  const appointment = await tenantDb.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: true
    }
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  // Get patient's vitals (latest)
  const vitals = await tenantDb.vitals.findFirst({
    where: { patientId: appointment.patientId },
    orderBy: { createdAt: "desc" }
  });

  // Get existing consultation for this appointment
  const consultation = await tenantDb.consultation.findUnique({
    where: { appointmentId: appointmentId },
    include: {
      prescriptions: {
        include: {
          items: {
            include: {
              medicine: true
            }
          }
        }
      }
    }
  });

  // Get patient's previous consultations
  const previousConsultations = await tenantDb.consultation.findMany({
    where: {
      patientId: appointment.patientId,
      id: { not: consultation?.id }
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      createdAt: true,
      chiefComplaints: true,
      finalDiagnosis: true,
      doctorName: true
    }
  });

  return {
    appointment,
    patient: appointment.patient,
    vitals,
    consultation,
    previousConsultations
  };
};

/**
 * Create or update consultation
 */
const saveConsultation = async (branchId, appointmentId, data, userId, userName) => {
  const tenantDb = await getTenantClient(branchId);

  // Verify appointment exists
  const appointment = await tenantDb.appointment.findUnique({
    where: { id: appointmentId }
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  // Check if consultation already exists
  const existing = await tenantDb.consultation.findUnique({
    where: { appointmentId }
  });

  const consultationData = {
    patientId: appointment.patientId,
    doctorId: userId,
    doctorName: userName,
    chiefComplaints: data.chiefComplaints || null,
    clinicalHistory: data.clinicalHistory || null,
    examination: data.examination || null,
    provisionalDiagnosis: data.provisionalDiagnosis || null,
    finalDiagnosis: data.finalDiagnosis || null,
    labTests: data.labTests || null,
    followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
    followUpNotes: data.followUpNotes || null,
    referralDoctor: data.referralDoctor || null,
    referralDepartment: data.referralDepartment || null,
    status: data.status || "IN_PROGRESS"
  };

  let consultation;
  if (existing) {
    // Update existing consultation
    consultation = await tenantDb.consultation.update({
      where: { id: existing.id },
      data: consultationData,
      include: {
        prescriptions: {
          include: {
            items: {
              include: {
                medicine: true
              }
            }
          }
        }
      }
    });
  } else {
    // Create new consultation
    consultation = await tenantDb.consultation.create({
      data: {
        id: crypto.randomUUID(),
        appointmentId,
        ...consultationData
      },
      include: {
        prescriptions: {
          include: {
            items: {
              include: {
                medicine: true
              }
            }
          }
        }
      }
    });
  }

  // Update appointment status if consultation is completed
  if (data.status === "COMPLETED") {
    await tenantDb.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" }
    });
  }

  return consultation;
};

/**
 * Add prescription to consultation
 */
const addPrescription = async (branchId, consultationId, prescriptionData, userId, userName) => {
  const tenantDb = await getTenantClient(branchId);

  // Verify consultation exists
  const consultation = await tenantDb.consultation.findUnique({
    where: { id: consultationId }
  });

  if (!consultation) {
    throw new Error("Consultation not found");
  }

  // Check if prescription already exists for this consultation
  let prescription = await tenantDb.prescription.findFirst({
    where: { consultationId }
  });

  if (!prescription) {
    // Create new prescription
    prescription = await tenantDb.prescription.create({
      data: {
        id: crypto.randomUUID(),
        consultationId,
        patientId: consultation.patientId,
        doctorId: userId,
        doctorName: userName,
        instructions: prescriptionData.instructions || null
      }
    });
  } else {
    // Update instructions if provided
    if (prescriptionData.instructions) {
      prescription = await tenantDb.prescription.update({
        where: { id: prescription.id },
        data: { instructions: prescriptionData.instructions }
      });
    }
  }

  return prescription;
};

/**
 * Add medicine to prescription
 */
const addMedicineToPrescription = async (branchId, prescriptionId, medicineData) => {
  const tenantDb = await getTenantClient(branchId);

  // Verify prescription exists
  const prescription = await tenantDb.prescription.findUnique({
    where: { id: prescriptionId }
  });

  if (!prescription) {
    throw new Error("Prescription not found");
  }

  // Verify medicine exists if medicineId provided
  let medicine = null;
  if (medicineData.medicineId) {
    medicine = await tenantDb.pharmacyItem.findUnique({
      where: { id: medicineData.medicineId }
    });
    if (!medicine) {
      throw new Error("Medicine not found in pharmacy");
    }
  }

  // Create prescription item
  const item = await tenantDb.prescriptionItem.create({
    data: {
      id: crypto.randomUUID(),
      prescriptionId,
      medicineId: medicineData.medicineId || null,
      medicineName: medicineData.medicineName || medicine?.medicineName,
      dosage: medicineData.dosage,
      timing: medicineData.timing,
      duration: medicineData.duration,
      instructions: medicineData.instructions || null
    },
    include: {
      medicine: true
    }
  });

  return item;
};

/**
 * Update prescription item
 */
const updatePrescriptionItem = async (branchId, itemId, medicineData) => {
  const tenantDb = await getTenantClient(branchId);

  const item = await tenantDb.prescriptionItem.update({
    where: { id: itemId },
    data: {
      medicineId: medicineData.medicineId || null,
      medicineName: medicineData.medicineName,
      dosage: medicineData.dosage,
      timing: medicineData.timing,
      duration: medicineData.duration,
      instructions: medicineData.instructions || null
    },
    include: {
      medicine: true
    }
  });

  return item;
};

/**
 * Delete prescription item
 */
const deletePrescriptionItem = async (branchId, itemId) => {
  const tenantDb = await getTenantClient(branchId);

  await tenantDb.prescriptionItem.delete({
    where: { id: itemId }
  });

  return { success: true };
};

/**
 * Get all medicines from pharmacy
 */
const getMedicines = async (branchId, search = "") => {
  const tenantDb = await getTenantClient(branchId);

  const where = search
    ? {
        OR: [
          { medicineName: { contains: search, mode: "insensitive" } },
          { type: { contains: search, mode: "insensitive" } }
        ]
      }
    : {};

  const medicines = await tenantDb.pharmacyItem.findMany({
    where,
    orderBy: { medicineName: "asc" },
    take: 50
  });

  return medicines;
};

/**
 * Get OPD statistics for today
 */
const getOPDStats = async (branchId, doctorId = null) => {
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = todayRange();

  const baseWhere = { dateTime: { gte: start, lte: end } };
  if (doctorId) baseWhere.doctorId = doctorId;

  const [total, waiting, inProgress, completed] = await Promise.all([
    tenantDb.appointment.count({ where: baseWhere }),
    tenantDb.appointment.count({ where: { ...baseWhere, status: "WAITING" } }),
    tenantDb.appointment.count({ where: { ...baseWhere, status: "CHECKED_IN" } }),
    tenantDb.appointment.count({ where: { ...baseWhere, status: "COMPLETED" } })
  ]);

  return {
    total,
    waiting,
    inProgress,
    completed
  };
};

module.exports = {
  resolveBranchId,
  getTodayOPDPatients,
  getOPDPatientDetails,
  saveConsultation,
  addPrescription,
  addMedicineToPrescription,
  updatePrescriptionItem,
  deletePrescriptionItem,
  getMedicines,
  getOPDStats
};
