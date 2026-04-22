const { getTenantClient, mainDb } = require('../src/database/tenant-manager');

async function purge() {
  const branchId = '8b3ca77d-e8df-4b79-809b-f568272d38a9';
  console.log(`🧹 Purging demo data for Branch: ${branchId}`);

  try {
    // 1. Delete Demo Staff from Tenant DB
    const tenantDb = await getTenantClient(branchId);
    const deletedStaff = await tenantDb.staff.deleteMany({
      where: {
        email: { in: ['priya@hms.com', 'sameer@hms.com', 'anjali@hms.com', 'rahul@hms.com', 'vikram@hms.com'] }
      }
    });
    console.log(`✅ Deleted ${deletedStaff.count} demo staff members.`);

    // 2. Delete Demo Templates from Main DB
    const deletedTemplates = await mainDb.shiftTemplate.deleteMany({
      where: {
        branchId,
        name: { in: ['Morning OPD', 'Evening Surgery', 'Night Ward', 'Emergency Response'] }
      }
    });
    console.log(`✅ Deleted ${deletedTemplates.count} demo templates.`);

  } catch (err) {
    console.error('Purge Error:', err.message);
  }
}

purge().finally(() => process.exit());
