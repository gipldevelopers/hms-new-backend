const { syncAllTenants } = require("./src/database/tenant-manager");
require('dotenv').config();

async function runSync() {
  console.log("🚀 Starting database synchronization for all tenants...");
  try {
    const results = await syncAllTenants();
    console.log("✅ Sync complete!");
    console.log("Success:", results.success);
    if (results.failed.length > 0) {
      console.error("❌ Failed:", results.failed);
    }
  } catch (error) {
    console.error("💥 Fatal sync error:", error);
  }
}

runSync();
