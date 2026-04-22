const { mainDb, getTenantClient } = require("../../database/tenant-manager");

/**
 * Record Check-In (Dual Persistence)
 */
const checkIn = async (branchId, data) => {
  console.log(`🕒 Recording Check-In for Staff: ${data.staffId} at Branch: ${branchId}`);

  const checkInTime = new Date();
  
  // 1. Save to Main DB
  const attendance = await mainDb.attendance.create({
    data: {
      staffId: data.staffId,
      staffName: data.staffName,
      branchId: branchId,
      rosterId: data.rosterId,
      date: new Date(data.date),
      checkIn: checkInTime,
      status: data.status || 'PRESENT',
      latitude: data.latitude,
      longitude: data.longitude,
      deviceInfo: data.deviceInfo,
      notes: data.notes
    }
  });

  // 2. Sync to Tenant DB
  try {
    const tenantDb = await getTenantClient(branchId);
    await tenantDb.tenantAttendance.create({
      data: {
        id: attendance.id,
        staffId: attendance.staffId,
        rosterId: attendance.rosterId,
        date: attendance.date,
        checkIn: attendance.checkIn,
        status: attendance.status,
        latitude: attendance.latitude,
        longitude: attendance.longitude,
        deviceInfo: attendance.deviceInfo,
        notes: attendance.notes
      }
    });

    // Update roster status if exists
    if (data.rosterId) {
      await tenantDb.tenantShiftRoster.update({
        where: { id: data.rosterId },
        data: { status: 'COMPLETED' } // Or another status indicating active/completed
      });
      
      await mainDb.shiftRoster.update({
        where: { id: data.rosterId },
        data: { status: 'COMPLETED' }
      });
    }
  } catch (err) {
    console.error(`❌ Tenant attendance sync FAILED:`, err.message);
  }

  return attendance;
};

/**
 * Record Check-Out (Dual Persistence)
 */
const checkOut = async (id, branchId, data) => {
  const checkOutTime = new Date();

  // 1. Update in Main DB
  const attendance = await mainDb.attendance.update({
    where: { id },
    data: {
      checkOut: checkOutTime,
      notes: data.notes ? `${data.notes}` : undefined
    }
  });

  // 2. Sync Update to Tenant DB
  try {
    const tenantDb = await getTenantClient(branchId);
    await tenantDb.tenantAttendance.update({
      where: { id },
      data: {
        checkOut: attendance.checkOut,
        notes: attendance.notes
      }
    });
  } catch (err) {
    console.error(`❌ Tenant attendance check-out sync FAILED:`, err.message);
  }

  return attendance;
};

/**
 * Get attendance for a specific branch and date range
 */
const getAttendance = async (branchId, startDate, endDate) => {
  return await mainDb.attendance.findMany({
    where: {
      branchId,
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    },
    include: {
      roster: true
    },
    orderBy: { date: 'desc' }
  });
};

/**
 * Get staff specific attendance
 */
const getStaffAttendance = async (branchId, staffId) => {
  return await mainDb.attendance.findMany({
    where: {
      branchId,
      staffId
    },
    orderBy: { date: 'desc' }
  });
};

module.exports = {
  checkIn,
  checkOut,
  getAttendance,
  getStaffAttendance
};
