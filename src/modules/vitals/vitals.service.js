const tenantManager = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");

const getPatientVitals = async (branchId, patientId, query = {}) => {
  const tx = await tenantManager.getTenantClient(branchId);
  const { search, recordedBy } = query;

  const whereClause = { patientId };

  if (recordedBy && recordedBy !== "All") {
    whereClause.recordedBy = { contains: recordedBy, mode: 'insensitive' };
  }

  if (search) {
    whereClause.OR = [
      { recordedBy: { contains: search, mode: 'insensitive' } },
      { notes: { contains: search, mode: 'insensitive' } }
    ];

    const numVal = parseInt(search);
    if (!isNaN(numVal)) {
      whereClause.OR.push(
        { heartRate: numVal },
        { systolic: numVal },
        { diastolic: numVal }
      );
    }
  }

  const vitals = await tx.vitals.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });
  return vitals;
};

const createVitals = async (branchId, data) => {
  const tx = await tenantManager.getTenantClient(branchId);

  // Sync to global as well
  const globalPatient = await prisma.patient.findUnique({
    where: { id: data.patientId }
  });

  const vitals = await tx.vitals.create({
    data: {
      patientId: data.patientId,
      systolic: data.systolic ? Number(data.systolic) : null,
      diastolic: data.diastolic ? Number(data.diastolic) : null,
      heartRate: data.heartRate ? Number(data.heartRate) : null,
      spo2: data.spo2 ? Number(data.spo2) : null,
      temperature: data.temperature ? Number(data.temperature) : null,
      respiratoryRate: data.respiratoryRate ? Number(data.respiratoryRate) : null,
      painLevel: data.painLevel ? Number(data.painLevel) : null,
      recordedBy: data.recordedBy,
      notes: data.notes,
    },
  });

  if (globalPatient) {
    try {
      await prisma.vitals.create({
        data: {
          id: vitals.id,
          patientId: vitals.patientId,
          branchId: branchId,
          systolic: vitals.systolic,
          diastolic: vitals.diastolic,
          heartRate: vitals.heartRate,
          spo2: vitals.spo2,
          temperature: vitals.temperature,
          respiratoryRate: vitals.respiratoryRate,
          painLevel: vitals.painLevel,
          recordedBy: vitals.recordedBy,
          notes: vitals.notes,
          createdAt: vitals.createdAt,
          updatedAt: vitals.updatedAt,
        }
      });
    } catch (e) {
      console.error("Failed to sync vitals to global", e);
    }
  }

  return vitals;
};

