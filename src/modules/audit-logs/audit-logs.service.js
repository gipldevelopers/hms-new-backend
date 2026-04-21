const prisma = require("../../database/prisma");

const getAuditLogs = async (query) => {
  const { page = 1, limit = 50, search, from, to, module, action } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = {};

  if (search) {
    where.OR = [
      { userEmail: { contains: search, mode: "insensitive" } },
      { userName: { contains: search, mode: "insensitive" } },
      { action: { contains: search, mode: "insensitive" } },
      { module: { contains: search, mode: "insensitive" } },
    ];
  }

  if (module) {
    where.module = module;
  }

  if (action) {
    where.action = action;
  }

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / take),
    },
  };
};

const getAuditStats = async () => {
  const [total, success, failed, actors, moduleGroups] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.count({ where: { status: "SUCCESS" } }),
    prisma.auditLog.count({ where: { status: "FAILED" } }),
    prisma.auditLog.groupBy({
      by: ['userEmail'],
      _count: {
        userEmail: true
      }
    }),
    prisma.auditLog.groupBy({
      by: ['module']
    })
  ]);

  return {
    totalTraces: total,
    successfulOps: success,
    failedAttempts: failed,
    uniqueActors: actors.length,
    modules: moduleGroups.map(m => m.module).filter(Boolean)
  };
};

module.exports = {
  getAuditLogs,
  getAuditStats,
};
