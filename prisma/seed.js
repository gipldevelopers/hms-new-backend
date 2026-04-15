const prisma = require('../src/database/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Super Admin User
  const adminPassword = await bcrypt.hash('super@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'super.developer@gohilinfotech.com' },
    update: {},
    create: {
      email: 'super.developer@gohilinfotech.com',
      name: 'Super Admin',
      password: adminPassword,
      role: 'SUPERADMIN',
    },
  });
  console.log('✅ Super Admin created: super.developer@gohilinfotech.com / super@123');

  // 2. Create Branches
  const branches = [
    {
      name: 'Apollo Hospital Ahmedabad',
      code: 'AHD001',
      email: 'ahmedabad@apollo.com',
      contact: '+91 79 1234 5678',
      address: 'Plot No. 1A, SG Highway',
      city: 'Ahmedabad',
      state: 'Gujarat',
      isActive: true,
    },
    {
      name: 'Fortis Hospital Bangalore',
      code: 'BLR001',
      email: 'bangalore@fortis.com',
      contact: '+91 80 9876 5432',
      address: '154/9, Bannerghatta Road',
      city: 'Bangalore',
      state: 'Karnataka',
      isActive: true,
    },
    {
      name: 'Max Healthcare Delhi',
      code: 'DEL001',
      email: 'delhi@max.com',
      contact: '+91 11 2345 6789',
      address: '1-2, Press Enclave Road, Saket',
      city: 'New Delhi',
      state: 'Delhi',
      isActive: true,
    },
    {
      name: 'Manipal Hospital Mumbai',
      code: 'MUM001',
      email: 'mumbai@manipal.com',
      contact: '+91 22 8765 4321',
      address: 'Parel East, Lal Baug',
      city: 'Mumbai',
      state: 'Maharashtra',
      isActive: true,
    },
    {
      name: 'Medanta Hospital Gurugram',
      code: 'GUR001',
      email: 'gurugram@medanta.com',
      contact: '+91 124 456 7890',
      address: 'Sector 38, CH Baktawar Singh Rd',
      city: 'Gurugram',
      state: 'Haryana',
      isActive: true,
    },
  ];

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { code: branch.code },
      update: branch,
      create: branch,
    });
  }

  console.log('✅ Branches seeded successfully!');
  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
