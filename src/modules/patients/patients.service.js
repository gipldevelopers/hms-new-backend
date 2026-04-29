const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");

const getAllPatients = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  return await tenantDb.patient.findMany({
    orderBy: { name: 'asc' },
    include: {
      admissions: {
        where: { status: 'In Progress' },
        select: { id: true }
      }
    }
  });
};

module.exports = {
  getAllPatients
};
