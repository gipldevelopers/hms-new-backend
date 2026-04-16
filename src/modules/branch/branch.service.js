const { 
  mainDb, 
  createBranchDatabase, 
  deleteBranchDatabase, 
  initializeTenantSchema,
  syncAllTenants,
  getCurrentSchemaVersion
} = require("../../database/tenant-manager");

const createBranch = async (data) => {
  // Check for email collision
  const existing = await mainDb.branch.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error(`A branch with email "${data.email}" already exists.`);
  }

  const dbName = await createBranchDatabase(data.name, data.dbName, data.dbUser, data.dbPassword);
  return await mainDb.branch.create({
    data: {
      ...data,
      dbName,
      dbUser: data.dbUser || 'postgres',
      dbPassword: data.dbPassword || '',
    },
  });
};

const getAllBranches = async () => {
  return await mainDb.branch.findMany({
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
  if (branch && branch.dbName) {
    await deleteBranchDatabase(branch.dbName);
  }
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
