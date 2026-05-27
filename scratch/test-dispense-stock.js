const prisma = require("../src/database/prisma");
const { getTenantClient } = require("../src/database/tenant-manager");
const { dispensePrescription } = require("../src/modules/pharmacy/pharmacy-queue.service");
const crypto = require("crypto");

async function runTest() {
  console.log("Running comprehensive dispense stock deduction test...");

  // Find a branch that is initialized
  const branch = await prisma.branch.findFirst({ where: { isDbInitialized: true } });
  if (!branch) {
    console.error("No initialized branch found!");
    return;
  }
  const branchId = branch.id;
  console.log(`Using Branch ID: ${branchId}`);

  const tenantDb = await getTenantClient(branchId);

  // 1. Create a mock patient
  const patient = await tenantDb.patient.create({
    data: {
      id: crypto.randomUUID(),
      name: "Mock Test Patient",
      firstName: "Mock",
      lastName: "Patient",
      contact: "1234567890",
      gender: "male",
      age: 30,
      status: "Complete"
    }
  });
  console.log(`Created mock patient: ${patient.id}`);

  // 2. Create a mock consultation
  const consultation = await tenantDb.consultation.create({
    data: {
      id: crypto.randomUUID(),
      appointmentId: crypto.randomUUID(),
      patientId: patient.id,
      doctorName: "Dr. Mock Test",
      status: "COMPLETED"
    }
  });
  console.log(`Created mock consultation: ${consultation.id}`);

  // 3. Create a mock medicine item in the inventory
  const initialQty = 1000;
  const medicine = await tenantDb.pharmacyItem.create({
    data: {
      id: crypto.randomUUID(),
      medicineName: "Mock Test Medicine",
      type: "Tablet",
      quantity: initialQty,
      status: "IN STOCK"
    }
  });
  console.log(`Created mock inventory medicine: ${medicine.id} with quantity: ${initialQty}`);

  // 4. Create a mock prescription
  const prescription = await tenantDb.prescription.create({
    data: {
      id: crypto.randomUUID(),
      consultationId: consultation.id,
      patientId: patient.id,
      doctorName: "Dr. Mock Test",
      pharmacyStatus: "PENDING"
    }
  });
  console.log(`Created mock prescription: ${prescription.id}`);

  // 5. Create a mock prescription item linked to our inventory medicine
  // Let's specify: timing = "1-0-1", duration = "5 Days", dosage = "1 Tablet"
  // Daily dose = 2. Days = 5. Dose multiplier = 1. Total quantity = 2 * 5 * 1 = 10 units.
  const prescriptionItem = await tenantDb.prescriptionItem.create({
    data: {
      id: crypto.randomUUID(),
      prescriptionId: prescription.id,
      medicineId: medicine.id,
      medicineName: medicine.medicineName,
      dosage: "1 Tablet",
      timing: "1-0-1",
      duration: "5 Days"
    }
  });
  console.log("Created mock prescription item");

  // 6. Execute dispensePrescription
  console.log("Executing dispensePrescription...");
  await dispensePrescription(branchId, prescription.id, { pharmacistNotes: "Testing stock deduction" }, "Test Pharmacist");

  // 7. Verify stock deduction
  const updatedMedicine = await tenantDb.pharmacyItem.findUnique({
    where: { id: medicine.id }
  });

  console.log(`Initial quantity: ${initialQty}`);
  console.log(`Expected deduction: 10 units`);
  console.log(`Actual updated quantity: ${updatedMedicine.quantity}`);
  console.log(`Updated status: ${updatedMedicine.status}`);

  const passed = updatedMedicine.quantity === (initialQty - 10);
  if (passed) {
    console.log("SUCCESS: Medicine stock was successfully and accurately reduced by 10 units!");
  } else {
    console.error("FAILURE: Medicine stock deduction did not match expected quantity!");
  }

  // 8. Clean up mock records
  console.log("Cleaning up mock records...");
  await tenantDb.prescriptionItem.delete({ where: { id: prescriptionItem.id } });
  await tenantDb.prescription.delete({ where: { id: prescription.id } });
  await tenantDb.pharmacyItem.delete({ where: { id: medicine.id } });
  await tenantDb.consultation.delete({ where: { id: consultation.id } });
  await tenantDb.patient.delete({ where: { id: patient.id } });
  console.log("Cleaned up successfully.");
}

runTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
