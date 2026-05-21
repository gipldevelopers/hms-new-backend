const { getAdmissionsOverview } = require("../src/modules/admissions/admissions.service");
const { mainDb } = require("../src/database/tenant-manager");

async function test() {
  const branchId = "3518ab4d-d5a8-40ba-ad4a-4264eab7801a"; // Gohil
  const query = { status: "In Progress" };
  const admissions = await getAdmissionsOverview(branchId, query);
  console.log("Admissions:", JSON.stringify(admissions, null, 2));
}

test().catch(console.error).finally(() => mainDb.$disconnect());
