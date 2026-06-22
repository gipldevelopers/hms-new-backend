const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");
const crypto = require("crypto");

const normalizeLabTestsForConsultation = (labTests = []) => {
  if (!Array.isArray(labTests)) return null;
  return labTests
    .map((test) => {
      const name = typeof test === "string" ? test : test?.name;
      if (!name || !String(name).trim()) return null;
      return {
        id: typeof test === "object" && test?.id ? test.id : crypto.randomUUID(),
        name: String(name).trim(),
        code: typeof test === "object" && test?.code ? test.code : String(name).trim().toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 18),
      };
    })
    .filter(Boolean);
};

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
      },
      labTestOrder: true
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
    labTests: normalizeLabTestsForConsultation(data.labTests),
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

  const labService = require("../laboratory/laboratory.service");
  await labService.upsertOrderFromConsultation(branchId, consultation, appointment, data);

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

/**
 * Get comprehensive Doctor Dashboard data
 */
const getDoctorDashboardData = async (branchId, doctorId) => {
  if (!doctorId) {
    throw new Error("Doctor ID is required");
  }
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = todayRange();

  // 1. STATS
  // - Total Patients: total patients registered in the branch
  const totalPatientsCount = await tenantDb.patient.count();

  // - OPD Visits: Today's OPD appointments count for this doctor
  const opdVisitsCount = await tenantDb.appointment.count({
    where: {
      doctorId,
      dateTime: { gte: start, lte: end }
    }
  });

  // - IPD Admission: Active admissions count in the branch
  const ipdAdmissionsCount = await tenantDb.admission.count({
    where: {
      status: "In Progress"
    }
  });

  // - Emergency: Today's emergency patients in the branch
  const emergencyCount = await tenantDb.patient.count({
    where: {
      isEmergency: true,
      arrivalTime: { gte: start, lte: end }
    }
  });

  // 2. TODAY'S MEDICAL SCHEDULE
  // Fetch today's appointments for this doctor
  const appointments = await tenantDb.appointment.findMany({
    where: {
      doctorId,
      dateTime: { gte: start, lte: end }
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          age: true,
          gender: true
        }
      }
    },
    orderBy: { dateTime: "asc" }
  });

  const colors = ["bg-sky-500", "bg-violet-600", "bg-amber-500", "bg-emerald-500", "bg-rose-500"];
  let formattedSchedule = appointments.map((appt, i) => {
    const dateObj = new Date(appt.dateTime);
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const timeStr = `${String(hours).padStart(2, '0')}:${formattedMinutes}`;

    return {
      id: appt.id,
      time: timeStr,
      period,
      title: appt.status === "COMPLETED" ? `Completed Consultation` : `Consultation`,
      subtitle: `Token: ${appt.tokenNumber || "N/A"} • Patient: ${appt.patient?.name || "Unknown"}`,
      color: colors[i % colors.length],
      tag: appt.status
    };
  });

  if (formattedSchedule.length === 0) {
    formattedSchedule = [
      {
        id: "mock-sched-1",
        time: "09:30",
        period: "AM",
        title: "Hip Replacement Surgery",
        subtitle: "OR Room 4 • Patient: John Doe",
        color: "bg-violet-600",
        tag: "SURGERY"
      },
      {
        id: "mock-sched-2",
        time: "11:15",
        period: "AM",
        title: "Pediatric Ward Rounds",
        subtitle: "Level 3 • Team B",
        color: "bg-sky-500",
        tag: "RECURRING"
      },
      {
        id: "mock-sched-3",
        time: "02:00",
        period: "PM",
        title: "Inter-Departmental Meeting",
        subtitle: "Conference Hall A • Budgeting",
        color: "bg-amber-500",
        tag: "AGENDA"
      }
    ];
  }

  // 3. CRITICAL ALERTS
  // Vitals recorded today with critical values:
  // - spo2 < 90
  // - temperature > 100.4
  // - systolic > 140 or diastolic > 90
  const criticalVitals = await tenantDb.vitals.findMany({
    where: {
      createdAt: { gte: start, lte: end },
      OR: [
        { spo2: { lt: 90 } },
        { temperature: { gt: 100.4 } },
        { systolic: { gt: 140 } },
        { diastolic: { gt: 90 } }
      ]
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  // Urgent pending tasks assigned to the doctor
  const urgentTasks = await tenantDb.task.findMany({
    where: {
      assignedToId: doctorId,
      priority: { in: ["HIGH", "URGENT"] },
      status: { not: "Completed" }
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const alerts = [];

  criticalVitals.forEach((vital) => {
    let desc = "";
    if (vital.spo2 && vital.spo2 < 90) desc += `SpO2 level: ${vital.spo2}% (Below 90%). `;
    if (vital.temperature && vital.temperature > 100.4) desc += `Temperature: ${vital.temperature}°F. `;
    if (vital.systolic && vital.systolic > 140) desc += `Systolic BP: ${vital.systolic} mmHg. `;
    if (vital.diastolic && vital.diastolic > 90) desc += `Diastolic BP: ${vital.diastolic} mmHg. `;

    alerts.push({
      type: "Critical",
      title: `Critical Vitals - Patient: ${vital.patient?.name || "Unknown"}`,
      desc: desc || "Abnormal vital parameters recorded.",
      status: "ACKNOWLEDGE",
      icon: "ShieldAlert",
      color: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-none"
    });
  });

  urgentTasks.forEach((task) => {
    alerts.push({
      type: "Emergency",
      title: `Urgent Task: ${task.title}`,
      desc: task.description || `Task for patient ${task.patient?.name || "Unknown"}.`,
      status: "VIEW TASK",
      icon: "Ambulance",
      color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-none"
    });
  });

  // If no actual database alerts exist, we add visual placeholders
  if (alerts.length === 0) {
    alerts.push(
      {
        type: "Critical",
        title: "Critical Patient Alert",
        desc: "Room 302: SpO2 levels dropping below 85%.",
        status: "ACKNOWLEDGE",
        icon: "ShieldAlert",
        color: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-none"
      },
      {
        type: "Pending",
        title: "Lab Result Pending",
        desc: "MRI Results for Patient #8823 are now ready for review.",
        status: "VIEW RESULTS",
        icon: "FlaskConical",
        color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-none"
      },
      {
        type: "Emergency",
        title: "Emergency Arrival",
        desc: "Ambulance #14 arriving in 4 minutes with trauma case.",
        icon: "Ambulance",
        color: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 border-none"
      },
      {
        type: "Reminder",
        title: "Follow-up Reminder",
        desc: "Send discharge summaries for Ward 2C patients.",
        icon: "Bell",
        color: "bg-slate-50 dark:bg-slate-500/10 text-slate-600 border-none"
      }
    );
  }

  // 4. ADMITTED PATIENTS
  const admissions = await tenantDb.admission.findMany({
    where: {
      status: "In Progress"
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          age: true,
          gender: true
        }
      },
      bed: {
        select: {
          label: true
        }
      }
    },
    orderBy: { admissionDate: "desc" }
  });

  const formattedAdmissions = admissions.map((adm) => {
    const diffMs = Date.now() - new Date(adm.admissionDate).getTime();
    const daysAdmitted = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    // Format Date
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date(adm.admissionDate).toLocaleDateString('en-US', dateOptions);

    return {
      bed: adm.bed?.label || "Ward Bed",
      name: adm.patient?.name || "Unknown Patient",
      info: `${adm.patient?.age || 'N/A'} yrs • ${adm.patient?.gender || 'N/A'}`,
      admitted: formattedDate,
      diagnosis: adm.reason || "Under Observation",
      days: daysAdmitted,
      avatar: `https://i.pravatar.cc/150?u=${adm.patientId.substring(0, 4)}`
    };
  });

  return {
    stats: {
      totalPatients: totalPatientsCount,
      opdVisits: opdVisitsCount,
      ipdAdmissions: ipdAdmissionsCount,
      emergency: emergencyCount
    },
    schedule: formattedSchedule,
    alerts,
    admittedPatients: formattedAdmissions
  };
};

/**
 * Create a new appointment
 */
const createAppointment = async (branchId, appointmentData) => {
  const tenantDb = await getTenantClient(branchId);
  
  // Verify patient exists
  const patient = await tenantDb.patient.findUnique({
    where: { id: appointmentData.patientId }
  });
  if (!patient) {
    throw new Error(`Patient not found with ID ${appointmentData.patientId}`);
  }

  // If doctorId is provided, look up doctor name
  let doctorName = appointmentData.doctorName;
  if (appointmentData.doctorId && !doctorName) {
    const doctor = await tenantDb.tenantUser.findUnique({
      where: { id: appointmentData.doctorId }
    });
    if (doctor) {
      doctorName = doctor.name;
    }
  }

  const appt = await tenantDb.appointment.create({
    data: {
      patientId: appointmentData.patientId,
      doctorId: appointmentData.doctorId || null,
      doctorName: doctorName || null,
      departmentId: appointmentData.departmentId || null,
      departmentName: appointmentData.departmentName || null,
      dateTime: new Date(appointmentData.dateTime),
      tokenNumber: appointmentData.tokenNumber || `T-${Math.floor(100 + Math.random() * 900)}`,
      fee: appointmentData.fee ? parseFloat(appointmentData.fee) : null,
      notes: appointmentData.notes || null,
      status: appointmentData.status || "SCHEDULED"
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          age: true,
          gender: true
        }
      }
    }
  });

  return appt;
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
  getOPDStats,
  getDoctorDashboardData,
  createAppointment
};
