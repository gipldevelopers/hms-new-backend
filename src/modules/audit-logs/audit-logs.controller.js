const auditLogService = require("./audit-logs.service");

const getAuditLogs = async (req, res, next) => {
  try {
    const result = await auditLogService.getAuditLogs(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAuditStats = async (req, res, next) => {
  try {
    const result = await auditLogService.getAuditStats();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
  getAuditStats,
};
