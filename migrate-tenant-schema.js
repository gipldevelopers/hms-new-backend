/**
 * Migrate Tenant Schema - Push new Consultation tables to all tenant databases
 */

require('dotenv').config();
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const prisma = require('./src/database/prisma');

async function migrateTenantSchema(branchId, branchName, dbName, dbUser, dbPassword) {
  console.log(`\n📦 Migrating schema for: ${branchName} (${dbName})`);
  
  try {
    // Build database URL
    const mainUrl = process.env.DATABASE_URL;
    const mainUrlObj = new URL(mainUrl);
    const masterPassword = mainUrlObj.password;
    const host = mainUrlObj.host;
    
    const user = dbUser || 'postgres';
    const password = dbPassword || (user === 'postgres' ? masterPassword : '');
    const dbUrl = `postgresql://${user}:${password}@${host}/${dbName}`;
    
    // Push schema using Prisma
    console.log(`   Pushing schema to ${dbName}...`);
    const command = `npx prisma db push --schema=./prisma/tenant.schema --accept-data-loss`;
    
    await execPromise(command, {
      env: { ...process.env, DATABASE_URL: dbUrl }
    });
    
    console.log(`   ✅ Schema migrated successfully for ${branchName}`);
    return { success: true, branch: branchName };
    
  } catch (error) {
    console.error(`   ❌ Error migrating ${branchName}:`, error.message);
    return { success: false, branch: branchName, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting Tenant Schema Migration...\n');
  console.log('This will add Consultation, Prescription, and PrescriptionItem tables\n');
  
  try {
    // Get all branches with initialized databases
    const branches = await prisma.branch.findMany({
      where: {
        isDbInitialized: true,
        dbName: { not: null }
      }
    });
    
    if (branches.length === 0) {
      console.log('⚠️  No initialized tenant databases found.');
      console.log('   Please initialize at least one branch first.');
      return;
    }
    
    console.log(`Found ${branches.length} tenant database(s) to migrate:\n`);
    branches.forEach((b, i) => {
      console.log(`   ${i + 1}. ${b.name} (${b.dbName})`);
    });
    console.log('');
    
    const results = [];
    
    // Migrate each branch
    for (const branch of branches) {
      const result = await migrateTenantSchema(
        branch.id,
        branch.name,
        branch.dbName,
        branch.dbUser,
        branch.dbPassword
      );
      results.push(result);
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}`);
    if (successful.length > 0) {
      successful.forEach(r => console.log(`   - ${r.branch}`));
    }
    
    if (failed.length > 0) {
      console.log(`\n❌ Failed: ${failed.length}`);
      failed.forEach(r => console.log(`   - ${r.branch}: ${r.error}`));
    }
    
    console.log('\n✅ Migration complete!');
    console.log('\nNew tables added:');
    console.log('   - consultations');
    console.log('   - prescriptions');
    console.log('   - prescription_items');
    console.log('\nYou can now use the Doctor OPD module!\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
