const { getTenantClient, mainDb } = require("../../database/tenant-manager");
const crypto = require("crypto");
const emailService = require("../../services/email.service");

/**
 * Get admissions overview for a specific branch
 */
const getAdmissionsOverview = async (branchId, query = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const { search, status, type = 'admissions', departmentId } = query;

  const where = {};

  if (status && status !== 'All' && status !== "") {
    where.status = status;
  }

  if (departmentId && departmentId !== "") {
    where.departmentId = departmentId;
  }

  if (search) {
    where.patient = {
      name: { contains: search, mode: 'insensitive' }
    };
  }

  // If type is discharge, we filter by status being Completed
  if (type === 'discharge') {
    where.status = 'Completed';
  } else {
    // Default to active admissions: exclude Completed
    where.status = status && status !== "" ? status : { not: 'Completed' };
  }

  const admissions = await tenantDb.admission.findMany({
    where,
    include: {
      patient: true,
      department: true,
      ward: true,
      bed: true,
      doctor: true
    },
    orderBy: { admissionDate: 'desc' }
  });

  return admissions;
};

/**
 * Create a new admission (Sync across Main and Tenant DBs)
 */
const createAdmission = async (branchId, data) => {
  const tenantDb = await getTenantClient(branchId);
  const admissionId = crypto.randomUUID();
  const patientId = data.patientId || crypto.randomUUID();

  // Fetch real names/codes from Tenant DB to avoid placeholders in Main DB
  const [realDept, realWard, realBed] = await Promise.all([
    tenantDb.department.findUnique({ where: { id: data.departmentId } }),
    tenantDb.ward.findUnique({ where: { id: data.wardId } }),
    tenantDb.bed.findUnique({ where: { id: data.bedId } })
  ]);

  const syncFunc = async (db, isMain = false) => {
    return await db.$transaction(async (tx) => {
      // 0. Self-Healing: Ensure Department, Ward, and Bed exist in this DB (Main DB sync safety)
      if (isMain) {
        await tx.department.upsert({
          where: { id: data.departmentId },
          update: { name: realDept?.name, code: realDept?.code },
          create: {
            id: data.departmentId,
            name: realDept?.name || "Uncategorized",
            code: realDept?.code || "DEPT",
            branchId: branchId
          }
        });

        await tx.ward.upsert({
          where: { id: data.wardId },
          update: { name: realWard?.name, code: realWard?.code },
          create: {
            id: data.wardId,
            name: realWard?.name || "General Ward",
            code: realWard?.code || "WARD",
            departmentId: data.departmentId,
            branchId: branchId
          }
        });

        await tx.bed.upsert({
          where: { id: data.bedId },
          update: { label: realBed?.label },
          create: {
            id: data.bedId,
            label: realBed?.label || "Bed",
            wardId: data.wardId,
            branchId: branchId,
            status: "AVAILABLE"
          }
        });
      }

      // Prepare localized data
      const localPatientData = {
        name: data.patientName,
        age: parseInt(data.patientAge),
        gender: data.patientGender,
        contact: data.patientContact,
        email: data.patientEmail || null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
        ...(isMain ? { branchId } : {})
      };

      const localAdmissionData = {
        id: admissionId,
        departmentId: data.departmentId,
        wardId: data.wardId,
        bedId: data.bedId,
        doctorId: data.doctorId || null,
        reason: data.reason,
        status: data.status || "Pending",
        admissionDate: data.admissionDate ? new Date(data.admissionDate) : new Date(),
        ...(isMain ? { branchId } : {})
      };

      // Upsert Patient
      const patient = await tx.patient.upsert({
        where: { id: patientId },
        update: localPatientData,
        create: { id: patientId, ...localPatientData }
      });

      // Create Admission
      const admission = await tx.admission.create({
        data: { ...localAdmissionData, patientId: patient.id }
      });

      // Update Bed Status to OCCUPIED
      await tx.bed.updateMany({
        where: { id: data.bedId },
        data: { status: "OCCUPIED" }
      });

      return admission;
    });
  };

  await syncFunc(mainDb, true);
  const result = await syncFunc(tenantDb, false);

  // Send Admission Email
  if (data.patientEmail) {
    emailService.sendAdmissionEmail(
      data.patientEmail,
      data.patientName,
      realDept?.name || "Hospital",
      data.admissionDate || new Date()
    );
  }

  return result;
};

/**
 * Get admission stats
 */
const getStats = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayAdmissions, todayDischarges, inProgress, pending] = await Promise.all([
    tenantDb.admission.count({ where: { admissionDate: { gte: today } } }),
    tenantDb.admission.count({ where: { dischargeDate: { gte: today }, status: "Completed" } }),
    tenantDb.admission.count({ where: { status: "In Progress" } }),
    tenantDb.admission.count({ where: { status: "Pending" } })
  ]);

  return { todayAdmissions, todayDischarges, inProgress, pending };
};

/**
 * Update existing admission
 */
