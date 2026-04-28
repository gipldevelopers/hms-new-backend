const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkLogs() {
  try {
    const count = await prisma.auditLog.count();
    console.log(`Total Audit Logs: ${count}`);
    
    if (count > 0) {
      const latest = await prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
      console.log("Latest Logs:", JSON.stringify(latest, null, 2));
    }
  } catch (error) {
    console.error("Error checking logs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLogs();
