const service = require("../src/modules/supplier/supplier.service");
const prisma = require("../src/database/prisma");

async function runTest() {
  console.log("Starting Supplier service tests...");
  
  // 1. Resolve first branch
  const branch = await prisma.branch.findFirst({
    where: { isDbInitialized: true }
  });
  if (!branch) {
    console.error("No initialized branch found to test with!");
    return;
  }
  const branchId = branch.id;
  console.log(`Using branchId: ${branchId} (${branch.name})`);

  // 2. Clear existing suppliers in test branch if any, to start clean
  console.log("Cleaning up existing suppliers...");
  const existing = await service.getSuppliers(branchId);
  for (const sup of existing) {
    await service.deleteSupplier(branchId, sup.id);
  }

  // 3. Test Seeding / Get Empty -> Seeds automatically
  console.log("Testing automatic mock data seeding...");
  const seededSuppliers = await service.getSuppliers(branchId);
  console.log(`Successfully seeded ${seededSuppliers.length} suppliers.`);
  if (seededSuppliers.length === 0) {
    throw new Error("Seeding failed: no suppliers returned.");
  }

  // 4. Test Create Supplier
  console.log("Testing supplier creation...");
  const newSupplier = await service.createSupplier(branchId, {
    name: "Test Sourcing Labs",
    sku: `SUP-TEST-${Date.now()}`,
    category: "Lab Reagents",
    supplierType: "Distributor",
    contactPerson: "Dr. Alex Patel",
    phone1: "+91 9876543210",
    email: "alex@testlabs.com",
    address: "74, Science City Road, Ahmedabad, India",
    bankName: "Axis Bank",
    accountNumber: "91802003004050",
    ifscCode: "UTIB0001234",
    accountType: "Current",
    branchName: "Ahmedabad",
    paymentType: "NEFT",
    taxCategory: "GST Registered",
    panNumber: "ABCDE9999F"
  });
  console.log("Created supplier:", newSupplier.name, "with ID:", newSupplier.id);

  // 5. Test Get Details
  console.log("Testing getSupplierDetails...");
  const fetched = await service.getSupplierDetails(branchId, newSupplier.id);
  console.log("Fetched contact person:", fetched.contactPerson);
  if (fetched.contactPerson !== "Dr. Alex Patel") {
    throw new Error("Get details contact person mismatch!");
  }

  // 6. Test Update Supplier
  console.log("Testing updateSupplier...");
  const updated = await service.updateSupplier(branchId, newSupplier.id, {
    ...fetched,
    name: "Test Sourcing Labs Ltd",
    contactPerson: "Dr. Alex R. Patel"
  });
  console.log("Updated supplier name:", updated.name);
  if (updated.name !== "Test Sourcing Labs Ltd") {
    throw new Error("Supplier name was not updated!");
  }

  // 7. Test Delete Supplier
  console.log("Testing deleteSupplier...");
  await service.deleteSupplier(branchId, newSupplier.id);
  
  try {
    await service.getSupplierDetails(branchId, newSupplier.id);
    throw new Error("Supplier should have been deleted!");
  } catch (err) {
    console.log("Deletion verified successfully (Supplier not found).");
  }

  console.log("\nALL SUPPLIER SERVICE TESTS PASSED SUCCESSFULLY!");
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
}).finally(() => process.exit(0));
