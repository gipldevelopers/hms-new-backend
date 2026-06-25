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
  const scheduleItems = await getSchedule(branchId, doctorId);
  const colorsMap = {
    "OPD Slot": "bg-sky-500",
    "Surgery": "bg-rose-500",
    "Leave": "bg-amber-500"
  };

  const formattedSchedule = scheduleItems.slice(0, 3).map((item) => {
    const timeParts = (item.time || "").split(" ");
    let time = timeParts[0] || "12:00";
    const period = timeParts[1] || "AM";

    if (time.split(":").length > 2) {
      time = time.split(":").slice(0, 2).join(":");
    }

    let subtitle = "";
    if (item.type === "Leave") {
      subtitle = item.patient;
    } else {
      subtitle = `Patient: ${item.patient}`;
      if (item.ward) subtitle += ` • ${item.ward}`;
    }

    return {
      id: item.id,
      time,
      period,
      title: item.type === "OPD Slot" ? "OPD Consultation" : item.type === "Surgery" ? "Surgery / Round" : "Leave / Duty",
      subtitle,
      color: colorsMap[item.type] || "bg-sky-500",
      tag: item.status
    };
  });

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

  // Fetch unacknowledged critical lab values
  const criticalLabs = await tenantDb.labCriticalValue.findMany({
    where: {
      status: "unacknowledged"
    },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  criticalLabs.forEach((lab) => {
    alerts.push({
      type: "Critical",
      title: `Critical Lab - Patient: ${lab.patientName}`,
      desc: `${lab.testName}: ${lab.value} (Ref: ${lab.refRange})`,
      status: "VIEW DETAILS",
      path: `/doctor/alerts/critical-${lab.id}`,
      icon: "FlaskConical",
      color: "bg-red-50 dark:bg-red-500/10 text-red-600 border-none"
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

/**
 * Get critical patient alerts (abnormal vitals, pending tasks, and pending discharges)
 */
const getAlerts = async (branchId, doctorId) => {
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = todayRange();

  // 1. Fetch active tasks assigned to the current doctor where status is not Completed
  const tasks = await tenantDb.task.findMany({
    where: {
      assignedToId: doctorId,
      status: { not: "Completed" }
    },
    include: {
      patient: true
    }
  });

  // 2. Fetch vitals recorded today that have abnormal/critical parameters
  const vitals = await tenantDb.vitals.findMany({
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
      patient: true
    }
  });

  // 3. Fetch admissions with status = "Pending"
  const pendingDischarges = await tenantDb.admission.findMany({
    where: {
      status: "Pending",
      doctorId: doctorId
    },
    include: {
      patient: true
    }
  });

  // 4. Fetch unacknowledged laboratory critical values
  const criticalValues = await tenantDb.labCriticalValue.findMany({
    where: {
      status: "unacknowledged"
    }
  });

  const alerts = [];

  // Helper for relative time
  const formatRelativeTime = (date) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // Map vitals to alerts
  vitals.forEach((vital) => {
    let desc = "";
    if (vital.spo2 && vital.spo2 < 90) desc += `SpO2 level: ${vital.spo2}% (Below 90%). `;
    if (vital.temperature && vital.temperature > 100.4) desc += `Temperature: ${vital.temperature}°F. `;
    if (vital.systolic && vital.systolic > 140) desc += `Systolic BP: ${vital.systolic} mmHg. `;
    if (vital.diastolic && vital.diastolic > 90) desc += `Diastolic BP: ${vital.diastolic} mmHg. `;

    alerts.push({
      id: `vital-${vital.id}`,
      type: "Critical Result",
      time: formatRelativeTime(vital.createdAt),
      patientName: vital.patient?.name || "Unknown Patient",
      uhid: vital.patient?.id || "N/A",
      description: desc || "Abnormal vital parameters recorded.",
      variant: "destructive"
    });
  });

  // Map tasks to alerts
  tasks.forEach((task) => {
    alerts.push({
      id: `task-${task.id}`,
      type: task.priority === "URGENT" || task.priority === "HIGH" ? "Critical Result" : "Follow-up",
      time: formatRelativeTime(task.createdAt),
      patientName: task.patient?.name || "Unknown Patient",
      uhid: task.patient?.id || "N/A",
      description: `${task.title}${task.description ? `: ${task.description}` : ""}`,
      variant: task.priority === "URGENT" || task.priority === "HIGH" ? "destructive" : "info"
    });
  });

  // Map pending discharges to alerts
  pendingDischarges.forEach((adm) => {
    alerts.push({
      id: `admission-${adm.id}`,
      type: "Pending Discharge",
      time: formatRelativeTime(adm.updatedAt),
      patientName: adm.patient?.name || "Unknown Patient",
      uhid: adm.patient?.id || "N/A",
      description: `Discharge summary pending. Admitted on ${new Date(adm.admissionDate).toLocaleDateString()}.`,
      variant: "warning"
    });
  });

  // Map critical laboratory values to alerts
  criticalValues.forEach((cv) => {
    alerts.push({
      id: `critical-${cv.id}`,
      type: "Critical Lab Value",
      time: formatRelativeTime(cv.createdAt),
      patientName: cv.patientName || "Unknown Patient",
      uhid: cv.uhid || "N/A",
      description: `${cv.testName}: ${cv.value} (Ref: ${cv.refRange})`,
      variant: "destructive"
    });
  });

  return alerts;
};

/**
 * Get detailed patient info and context for a specific alert
 */
const getAlertDetails = async (branchId, id) => {
  const tenantDb = await getTenantClient(branchId);
  const parts = id.split("-");
  const prefix = parts[0];
  const actualId = id.substring(prefix.length + 1);

  let alertDetails = {
    id,
    type: "",
    title: "",
    reportedAt: "",
    patient: {
      name: "Unknown",
      uhid: "N/A",
      location: "Unknown"
    },
    findings: []
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getPatientLocation = async (patientId) => {
    const activeAdm = await tenantDb.admission.findFirst({
      where: { patientId, status: "In Progress" },
      include: { ward: true, bed: true }
    });
    if (activeAdm) {
      return `${activeAdm.ward?.name || "Ward"} - Bed ${activeAdm.bed?.label || "Bed"}`;
    }
    return "Outpatient";
  };

  if (prefix === "vital") {
    const vital = await tenantDb.vitals.findUnique({
      where: { id: actualId },
      include: { patient: true }
    });
    if (!vital) throw new Error("Alert not found");

    alertDetails.type = "Critical Result";
    
    let titleParts = [];
    if (vital.spo2 && vital.spo2 < 90) titleParts.push(`SpO2 ${vital.spo2}%`);
    if (vital.temperature && vital.temperature > 100.4) titleParts.push(`Temp ${vital.temperature}°F`);
    if (vital.systolic && vital.systolic > 140) titleParts.push(`BP ${vital.systolic}/${vital.diastolic} mmHg`);
    alertDetails.title = titleParts.length > 0 ? `Critical Vitals: ${titleParts.join(", ")}` : "Critical Vitals Alert";
    alertDetails.reportedAt = formatDate(vital.createdAt);
    
    if (vital.patient) {
      alertDetails.patient.name = vital.patient.name || `${vital.patient.firstName || ""} ${vital.patient.lastName || ""}`.trim();
      alertDetails.patient.uhid = vital.patient.id;
      alertDetails.patient.location = await getPatientLocation(vital.patient.id);
    }

    if (vital.spo2) {
      alertDetails.findings.push({
        name: "SpO2",
        value: `${vital.spo2}%`,
        referenceRange: "95% - 100%",
        status: vital.spo2 < 90 ? "Low" : "Normal"
      });
    }
    if (vital.temperature) {
      alertDetails.findings.push({
        name: "Body Temperature",
        value: `${vital.temperature}°F`,
        referenceRange: "97.8°F - 99.1°F",
        status: vital.temperature > 100.4 ? "High" : "Normal"
      });
    }
    if (vital.systolic || vital.diastolic) {
      alertDetails.findings.push({
        name: "Blood Pressure",
        value: `${vital.systolic || "N/A"}/${vital.diastolic || "N/A"} mmHg`,
        referenceRange: "90/60 - 120/80 mmHg",
        status: (vital.systolic > 140 || vital.diastolic > 90) ? "High" : "Normal"
      });
    }
  } else if (prefix === "task") {
    const task = await tenantDb.task.findUnique({
      where: { id: actualId },
      include: { patient: true }
    });
    if (!task) throw new Error("Alert not found");

    alertDetails.type = "Task";
    alertDetails.title = task.title;
    alertDetails.reportedAt = formatDate(task.createdAt);

    if (task.patient) {
      alertDetails.patient.name = task.patient.name || `${task.patient.firstName || ""} ${task.patient.lastName || ""}`.trim();
      alertDetails.patient.uhid = task.patient.id;
      alertDetails.patient.location = await getPatientLocation(task.patient.id);
    }

    alertDetails.findings.push({
      name: "Priority",
      value: task.priority,
      referenceRange: "MEDIUM",
      status: task.priority
    });
    alertDetails.findings.push({
      name: "Description",
      value: task.description || "No description provided",
      referenceRange: "N/A",
      status: task.status
    });
  } else if (prefix === "admission") {
    const admission = await tenantDb.admission.findUnique({
      where: { id: actualId },
      include: { patient: true, ward: true, bed: true, department: true }
    });
    if (!admission) throw new Error("Alert not found");

    alertDetails.type = "Pending Discharge";
    alertDetails.title = `Discharge Summary Pending for Patient`;
    alertDetails.reportedAt = formatDate(admission.updatedAt);

    if (admission.patient) {
      alertDetails.patient.name = admission.patient.name || `${admission.patient.firstName || ""} ${admission.patient.lastName || ""}`.trim();
      alertDetails.patient.uhid = admission.patient.id;
      alertDetails.patient.location = `${admission.ward?.name || "Ward"} - Bed ${admission.bed?.label || "Bed"}`;
    }

    alertDetails.findings.push({
      name: "Admission Date",
      value: formatDate(admission.admissionDate),
      referenceRange: "N/A",
      status: "Admitted"
    });
    alertDetails.findings.push({
      name: "Reason",
      value: admission.reason || "Under Observation",
      referenceRange: "N/A",
      status: admission.status
    });
  } else if (prefix === "critical") {
    const cv = await tenantDb.labCriticalValue.findUnique({
      where: { id: actualId }
    });
    if (!cv) throw new Error("Alert not found");

    alertDetails.type = "Critical Lab Value";
    alertDetails.title = `${cv.testName}: ${cv.value}`;
    alertDetails.reportedAt = formatDate(cv.createdAt);

    alertDetails.patient.name = cv.patientName || "Unknown Patient";
    alertDetails.patient.uhid = cv.uhid || "N/A";
    alertDetails.patient.location = cv.bedLabel || "Outpatient";

    alertDetails.findings.push({
      name: "Test Name",
      value: cv.testName,
      referenceRange: cv.refRange || "N/A",
      status: "Critical"
    });
    alertDetails.findings.push({
      name: "Value",
      value: cv.value,
      referenceRange: cv.refRange || "N/A",
      status: "Critical"
    });
    alertDetails.findings.push({
      name: "Reported By",
      value: cv.reportedBy || "N/A",
      referenceRange: "N/A",
      status: "N/A"
    });
  } else {
    throw new Error("Invalid alert ID prefix");
  }

  return alertDetails;
};

/**
 * Acknowledge/resolve a specific alert
 */
const acknowledgeAlert = async (branchId, id) => {
  const tenantDb = await getTenantClient(branchId);
  const parts = id.split("-");
  const prefix = parts[0];
  const actualId = id.substring(prefix.length + 1);

  if (prefix === "task") {
    await tenantDb.task.update({
      where: { id: actualId },
      data: { status: "Completed" }
    });
  } else if (prefix === "admission") {
    const admissionsSvc = require("../admissions/admissions.service");
    await admissionsSvc.updateAdmission(branchId, actualId, { status: "Completed" });
  } else if (prefix === "vital") {
    // Vitals don't have a status, acknowledging them just returns success
  } else if (prefix === "critical") {
    await tenantDb.labCriticalValue.update({
      where: { id: actualId },
      data: {
        status: "acknowledged",
        acknowledgedBy: "Doctor",
        acknowledgedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        wardNotified: true
      }
    });
  } else {
    throw new Error("Invalid alert ID prefix");
  }
  return { success: true, message: "Alert acknowledged successfully" };
};

/**
 * Get OPD and IPD Reports summary statistics
 */
const getReports = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);

  // 1. Totals
  const totalOPD = await tenantDb.appointment.count();
  const totalIPD = await tenantDb.admission.count({
    where: { status: "In Progress" }
  });
  const pendingDischarges = await tenantDb.admission.count({
    where: { status: "Pending" }
  });

  // 2. Recent OPD Summary (past 7 days)
  const opdSummary = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const startOfDay = new Date(d); startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(d); endOfDay.setHours(23,59,59,999);

    const seenCount = await tenantDb.appointment.count({
      where: {
        dateTime: { gte: startOfDay, lte: endOfDay },
        status: "COMPLETED"
      }
    });

    const ordersCount = await tenantDb.labTestOrder.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay }
      }
    });

    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    opdSummary.push({
      date: dateStr,
      seen: seenCount,
      orders: ordersCount
    });
  }

  // 3. Recent IPD Summary
  const recentAdmissions = await tenantDb.admission.findMany({
    take: 10,
    orderBy: { admissionDate: "desc" },
    include: {
      patient: true
    }
  });

  const ipdSummary = recentAdmissions.map((adm) => {
    const formatDate = (date) => {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    let status = "Admitted";
    if (adm.status === "Completed") status = "Discharged";
    else if (adm.status === "Pending") status = "Pending Discharge";

    return {
      name: adm.patient?.name || `${adm.patient?.firstName || ""} ${adm.patient?.lastName || ""}`.trim() || "Unknown Patient",
      admitted: formatDate(adm.admissionDate),
      discharged: formatDate(adm.dischargeDate),
      status
    };
  });

  return {
    stats: {
      totalOPD,
      totalIPD,
      pendingDischarges
    },
    opdSummary,
    ipdSummary
  };
};

