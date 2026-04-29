const { getTenantClient } = require("../../database/tenant-manager");

/**
 * Get the full hierarchy of departments, wards, and beds for the bed map
 */
const getBedMapHierarchy = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  return await tenantDb.department.findMany({
    where: { active: true },
    include: {
      wards: {
        include: {
          beds: {
            include: {
              admissions: {
                where: { status: { not: "Completed" } },
                include: {
                  patient: true,
                  doctor: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
};

module.exports = {
  getBedMapHierarchy
};
