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

    // 2. Get the global Doctor user
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

    // 4. Create Patients
    const patientData = [
      { name: "Michael Ross", age: 30, gender: "Male", contact: "+91 9876543210" },
      { name: "John Doe", age: 45, gender: "Male", contact: "+91 9876543211" },
      { name: "Alice Smith", age: 28, gender: "Female", contact: "+91 9876543212" },
      { name: "Bob Johnson", age: 50, gender: "Male", contact: "+91 9876543213" }
    ];

    const patients = [];
    for (const p of patientData) {
      let patient = await tenantDb.patient.findFirst({ where: { name: p.name } });
      if (!patient) {
        patient = await tenantDb.patient.create({ data: p });
        console.log("Created Patient:", patient.name);
      }
      patients.push(patient);
    }

    // 5. Create Department, Ward, Beds
    let department = await tenantDb.department.findUnique({ where: { code: "CARD" } });
    if (!department) {
      department = await tenantDb.department.create({
        data: { name: "Cardiology", code: "CARD", description: "Cardiovascular Medicine" }
      });
      console.log("Created Department:", department.name);
    }

    let ward = await tenantDb.ward.findUnique({ where: { code: "ICU-A" } });
    if (!ward) {
      ward = await tenantDb.ward.create({
        data: { name: "ICU Ward A", code: "ICU-A", departmentId: department.id }
      });
      console.log("Created Ward:", ward.name);
    }

    let bed1 = await tenantDb.bed.findFirst({ where: { label: "Bed-101", wardId: ward.id } });
    if (!bed1) {
      bed1 = await tenantDb.bed.create({
        data: { label: "Bed-101", wardId: ward.id, status: "AVAILABLE" }
      });
      console.log("Created Bed:", bed1.label);
    }

    let bed2 = await tenantDb.bed.findFirst({ where: { label: "Bed-102", wardId: ward.id } });
    if (!bed2) {
      bed2 = await tenantDb.bed.create({
        data: { label: "Bed-102", wardId: ward.id, status: "AVAILABLE" }
      });
      console.log("Created Bed:", bed2.label);
    }

    // 6. Clear existing schedule entries for this doctor to start fresh
    await tenantDb.appointment.deleteMany({ where: { doctorId: doctorUser.id } });
    await tenantDb.admission.deleteMany({ where: { doctorId: doctorUser.id } });
    await tenantDb.tenantShiftRoster.deleteMany({ where: { staffId: doctorUser.id } });
    console.log("Cleared existing appointments, admissions, and leaves for this doctor.");

    // Today boundaries
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const apptTime1 = new Date(`${todayStr}T09:00:00`);
    const apptTime2 = new Date(`${todayStr}T11:30:00`);
    const surgeryTime1 = new Date(`${todayStr}T10:00:00`);
    const surgeryTime2 = new Date(`${todayStr}T14:00:00`);

    // 7. Seed Appointments
    const appt1 = await tenantDb.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctorUser.id,
        doctorName: doctorUser.name,
        departmentId: department.id,
        departmentName: department.name,
        dateTime: apptTime1,
        tokenNumber: "A-101",
        fee: 500,
        notes: "General health follow up consultation.",
        status: "SCHEDULED"
      }
    });
    console.log("Seeded Appointment 1:", appt1.tokenNumber);

    const appt2 = await tenantDb.appointment.create({
      data: {
        patientId: patients[1].id,
        doctorId: doctorUser.id,
        doctorName: doctorUser.name,
        departmentId: department.id,
        departmentName: department.name,
        dateTime: apptTime2,
        tokenNumber: "A-102",
        fee: 500,
        notes: "Hypertension checkup.",
        status: "CHECKED_IN"
      }
    });
    console.log("Seeded Appointment 2:", appt2.tokenNumber);

    // 8. Seed Admissions (Surgeries)
    const adm1 = await tenantDb.admission.create({
      data: {
        patientId: patients[2].id,
        doctorId: doctorUser.id,
        departmentId: department.id,
        wardId: ward.id,
        bedId: bed1.id,
        reason: "Appendectomy",
        status: "In Progress",
        admissionDate: surgeryTime1
      }
    });
    console.log("Seeded Admission 1 (Surgery):", adm1.id);

    const adm2 = await tenantDb.admission.create({
      data: {
        patientId: patients[3].id,
        doctorId: doctorUser.id,
        departmentId: department.id,
        wardId: ward.id,
        bedId: bed2.id,
        reason: "Coronary Bypass",
        status: "In Progress",
        admissionDate: surgeryTime2
      }
    });
    console.log("Seeded Admission 2 (Surgery):", adm2.id);

    // 9. Seed Shift Roster Leave
    const leaveDate = new Date(`${todayStr}T00:00:00Z`);
    const roster = await tenantDb.tenantShiftRoster.create({
      data: {
        staffId: doctorUser.id,
        date: leaveDate,
        startTime: "03:00 PM",
        endTime: "05:00 PM",
        department: "Cardiology",
        status: "LEAVE",
        notes: "Staff Medical Seminar"
      }
    });
    console.log("Seeded Shift Roster Leave:", roster.id);

    console.log("\n🎉 Database successfully seeded with real doctor schedule data!");
  } catch (err) {
    console.error("ERROR seeding schedule data:", err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

seed();
