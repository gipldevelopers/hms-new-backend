const { getTenantClient, mainDb } = require('../src/database/tenant-manager');

async function seed() {
  try {
    console.log('🚀 Starting Bed Occupancy Analytics Seeding...');
    
    // Find first branch
    const branch = await mainDb.branch.findFirst({
      where: { isDbInitialized: true }
    });
    
    if (!branch) {
      console.error('❌ No initialized branch found. Please run main seed first.');
      process.exit(1);
    }
    
    console.log(`🏢 Selected Branch: ${branch.name} (${branch.id})`);
    const tenantDb = await getTenantClient(branch.id);
    
    // 1. Clear existing beds, wards, departments, admissions, patients to ensure clean state
    console.log('🧹 Cleaning existing clinical data...');
    await tenantDb.admission.deleteMany({});
    await tenantDb.bed.deleteMany({});
    await tenantDb.ward.deleteMany({});
    await tenantDb.department.deleteMany({});
    await tenantDb.vitals.deleteMany({});
    await tenantDb.patient.deleteMany({});
    await tenantDb.bill.deleteMany({});
    await tenantDb.labTestOrder.deleteMany({});
    await tenantDb.task.deleteMany({});
    
    // Also clear audit logs for this user/system
    await mainDb.auditLog.deleteMany({
      where: { module: 'REPORTS' }
    });

    console.log('🌱 Seeding Departments...');
    const depts = [
      { id: 'dept-icu', name: 'Intensive Care', code: 'ICU_DEPT', description: 'Intensive Care Unit Department' },
      { id: 'dept-er', name: 'Emergency Medicine', code: 'ER_DEPT', description: 'Emergency Department' },
      { id: 'dept-ped', name: 'Pediatrics', code: 'PED_DEPT', description: 'Pediatric Care and NICU' },
      { id: 'dept-gen', name: 'General Medicine', code: 'GEN_DEPT', description: 'General Medicine Wards and Private Rooms' }
    ];

    for (const d of depts) {
      await tenantDb.department.create({ data: d });
    }

    console.log('🌱 Seeding Wards...');
    const wards = [
      { id: 'ward-icu', name: 'ICU', code: 'ICU', departmentId: 'dept-icu' },
      { id: 'ward-er', name: 'Emergency', code: 'EMERGENCY', departmentId: 'dept-er' },
      { id: 'ward-nicu', name: 'NICU', code: 'NICU', departmentId: 'dept-ped' },
      { id: 'ward-iso', name: 'Isolation', code: 'ISOLATION', departmentId: 'dept-gen' },
      { id: 'ward-gen', name: 'General ward', code: 'GENERAL', departmentId: 'dept-gen' },
      { id: 'ward-pvt', name: 'Private Rooms', code: 'PRIVATE', departmentId: 'dept-gen' }
    ];

    for (const w of wards) {
      await tenantDb.ward.create({ data: w });
    }

    console.log('🌱 Seeding Wards & Beds configuration...');
    
    // We will seed beds for each ward.
    // ICU: 40 beds (37 occupied, 1 cleaning, 2 available)
    // Emergency: 30 beds (26 occupied, 4 available)
    // NICU: 10 beds (5 occupied, 5 available)
    // Isolation: 15 beds (12 occupied, 3 available)
    // General ward: 254 beds (170 occupied, 84 available)
    // Private Rooms: 100 beds (82 occupied, 18 available)
    
    const wardConfigs = [
      { wardId: 'ward-icu', prefix: 'B-1', total: 40, occupied: 37, cleaningIndices: [1] }, // index 1 is #B-102 (Cleaning)
      { wardId: 'ward-er', prefix: 'B-2', total: 30, occupied: 26, cleaningIndices: [] },
      { wardId: 'ward-nicu', prefix: 'B-3', total: 10, occupied: 5, cleaningIndices: [] },
      { wardId: 'ward-iso', prefix: 'B-4', total: 15, occupied: 12, cleaningIndices: [] },
      { wardId: 'ward-gen', prefix: 'B-5', total: 254, occupied: 170, cleaningIndices: [] },
      { wardId: 'ward-pvt', prefix: 'B-6', total: 100, occupied: 82, cleaningIndices: [] }
    ];

    const firstNames = ['Meena', 'Tommy', 'Rahul', 'Sarah', 'John', 'Jane', 'David', 'Emma', 'Oliver', 'Sophia', 'Lucas', 'Mia', 'Aarav', 'Priya', 'Amit', 'Sunita', 'Raj', 'Vikram', 'Anjali', 'Karan'];
    const lastNames = ['Patel', 'Lee', 'Sharma', 'Smith', 'Doe', 'Miller', 'Johnson', 'Davis', 'Brown', 'Wilson', 'Kumar', 'Singh', 'Gupta', 'Verma', 'Joshi', 'Mehta', 'Shah', 'Rao', 'Reddy', 'Nair'];

    let patientCounter = 0;
    
    for (const conf of wardConfigs) {
      console.log(`  Creating ${conf.total} beds for Ward ID: ${conf.wardId}...`);
      
      for (let i = 1; i <= conf.total; i++) {
        // Bed Label, e.g. #B-101, #B-102...
        const suffixNum = 100 + i;
        const label = `#B-${conf.prefix.substring(2)}${i.toString().padStart(2, '0')}`; // E.g. #B-101, #B-102...
        const bedId = `bed-${conf.wardId}-${i}`;
        
        let status = 'AVAILABLE';
        if (conf.cleaningIndices.includes(i - 1)) {
          status = 'CLEANING';
        } else if (i <= conf.occupied) {
          status = 'OCCUPIED';
        }
        
        await tenantDb.bed.create({
          data: {
            id: bedId,
            label,
            wardId: conf.wardId,
            status
          }
        });
        
        if (status === 'OCCUPIED') {
          // Create a patient and admission
          patientCounter++;
          
          let pFirstName = firstNames[patientCounter % firstNames.length];
          let pLastName = lastNames[patientCounter % lastNames.length];
          let pName = `${pFirstName} ${pLastName}`;
          let age = 20 + (patientCounter % 60);
          let gender = patientCounter % 2 === 0 ? 'Female' : 'Male';
          let contact = `+91 98765 43${patientCounter.toString().padStart(3, '0')}`;
          
          // Custom names for specific beds matching the mockup
          if (conf.wardId === 'ward-icu' && i === 1) {
            pFirstName = 'Meena';
            pLastName = 'Patel';
            pName = 'Meena Patel';
            age = 45;
            gender = 'Female';
            contact = '+91 98765 43210';
          } else if (conf.wardId === 'ward-icu' && i === 4) {
            pFirstName = 'Tommy';
            pLastName = 'Lee';
            pName = 'Tommy Lee';
            age = 32;
            gender = 'Male';
            contact = '+91 99988 87766';
          }
          
          const patient = await tenantDb.patient.create({
            data: {
              id: `pat-${patientCounter}`,
              firstName: pFirstName,
              lastName: pLastName,
              name: pName,
              age,
              gender,
              contact,
              status: 'Complete'
            }
          });
          
          // Set admission dates
          let admissionDate = new Date();
          admissionDate.setDate(admissionDate.getDate() - (patientCounter % 10)); // admitted 0 to 10 days ago
          
          let expectedDischarge = new Date();
          expectedDischarge.setDate(expectedDischarge.getDate() + 1 + (patientCounter % 7)); // discharge in 1 to 8 days
          
          // Specific dates for Meena Patel and Tommy Lee to match mockups
          if (conf.wardId === 'ward-icu' && i === 1) {
            admissionDate = new Date('2025-10-12T10:00:00Z');
            expectedDischarge = new Date('2025-10-18T16:00:00Z');
          } else if (conf.wardId === 'ward-icu' && i === 4) {
            admissionDate = new Date('2025-10-19T08:00:00Z');
            expectedDischarge = new Date('2025-10-26T12:00:00Z');
          }
          
          await tenantDb.admission.create({
            data: {
              id: `adm-${patientCounter}`,
              patientId: patient.id,
              departmentId: conf.wardId === 'ward-icu' ? 'dept-icu' : conf.wardId === 'ward-er' ? 'dept-er' : conf.wardId === 'ward-nicu' ? 'dept-ped' : 'dept-gen',
              wardId: conf.wardId,
              bedId: bedId,
              admissionDate,
              dischargeDate: expectedDischarge,
              status: 'In Progress',
              reason: 'Seeded for occupancy analytics'
            }
          });

          // Add vitals (SPO2) for a patient to trigger Critical Patient Alert
          // "Room 302: SpO2 levels dropping below 85%"
          // Let's create Room 302: bed label "#B-101" or let's create a patient vitals record with spo2 = 84%
          if (conf.wardId === 'ward-icu' && i === 1) { // Meena Patel in #B-101 (Room 302 in alert)
            await tenantDb.vitals.create({
              data: {
                id: 'vital-meena',
                patientId: patient.id,
                systolic: 120,
                diastolic: 80,
                heartRate: 98,
                spo2: 84, // below 85%
                temperature: 98.6,
                respiratoryRate: 20,
                recordedBy: 'Nurse Staff',
                notes: 'SpO2 levels dropping'
              }
            });
          }
        }
      }
    }

    console.log('🌱 Seeding Pending Lab Test Orders...');
    // MRI Results for Patient #8829 are now ready for review
    const labPatient = await tenantDb.patient.create({
      data: {
        id: 'pat-8829',
        firstName: 'Amit',
        lastName: 'Sharma',
        name: 'Amit Sharma',
        age: 52,
        gender: 'Male',
        contact: '+91 90000 88290',
        status: 'Complete'
      }
    });

    await tenantDb.labTestOrder.create({
      data: {
        id: 'lab-order-1',
        orderNumber: 'ORD-8829',
        patientId: labPatient.id,
        doctorName: 'Dr. Sarah Smith',
        status: 'Completed', // Completed means MRI results are ready
        priority: 'High',
        tests: [
          { id: 't1', name: 'Brain MRI Scan', code: 'MRI-01', status: 'Completed', timeline: 'Completed' }
        ],
        clinicalNotes: 'Rule out stroke symptoms'
      }
    });

    console.log('🌱 Seeding Emergency Arrival...');
    // Emergency patient arriving in Ambulance
    await tenantDb.patient.create({
      data: {
        id: 'pat-er-arrival',
        name: 'Unknown Patient (Trauma)',
        age: 30,
        gender: 'Male',
        isEmergency: true,
        arrivalMode: 'Ambulance',
        triagePriority: 'Red',
        emergencyType: 'Trauma case',
        arrivalTime: new Date(),
        status: 'Emergency'
      }
    });

    console.log('🌱 Seeding Bills (Payment Pending / Completed)...');
    // Seed some bills
    const billPatient1 = await tenantDb.patient.create({
      data: { id: 'pat-bill-1', name: 'Alice Johnson', status: 'Complete' }
    });
    await tenantDb.bill.create({
      data: {
        id: 'bill-1',
        patientId: billPatient1.id,
        type: 'IPD',
        netPayable: 15000,
        amountPaid: 0,
        status: 'UNPAID' // Payment Pending
      }
    });

    const billPatient2 = await tenantDb.patient.create({
      data: { id: 'pat-bill-2', name: 'Jane Smith', status: 'Complete' }
    });
    await tenantDb.bill.create({
      data: {
        id: 'bill-2',
        patientId: billPatient2.id,
        type: 'IPD',
        netPayable: 8500,
        amountPaid: 8500,
        status: 'PAID' // Payment Completed
      }
    });

    console.log('🌱 Seeding Tasks...');
    // Seed follow-up reminders
    const taskPatient = await tenantDb.patient.create({
      data: { id: 'pat-task-1', name: 'Charlie Green', status: 'Complete' }
    });
    await tenantDb.task.create({
      data: {
        id: 'task-1',
        patientId: taskPatient.id,
        title: 'Send discharge summaries for Ward 2C patients',
        status: 'Pending',
        priority: 'MEDIUM'
      }
    });

    console.log('🌱 Seeding Audit Logs (Recent Activity)...');
    const logs = [
      { action: 'New user created', details: { name: 'John Doe' } },
      { action: 'User updated', details: { name: 'Jane Smith' } },
      { action: 'User deleted', details: { name: 'Alice Johnson' } },
      { action: 'Password changed', details: { name: 'Bob Brown' } },
      { action: 'Profile picture updated', details: { name: 'Charlie Green' } }
    ];

    for (let idx = 0; idx < logs.length; idx++) {
      const log = logs[idx];
      await mainDb.auditLog.create({
        data: {
          action: log.action,
          module: 'REPORTS',
          status: 'SUCCESS',
          details: log.details,
          userEmail: 'reports.developer@gohilinfotech.com',
          userName: 'Reports Manager',
          userRole: 'REPORTS',
          createdAt: new Date(Date.now() - idx * 60 * 1000 * 5) // spaced 5 minutes apart
        }
      });
    }

    console.log('✅ Bed Occupancy Analytics Seeding Completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seed();
