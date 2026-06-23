const { createAppointment } = require('../src/modules/doctor-opd/doctor-opd.service');
const prisma = require('../src/database/prisma');
const { getTenantClient } = require('../src/database/tenant-manager');

async function test() {
  try {
    // Get first branch with initialized database
    const branch = await prisma.branch.findFirst({
      where: { isDbInitialized: true }
    });
    if (!branch) {
      console.error("No initialized branch found in global database.");
      return;
    }
    
    console.log("Found branch:", branch.name, "ID:", branch.id);
    
    // Get first patient in tenant DB
    const tenantDb = await getTenantClient(branch.id);
    const patient = await tenantDb.patient.findFirst();
    if (!patient) {
      console.error("No patient found in tenant DB.");
      return;
    }
    
    console.log("Found patient:", patient.name, "ID:", patient.id);
    
    // Create appointment
    const appt = await createAppointment(branch.id, {
      patientId: patient.id,
      dateTime: new Date(),
      tokenNumber: "T-999",
      fee: 250,
      notes: "Test appointment creation"
    });
    
    console.log("SUCCESS! Created appointment:", appt);
  } catch (err) {
    console.error("ERROR testing appointment creation:", err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

test();