const getVitalsOverview = async (branchId, query = {}) => {
  const tx = await tenantManager.getTenantClient(branchId);
  const { search, status, ward } = query;

  // Build filter for admission
  const whereClause = { status: "In Progress" };

  if (ward) {
    whereClause.ward = {
      code: { equals: ward, mode: 'insensitive' }
    };
  }

  if (search) {
    whereClause.patient = {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    };
  }

  // Get admitted patients in progress
  const admissions = await tx.admission.findMany({
    where: whereClause,
    include: {
      ward: true,
      patient: {
        include: {
          vitals: {
            orderBy: { createdAt: "desc" },
            take: 1
          }
        }
      }
    }
  });

  let mapped = admissions.map(adm => {
    const patient = adm.patient;
    const latestVital = patient.vitals?.[0] || null;
    
    let bp = "--";
    let bpStatus = "normal";
    let spo2 = "--";
    let spo2Status = "normal";
    let temp = "--";
    let hr = "--";
    let resp = "--";
    let pain = "0";
    let recordedBy = "--";
    let notes = false;

    if (latestVital) {
      const sys = latestVital.systolic;
      const dia = latestVital.diastolic;
      if (sys && dia) {
        bp = `${sys}/${dia}`;
        if (sys > 180 || dia > 110 || sys < 90 || dia < 60) {
          bpStatus = "critical";
        } else if (sys > 140 || dia > 90) {
          bpStatus = "abnormal";
        }
      }
      
      if (latestVital.spo2) {
        spo2 = `${latestVital.spo2}%`;
        if (latestVital.spo2 < 90) {
          spo2Status = "critical";
        } else if (latestVital.spo2 < 95) {
          spo2Status = "abnormal";
        }
      }

      if (latestVital.temperature) {
        temp = `${latestVital.temperature} °C`;
      }
      
      hr = latestVital.heartRate || "--";
      resp = latestVital.respiratoryRate || "--";
      pain = latestVital.painLevel !== null ? latestVital.painLevel.toString() : "0";
      recordedBy = latestVital.recordedBy || "--";
      notes = !!latestVital.notes;
    }

    return {
      id: patient.id,
      name: patient.name || `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Unknown Patient",
      bp,
      bpStatus,
      hr,
      spo2,
      spo2Status,
      temp,
      resp,
      pain,
      recordedBy,
      notes
    };
  });

  // Filter by status if specified
  if (status) {
    mapped = mapped.filter(item => item.bpStatus === status || item.spo2Status === status);
  }

  return mapped;
};

const getVitalsStats = async (branchId) => {
  const tx = await tenantManager.getTenantClient(branchId);
  
  const admissions = await tx.admission.findMany({
    where: { status: "In Progress" },
    include: {
      patient: {
        include: {
          vitals: {
            orderBy: { createdAt: "desc" },
            take: 1
          }
        }
      }
    }
  });

  let totalPatients = admissions.length;
  let critical = 0;
  let abnormal = 0;
  let overdue = 0;

  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

  admissions.forEach(adm => {
    const patient = adm.patient;
    const latestVital = patient.vitals?.[0] || null;

    if (!latestVital) {
      overdue++; // Admitted but has no vitals recorded yet
      return;
    }

    // Check overdue (older than 4 hours)
    if (new Date(latestVital.createdAt) < fourHoursAgo) {
      overdue++;
    }

    let sys = latestVital.systolic;
    let dia = latestVital.diastolic;
    let vitalSpO2 = latestVital.spo2;

    let isCritical = false;
    let isAbnormal = false;

    if (sys && dia) {
      if (sys > 180 || dia > 110 || sys < 90 || dia < 60) {
        isCritical = true;
      } else if (sys > 140 || dia > 90) {
        isAbnormal = true;
      }
    }

    if (vitalSpO2) {
      if (vitalSpO2 < 90) {
        isCritical = true;
      } else if (vitalSpO2 < 95) {
        isAbnormal = true;
      }
    }

    if (isCritical) {
      critical++;
    } else if (isAbnormal) {
      abnormal++;
    }
  });

  return {
    totalPatients,
    critical,
    abnormal,
    overdue
  };
};

const getVitalsById = async (branchId, id) => {
  const tx = await tenantManager.getTenantClient(branchId);
  return await tx.vitals.findUnique({ where: { id } });
};

const updateVitals = async (branchId, id, data) => {
  const tx = await tenantManager.getTenantClient(branchId);
  const vitals = await tx.vitals.update({
    where: { id },
    data,
  });

  try {
    await prisma.vitals.update({
      where: { id },
      data,
    });
  } catch (e) {
    console.error("Failed to update global vitals", e);
  }

  return vitals;
};

const deleteVitals = async (branchId, id) => {
  const tx = await tenantManager.getTenantClient(branchId);
  await tx.vitals.delete({ where: { id } });

  try {
    await prisma.vitals.delete({ where: { id } });
  } catch (e) {}

  return true;
};

const getVitalsFilters = async (branchId) => {
  const tx = await tenantManager.getTenantClient(branchId);

  // Fetch active wards
  const wards = await tx.ward.findMany({
    select: {
      id: true,
      name: true,
      code: true
    }
  });

  // Fetch all staff / doctors / users
  const users = await tx.tenantUser.findMany({
    where: {
      role: { in: ["STAFF", "DOCTOR", "BRANCH_ADMIN", "SUPERADMIN"] }
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  // Format wards: { label: ward.name, value: ward.code }
  const formattedWards = wards.map(w => ({
    label: w.name,
    value: w.code.toLowerCase()
  }));

  // Format staff: array of names
  const formattedStaff = users
    .map(u => u.name || u.email)
    .filter(Boolean);

  // Also get any unique recordedBy string from vitals in case it was written manually
  const uniqueRecorded = await tx.vitals.findMany({
    distinct: ['recordedBy'],
    select: { recordedBy: true },
    where: { recordedBy: { not: null } }
  });

  uniqueRecorded.forEach(r => {
    if (r.recordedBy && !formattedStaff.includes(r.recordedBy)) {
      formattedStaff.push(r.recordedBy);
    }
  });

  return {
    wards: formattedWards,
    staff: ["All", ...formattedStaff]
  };
};

module.exports = {
  getPatientVitals,
  createVitals,
  getVitalsOverview,
  getVitalsStats,
  getVitalsById,
  updateVitals,
  deleteVitals,
  getVitalsFilters,
};
