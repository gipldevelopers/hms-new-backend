const { getTenantClient, mainDb } = require("../../database/tenant-manager");

/**
 * Get all departments with their wards and beds (Tenant DB)
 */
const getDepartmentsOverview = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  return await tenantDb.department.findMany({
    include: {
      wards: {
        include: {
          beds: true
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
};

/**
 * Update/Create departments, wards, and beds in bulk across both Main and Tenant DBs
 */
const syncDepartments = async (branchId, departments) => {
  const tenantDb = await getTenantClient(branchId);
  
  // 1. Assign stable UUIDs to all new items BEFORE syncing
  // This ensures Main DB and Tenant DB have IDENTICAL IDs for the same records
  const processedDepts = departments.map(dept => {
    const dId = (typeof dept.id !== 'string' || dept.id.startsWith('new-')) ? crypto.randomUUID() : dept.id;
    return {
      ...dept,
      id: dId,
      wards: (dept.wards || []).map(ward => {
        const wId = (typeof ward.id !== 'string' || ward.id.startsWith('new-')) ? crypto.randomUUID() : ward.id;
        return {
          ...ward,
          id: wId,
          beds: (ward.beds || []).map(bed => {
            const bId = (typeof bed.id !== 'string' || bed.id.startsWith('new-')) ? crypto.randomUUID() : bed.id;
            return {
              ...bed,
              id: bId
            };
          })
        };
      })
    };
  });

  const syncFunc = async (db, isMain) => {
    return await db.$transaction(async (tx) => {
      // 1. Get incoming IDs to handle deletions
      const incomingDeptIds = processedDepts.map(d => d.id);
      const incomingWardIds = processedDepts.flatMap(d => d.wards.map(w => w.id));
      const incomingBedIds = processedDepts.flatMap(d => d.wards.flatMap(w => w.beds.map(b => b.id)));
      
      // 2. Safety Check: Ensure no entities being deleted have active admissions
      const deptsToDelete = await tx.department.findMany({
        where: { 
          id: { notIn: incomingDeptIds },
          ...(isMain ? { branchId } : {})
        },
        include: { _count: { select: { admissions: true } } }
      });

      const deptsWithAdmissions = deptsToDelete.filter(d => d._count.admissions > 0);
      const deptIdsWithAdmissions = deptsWithAdmissions.map(d => d.id);

      // Cleanup: Remove departments not in incoming list, EXCEPT those with active admissions
      await tx.department.deleteMany({
        where: { 
          id: { notIn: [...incomingDeptIds, ...deptIdsWithAdmissions] },
          ...(isMain ? { branchId } : {})
        }
      });

      // 3. Process Departments, Wards, and Beds
      for (const dept of processedDepts) {
        const deptData = {
          name: dept.name,
          active: dept.active ?? (dept.status === 'Active')
        };

        const upsertedDept = await tx.department.upsert({
          where: { id: dept.id },
          update: deptData,
          create: {
            id: dept.id,
            ...deptData,
            code: dept.code || dept.name.toUpperCase().substring(0, 3),
            ...(isMain ? { branchId } : {})
          }
        });

        // Cleanup Wards in this department
        const deptWardIds = dept.wards.map(w => w.id);
        const wardsToDelete = await tx.ward.findMany({
          where: { 
            departmentId: upsertedDept.id,
            id: { notIn: deptWardIds },
            ...(isMain ? { branchId } : {})
          },
          include: { _count: { select: { admissions: true } } }
        });

        const wardIdsWithAdmissions = wardsToDelete.filter(w => w._count.admissions > 0).map(w => w.id);

        await tx.ward.deleteMany({
          where: { 
            departmentId: upsertedDept.id,
            id: { notIn: [...deptWardIds, ...wardIdsWithAdmissions] },
            ...(isMain ? { branchId } : {})
          }
        });

        for (const ward of dept.wards) {
          const wardData = { name: ward.name, code: ward.code };
          const upsertedWard = await tx.ward.upsert({
            where: { id: ward.id },
            update: wardData,
            create: {
              id: ward.id,
              ...wardData,
              departmentId: upsertedDept.id,
              ...(isMain ? { branchId } : {})
            }
          });

          // Cleanup Beds in this ward
          const wardBedIds = ward.beds.map(b => b.id);
          const bedsToDelete = await tx.bed.findMany({
            where: { 
              wardId: upsertedWard.id,
              id: { notIn: wardBedIds },
              ...(isMain ? { branchId } : {})
            },
            include: { _count: { select: { admissions: true } } }
          });

          const bedIdsWithAdmissions = bedsToDelete.filter(b => b._count.admissions > 0).map(b => b.id);

          await tx.bed.deleteMany({
            where: { 
              wardId: upsertedWard.id,
              id: { notIn: [...wardBedIds, ...bedIdsWithAdmissions] },
              ...(isMain ? { branchId } : {})
            }
          });

          for (const bed of ward.beds) {
            const bedData = {
              label: bed.label,
              equipmentId: bed.equipmentId,
              status: bed.status || 'AVAILABLE'
            };

            await tx.bed.upsert({
              where: { id: bed.id },
              update: bedData,
              create: {
                id: bed.id,
                ...bedData,
                wardId: upsertedWard.id,
                ...(isMain ? { branchId } : {})
              }
            });
          }
        }
      }
    });
  };

  // Run both syncs - Main DB first to act as the primary registry
  await syncFunc(mainDb, true);
  await syncFunc(tenantDb, false);

  return { message: "Synced successfully across all databases" };
};

/**
 * Get statistics for beds and wards
 */
const getStats = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  
  const totalBeds = await tenantDb.bed.count();
  const occupiedBeds = await tenantDb.bed.count({ where: { status: 'OCCUPIED' } });
  const availableBeds = await tenantDb.bed.count({ where: { status: 'AVAILABLE' } });
  const reservedBeds = await tenantDb.bed.count({ where: { status: 'RESERVED' } });
  const totalDepts = await tenantDb.department.count();

  return {
    totalBeds,
    occupiedBeds,
    availableBeds,
    reservedBeds,
    totalDepts
  };
};

/**
 * Toggle department status across both Main and Tenant DBs
 */
const toggleDepartmentStatus = async (branchId, departmentId, active) => {
  const tenantDb = await getTenantClient(branchId);
  
  // 1. Update Tenant DB (The primary source of truth for the branch)
  const dept = await tenantDb.department.update({
    where: { id: departmentId },
    data: { active }
  });

  // 2. Update Main DB (The central registry)
  // Use upsert to handle legacy ID mismatches or missing records
  try {
    await mainDb.department.upsert({
      where: { id: departmentId },
      update: { active },
      create: {
        id: departmentId,
        name: dept.name,
        code: dept.code,
        active: active,
        branchId: branchId
      }
    });
  } catch (error) {
    // If even upsert fails (e.g. unique constraint on name/code), log it but don't crash
    console.error("Main DB sync failed for department toggle:", error.message);
    
    // Fallback: try to update by code/branch if ID mismatch is the issue
    try {
      await mainDb.department.updateMany({
        where: { 
          branchId: branchId,
          code: dept.code
        },
        data: { active }
      });
    } catch (innerError) {
      console.error("Main DB fallback update failed:", innerError.message);
    }
  }

  return { message: `Department status updated to ${active ? 'Active' : 'Inactive'}` };
};

/**
 * Delete a department and its wards/beds
 */
const deleteDepartment = async (branchId, departmentId) => {
  const tenantDb = await getTenantClient(branchId);
  
  // 1. Safety Check: Existence and Admissions
  const deptWithCount = await tenantDb.department.findUnique({
    where: { id: departmentId },
    include: { _count: { select: { admissions: true } } }
  });

  if (!deptWithCount) throw new Error("Department not found");
  if (deptWithCount._count.admissions > 0) {
    throw new Error(`Cannot delete department "${deptWithCount.name}" as it has active or past clinical records.`);
  }

  // 2. Delete from tenant DB
  await tenantDb.department.delete({
    where: { id: departmentId }
  });

  // Delete from main DB
  // Use deleteMany to avoid errors if record doesn't exist (e.g. legacy ID mismatch)
  await mainDb.department.deleteMany({
    where: { 
      id: departmentId,
      branchId: branchId
    }
  });

  return { message: "Deleted successfully across all databases" };
};

module.exports = {
  getDepartmentsOverview,
  syncDepartments,
  getStats,
  deleteDepartment,
  toggleDepartmentStatus
};
