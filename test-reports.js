const { getDashboardData } = require("./src/modules/reports/reports.service");
const prisma = require("./src/database/prisma");

async function test() {
  try {
    const branch = await prisma.branch.findFirst({ where: { isDbInitialized: true }});
    if (!branch) {
      console.log("No initialized branch found.");
      return;
    }
    console.log("Testing with branch ID:", branch.id);
    const data = await getDashboardData(branch.id);
    console.log("Stats:", data.stats);
    console.log("Success!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}
test();
