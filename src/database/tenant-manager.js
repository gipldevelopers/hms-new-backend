const { PrismaClient } = require('@prisma/client');
const { PrismaClient: TenantClient } = require('../generated/tenant-client');
const { Pool } = require('pg');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const mainDb = require('./prisma');
const { PrismaPg } = require('@prisma/adapter-pg');

// In-memory cache for tenant prisma clients and pools
const tenantClients = new Map();
const tenantPools = new Map();

/**
 * Get the current hash of the tenant schema file
 */
const getCurrentSchemaVersion = () => {
  const schemaPath = path.join(__dirname, '../../prisma/tenant.schema');
  if (!fs.existsSync(schemaPath)) return 'unknown';
  const content = fs.readFileSync(schemaPath, 'utf8');
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 12);
};

/**
 * Get or create a Prisma client for a specific tenant with connection pooling
 */
const getTenantClient = async (branchId) => {
  if (tenantClients.has(branchId)) {
    return tenantClients.get(branchId);
  }

  const branch = await mainDb.branch.findUnique({
    where: { id: branchId }
  });

  if (!branch || !branch.dbName) {
    throw new Error('Branch not found or database not initialized');
  }

  const mainUrl = process.env.DATABASE_URL;
  const passMatch = mainUrl.match(/:([^@]+)@/);
  const masterPassword = passMatch ? passMatch[1] : '';

  const user = branch.dbUser || 'postgres';
  const password = branch.dbPassword || (user === 'postgres' ? masterPassword : '');
  const hostMatch = mainUrl.match(/@([^/]+)/);
  const host = hostMatch ? hostMatch[1] : 'localhost:5432';
  
  const dbUrl = `postgresql://${user}:${password}@${host}/${branch.dbName}`;

  // Create a dedicated pool for this tenant
  const pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);

  const client = new TenantClient({
    adapter,
    log: ['error']
  });

  tenantClients.set(branchId, client);
  tenantPools.set(branchId, pool);

  return client;
};

/**
 * Create a new PostgreSQL database and optional role for a branch
 */
