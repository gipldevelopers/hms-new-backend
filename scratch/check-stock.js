const { getTenantClient, mainDb } = require("../src/database/tenant-manager");

async function main() {
  try {
    const branches = await mainDb.branch.findMany({ where: { isDbInitialized: true } });
    console.log("Initialized Branches:", branches.map(b => ({ id: b.id, name: b.name })));
    for (const b of branches) {
      console.log(`\n--- Items for Branch: ${b.name} (${b.id}) ---`);
      const tenantDb = await getTenantClient(b.id);
      const items = await tenantDb.stockItem.findMany();
      console.log(`Found ${items.length} StockItems`);
      items.forEach(item => {
        console.log(`- ID: ${item.id}, Name: ${item.name}, SKU: ${item.sku}, Qty: ${item.qty}, Expiry: ${item.expiry}, Status: ${item.status}, Supplier: ${item.supplier}`);
      });

      const histories = await tenantDb.stockHistory.findMany();
      console.log(`Found ${histories.length} StockHistories`);
    }
  } catch (err) {
    console.error("Error checking stock:", err);
  } finally {
    process.exit(0);
  }
}

main();
