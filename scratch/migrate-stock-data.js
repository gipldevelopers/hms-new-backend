const { getTenantClient, mainDb } = require('../src/database/tenant-manager');

async function migrateBranchData(branch) {
  console.log(`\n📦 Migrating data for branch: ${branch.name} (${branch.id})...`);
  let tenantDb;
  try {
    tenantDb = await getTenantClient(branch.id);
  } catch (err) {
    console.warn(`⚠️ Skipped branch ${branch.name}: ${err.message}`);
    return;
  }

  // 1. Fetch old stock items from tenant database
  const oldItems = await tenantDb.inventoryItem.findMany({
    where: { inventoryType: 'STOCK' }
  });
  console.log(`Found ${oldItems.length} old stock items in tenant DB.`);

  let itemsMigrated = 0;
  let historyMigrated = 0;

  for (const item of oldItems) {
    // Check if it already exists in stockItem
    const exists = await tenantDb.stockItem.findUnique({
      where: { id: item.id }
    });

    if (!exists) {
      await tenantDb.stockItem.create({
        data: {
          id: item.id,
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
        }
      });
      itemsMigrated++;
    }

    // Fetch stock histories for this item
    const oldHistory = await tenantDb.inventoryStockHistory.findMany({
      where: { itemId: item.id, inventoryType: 'STOCK' }
    });

    for (const hist of oldHistory) {
      const histExists = await tenantDb.stockHistory.findUnique({
        where: { id: hist.id }
      });

      if (!histExists) {
        await tenantDb.stockHistory.create({
          data: {
            id: hist.id,
            itemId: hist.itemId,
            dateTime: hist.dateTime,
            type: hist.type,
            qtyChanged: hist.qtyChanged,
            user: hist.user,
            notes: hist.notes
          }
        });
        historyMigrated++;
      }
    }
  }

  console.log(`✅ Branch ${branch.name} migration finished: ${itemsMigrated} items and ${historyMigrated} histories migrated.`);
}

async function migrateMainDbData() {
  console.log(`\n📦 Migrating data for Main/Global database...`);

  // 1. Fetch old stock items from main DB
  const oldItems = await mainDb.inventoryItem.findMany({
    where: { inventoryType: 'STOCK' }
  });
  console.log(`Found ${oldItems.length} old stock items in Main DB.`);

  let itemsMigrated = 0;
  let historyMigrated = 0;

  for (const item of oldItems) {
    const exists = await mainDb.stockItem.findUnique({
      where: { id: item.id }
    });

    if (!exists) {
      await mainDb.stockItem.create({
        data: {
          id: item.id,
          branchId: item.branchId,
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
        }
      });
      itemsMigrated++;
    }

    // Fetch stock histories for this item
    const oldHistory = await mainDb.inventoryStockHistory.findMany({
      where: { itemId: item.id, inventoryType: 'STOCK' }
    });

    for (const hist of oldHistory) {
      const histExists = await mainDb.stockHistory.findUnique({
        where: { id: hist.id }
      });

      if (!histExists) {
        await mainDb.stockHistory.create({
          data: {
            id: hist.id,
            itemId: hist.itemId,
            branchId: hist.branchId,
            dateTime: hist.dateTime,
            type: hist.type,
            qtyChanged: hist.qtyChanged,
            user: hist.user,
            notes: hist.notes
          }
        });
        historyMigrated++;
      }
    }
  }

  console.log(`✅ Main DB migration finished: ${itemsMigrated} items and ${historyMigrated} histories migrated.`);
}

async function main() {
  console.log('🚀 Starting stock inventory data migration to new tables...');
  try {
    const branches = await mainDb.branch.findMany({
      where: { isDbInitialized: true }
    });

    for (const branch of branches) {
      await migrateBranchData(branch);
    }

    await migrateMainDbData();

    console.log('\n🎉 ALL MIGRATIONS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

main();
