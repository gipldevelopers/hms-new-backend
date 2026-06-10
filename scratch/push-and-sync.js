const { execSync } = require('child_process');
const { syncAllTenants } = require('../src/database/tenant-manager');

async function run() {
  console.log("1. Running prisma db push on main database schema...");
  execSync('npx prisma db push --schema=./prisma/schema.prisma', { stdio: 'inherit' });

  console.log("\n2. Regenerating prisma clients...");
  execSync('npx prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });
  execSync('npx prisma generate --schema=./prisma/tenant.schema', { stdio: 'inherit' });

  console.log("\n3. Synchronizing all tenant databases with tenant.schema...");
  const syncResult = await syncAllTenants(true);
  console.log("Sync results:", JSON.stringify(syncResult, null, 2));

  console.log("\nDone!");
}

run().catch(console.error).finally(() => process.exit(0));