/**
 * Get schedule for a specific doctor (appointments, surgeries/admissions, leaves)
 */
const getSchedule = async (branchId, doctorId) => {
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = todayRange();

  // 1. Fetch appointments (OPD slots)
  const appts = await tenantDb.appointment.findMany({
    where: {
      doctorId,
      dateTime: { gte: start, lte: end }
    },
    include: {
      patient: true
    },
    orderBy: { dateTime: "asc" }
  });

  // 2. Fetch admissions (surgeries/IPD rounds)
  const adms = await tenantDb.admission.findMany({
    where: {
      doctorId,
      status: { not: "Completed" } // active admissions
    },
    include: {
      patient: true,
      ward: true,
      bed: true
    },
    orderBy: { admissionDate: "desc" }
  });

  // 3. Fetch leaves from TenantShiftRoster for this doctor
  const leaves = await tenantDb.tenantShiftRoster.findMany({
    where: {
      staffId: doctorId,
      status: "LEAVE",
      date: { gte: start, lte: end }
    },
    orderBy: { date: "asc" }
  });

  const scheduleList = [];

  // Mappers
  appts.forEach((appt) => {
    const timeStr = new Date(appt.dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
    
    let statusMapped = "Available";
    if (appt.status === "SCHEDULED") statusMapped = "Booked";
    else if (appt.status === "CHECKED_IN") statusMapped = "Checked In";
    else if (appt.status === "WAITING") statusMapped = "Waiting";
    else if (appt.status === "COMPLETED") statusMapped = "Completed";
    else if (appt.status === "CANCELLED") statusMapped = "Cancelled";
    
    scheduleList.push({
      id: appt.id,
      time: timeStr,
      type: "OPD Slot",
      patient: appt.patient?.name || `${appt.patient?.firstName || ""} ${appt.patient?.lastName || ""}`.trim() || "No Patient Name",
      status: statusMapped,
      typeVariant: "info",
      dateTime: appt.dateTime,
      rawAppointment: appt
    });
  });

  adms.forEach((adm) => {
    const timeStr = new Date(adm.admissionDate).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });

    let statusMapped = "Confirmed";
    if (adm.status === "Pending") statusMapped = "Discharge Pending";
    else if (adm.status === "Completed") statusMapped = "Discharged";

    scheduleList.push({
      id: adm.id,
      time: timeStr,
      type: "Surgery",
      patient: adm.patient?.name || `${adm.patient?.firstName || ""} ${adm.patient?.lastName || ""}`.trim() || "No Patient Name",
      status: statusMapped,
      typeVariant: "destructive",
      dateTime: adm.admissionDate,
      diagnosis: adm.reason || "N/A",
      ward: `${adm.ward?.name || "General Ward"} - ${adm.bed?.label || "Bed"}`,
      rawAdmission: adm
    });
  });

  leaves.forEach((l) => {
    const timeStr = l.startTime && l.endTime ? `${l.startTime} - ${l.endTime}` : "All Day";
    scheduleList.push({
      id: l.id,
      time: timeStr,
      type: "Leave",
      patient: l.notes || "Approved Leave",
      status: "Approved",
      typeVariant: "secondary",
      dateTime: l.date
    });
  });

  // Seed mocked default items only if the entire schedule is empty
  if (scheduleList.length === 0) {
    scheduleList.push(
      { id: "mock-1", time: "08:00 AM", type: "OPD Slot", patient: "Michael Ross", status: "Available", typeVariant: "info", dateTime: new Date() },
      { id: "mock-2", time: "09:00 AM", type: "OPD Slot", patient: "John Doe", status: "Booked", typeVariant: "info", dateTime: new Date() },
      { id: "mock-3", time: "10:00 AM", type: "Surgery", patient: "Alice Smith", status: "Confirmed", typeVariant: "destructive", dateTime: new Date() },
      { id: "mock-4", time: "12:00 PM", type: "Surgery", patient: "Bob Johnson", status: "Confirmed", typeVariant: "destructive", dateTime: new Date() },
      { id: "mock-5", time: "02:00 PM", type: "OPD Slot", patient: "Mary Williams", status: "Checked In", typeVariant: "info", dateTime: new Date() },
      { id: "mock-6", time: "03:00 PM", type: "Leave", patient: "Staff Meeting", status: "Approved", typeVariant: "secondary", dateTime: new Date() }
    );
  }

  // Sort schedule items by dateTime
  scheduleList.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return scheduleList;
};

const createLeave = async (branchId, doctorId, data) => {
  const tenantDb = await getTenantClient(branchId);
  const dateVal = new Date(data.date);

  // 1. Create on tenant DB
  const leave = await tenantDb.tenantShiftRoster.create({
    data: {
      staffId: doctorId,
      date: dateVal,
      startTime: data.startTime || "All Day",
      endTime: data.endTime || "All Day",
      department: data.department || "OPD",
      status: "LEAVE",
      notes: data.notes || "Approved Leave"
    }
  });

  // 2. Dual Persistence: Sync to Main DB
  try {
    await prisma.shiftRoster.create({
      data: {
        id: leave.id,
        staffId: doctorId,
        staffName: data.doctorName || "Doctor",
        templateId: null,
        date: dateVal,
        startTime: leave.startTime,
        endTime: leave.endTime,
        department: leave.department,
        status: "LEAVE",
        notes: leave.notes,
        branchId
      }
    });
  } catch (err) {
    console.error("Main DB roster sync failed inside doctor-opd service:", err.message);
  }

  return leave;
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
  createAppointment,
  getAlerts,
  getAlertDetails,
  acknowledgeAlert,
  getReports,
  getSchedule,
  createLeave
};
