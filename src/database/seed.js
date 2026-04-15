const prisma = require('./prisma');
const bcrypt = require('bcryptjs');

async function main() {
  const superAdminEmail = 'super.developer@gohilinfotech.com';
  const superAdminPassword = 'super@123';
  const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail }
  });

  if (!existingSuperAdmin) {
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });
    console.log(`Super Admin ${superAdminEmail} created.`);
  } else {
    // Update existing user password and role just in case
    await prisma.user.update({
      where: { email: superAdminEmail },
      data: {
        password: hashedPassword,
        role: 'SUPERADMIN',
      }
    });
    console.log(`Super Admin ${superAdminEmail} updated.`);
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });