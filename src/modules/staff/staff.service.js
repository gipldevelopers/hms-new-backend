const { getTenantClient, mainDb } = require("../../database/tenant-manager");

/**
 * Get all staff for a specific branch (Tenant DB)
 */
const getAllStaff = async (branchId) => {
  // Get Users from Main DB who are doctors/nurses/staff for this branch
  const branchUsers = await mainDb.user.findMany({
    where: { 
      branchId: branchId,
      role: { in: ['DOCTOR', 'STAFF', 'NURSE'] } // Include all clinical roles
    }
  });

  // Normalize and return
  return branchUsers.map(u => ({ 
    id: u.id, 
    firstName: u.name?.split(' ')[0] || "User", 
    lastName: u.name?.split(' ').slice(1).join(' ') || "",
    designation: u.role,
    specialization: u.specialization || 'General',
    email: u.email,
    isUser: true,
    isClinical: ['DOCTOR', 'STAFF', 'NURSE'].includes(u.role)
  }));
};

/**
 * Staff creation is now handled through the main user service.
 */
const createStaff = async (branchId, data) => {
  throw new Error("Staff creation should be handled through User management");
};

/**
 * Get patients assigned to a specific staff
 */
const getStaffAssignments = async (branchId, staffId) => {
  const tenantDb = await getTenantClient(branchId);
  const staff = await tenantDb.tenantUser.findUnique({
    where: { id: staffId },
    include: { assignedPatients: true }
  });
  return staff?.assignedPatients || [];
};

/**
 * Assign patients to a specific staff
 */
const assignPatientsToStaff = async (branchId, staffId, patientIds) => {
  const tenantDb = await getTenantClient(branchId);
  
  // Update assignments using many-to-many set
  return await tenantDb.tenantUser.update({
    where: { id: staffId },
    data: {
      assignedPatients: {
        set: patientIds.map(id => ({ id }))
      }
    },
    include: { assignedPatients: true }
  });
};

module.exports = {
  getAllStaff,
  createStaff,
  getStaffAssignments,
  assignPatientsToStaff
};
