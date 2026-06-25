const { getTenantClient, mainDb } = require("../../database/tenant-manager");
const crypto = require("crypto");
const emailService = require("../../services/email.service");

/**
 * Get admissions overview for a specific branch
 */
const getAdmissionsOverview = async (branchId, query = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const { search, status, type = 'admissions', departmentId, wardId } = query;

  const where = {};

  if (status && status !== 'All' && status !== "") {
    where.status = status;
  }

  if (departmentId && departmentId !== "") {
    where.departmentId = departmentId;
  }

  if (wardId && wardId !== 'All' && wardId !== "") {
    where.wardId = wardId;
  }

  if (search) {
    where.patient = {
      name: { contains: search, mode: 'insensitive' }
    };
  }

  if (type === 'discharge') {
    where.status = 'Completed';
  } else if (type === 'all') {
    // If status is specifically provided, use it, otherwise show all
    if (status && status !== 'All' && status !== "") {
      where.status = status;
    }
  } else {
    // Default to active admissions: exclude Completed unless a specific status is requested
    where.status = status && status !== "" && status !== "All" ? status : { not: 'Completed' };
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
  const [realDept, realWard, realBed, realDoctor] = await Promise.all([
    tenantDb.department.findUnique({ where: { id: data.departmentId } }),
    tenantDb.ward.findUnique({ where: { id: data.wardId } }),
    tenantDb.bed.findUnique({ where: { id: data.bedId } }),
    data.doctorId ? mainDb.user.findUnique({ where: { id: data.doctorId } }) : Promise.resolve(null)
  ]);

  if (realBed && realBed.status === 'OCCUPIED') {
    throw new Error(`Bed ${realBed.label} is already occupied by another patient.`);
  }

  const syncFunc = async (db, isMain = false) => {
    return await db.$transaction(async (tx) => {
      // 0. Self-Healing: Ensure Department, Ward, Bed, and Doctor exist in this DB
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

      // Sync Doctor if provided
      if (realDoctor) {
        const doctorData = {
          email: realDoctor.email,
          name: realDoctor.name,
          password: realDoctor.password,
          role: realDoctor.role,
          consoleRoles: realDoctor.consoleRoles,
          status: realDoctor.status,
          shiftType: realDoctor.shiftType,
          shiftStartTime: realDoctor.shiftStartTime,
          shiftEndTime: realDoctor.shiftEndTime
        };

        if (isMain) {
          await tx.user.upsert({
            where: { id: realDoctor.id },
            update: doctorData,
            create: { id: realDoctor.id, ...doctorData, branchId: realDoctor.branchId }
          });
        } else {
          // In Tenant DB, we use tenantUser model
          await tx.tenantUser.upsert({
            where: { id: realDoctor.id },
            update: doctorData,
            create: { id: realDoctor.id, ...doctorData }
          });
        }
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
    include: { patient: true, department: true, ward: true, bed: true }
  });
  if (!oldAdmission) throw new Error("Admission record not found");

  // Fetch real data only for provided IDs (support partial updates)
  const [realDept, realWard, realBed, realDoctor] = await Promise.all([
    data.departmentId ? tenantDb.department.findUnique({ where: { id: data.departmentId } }) : Promise.resolve(null),
    data.wardId ? tenantDb.ward.findUnique({ where: { id: data.wardId } }) : Promise.resolve(null),
    data.bedId ? tenantDb.bed.findUnique({ where: { id: data.bedId } }) : Promise.resolve(null),
    data.doctorId ? mainDb.user.findUnique({ where: { id: data.doctorId } }) : Promise.resolve(null)
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

      // Sync Doctor if provided
      if (realDoctor) {
        const doctorData = {
          email: realDoctor.email,
          name: realDoctor.name,
          password: realDoctor.password,
          role: realDoctor.role,
          consoleRoles: realDoctor.consoleRoles,
          status: realDoctor.status,
          shiftType: realDoctor.shiftType,
          shiftStartTime: realDoctor.shiftStartTime,
          shiftEndTime: realDoctor.shiftEndTime
        };

        if (isMain) {
          await tx.user.upsert({
            where: { id: realDoctor.id },
            update: doctorData,
            create: { id: realDoctor.id, ...doctorData, branchId: realDoctor.branchId }
          });
        } else {
          await tx.tenantUser.upsert({
            where: { id: realDoctor.id },
            update: doctorData,
            create: { id: realDoctor.id, ...doctorData }
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
        const patientExists = await tx.patient.findUnique({
          where: { id: oldAdmission.patientId }
        });
        if (patientExists) {
          await tx.patient.update({
            where: { id: oldAdmission.patientId },
            data: localPatientData
          });
        } else {
          await tx.patient.create({
            data: {
              id: oldAdmission.patientId,
              name: data.patientName || oldAdmission.patient?.name || "Unknown",
              age: parseInt(data.patientAge) || oldAdmission.patient?.age || null,
              gender: data.patientGender || oldAdmission.patient?.gender || null,
              contact: data.patientContact || oldAdmission.patient?.contact || null,
              email: data.patientEmail !== undefined ? (data.patientEmail || null) : (oldAdmission.patient?.email || null),
              emergencyContactName: data.emergencyContactName !== undefined ? (data.emergencyContactName || null) : (oldAdmission.patient?.emergencyContactName || null),
              emergencyContactPhone: data.emergencyContactPhone !== undefined ? (data.emergencyContactPhone || null) : (oldAdmission.patient?.emergencyContactPhone || null),
              ...(isMain ? { branchId } : {})
            }
          });
        }
      }

      const admissionExists = await tx.admission.findUnique({
        where: { id: admissionId }
      });

      let admission;
      if (admissionExists) {
        admission = await tx.admission.update({
          where: { id: admissionId },
          data: {
            ...((data.departmentId || (realWard ? realWard.departmentId : null)) && { departmentId: data.departmentId || realWard.departmentId }),
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
      } else {
        // Self-Healing: Ensure Patient, Department, Ward, and Bed exist in this DB first
        if (oldAdmission.patient) {
          const patientExists = await tx.patient.findUnique({
            where: { id: oldAdmission.patientId }
          });
          if (!patientExists) {
            await tx.patient.create({
              data: {
                id: oldAdmission.patientId,
                name: oldAdmission.patient.name || "Unknown Patient",
                age: oldAdmission.patient.age || null,
                gender: oldAdmission.patient.gender || null,
                contact: oldAdmission.patient.contact || null,
                email: oldAdmission.patient.email || null,
                emergencyContactName: oldAdmission.patient.emergencyContactName || null,
                emergencyContactPhone: oldAdmission.patient.emergencyContactPhone || null,
                ...(isMain ? { branchId } : {})
              }
            });
          }
        }

        if (oldAdmission.departmentId && oldAdmission.department) {
          const deptExists = await tx.department.findUnique({
            where: { id: oldAdmission.departmentId }
          });
          if (!deptExists) {
            await tx.department.create({
              data: {
                id: oldAdmission.departmentId,
                name: oldAdmission.department.name,
                code: oldAdmission.department.code,
                ...(isMain ? { branchId } : {})
              }
            });
          }
        }

        if (oldAdmission.wardId && oldAdmission.ward) {
          const wardExists = await tx.ward.findUnique({
            where: { id: oldAdmission.wardId }
          });
          if (!wardExists) {
            await tx.ward.create({
              data: {
                id: oldAdmission.wardId,
                name: oldAdmission.ward.name,
                code: oldAdmission.ward.code,
                departmentId: oldAdmission.departmentId,
                ...(isMain ? { branchId } : {})
              }
            });
          }
        }

        if (oldAdmission.bedId && oldAdmission.bed) {
          const bedExists = await tx.bed.findUnique({
            where: { id: oldAdmission.bedId }
          });
          if (!bedExists) {
            await tx.bed.create({
              data: {
                id: oldAdmission.bedId,
                label: oldAdmission.bed.label,
                wardId: oldAdmission.wardId,
                status: oldAdmission.bed.status || "AVAILABLE",
                ...(isMain ? { branchId } : {})
              }
            });
          }
        }

        admission = await tx.admission.create({
          data: {
            id: admissionId,
            patientId: oldAdmission.patientId,
            departmentId: data.departmentId || (realWard ? realWard.departmentId : oldAdmission.departmentId),
            wardId: data.wardId || oldAdmission.wardId,
            bedId: data.bedId || oldAdmission.bedId,
            doctorId: data.doctorId !== undefined ? (data.doctorId || null) : (oldAdmission.doctorId || null),
            reason: data.reason !== undefined ? data.reason : (oldAdmission.reason || "Admitted"),
            status: data.status || oldAdmission.status || "Pending",
            admissionDate: data.admissionDate ? new Date(data.admissionDate) : (oldAdmission.admissionDate || new Date()),
            dischargeDate: data.status === "Completed" ? new Date() : (oldAdmission.dischargeDate || null),
            ...(isMain ? { branchId } : {})
          }
        });
      }

      // Manage bed transitions
      if (data.bedId && oldAdmission.bedId !== data.bedId) {
        await tx.bed.updateMany({ where: { id: oldAdmission.bedId }, data: { status: "AVAILABLE" } });
        await tx.bed.updateMany({ where: { id: data.bedId }, data: { status: "OCCUPIED" } });

        // Propagate the new bed label to patient tasks and service requests in the tenant database
        if (!isMain) {
          const newBedLabel = realBed?.label || "Bed";
          await tx.serviceRequest.updateMany({
            where: { patientId: oldAdmission.patientId, status: { not: "Completed" } },
            data: { bed: newBedLabel }
          });
          await tx.task.updateMany({
            where: { patientId: oldAdmission.patientId, status: { not: "Completed" } },
            data: { bedLabel: newBedLabel }
          });
        }
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
