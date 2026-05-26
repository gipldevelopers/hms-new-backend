const { getOPDBillingDetails, resolveBranchId } = require("../src/modules/billing/billing.service");
const { getTenantClient } = require("../src/database/tenant-manager");

async function main() {
  const branchId = await resolveBranchId(null);
  console.log("Branch ID:", branchId);
  const res = await getOPDBillingDetails(branchId, { uhid: "UHID-293F26", patient: "Test User" });
  console.log("Resolved Patient:", res.patient);
  console.log("Totals:", res.totals);
}

main().catch(console.error);
