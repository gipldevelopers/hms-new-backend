const prisma = require("../src/database/prisma");
const labService = require("../src/modules/lab-inventory/lab-inventory.service");
const stockService = require("../src/modules/stock-inventory/stock-inventory.service");

async function run() {
  console.log("Starting service separation verification...");

  // 1. Resolve branchId
  const branch = await prisma.branch.findFirst({
    where: { isDbInitialized: true }
  });

  if (!branch) {
    console.error("No initialized branch found. Run migrations/sync first.");
    process.exit(1);
  }

  const branchId = branch.id;
  console.log(`Using branchId: ${branchId}`);

  // 2. Clean up any previous test items to ensure clean run
  const tenantManager = require("../src/database/tenant-manager");
  const tenantDb = await tenantManager.getTenantClient(branchId);

  // Clean old table
  await tenantDb.inventoryItem.deleteMany({
    where: {
      OR: [
        { name: "Verification Test Lab Reagent" },
        { name: "Verification Test Stock Item" }
      ]
    }
  });
  await tenantManager.mainDb.inventoryItem.deleteMany({
    where: {
      OR: [
        { name: "Verification Test Lab Reagent" },
        { name: "Verification Test Stock Item" }
      ]
    }
  });

  // Clean new stock table
  await tenantDb.stockItem.deleteMany({
    where: {
      OR: [
        { name: "Verification Test Lab Reagent" },
        { name: "Verification Test Stock Item" }
      ]
    }
  });
  await tenantManager.mainDb.stockItem.deleteMany({
    where: {
      OR: [
        { name: "Verification Test Lab Reagent" },
        { name: "Verification Test Stock Item" }
      ]
    }
  });

  console.log("Cleanup completed.");

  // 3. Create a Lab Reagent item
  console.log("\nCreating Lab Reagent...");
  const labItem = await labService.createItem(branchId, {
    name: "Verification Test Lab Reagent",
    sku: "TEST-LAB-999",
    category: "Reagents",
    qty: "500 ml",
    expiry: "2027-12-31",
    status: "In Stock",
    supplier: "Test Lab Supplier",
    minThreshold: "100",
    notes: "Verification test lab notes",
    unitPrice: 15.50
  }, "Verify Script");
  console.log(`Lab Reagent created with ID: ${labItem.id}`);

  // 4. Create a Stock Item
  console.log("\nCreating Stock Item...");
  const stockItem = await stockService.createItem(branchId, {
    name: "Verification Test Stock Item",
    sku: "TEST-STOCK-999",
    category: "Anesthetics",
    qty: "10 Boxes",
    expiry: "2028-06-30",
    status: "In Stock",
    supplier: "Test Stock Supplier",
    minThreshold: "5",
    notes: "Verification test stock notes",
    unitPrice: 150.00
  }, "Verify Script");
  console.log(`Stock Item created with ID: ${stockItem.id}`);

  // 5. Verify Table Separation in Tenant DB
  console.log("\nVerifying table-level separation in Tenant DB...");
  const labItemInStockTable = await tenantDb.stockItem.findUnique({
    where: { id: labItem.id }
  });
  const stockItemInLabTable = await tenantDb.inventoryItem.findUnique({
    where: { id: stockItem.id }
  });

  console.log(`Lab Reagent found in stock_items table? ${!!labItemInStockTable}`);
  console.log(`Stock Item found in inventory_items table? ${!!stockItemInLabTable}`);

  if (labItemInStockTable) {
    throw new Error("FAIL: Lab Reagent leaked into stock_items database table!");
  }
  if (stockItemInLabTable) {
    throw new Error("FAIL: Stock Item leaked into inventory_items database table!");
  }

  // 6. Fetch Lab Items and verify Stock Item is NOT there
  console.log("\nFetching Lab items...");
  const labItemsList = await labService.getItems(branchId);
  const foundStockInLab = labItemsList.some(item => item.id === stockItem.id);
  const foundLabInLab = labItemsList.some(item => item.id === labItem.id);

  console.log(`Found Lab Reagent in Lab list? ${foundLabInLab}`);
  console.log(`Found Stock Item in Lab list? ${foundStockInLab}`);

  if (foundStockInLab) {
    throw new Error("FAIL: Stock item returned by Lab Inventory service!");
  }
  if (!foundLabInLab) {
    throw new Error("FAIL: Lab item was not returned by Lab service!");
  }

  // 7. Fetch Stock Items and verify Lab Reagent is NOT there
  console.log("\nFetching Stock items...");
  const stockItemsList = await stockService.getItems(branchId);
  const foundLabInStock = stockItemsList.some(item => item.id === labItem.id);
  const foundStockInStock = stockItemsList.some(item => item.id === stockItem.id);

  console.log(`Found Stock Item in Stock list? ${foundStockInStock}`);
  console.log(`Found Lab Reagent in Stock list? ${foundLabInStock}`);

  if (foundLabInStock) {
    throw new Error("FAIL: Lab item returned by Stock Inventory service!");
  }
  if (!foundStockInStock) {
    throw new Error("FAIL: Stock item was not returned by Stock service!");
  }

  // 8. Verify Dashboard Stats
  console.log("\nVerifying Dashboard Stats for Stock Inventory...");
  const stats = await stockService.getDashboardStats(branchId);
  console.log("Stock Dashboard Stats:", stats);
  if (stats.totalItems < 1) {
    throw new Error("FAIL: Stock Dashboard stats did not count the created Stock Item!");
  }

  // 9. Clean up created items
  console.log("\nCleaning up verification items...");
  await labService.deleteItem(branchId, labItem.id);
  await stockService.deleteItem(branchId, stockItem.id);
  console.log("Cleanup completed successfully.");

  console.log("\nALL VERIFICATIONS PASSED!");
}

run().catch(err => {
  console.error("\nVERIFICATION FAILED:", err.message);
  process.exit(1);
}).finally(() => process.exit(0));
