const prisma = require('../src/database/prisma');
const { getTenantClient } = require('../src/database/tenant-manager');

async function seed() {
  try {
    // 1. Get first initialized branch
    const branch = await prisma.branch.findFirst({
      where: { isDbInitialized: true }
    });
    if (!branch) {
      console.error("No initialized branch found.");
      return;
    }
    console.log("Branch:", branch.name, "ID:", branch.id);

    // 2. Get the global Doctor user or create one
    let doctorUser = await prisma.user.findFirst({
      where: { role: 'DOCTOR', branchId: branch.id }
    });
    
    if (!doctorUser) {
      doctorUser = await prisma.user.findFirst({
        where: { role: 'DOCTOR' }
      });
      
      if (doctorUser) {
        doctorUser = await prisma.user.update({
          where: { id: doctorUser.id },
          data: { branchId: branch.id }
        });
        console.log("Linked existing Doctor User to branch:", doctorUser.name);
      } else {
        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash('doctor@123', 10);
        doctorUser = await prisma.user.create({
          data: {
            email: 'doctor.developer@gohilinfotech.com',
            name: 'Demo Doctor',
            password: passwordHash,
            role: 'DOCTOR',
            branchId: branch.id
          }
        });
        console.log("Created new Doctor User:", doctorUser.name);
      }
    }
    
    console.log("Doctor User:", doctorUser.name, "ID:", doctorUser.id);

    const tenantDb = await getTenantClient(branch.id);

    // 3. Ensure Doctor user is in Tenant DB
    const tenantDoctor = await tenantDb.tenantUser.upsert({
      where: { email: doctorUser.email },
      update: { role: 'DOCTOR' },
      create: {
        id: doctorUser.id,
        email: doctorUser.email,
        name: doctorUser.name,
        password: doctorUser.password,
        role: 'DOCTOR'
      }
    });
    console.log("Tenant Doctor upserted:", tenantDoctor.name);

    // 4. Get first patient in tenant DB
    let patient = await tenantDb.patient.findFirst();
    if (!patient) {
      console.log("Creating dummy patient in tenant database...");
      patient = await tenantDb.patient.create({
        data: {
          name: "John Harrison",
          age: 62,
          gender: "Male",
          contact: "+91 9900990099",
          address: "Ahmedabad"
        }
      });
    }
    console.log("Patient:", patient.name, "ID:", patient.id);

    // 5. Create a critical vitals record for today
    const vital = await tenantDb.vitals.create({
      data: {
        patientId: patient.id,
        spo2: 86,               // Critical: < 90
        temperature: 102.1,      // Critical: > 100.4
        systolic: 145,          // Critical: > 140
        diastolic: 95,          // Critical: > 90
        recordedBy: "Nurse Staff",
        notes: "Severe shortness of breath reported."
      }
    });
    console.log("Seeded Critical Vital Record:", vital);

    // 6. Create an urgent pending task assigned to the doctor for today
    const task = await tenantDb.task.create({
      data: {
        patientId: patient.id,
        title: "Immediate ICU Consultation",
        description: "Patient John Harrison has SpO2 level: 86% and Temperature: 102.1°F.",
        priority: "URGENT",
        status: "Pending",
        assignedToId: doctorUser.id
      }
    });
    console.log("Seeded Urgent Task:", task);

    console.log("\n🎉 Live Critical Alerts successfully seeded to database!");
  } catch (err) {
    console.error("ERROR seeding critical alerts:", err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

seed();
