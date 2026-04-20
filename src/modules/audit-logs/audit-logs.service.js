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

module.exports = {
  getAuditLogs,
};
