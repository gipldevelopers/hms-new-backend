const { getTenantClient, mainDb } = require('../src/database/tenant-manager');

async function syncAll() {
  console.log("🔍 Finding all branches...");
  const branches = await mainDb.branch.findMany({
    where: { isDbInitialized: true }
  });

  console.log(`Found ${branches.length} branches to sync.`);

  for (const b of branches) {
    console.log(`\nProcessing branch: ${b.name} (${b.id}) - DB: ${b.dbName}`);
    try {
      const tenantDb = await getTenantClient(b.id);

      // Fetch all items from tenant DB
      const items = await tenantDb.inventoryItem.findMany({
        include: { stockHistory: true }
      });

      console.log(`Found ${items.length} items to sync.`);

      for (const item of items) {
        // Upsert item in main DB
        const itemData = {
          name: item.name,
          sku: item.sku,
          category: item.category,
          qty: item.qty,
          expiry: item.expiry,
          status: item.status,
          supplier: item.supplier,
          minThreshold: item.minThreshold,
          notes: item.notes,
          unitPrice: item.unitPrice,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };

        await mainDb.inventoryItem.upsert({
          where: { id: item.id },
          update: itemData,
          create: {
            id: item.id,
            branchId: b.id,
            ...itemData
          }
        });

        // Sync history logs
        for (const history of item.stockHistory) {
          const historyData = {
            itemId: history.itemId,
            dateTime: history.dateTime,
            type: history.type,
            qtyChanged: history.qtyChanged,
            user: history.user,
            notes: history.notes
          };

          await mainDb.inventoryStockHistory.upsert({
            where: { id: history.id },
            update: historyData,
            create: {
              id: history.id,
              branchId: b.id,
              ...historyData
            }
          });
        }
      }

      console.log(`✅ Synced branch ${b.name} successfully.`);
    } catch (err) {
      console.error(`❌ Failed to sync branch ${b.name}:`, err.message);
    }
  }
}

syncAll().catch(console.error).finally(() => {
  mainDb.$disconnect();
  process.exit();
});
