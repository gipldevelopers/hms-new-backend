const { getTenantClient, mainDb } = require("../src/database/tenant-manager");
const service = require("../src/modules/batch-expiry/batch-expiry.service");
const crypto = require("crypto");

async function main() {
  try {
    const branch = await mainDb.branch.findFirst({
      where: { isDbInitialized: true }
    });

    if (!branch) {
      console.error("No active branch found!");
      return;
    }

    console.log(`Using branch: ${branch.name} (${branch.id})`);
    const tenantDb = await getTenantClient(branch.id);

    console.log("Seeding a temporary test item...");
    const id = crypto.randomUUID();
    let item = await tenantDb.stockItem.create({
      data: {
        id,
        name: "Test Return Med " + Date.now(),
        sku: "RET-MED-" + Date.now(),
        category: "Cardiology",
        qty: "500 Tablets",
        expiry: "2026-12",
        status: "In Stock",
        unitPrice: 15.0,
        notes: "Seeded for return test"
      }
    });
    await mainDb.stockItem.create({
      data: {
        id,
        branchId: branch.id,
        name: item.name,
        sku: item.sku,
        category: "Cardiology",
        qty: "500 Tablets",
        expiry: "2026-12",
        status: "In Stock",
        unitPrice: 15.0,
        notes: "Seeded for return test"
      }
    });

    console.log(`Initial Item Qty: ${item.qty}`);

    // Process a return
    console.log("Processing a vendor return of 50 units...");
    const returnResult = await service.processReturn(branch.id, {
      itemId: item.id,
      returnQty: "50",
      returnNote: "Test return of 50 tablets",
      vendor: "Cipla Ltd",
      reason: "Damaged packaging",
      settlementMode: "Refund"
    }, "Test Auditor");

    console.log(`Updated Item Qty: ${returnResult.qty}`);

    // Query BatchReturn from Tenant DB
    const tenantReturns = await tenantDb.batchReturn.findMany({
      where: { itemId: item.id }
    });
    console.log("\nTenant DB 'batch_returns' entries for item:");
    console.log(JSON.stringify(tenantReturns, null, 2));

    // Query BatchReturn from Main DB
    const mainReturns = await mainDb.batchReturn.findMany({
      where: { itemId: item.id }
    });
    console.log("\nMain DB 'batch_returns' entries for item:");
    console.log(JSON.stringify(mainReturns, null, 2));

    if (tenantReturns.length > 0 && mainReturns.length > 0) {
      console.log("\n✅ Success! New BatchReturn table records were successfully created in both databases!");
    } else {
      console.error("\n❌ Failed to insert BatchReturn records!");
    }

  } catch (err) {
    console.error("Error running test:", err);
  } finally {
    process.exit(0);
  }
}

main();
