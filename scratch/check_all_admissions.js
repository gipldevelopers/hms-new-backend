const { mainDb, getTenantClient } = require("../src/database/tenant-manager");

async function checkAdmissions() {
  // Get all branches first to check their tenant DBs
  const branches = await mainDb.branch.findMany();
  console.log("Branches:", branches.map(b => ({ id: b.id, name: b.name })));

  for (const branch of branches) {
    console.log(`--- Branch: ${branch.name} (${branch.id}) ---`);
    try {
      const tenantDb = await getTenantClient(branch.id);
      const admissions = await tenantDb.admission.findMany({
        include: { patient: true }
      });
      console.log(`Admissions count: ${admissions.length}`);
      if (admissions.length > 0) {
        console.log(JSON.stringify(admissions, null, 2));
      }
    } catch (e) {
      console.log(`Error checking branch ${branch.name}: ${e.message}`);
    }
  }
}

checkAdmissions().catch(console.error).finally(() => mainDb.$disconnect());
