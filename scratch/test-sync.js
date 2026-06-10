const { createItem, updateItem, deleteItem, adjustStock } = require('../src/modules/lab-inventory/lab-inventory.service');
const { getTenantClient, mainDb } = require('../src/database/tenant-manager');

async function test() {
  const branchId = 'de30ef12-2cde-4e36-8290-7f28876c11db'; // Let's find a valid branch first
  console.log("Fetching a valid branch...");
  const branch = await mainDb.branch.findFirst({
    where: { isDbInitialized: true }
  });

  if (!branch) {
    console.error("No initialized branch found to test with.");
    return;
  }

  const targetBranchId = branch.id;
  console.log(`Using branch: ${branch.name} (${targetBranchId})`);

  const tenantDb = await getTenantClient(targetBranchId);

  // Test data
  const testSku = 'TEST-SKU-' + Date.now();
  const testData = {
    name: 'Test Sync Item',
    sku: testSku,
    category: 'Lab Reagents',
    qty: '100 Packs',
    expiry: '2026-12-31',
    status: 'In Stock',
    supplier: 'Test Supplier LLC',
    minThreshold: '10',
    notes: 'Testing DB sync',
    unitPrice: 15.5
  };

  console.log("\n1. Creating test item...");
  const createdItem = await createItem(targetBranchId, testData, 'Test Runner');
  console.log("Created item ID:", createdItem.id);

  // Check tenant DB
  const tenantItem = await tenantDb.inventoryItem.findUnique({
    where: { id: createdItem.id },
    include: { stockHistory: true }
  });
  console.log(`Tenant DB Check: Found? ${!!tenantItem}, SKU: ${tenantItem?.sku}, Stock History Count: ${tenantItem?.stockHistory?.length}`);

  // Check main DB
  const mainItem = await mainDb.inventoryItem.findUnique({
    where: { id: createdItem.id },
    include: { stockHistory: true }
  });
  console.log(`Main DB Check: Found? ${!!mainItem}, SKU: ${mainItem?.sku}, BranchId: ${mainItem?.branchId}, Stock History Count: ${mainItem?.stockHistory?.length}`);

  if (tenantItem && mainItem && mainItem.branchId === targetBranchId) {
    console.log("✅ Create Sync Successful!");
  } else {
    console.error("❌ Create Sync Failed!");
  }

  console.log("\n2. Adjusting stock...");
  await adjustStock(targetBranchId, createdItem.id, { type: 'Usage', qtyChanged: '10' }, 'Test Runner');

  // Verify stock in tenant and main DB
  const tenantItemAfterAdjust = await tenantDb.inventoryItem.findUnique({
    where: { id: createdItem.id },
    include: { stockHistory: true }
  });
  const mainItemAfterAdjust = await mainDb.inventoryItem.findUnique({
    where: { id: createdItem.id },
    include: { stockHistory: true }
  });
  console.log(`Tenant Qty: ${tenantItemAfterAdjust?.qty}, History Count: ${tenantItemAfterAdjust?.stockHistory?.length}`);
  console.log(`Main Qty: ${mainItemAfterAdjust?.qty}, History Count: ${mainItemAfterAdjust?.stockHistory?.length}`);

  if (tenantItemAfterAdjust?.qty === mainItemAfterAdjust?.qty && tenantItemAfterAdjust?.stockHistory?.length === 2) {
    console.log("✅ Adjust Stock Sync Successful!");
  } else {
    console.error("❌ Adjust Stock Sync Failed!");
  }

  console.log("\n3. Updating item...");
  await updateItem(targetBranchId, createdItem.id, {
    ...testData,
    name: 'Updated Test Sync Item',
    qty: '200 Packs',
    notes: 'Updated'
  }, 'Test Runner');

  const tenantItemAfterUpdate = await tenantDb.inventoryItem.findUnique({
    where: { id: createdItem.id },
    include: { stockHistory: true }
  });
  const mainItemAfterUpdate = await mainDb.inventoryItem.findUnique({
    where: { id: createdItem.id },
    include: { stockHistory: true }
  });
  console.log(`Tenant Name: ${tenantItemAfterUpdate?.name}, Qty: ${tenantItemAfterUpdate?.qty}, History Count: ${tenantItemAfterUpdate?.stockHistory?.length}`);
  console.log(`Main Name: ${mainItemAfterUpdate?.name}, Qty: ${mainItemAfterUpdate?.qty}, History Count: ${mainItemAfterUpdate?.stockHistory?.length}`);

  if (tenantItemAfterUpdate?.name === 'Updated Test Sync Item' && tenantItemAfterUpdate?.qty === mainItemAfterUpdate?.qty) {
    console.log("✅ Update Sync Successful!");
  } else {
    console.error("❌ Update Sync Failed!");
  }

  console.log("\n4. Deleting item...");
  await deleteItem(targetBranchId, createdItem.id);

  const tenantItemAfterDelete = await tenantDb.inventoryItem.findUnique({
    where: { id: createdItem.id }
  });
  const mainItemAfterDelete = await mainDb.inventoryItem.findUnique({
    where: { id: createdItem.id }
  });
  console.log(`Tenant DB: Still exists? ${!!tenantItemAfterDelete}`);
  console.log(`Main DB: Still exists? ${!!mainItemAfterDelete}`);

  if (!tenantItemAfterDelete && !mainItemAfterDelete) {
    console.log("✅ Delete Sync Successful!");
  } else {
    console.error("❌ Delete Sync Failed!");
  }
}

test().catch(console.error).finally(() => {
  mainDb.$disconnect();
  process.exit();
});
