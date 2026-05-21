require('dotenv').config();
const { syncAllTenants } = require('./src/database/tenant-manager');

(async () => {
  try {
    console.log("Starting tenant DB sync...");
    const result = await syncAllTenants(true);
    console.log("Sync complete:", result);
  } catch (error) {
    console.error("Sync failed:", error);
  }
  process.exit(0);
})();
