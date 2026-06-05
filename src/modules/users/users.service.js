// Prisma schema updated: shiftType added
const { mainDb, getTenantClient } = require("../../database/tenant-manager");
const bcrypt = require('bcryptjs');
const emailService = require('../../services/email.service');
const crypto = require('crypto');

/**
 * Generate a cryptographically secure 13-character random password
 */
const generateRandomPassword = () => {
  return crypto.randomBytes(10).toString('base64').substring(0, 13).replace(/\+/g, '0').replace(/\//g, '1');
};

const getAllUsers = async (filters = {}) => {
  const { role, branchId, search } = filters;
  const where = {};

  if (role && role !== 'All') where.role = role.toUpperCase();
  if (branchId) where.branchId = branchId;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  return await mainDb.user.findMany({
    where,
    include: { branch: true },
    orderBy: { createdAt: 'desc' }
  });
};

const createUser = async (userData) => {
  const { password: manualPassword, branchId, image, department, ...otherData } = userData;

  // Normalize branchId: "" should be null for UUID relations
  const normalizedBranchId = (branchId === "" || !branchId) ? null : branchId;

  // Handle multi-recipient email (array)
  const isMultiRecipient = Array.isArray(otherData.email);
  const primaryEmail = isMultiRecipient ? otherData.email[0] : otherData.email;

  // Use manual password if provided (e.g. from seed), otherwise generate 13-char one
  const plainPassword = manualPassword || generateRandomPassword();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 0. Check for existing email in Main DB
  const existingUser = await mainDb.user.findUnique({
    where: { email: primaryEmail }
  });
  if (existingUser) {
    throw new Error(`User with email ${primaryEmail} already exists`);
  }

  // 1. Create in Main DB
  const user = await mainDb.user.create({
    data: {
      ...otherData,
      email: primaryEmail,
      branchId: normalizedBranchId,
      password: hashedPassword
    }
  });

  // 2. Sync to Tenant DB if applicable (All roles EXCEPT SUPERADMIN)
  if (user.branchId && user.role !== 'SUPERADMIN') {
    try {
      console.log(`📡 Attempting to sync user ${user.email} to branch ${user.branchId}...`);
      const tenantDb = await getTenantClient(user.branchId);

      await tenantDb.tenantUser.create({
        data: {
          id: user.id, // Syncing the exact ID from Main DB
          email: user.email,
          name: user.name,
          password: hashedPassword,
          role: user.role,
          consoleRoles: user.consoleRoles,
          status: user.status,
          shiftType: user.shiftType,
          shiftStartTime: user.shiftStartTime,
          shiftEndTime: user.shiftEndTime,
          image: image,
          department: department
        }
      });
      console.log(`✅ Successfully synced ${user.email} to tenant DB (ID Match: ${user.id}).`);
    } catch (err) {
      console.error(`❌ Tenant sync FAILED for ${user.email}:`, err.message);
    }
  }

  // 3. Dispatch Credentials Email (to all recipients if specified)
  await emailService.sendCredentials(otherData.email, user.name, plainPassword, user.role);

  return user;
};

const updateUser = async (id, userData) => {
  const { password, branchId, image, department, ...otherData } = userData;
  const updateData = { ...otherData };

  // Normalize branchId
  if (branchId !== undefined) {
    updateData.branchId = (branchId === "" || !branchId) ? null : branchId;
  }

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const user = await mainDb.user.update({
    where: { id },
    data: updateData
  });

  // Optional: Sync updates to Tenant DB too (All roles EXCEPT SUPERADMIN)
  if (user.branchId && user.role !== 'SUPERADMIN') {
    try {
      const tenantDb = await getTenantClient(user.branchId);
      await tenantDb.tenantUser.update({
        where: { email: user.email },
        data: {
          name: user.name,
          ...(updateData.password && { password: updateData.password }),
          role: user.role,
          consoleRoles: user.consoleRoles,
          status: user.status,
          isRestricted: user.isRestricted,
          shiftType: user.shiftType,
          shiftStartTime: user.shiftStartTime,
          shiftEndTime: user.shiftEndTime,
          image: image,
          department: department
        }
      }).catch(() => { }); // ignore if doesn't exist in tenant yet
    } catch (err) { }
  }

  return user;
};

const deleteUser = async (id) => {
  const user = await mainDb.user.findUnique({ where: { id } });
  if (!user) return null;

  // Sync delete to Tenant DB (All roles EXCEPT SUPERADMIN)
  if (user.branchId && user.role !== 'SUPERADMIN') {
    try {
      const tenantDb = await getTenantClient(user.branchId);
      await tenantDb.tenantUser.delete({ where: { email: user.email } }).catch(() => { });
    } catch (err) { }
  }

  return await mainDb.user.delete({ where: { id } });
};

const getStats = async (branchId = null) => {
  const where = branchId ? { branchId } : {};

  const totalUsers = await mainDb.user.count({ where });
  const doctors = await mainDb.user.count({ where: { ...where, role: 'DOCTOR' } });
  const staff = await mainDb.user.count({ where: { ...where, role: 'STAFF' } });
  const admins = await mainDb.user.count({
    where: {
      ...where,
      role: { in: ['SUPERADMIN', 'BRANCH_ADMIN'] }
    }
  });

  return {
    totalUsers,
    activeDoctors: doctors,
    activeNurses: staff,
    systemAdmins: admins
  };
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getStats
};
