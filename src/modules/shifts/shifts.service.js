const { mainDb, getTenantClient } = require("../../database/tenant-manager");

/**
 * Get all shift templates for a branch
 */
const getAllTemplates = async (branchId) => {
  return await mainDb.shiftTemplate.findMany({
    where: { 
      OR: [
        { branchId: branchId },
        { branch: { name: { contains: branchId, mode: 'insensitive' } } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Create a new shift template (Dual Persistence)
 */
const createTemplate = async (branchId, data) => {
  console.log(`🕒 Provisioning Shift Template: ${data.name} for Branch: ${branchId}`);

  // 1. Save to Main DB
  const template = await mainDb.shiftTemplate.create({
    data: {
      ...data,
      branchId
    }
  });

  // 2. Sync to Tenant DB
  try {
    const tenantDb = await getTenantClient(branchId);
    await tenantDb.tenantShiftTemplate.create({
      data: {
        id: template.id, // Keep IDs synchronized
        name: template.name,
        department: template.department,
        type: template.type,
        startTime: template.startTime,
        endTime: template.endTime,
        breakDuration: template.breakDuration,
        rule: template.rule,
        staffing: template.staffing
      }
    });
    console.log(`✅ Successfully synced template ${template.name} to tenant DB.`);
  } catch (err) {
    console.error(`❌ Tenant sync FAILED for template ${template.name}:`, err.message);
  }

  return template;
};

/**
 * Update a shift template (Dual Persistence)
 */
const updateTemplate = async (id, branchId, data) => {
  // 1. Update in Main DB
  const template = await mainDb.shiftTemplate.update({
    where: { id, branchId },
    data
  });

  // 2. Sync Update to Tenant DB
  try {
    const tenantDb = await getTenantClient(branchId);
    await tenantDb.tenantShiftTemplate.update({
      where: { id },
      data: {
        name: template.name,
        department: template.department,
        type: template.type,
        startTime: template.startTime,
        endTime: template.endTime,
        breakDuration: template.breakDuration,
        rule: template.rule,
        staffing: template.staffing
      }
    }).catch(() => {});
  } catch (err) {
    console.error(`❌ Tenant update FAILED for template ${id}:`, err.message);
  }

  return template;
};

/**
 * Delete a shift template (Dual Persistence)
 */
const deleteTemplate = async (id, branchId) => {
  try {
    const tenantDb = await getTenantClient(branchId);
    await tenantDb.tenantShiftTemplate.delete({ where: { id } }).catch(() => {});
  } catch (err) {
    console.error(`❌ Tenant delete FAILED for template ${id}:`, err.message);
  }

  return await mainDb.shiftTemplate.delete({
    where: { id, branchId }
  });
};

// --- SHIFT ROSTER LOGIC (Dual Persistence) ---

/**
 * Get roster for a specific branch and date range
 */
const getRoster = async (branchId, startDate, endDate) => {
  return await mainDb.shiftRoster.findMany({
    where: {
      branchId,
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    },
    include: {
      attendance: true
    },
    orderBy: { date: 'asc' }
  });
};

/**
 * Create a roster assignment (Dual Persistence)
 */
const createRosterEntry = async (branchId, data) => {
  // 1. Save to Main DB
  const entry = await mainDb.shiftRoster.create({
    data: {
      staffId: data.staffId,
      staffName: data.staffName,
      templateId: data.templateId,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      department: data.department,
      status: data.status || 'SCHEDULED',
      notes: data.notes,
      branchId
    }
  });

  // 2. Sync to Tenant DB
  try {
    const tenantDb = await getTenantClient(branchId);
    await tenantDb.tenantShiftRoster.create({
      data: {
        id: entry.id, // Synchronized ID
        staffId: entry.staffId,
        templateId: entry.templateId,
        date: entry.date,
        startTime: entry.startTime,
        endTime: entry.endTime,
        department: entry.department,
        status: entry.status,
        notes: entry.notes
      }
    });
  } catch (err) {
    console.error(`❌ Tenant roster sync FAILED:`, err.message);
  }

  return entry;
};

/**
 * Update roster status or details
 */
const updateRosterEntry = async (id, branchId, data) => {
  // 1. Update Main DB
  const entry = await mainDb.shiftRoster.update({
    where: { id, branchId },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined
    }
  });

  // 2. Sync to Tenant DB
  try {
    const tenantDb = await getTenantClient(branchId);
    await tenantDb.tenantShiftRoster.update({
      where: { id },
      data: {
        staffId: entry.staffId,
        templateId: entry.templateId,
        date: entry.date,
        startTime: entry.startTime,
        endTime: entry.endTime,
        department: entry.department,
        status: entry.status,
        notes: entry.notes
      }
    }).catch(() => {});
  } catch (err) {
    console.error(`❌ Tenant roster update FAILED:`, err.message);
  }

  return entry;
};

/**
 * Delete roster assignment
 */
const deleteRosterEntry = async (id, branchId) => {
  try {
    const tenantDb = await getTenantClient(branchId);
    await tenantDb.tenantShiftRoster.delete({ where: { id } }).catch(() => {});
  } catch (err) {
    console.error(`❌ Tenant roster delete FAILED:`, err.message);
  }

  return await mainDb.shiftRoster.delete({
    where: { id, branchId }
  });
};

module.exports = {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getRoster,
  createRosterEntry,
  updateRosterEntry,
  deleteRosterEntry
};
