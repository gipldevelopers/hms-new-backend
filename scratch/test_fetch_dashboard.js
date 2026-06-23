const { getDoctorDashboardData } = require('../src/modules/doctor-opd/doctor-opd.service');
const prisma = require('../src/database/prisma');

async function test() {
  try {
    const branch = await prisma.branch.findFirst({
      where: { isDbInitialized: true }
    });
    const doctorUser = await prisma.user.findFirst({
      where: { role: 'DOCTOR', branchId: branch.id }
    });

    console.log("Fetching dashboard data for Doctor:", doctorUser.name, "branch ID:", branch.id);
    const data = await getDoctorDashboardData(branch.id, doctorUser.id);
    
    console.log("\n--- DETECTED CRITICAL ALERTS ---");
    console.log(data.alerts);
  } catch (err) {
    console.error("ERROR fetching dashboard data:", err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

test();
