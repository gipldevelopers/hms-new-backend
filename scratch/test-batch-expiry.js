const { getTenantClient, mainDb } = require("../src/database/tenant-manager");
const service = require("../src/modules/batch-expiry/batch-expiry.service");
const crypto = require("crypto");

async function main() {
  try {
    // 1. Get first active branch
    const branch = await mainDb.branch.findFirst({
      where: { isDbInitialized: true }
    });

    if (!branch) {
      console.error("No active branch found!");
      return;
    }

    console.log(`Using branch: ${branch.name} (${branch.id})`);
    const tenantDb = await getTenantClient(branch.id);

    // 2. Fetch all batches
    let batches = await service.getBatches(branch.id);
    console.log("Current Batches Counts:");
    console.log(`- Expired: ${batches.expired.length}`);
    console.log(`- Expiring 30 Days: ${batches.expiring30.length}`);
    console.log(`- Expiring 60 Days: ${batches.expiring60.length}`);
    console.log(`- Healthy: ${batches.healthy.length}`);

    // 3. Create items to test various expiry dates if we don't have enough
    console.log("\nSeeding test items for different expiry zones...");
    const testItems = [
      {
        id: crypto.randomUUID(),
        name: "Expired Amoxicillin",
        sku: "EXP-AMX",
        category: "Antibiotics",
        qty: "200 Capsules",
        expiry: "2024-02",
        status: "In Stock",
        unitPrice: 4.5,
        notes: "Test expired item"
      },
      {
        id: crypto.randomUUID(),
        name: "Expiring 15d Amoxicillin",
        sku: "EXP15-AMX",
        category: "Antibiotics",
        qty: "300 Capsules",
        expiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        status: "In Stock",
        unitPrice: 5.0,
        notes: "Test expiring 15d item"
      },
      {
        id: crypto.randomUUID(),
        name: "Expiring 45d Propofol",
        sku: "EXP45-PRP",
        category: "Anesthetics",
        qty: "150 Ampoules",
        expiry: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        status: "In Stock",
        unitPrice: 12.5,
        notes: "Test expiring 45d item"
      },
      {
        id: crypto.randomUUID(),
        name: "Healthy Saline IV",
        sku: "HLT-SLN",
        category: "Intravenous Fluids",
        qty: "1000 Bags",
        expiry: "2027-12",
        status: "In Stock",
        unitPrice: 18.0,
        notes: "Test healthy item"
      }
    ];

    for (const item of testItems) {
      await tenantDb.stockItem.create({ data: item });
      await mainDb.stockItem.create({ data: { ...item, branchId: branch.id } });
    }

    console.log("Seeding complete. Fetching updated batches...");
    batches = await service.getBatches(branch.id);
    console.log("Updated Batches Counts:");
    console.log(`- Expired: ${batches.expired.length}`);
    console.log(`- Expiring 30 Days: ${batches.expiring30.length}`);
    console.log(`- Expiring 60 Days: ${batches.expiring60.length}`);
    console.log(`- Healthy: ${batches.healthy.length}`);

    // Verify properties of mapped batch item
    if (batches.expired.length > 0) {
      const item = batches.expired[0];
      console.log("\nSample Expired Item Properties:");
      console.log(JSON.stringify(item, null, 2));
    }

    // 4. Test vendor return
    const expiringItem = batches.expiring30.find(i => i.code === "EXP15-AMX");
    if (expiringItem) {
      console.log(`\nTesting vendor return for item: ${expiringItem.name} (${expiringItem.qty})`);
      const returnResult = await service.processReturn(branch.id, {
        itemId: expiringItem.id,
        returnQty: "100",
        returnNote: "Returning for credit note",
        vendor: "Pfizer Inc.",
        reason: "Near Expiry",
        settlementMode: "Credit Note"
      }, "Test User");
      console.log(`Updated quantity in DB after return: ${returnResult.qty}`);
    }

  } catch (err) {
    console.error("Error in test run:", err);
  } finally {
    process.exit(0);
  }
}

main();
