const { mainDb } = require("../src/database/tenant-manager");

async function checkStaff() {
  const staff = await mainDb.user.findFirst({
    where: { role: "STAFF" },
    include: { branch: true }
  });
  console.log("Staff User:", JSON.stringify(staff, null, 2));
}

checkStaff().catch(console.error).finally(() => mainDb.$disconnect());
