const prisma = require('./src/database/prisma');

async function main() {
  const users = await prisma.user.findMany({
    take: 10
  });
  console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
