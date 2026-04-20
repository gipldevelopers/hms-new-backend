const prisma = require("../database/prisma");

/**
 * Log an action to the audit logs
 * @param {Object} params
 * @param {string} params.userId - ID of the user performing the action
 * @param {string} params.userEmail - Email of the user performing the action
 * @param {string} params.userName - Name of the user performing the action
 * @param {string} params.action - Action performed (e.g., "CREATE_USER")
 * @param {string} params.module - Module affected (e.g., "USER_MANAGEMENT")
 * @param {Object} params.details - Additional details about the action
 * @param {string} params.ipAddress - IP address of the user
 * @param {string} params.userAgent - User agent of the user
 */
const logActivity = async ({
  userId,
  userEmail,
  userName,
  userRole,
  action,
  module,
  status,
  details,
  ipAddress,
  userAgent,
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        userEmail,
        userName,
        userRole,
        action,
        module,
        status: status || "SUCCESS",
        details: details || {},
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to save audit log:", error);
  }
};

module.exports = {
  logActivity,
};
