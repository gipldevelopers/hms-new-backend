const prisma = require('./src/database/prisma');

async function check() {
  const branches = await prisma.branch.findMany();
  console.log('Branches:', JSON.stringify(branches, null, 2));
  process.exit(0);
}

check();
