const { mainDb } = require('../src/database/tenant-manager');

async function audit() {
  console.log('--- 🛡️ DATABASE AUDIT START ---');
  
  try {
    // 1. Check Branches
    const branches = await mainDb.branch.findMany();
    console.log('Branches found:', branches.map(b => ({ id: b.id, name: b.name, slug: b.slug })));
    
    // 2. Check Users
    const users = await mainDb.user.findMany({
      where: { OR: [{ name: 'Vraj Darji' }, { name: 'user 1' }] }
    });
    console.log('Target Users:', users.map(u => ({ id: u.id, name: u.name, role: u.role, branchId: u.branchId })));
    
    // 3. Check Shift Rosters
    const rosters = await mainDb.shiftRoster.findMany({ take: 5 });
    console.log('Sample Roster Entries:', rosters.length);

  } catch (err) {
    console.error('Audit Error:', err.message);
  }

  console.log('--- 🛡️ DATABASE AUDIT END ---');
}

audit().finally(() => process.exit());