const createBranchDatabase = async (branchName, customDbName, dbUser, dbPassword) => {
  const baseName = customDbName || branchName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const dbName = baseName.startsWith('ghms_') ? baseName : `ghms_${baseName}`;
  
  const mainUrl = process.env.DATABASE_URL;
  const passMatch = mainUrl.match(/:([^@]+)@/);
  const masterPassword = passMatch ? passMatch[1] : '';

  const pool = new Pool({
    connectionString: mainUrl.replace(/\/[^\/]+$/, '/postgres')
  });

  try {
    if (dbUser && dbUser !== 'postgres') {
      const userExists = await pool.query("SELECT 1 FROM pg_roles WHERE rolname=$1", [dbUser]);
      if (userExists.rows.length === 0) {
        const password = dbPassword || masterPassword;
        await pool.query(`CREATE ROLE "${dbUser}" WITH LOGIN PASSWORD '${password}'`);
      }
    }

    const dbExists = await pool.query("SELECT 1 FROM pg_database WHERE datname=$1", [dbName]);
    if (dbExists.rows.length === 0) {
      await pool.query(`CREATE DATABASE "${dbName}"`);
      
      if (dbUser && dbUser !== 'postgres') {
        await pool.query(`GRANT ALL PRIVILEGES ON DATABASE "${dbName}" TO "${dbUser}"`);
        
        // --- PG15+ FIX: Grant permissions on the public schema ---
        // We need to connect specifically to the new DB to grant schema rights
        const tenantPool = new Pool({
          connectionString: mainUrl.replace(/\/[^\/]+$/, `/${dbName}`)
        });
        try {
          await tenantPool.query(`GRANT ALL ON SCHEMA public TO "${dbUser}"`);
          console.log(`🔓 Public schema access granted to ${dbUser} on ${dbName}`);
        } catch (grantError) {
          console.warn(`⚠️ Failed to grant public schema access (might be PG version < 15): ${grantError.message}`);
        } finally {
          await tenantPool.end();
        }
      }
    }

    return dbName;
  } catch (error) {
    console.error('Database provisioning error:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

/**
 * Cleanly remove a branch database and terminate connections
 */
const deleteBranchDatabase = async (dbName) => {
  if (!dbName || dbName === 'postgres' || dbName === 'hms_db') return;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL.replace(/\/[^\/]+$/, '/postgres')
  });
  try {
    await pool.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
        AND pid <> pg_backend_pid();
    `, [dbName]);
    await pool.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    return true;
  } catch (error) {
    console.error(`Error wiping database ${dbName}:`, error);
    throw error;
  } finally {
    await pool.end();
  }
};

/**
 * Invalidate a tenant client from cache and close its pool
 * Necessary when schema changes to avoid "cached plan must not change result type"
 */
const invalidateTenantClient = async (branchId) => {
  if (tenantClients.has(branchId)) {
    tenantClients.delete(branchId);
  }
  if (tenantPools.has(branchId)) {
    const pool = tenantPools.get(branchId);
    await pool.end().catch(() => {});
    tenantPools.delete(branchId);
  }
};

/**
 * Initialize Tenant Schema using Prisma Migrate
 */
const initializeTenantSchema = async (branchId) => {
  // Clear existing connections to avoid stale "cached plan" errors
  await invalidateTenantClient(branchId);

  const branch = await mainDb.branch.findUnique({ where: { id: branchId } });
  if (!branch) throw new Error('Branch not found');

  const mainUrl = process.env.DATABASE_URL;
  const passMatch = mainUrl.match(/:([^@]+)@/);
  const masterPassword = passMatch ? passMatch[1] : '';

  const user = branch.dbUser || 'postgres';
  const password = branch.dbPassword || (user === 'postgres' ? masterPassword : '');
  const hostMatch = mainUrl.match(/@([^/]+)/);
  const host = hostMatch ? hostMatch[1] : 'localhost:5432';
  
  const dbUrl = `postgresql://${user}:${password}@${host}/${branch.dbName}`;

  try {
    const command = `npx prisma db push --schema=./prisma/tenant.schema --accept-data-loss`;
    const env = { ...process.env, DATABASE_URL: dbUrl };
    
    await execPromise(command, { env });
    
    const currentVersion = getCurrentSchemaVersion();
    
    // Mark as initialized and Update Version
    await mainDb.branch.update({
      where: { id: branchId },
      data: { 
        isDbInitialized: true,
        schemaVersion: currentVersion
      }
    });

    // --- NEW: Sync Branch Users to Tenant DB after push (All roles EXCEPT SUPERADMIN) ---
    const branchUsers = await mainDb.user.findMany({
      where: { 
        branchId: branchId,
        role: { not: 'SUPERADMIN' }
      }
    });

    if (branchUsers.length > 0) {
      console.log(`📡 Seeding ${branchUsers.length} Users into tenant DB...`);
      const tenantDb = await module.exports.getTenantClient(branchId);
      
      for (const user of branchUsers) {
        await tenantDb.tenantUser.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            password: user.password,
            role: user.role,
            status: user.status
          },
          create: {
            id: user.id, // Ensure matching ID
            email: user.email,
            name: user.name,
            password: user.password,
            role: user.role,
            status: user.status
          }
        });
      }
    }

    return true;
  } catch (error) {
    console.error(`Error initializing schema for ${branch.dbName}:`, error);
    throw error;
  }
};

/**
 * Synchronize schema across all registered tenants
 */
const syncAllTenants = async () => {
  const currentVersion = getCurrentSchemaVersion();
  const branches = await mainDb.branch.findMany({
    where: { 
      dbName: { not: null },
      OR: [
        { schemaVersion: { not: currentVersion } },
        { schemaVersion: null }
      ]
    }
  });

  console.log(`Starting global sync for ${branches.length} out-of-sync tenants...`);
  const results = { success: [], failed: [] };

  for (const branch of branches) {
    try {
      await initializeTenantSchema(branch.id);
      results.success.push(branch.name);
    } catch (error) {
      results.failed.push({ branch: branch.name, error: error.message });
    }
  }

  return results;
};

module.exports = {
  mainDb,
  getTenantClient,
  invalidateTenantClient,
  createBranchDatabase,
  deleteBranchDatabase,
  initializeTenantSchema,
  syncAllTenants,
  getCurrentSchemaVersion
};
