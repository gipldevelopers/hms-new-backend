const { getTenantClient, mainDb } = require("../src/database/tenant-manager");
const service = require("../src/modules/stock-transfer/stock-transfer.service");
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

    // 2. Ensure we have at least one stock item in the database
    let item = await tenantDb.stockItem.findFirst();
    if (!item) {
      console.log("No stock item found, creating one for testing...");
      item = await tenantDb.stockItem.create({
        data: {
          id: crypto.randomUUID(),
          name: "Test Sterile Gloves",
          sku: "SG-999",
          category: "Medical Supplies",
          qty: "100 pairs",
          status: "In Stock",
          unitPrice: 15.0
        }
      });
      // create in main db too
      await mainDb.stockItem.create({
        data: {
          id: item.id,
          branchId: branch.id,
          name: item.name,
          sku: item.sku,
          category: item.category,
          qty: item.qty,
          status: item.status,
          unitPrice: item.unitPrice
        }
      });
    }

    console.log(`Selected item for transfer: ${item.name} (Current Qty: ${item.qty})`);

    // 3. Perform transfer via service
    const initialQty = parseFloat(item.qty);
    const transferQty = 10;
    console.log(`Transferring ${transferQty} units...`);

    const transferResult = await service.createTransfer(branch.id, {
      transferId: `TX-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      source: "Central Store",
      destination: "Emergency Ward",
      notes: "Test internal stock dispatch",
      items: [
        {
          id: item.id,
          name: item.name,
          sku: item.sku,
          qty: String(transferQty)
        }
      ]
    }, "Test User");

    console.log("Transfer successfully created:", transferResult);

    // 4. Retrieve stock item to verify quantity deduction
    const updatedItem = await tenantDb.stockItem.findUnique({
      where: { id: item.id }
    });
    console.log(`Updated item quantity: ${updatedItem.qty}`);

    const finalQty = parseFloat(updatedItem.qty);
    if (finalQty === initialQty - transferQty) {
      console.log("✅ Verification Success: Quantity correctly deducted!");
    } else {
      console.error(`❌ Verification Failure: Quantity mismatch! Expected ${initialQty - transferQty}, got ${finalQty}`);
    }

    // 5. Retrieve transfers
    const transfers = await service.getTransfers(branch.id);
    console.log(`Total transfers found in database: ${transfers.length}`);
    if (transfers.some(t => t.id === transferResult.id)) {
      console.log("✅ Verification Success: Transfer record successfully saved and retrieved!");
    } else {
      console.error("❌ Verification Failure: Transfer record not found in list!");
    }

  } catch (err) {
    console.error("Error during test run:", err);
  } finally {
    process.exit(0);
  }
}

main();