const updateAdmission = async (branchId, admissionId, data) => {
  const tenantDb = await getTenantClient(branchId);
  
  const oldAdmission = await tenantDb.admission.findUnique({ 
    where: { id: admissionId },
    include: { patient: true, department: true }
  });
  if (!oldAdmission) throw new Error("Admission record not found");

  // Fetch real data only for provided IDs (support partial updates)
  const [realDept, realWard, realBed] = await Promise.all([
    data.departmentId ? tenantDb.department.findUnique({ where: { id: data.departmentId } }) : Promise.resolve(null),
    data.wardId ? tenantDb.ward.findUnique({ where: { id: data.wardId } }) : Promise.resolve(null),
    data.bedId ? tenantDb.bed.findUnique({ where: { id: data.bedId } }) : Promise.resolve(null)
  ]);

  const syncFunc = async (db, isMain = false) => {
    return await db.$transaction(async (tx) => {
      // 0. Self-Healing: Only perform if IDs are provided in the update
      if (isMain) {
        if (data.departmentId) {
          await tx.department.upsert({
            where: { id: data.departmentId },
            update: { name: realDept?.name, code: realDept?.code },
            create: {
              id: data.departmentId,
              name: realDept?.name || "Uncategorized",
              code: realDept?.code || "DEPT",
              branchId: branchId
            }
          });
        }

        if (data.wardId) {
          await tx.ward.upsert({
            where: { id: data.wardId },
            update: { 
              name: realWard?.name, 
              code: realWard?.code,
              departmentId: data.departmentId || oldAdmission.departmentId 
            },
            create: {
              id: data.wardId,
              name: realWard?.name || "General Ward",
              code: realWard?.code || "WARD",
              departmentId: data.departmentId || oldAdmission.departmentId,
              branchId: branchId
            }
          });
        }

        if (data.bedId) {
          await tx.bed.upsert({
            where: { id: data.bedId },
            update: { label: realBed?.label },
            create: {
              id: data.bedId,
              label: realBed?.label || "Bed",
              wardId: data.wardId || oldAdmission.wardId,
              branchId: branchId,
              status: "AVAILABLE"
            }
          });
        }
      }

      const localPatientData = {
        ...(data.patientName && { name: data.patientName }),
        ...(data.patientAge && { age: parseInt(data.patientAge) }),
        ...(data.patientGender && { gender: data.patientGender }),
        ...(data.patientContact && { contact: data.patientContact }),
        ...(data.patientEmail !== undefined && { email: data.patientEmail || null }),
        ...(data.emergencyContactName !== undefined && { emergencyContactName: data.emergencyContactName || null }),
        ...(data.emergencyContactPhone !== undefined && { emergencyContactPhone: data.emergencyContactPhone || null }),
        ...(isMain ? { branchId } : {})
      };

      // Only update patient if data provided
      if (Object.keys(localPatientData).length > (isMain ? 1 : 0)) {
        await tx.patient.update({
          where: { id: oldAdmission.patientId },
          data: localPatientData
        });
      }

      const admission = await tx.admission.update({
        where: { id: admissionId },
        data: {
          ...(data.departmentId && { departmentId: data.departmentId }),
          ...(data.wardId && { wardId: data.wardId }),
          ...(data.bedId && { bedId: data.bedId }),
          ...(data.doctorId !== undefined && { doctorId: data.doctorId || null }),
          ...(data.reason !== undefined && { reason: data.reason }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.admissionDate && { admissionDate: new Date(data.admissionDate) }),
          ...(data.status === "Completed" && { dischargeDate: new Date() }),
          ...(isMain ? { branchId } : {})
        }
      });

      // Manage bed transitions
      if (data.bedId && oldAdmission.bedId !== data.bedId) {
        await tx.bed.updateMany({ where: { id: oldAdmission.bedId }, data: { status: "AVAILABLE" } });
        await tx.bed.updateMany({ where: { id: data.bedId }, data: { status: "OCCUPIED" } });
      } else if (data.status === "Completed" && oldAdmission.status !== "Completed") {
        await tx.bed.updateMany({ where: { id: oldAdmission.bedId }, data: { status: "AVAILABLE" } });
      } else if (data.status === "In Progress" && oldAdmission.status === "Completed") {
        // Re-admission: set bed to OCCUPIED
        await tx.bed.updateMany({ where: { id: oldAdmission.bedId }, data: { status: "OCCUPIED" } });
      }

      return admission;
    });
  };

  await syncFunc(mainDb, true);
  const result = await syncFunc(tenantDb, false);

  // Send Conditional Emails
  const patientEmail = data.patientEmail || oldAdmission.patient.email;
  if (patientEmail) {
    if (data.status === "Completed" && oldAdmission.status !== "Completed") {
      emailService.sendDischargeEmail(patientEmail, oldAdmission.patient.name, new Date());
    } else if (data.status === "In Progress" && oldAdmission.status === "Completed") {
      emailService.sendReadmissionEmail(patientEmail, oldAdmission.patient.name, oldAdmission.department?.name || "Hospital");
    }
  }

  return result;
};

/**
 * Delete admission record
 */
const deleteAdmission = async (branchId, admissionId) => {
  const tenantDb = await getTenantClient(branchId);
  const admission = await tenantDb.admission.findUnique({ where: { id: admissionId } });
  if (!admission) throw new Error("Admission not found");

  const syncFunc = async (db, isMain = false) => {
    return await db.$transaction(async (tx) => {
      await tx.bed.updateMany({ where: { id: admission.bedId }, data: { status: "AVAILABLE" } });
      return await tx.admission.deleteMany({ where: { id: admissionId } });
    });
  };

  await syncFunc(mainDb, true);
  return await syncFunc(tenantDb, false);
};

module.exports = {
  getAdmissionsOverview,
  createAdmission,
  updateAdmission,
  deleteAdmission,
  getStats
};
