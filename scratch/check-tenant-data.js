const { getTenantClient, mainDb } = require('../src/database/tenant-manager');

async function check() {
  try {
    const branches = await mainDb.branch.findMany();
    console.log('Branches:', branches.map(b => ({ id: b.id, name: b.name, dbName: b.dbName })));
    
    for (const b of branches) {
      if (!b.isDbInitialized) {
        console.log(`Branch ${b.name} database not initialized`);
        continue;
      }
      const tenantDb = await getTenantClient(b.id);
      
      const depts = await tenantDb.department.findMany();
      const wards = await tenantDb.ward.findMany();
      const beds = await tenantDb.bed.findMany();
      const admissions = await tenantDb.admission.findMany();
      const patients = await tenantDb.patient.findMany();
      
      console.log(`\nBranch: ${b.name}`);
      console.log(`Departments count: ${depts.length}`);
      console.log(`Wards count: ${wards.length}`);
      console.log(`Beds count: ${beds.length}`);
      console.log(`Admissions count: ${admissions.length}`);
      console.log(`Patients count: ${patients.length}`);
      
      if (depts.length > 0) {
        console.log('Depts:', depts.map(d => ({ id: d.id, name: d.name, code: d.code })));
      }
      if (wards.length > 0) {
        console.log('Wards:', wards.map(w => ({ id: w.id, name: w.name, code: w.code, deptId: w.departmentId })));
      }
      if (beds.length > 0) {
        console.log('Beds sample:', beds.slice(0, 5).map(b => ({ id: b.id, label: b.label, status: b.status, wardId: b.wardId })));
      }
    }
  } catch (err) {
    console.error('Error running check:', err);
  }
  process.exit(0);
}

check();
