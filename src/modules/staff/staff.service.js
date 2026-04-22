const { getTenantClient, mainDb } = require("../../database/tenant-manager");

/**
 * Get all staff for a specific branch (Tenant DB)
 */
const getAllStaff = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  
  // 1. Get Clinical Staff from Tenant DB
  const clinicalStaff = await tenantDb.staff.findMany({
    orderBy: { firstName: 'asc' }
  });

  // 2. Get Users from Main DB who are doctors/nurses for this branch
  const branchUsers = await mainDb.user.findMany({
    where: { 
      OR: [
        { branchId: branchId },
        { branch: { name: { contains: branchId, mode: 'insensitive' } } }
      ],
      role: { in: ['DOCTOR', 'STAFF'] }
    }
  });

  // 3. Normalize and Combine (REAL DATA ONLY)
  return [
    ...clinicalStaff.map(s => ({ ...s, isClinical: true })),
    ...branchUsers.map(u => ({ 
      id: u.id, 
      firstName: u.name?.split(' ')[0] || "User", 
      lastName: u.name?.split(' ').slice(1).join(' ') || "",
      designation: u.role,
      specialization: 'General',
      email: u.email,
      isUser: true
    }))
  ];
};

/**
 * Create staff entry (Tenant DB)
 */
const createStaff = async (branchId, data) => {
  const tenantDb = await getTenantClient(branchId);
  return await tenantDb.staff.create({
    data
  });
};

module.exports = {
  getAllStaff,
  createStaff
};
