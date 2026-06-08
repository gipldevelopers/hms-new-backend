const prisma = require('../src/database/prisma');

async function main() {
  try {
    const res = await prisma.$queryRawUnsafe("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'inventory_stock_histories'");
    console.log("Columns of inventory_stock_histories in main database:", res);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
