require('dotenv').config();
const { getTenantClient, syncAllTenants } = require('../src/database/tenant-manager');
const mainDb = require('../src/database/prisma');

async function test() {
  console.log("Checking main branches...");
  const branches = await mainDb.branch.findMany({
    where: { isDbInitialized: true }
  });
  console.log(`Found ${branches.length} initialized branches.`);

  for (const b of branches) {
    console.log(`\nTesting client for branch: ${b.name} (${b.id}) - DB: ${b.dbName}`);
    try {
      const tenantDb = await getTenantClient(b.id);
      
      console.log("Querying inventory items...");
      const itemsCount = await tenantDb.inventoryItem.count();
      console.log(`Items count: ${itemsCount}`);

      console.log("Querying stock history...");
      const historyCount = await tenantDb.inventoryStockHistory.count();
      console.log(`History count: ${historyCount}`);
      
      console.log("All OK!");
    } catch (err) {
      console.error("Failed to query tenant DB:", err.message);
      console.log("Attempting schema sync/push...");
      try {
        const { initializeTenantSchema } = require('../src/database/tenant-manager');
        await initializeTenantSchema(b.id);
        console.log("Sync/push success!");
      } catch (syncErr) {
        console.error("Schema sync failed:", syncErr.message);
      }
    }
  }
}

test().catch(console.error).finally(() => process.exit());
