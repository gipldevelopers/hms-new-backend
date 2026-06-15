const prisma = require('../src/database/prisma');
const bcrypt = require('bcryptjs');
const { createBranchDatabase, initializeTenantSchema } = require('../src/database/tenant-manager');

async function main() {
  try {
    console.log('\n🚀 Starting Database Seeding Process...');
    await prisma.$connect();
    console.log('✅ Connection to Database Established.');

    // 1. Create Super Admin User
    const adminEmail = 'super.developer@gohilinfotech.com';
    console.log(`\n🔹 Processing Super Admin: ${adminEmail}...`);
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('super@123', 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Super Admin',
          password: adminPassword,
          role: 'SUPERADMIN',
        },
      });
      console.log(`✅ Added: Super Admin (${adminEmail})`);
    } else {
      console.log(`ℹ️ Skipped: Super Admin (${adminEmail}) (Already exists)`);
    }

    // 2. Create Branches
    const branches = [
      {
        name: 'Apollo Hospital Ahmedabad',
        code: 'AHD001',
        email: 'ahmedabad@apollo.com',
        contact: '+91 79 1234 5678',
        address: 'Plot No. 1A, SG Highway',
        city: 'Ahmedabad',
        state: 'Gujarat',
        active: true,
      },
      {
        name: 'Fortis Hospital Bangalore',
        code: 'BLR001',
        email: 'bangalore@fortis.com',
        contact: '+91 80 9876 5432',
        address: '154/9, Bannerghatta Road',
        city: 'Bangalore',
        state: 'Karnataka',
        active: true,
      }
    ];

    console.log('\n🏢 Processing Hospital Branches...');
    let firstBranchId = null;

    for (const branch of branches) {
      try {
        let existingBranch = await prisma.branch.findUnique({
          where: { code: branch.code }
        });

        if (!existingBranch) {
          const cleanName = branch.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const shortId = Math.random().toString(36).substring(2, 7);
          const generatedDbName = `ghms_${cleanName}_${shortId}`;
          const generatedDbUser = `user_${cleanName}_${shortId}`;
          const generatedDbPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

          existingBranch = await prisma.branch.create({
            data: {
              ...branch,
              dbName: generatedDbName,
              dbUser: generatedDbUser,
              dbPassword: generatedDbPassword,
              isDbInitialized: false
            }
          });

          console.log(`🛠️ Provisioning isolated infrastructure for seed branch: ${branch.name}...`);
          await createBranchDatabase(branch.name, generatedDbName, generatedDbUser, generatedDbPassword);
          await initializeTenantSchema(existingBranch.id);
          console.log(`✅ Added & Initialized: Branch - ${branch.name} (${branch.code})`);
        } else if (!existingBranch.dbName) {
          const cleanName = branch.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const shortId = Math.random().toString(36).substring(2, 7);
          const generatedDbName = `ghms_${cleanName}_${shortId}`;
          const generatedDbUser = `user_${cleanName}_${shortId}`;
          const generatedDbPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

          existingBranch = await prisma.branch.update({
            where: { id: existingBranch.id },
            data: {
              dbName: generatedDbName,
              dbUser: generatedDbUser,
              dbPassword: generatedDbPassword,
              isDbInitialized: false
            }
          });

          console.log(`🛠️ Provisioning isolated infrastructure for existing seed branch: ${branch.name}...`);
          await createBranchDatabase(branch.name, generatedDbName, generatedDbUser, generatedDbPassword);
          await initializeTenantSchema(existingBranch.id);
          console.log(`✅ Initialized: Branch - ${branch.name} (${branch.code})`);
        }
        if (!firstBranchId) firstBranchId = existingBranch.id;
      } catch (branchError) {
        console.error(`❌ Failed to process branch ${branch.name}:`, branchError.message);
      }
    }

    // 3. Create Demo Users for All Roles
    const demoRoles = [
      { name: 'Branch Admin', role: 'BRANCH_ADMIN', slug: 'branchadmin' },
      { name: 'Doctor', role: 'DOCTOR', slug: 'doctor' },
      { name: 'Staff', role: 'STAFF', slug: 'staff' },
      { name: 'Receptionist', role: 'RECEPTION', slug: 'reception' },
      { name: 'Pharmacist', role: 'PHARMACY', slug: 'pharmacy' },
      { name: 'Laboratory Tech', role: 'LABORATORY', slug: 'laboratory' },
      { name: 'Radiologist', role: 'RADIOLOGY', slug: 'radiology' },
      { name: 'Finance head', role: 'FINANCE', slug: 'finance' },
      { name: 'Reports Manager', role: 'REPORTS', slug: 'reports' },
      { name: 'Hospital Inventory Manager', role: 'HOSPITAL_INVENTORY', slug: 'hospital-inventory' }
    ];

    console.log('\n👥 Processing Demo Users...');
    for (const r of demoRoles) {
      const email = `${r.slug}.developer@gohilinfotech.com`;
      try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (!existing) {
          const password = await bcrypt.hash(`${r.slug}@123`, 10);
          await prisma.user.create({
            data: {
              email,
              name: r.name,
              password,
              role: r.role,
              branchId: firstBranchId // Link to first branch by default
            }
          });
          console.log(`✅ Added: ${r.name} (${email}) - Linked to Branch`);
        } else if (!existing.branchId && firstBranchId) {
          await prisma.user.update({
            where: { id: existing.id },
            data: { branchId: firstBranchId }
          });
          console.log(`✅ Updated: ${r.name} (${email}) - Linked to Branch`);
        } else {
          console.log(`ℹ️ Skipped: ${r.name} (Already exists and linked)`);
        }
      } catch (err) {
        console.error(`❌ Failed to seed ${r.role}:`, err.message);
      }
    }

    // 3. Create Master Data Configurations
    const masterDataConfigs = [
      {
        name: 'Doctors Directory',
        code: 'DOC_DIR',
        description: 'Primary registry for all hospital consultants and specialists.',
        fields: [
          { id: 'f1', type: 'text', label: 'Doctor Name', required: true, placeholder: 'Dr. John Doe' },
          { id: 'f2', type: 'text', label: 'Specialization', required: true, placeholder: 'Cardiology' },
          { id: 'f3', type: 'text', label: 'License Number', required: true, placeholder: 'MD-99823' },
          { id: 'f4', type: 'email', label: 'Contact Email', required: false, placeholder: 'john@hospital.com' },
          { id: 'f5', type: 'text', label: 'OPD Timing', required: false, placeholder: '10:00 AM - 04:00 PM' }
        ]
      },
      {
        name: 'Clinical Services',
        code: 'SRV_LST',
        description: 'Comprehensive list of billable clinical and surgical services.',
        fields: [
          { id: 's1', type: 'text', label: 'Service Name', required: true, placeholder: 'Consultation Fee' },
          { id: 's2', type: 'text', label: 'Department', required: true, placeholder: 'General Medicine' },
          { id: 's3', type: 'number', label: 'Base Price (INR)', required: true, placeholder: '500' }
        ]
      },
      {
        name: 'Laboratory Profiles',
        code: 'LAB_PRF',
        description: 'Standard diagnostic test packages and individual tests.',
        fields: [
          { id: 'l1', type: 'text', label: 'Test Code', required: true, placeholder: 'CBC-01' },
          { id: 'l2', type: 'text', label: 'Test Name', required: true, placeholder: 'Complete Blood Count' },
          { id: 'l3', type: 'text', label: 'Normal Range', required: false, placeholder: '13.5 - 17.5 g/dL' }
        ]
      }
    ];

    console.log('\n📊 Processing Master Data Configurations...');
    for (const config of masterDataConfigs) {
      try {
        const existing = await prisma.masterData.findUnique({ where: { code: config.code } });
        if (!existing) {
          await prisma.masterData.create({ data: config });
          console.log(`✅ Added: Master Data - ${config.name} (${config.code})`);
        } else {
          console.log(`ℹ️ Skipped: Master Data - ${config.name} (${config.code}) (Already exists)`);
        }
      } catch (err) {
        console.error(`❌ Failed to seed Master Data ${config.name}:`, err.message);
      }
    }

    // 4. Create Document Templates
    const documentTemplates = [
      {
        name: 'Standard Digital Prescription',
        code: 'STD_RX_01',
        category: 'prescription',
        blocks: [
          { id: 'b1', type: 'header', label: 'GVoice Digital Header' },
          { id: 'b2', type: 'patient', label: 'Primary Patient Info' },
          { id: 'b3', type: 'diagnosis', label: 'Clinical Findings' },
          { id: 'b4', type: 'medicine', label: 'Rx Medications' },
          { id: 'b5', type: 'signature', label: 'Doctor Authentication' }
        ]
      },
      {
        name: 'Patient Discharge Summary',
        code: 'DISCH_SUMM_A1',
        category: 'discharge',
        blocks: [
          { id: 'd1', type: 'header', label: 'Hospital Identity' },
          { id: 'd2', type: 'patient', label: 'Patient Demographics' },
          { id: 'd3', type: 'vitals', label: 'Final Vital Signs' },
          { id: 'd4', type: 'diagnosis', label: 'Final Diagnosis & Summary' },
          { id: 'd5', type: 'text', label: 'Follow-up Advice' },
          { id: 'd6', type: 'signature', label: 'Approved By' }
        ]
      },
      {
        name: 'Pathology Lab Report',
        code: 'LAB_REP_002',
        category: 'lab',
        blocks: [
          { id: 'l1', type: 'header', label: 'Clinical Laboratory Header' },
          { id: 'l2', type: 'patient', label: 'Sample Information' },
          { id: 'l3', type: 'lab', label: 'Test Values & Results' },
          { id: 'l5', type: 'signature', label: 'Pathologist Signature' }
        ]
      }
    ];

    console.log('\n📄 Processing Document Templates...');
    for (const temp of documentTemplates) {
      try {
        const existing = await prisma.template.findUnique({ where: { code: temp.code } });
        if (!existing) {
          await prisma.template.create({ data: temp });
          console.log(`✅ Added: Template - ${temp.name} (${temp.code})`);
        } else {
          console.log(`ℹ️ Skipped: Template - ${temp.name} (${temp.code}) (Already exists)`);
        }
      } catch (err) {
        console.error(`❌ Failed to seed Template ${temp.name}:`, err.message);
      }
    }

    console.log('\n✨ Database Seeding Processed Successfully!');
  } catch (globalError) {
    console.error('\n💥 Critical Error during seeding:', globalError.message);
    throw globalError;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
