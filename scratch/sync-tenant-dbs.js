const { syncAllTenants } = require('../src/database/tenant-manager');

async function main() {
  console.log('Starting sync of tenant databases...');
  try {
    const results = await syncAllTenants(true); // Force sync
    console.log('Sync results:', JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Failed to sync tenant databases:', err);
    process.exit(1);
  }
}

main();
