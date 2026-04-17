const { 
  mainDb, 
  createBranchDatabase, 
  deleteBranchDatabase, 
  initializeTenantSchema,
  syncAllTenants,
  getCurrentSchemaVersion
} = require("../../database/tenant-manager");
const userService = require("../users/users.service");

const createBranch = async (data) => {
  // Check for email collision
  const existing = await mainDb.branch.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error(`A branch with email "${data.email}" already exists.`);
  }

  const dbName = await createBranchDatabase(data.name, data.dbName, data.dbUser, data.dbPassword);
  
  const branch = await mainDb.branch.create({
    data: {
      ...data,
      dbName,
      dbUser: data.dbUser || 'postgres',
      dbPassword: data.dbPassword || '',
    },
  });

  // Automatically create a Branch Admin user for this branch
  try {
      await userService.createUser({
          name: `${branch.name} Admin`,
          email: branch.email,
          role: 'BRANCH_ADMIN',
          branchId: branch.id,
          status: 'Active'
      });
      console.log(`👤 Branch Admin automatically created for ${branch.name}`);
  } catch (err) {
      console.error(`⚠️ Failed to auto-create Branch Admin: ${err.message}`);
  }

  return branch;
};

const getAllBranches = async (filters = {}) => {
  const { search } = filters;
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { state: { contains: search, mode: 'insensitive' } },
    ];
  }

  return await mainDb.branch.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

const getBranchById = async (id) => {
  return await mainDb.branch.findUnique({
    where: { id },
  });
};

const updateBranch = async (id, data) => {
  return await mainDb.branch.update({
    where: { id },
    data,
  });
};

const deleteBranch = async (id) => {
  const branch = await mainDb.branch.findUnique({ where: { id } });
  
  // 1. Terminate Tenant Database and Connections
  if (branch && branch.dbName) {
    await deleteBranchDatabase(branch.dbName);
  }

  // 2. Forensic Purge of associated accounts in Global Registry
  console.log(`🧹 Forcefully purging all personnel and assignments for branch: ${branch?.name || id}`);
  await mainDb.user.deleteMany({ where: { branchId: id } });
  await mainDb.branchAssignment.deleteMany({ where: { branchId: id } });

  // 3. Remove Institutional Identity
  return await mainDb.branch.delete({
    where: { id },
  });
};

const getBranchStats = async () => {
  const totalBranches = await mainDb.branch.count();
  return {
    totalBranches,
    totalDepartments: 0,
    totalBeds: 0,
    totalStaff: 0,
  };
};

const initTables = async (id) => {
  return await initializeTenantSchema(id);
};

const syncAll = async () => {
  return await syncAllTenants();
};

const getSchemaInfo = async () => {
  return {
    version: getCurrentSchemaVersion()
  };
};

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getBranchStats,
  initTables,
  syncAll,
  getSchemaInfo
};
