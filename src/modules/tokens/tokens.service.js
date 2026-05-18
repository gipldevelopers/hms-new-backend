const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");
const crypto = require("crypto");

/**
 * Resolve branchId with fallback to first initialized branch.
 */
const resolveBranchId = async (branchId) => {
  if (branchId) {
    const b = await prisma.branch.findUnique({ where: { id: branchId } });
    if (b && b.isDbInitialized) return branchId;
  }
  const first = await prisma.branch.findFirst({ where: { isDbInitialized: true } });
  return first?.id || null;
};

/**
 * Get today's date range (midnight → midnight) for a branch.
 */
const todayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

/**
 * Get the branch token prefix (default "OPD").
 */
const getBranchPrefix = async (branchId) => {
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    select: { tokenPrefix: true },
  });
  return branch?.tokenPrefix || "OPD";
};

/**
 * Update the branch token prefix (branch admin only).
 */
const updateBranchPrefix = async (branchId, prefix) => {
  const clean = prefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  if (!clean) throw new Error("Invalid prefix. Use letters/numbers only, max 6 chars.");
  await prisma.branch.update({
    where: { id: branchId },
    data: { tokenPrefix: clean },
  });
  return { prefix: clean };
};

/**
 * Get today's next sequential token number for a branch.
 * Resets to 1 every day.
 */
const getNextTokenNumber = async (tenantDb, branchId) => {
  const { start, end } = todayRange();
  const count = await tenantDb.token.count({
    where: { date: { gte: start, lte: end } },
  });
  return count + 1;
};

/**
 * Format display token: prefix + zero-padded number.
 * e.g. OPD-001, OPD-012, OPD-100
 */
const formatDisplay = (prefix, num) =>
  `${prefix}-${String(num).padStart(3, "0")}`;

/**
 * Generate a token for a patient.
 * Dual-write: tenant DB + main DB.
 * Optionally creates a linked appointment if appointmentData is provided.
 */
const generateToken = async (branchId, patientId, notes, appointmentData = null) => {
  const tenantDb = await getTenantClient(branchId);
  const prefix = await getBranchPrefix(branchId);
  const tokenId = crypto.randomUUID();

  // Verify patient exists in tenant DB
  const patient = await tenantDb.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new Error("Patient not found.");

  // Check if patient already has a token today
  const { start, end } = todayRange();
  const existing = await tenantDb.token.findFirst({
    where: {
      patientId,
      date: { gte: start, lte: end },
      status: { not: "Skipped" },
    },
  });
  if (existing) {
    throw new Error(`Patient already has token ${existing.displayToken} for today.`);
  }

  const tokenNumber = await getNextTokenNumber(tenantDb, branchId);
  const displayToken = formatDisplay(prefix, tokenNumber);

  const tokenData = {
    id: tokenId,
    tokenNumber,
    prefix,
    displayToken,
    patientId,
    date: new Date(),
    status: "Waiting",
    notes: notes || null,
  };

  // Write to tenant DB
  const created = await tenantDb.token.create({ data: tokenData });

  // Write to main DB
  await prisma.token.create({
    data: { ...tokenData, branchId },
  });

  // Optionally create linked appointment
  let appointment = null;
  if (appointmentData) {
    const apptId = crypto.randomUUID();
    appointment = await tenantDb.appointment.create({
      data: {
        id: apptId,
        patientId,
        doctorId: appointmentData.doctorId || null,
        doctorName: appointmentData.doctorName || null,
        departmentId: appointmentData.departmentId || null,
        departmentName: appointmentData.departmentName || null,
        dateTime: appointmentData.dateTime || new Date(),
        tokenNumber: displayToken,
        fee: appointmentData.fee || null,
        notes: appointmentData.notes || null,
        status: "SCHEDULED",
      },
      include: { patient: true },
    });
  }

  return { ...created, patient, appointment };
};

/**
 * List today's tokens for a branch (token listing tab).
 */
const getTodayTokens = async (branchId, query = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = todayRange();
  const { search, status } = query;

  const where = { date: { gte: start, lte: end } };
  if (status && status !== "All") where.status = status;

  const tokens = await tenantDb.token.findMany({
    where,
    include: { patient: true },
    orderBy: { tokenNumber: "asc" },
  });

  // Apply search filter on patient name/contact
  const filtered = search
    ? tokens.filter(
        (t) =>
          t.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
          t.patient?.contact?.includes(search)
      )
    : tokens;

  return filtered;
};

/**
 * List all patients (for the "generate token" listing — patients without a token today).
 */
const getPatientsForTokening = async (branchId, query = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = todayRange();
  const { search } = query;

  // Get patient IDs that already have a token today (not skipped)
  const todayTokens = await tenantDb.token.findMany({
    where: { date: { gte: start, lte: end }, status: { not: "Skipped" } },
    select: { patientId: true, displayToken: true, status: true },
  });
  const tokenedMap = new Map(todayTokens.map((t) => [t.patientId, t]));

  const where = { isEmergency: false };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { contact: { contains: search, mode: "insensitive" } },
    ];
  }

  const patients = await tenantDb.patient.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, age: true, gender: true,
      contact: true, status: true, createdAt: true,
    },
  });

  // Annotate each patient with their token if they have one today
  return patients.map((p) => ({
    ...p,
    todayToken: tokenedMap.get(p.id) || null,
  }));
};

/**
 * Token history — all tokens for a branch, optionally filtered by date.
 */
const getTokenHistory = async (branchId, query = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const { date, search, status } = query;

  const where = {};

  if (date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const dEnd = new Date(date);
    dEnd.setHours(23, 59, 59, 999);
    where.date = { gte: d, lte: dEnd };
  }

  if (status && status !== "All") where.status = status;

  const tokens = await tenantDb.token.findMany({
    where,
    include: { patient: true },
    orderBy: [{ date: "desc" }, { tokenNumber: "asc" }],
  });

  const filtered = search
    ? tokens.filter(
        (t) =>
          t.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
          t.displayToken.toLowerCase().includes(search.toLowerCase())
      )
    : tokens;

  return filtered;
};

/**
 * Update token status (Called, Completed, Skipped).
 * Also syncs the linked appointment status if one exists for the patient today.
 */
const updateTokenStatus = async (branchId, tokenId, status) => {
  const tenantDb = await getTenantClient(branchId);

  const token = await tenantDb.token.findUnique({ where: { id: tokenId } });
  if (!token) throw new Error("Token not found.");

  const updated = await tenantDb.token.update({
    where: { id: tokenId },
    data: { status },
  });

  await prisma.token.update({
    where: { id: tokenId },
    data: { status },
  });

  // Sync appointment status for this patient today
  const { start, end } = todayRange();
  const apptStatusMap = {
    Called:    "WAITING",
    Completed: "COMPLETED",
    Skipped:   "NO_SHOW",
    Waiting:   "SCHEDULED",
  };
  const apptStatus = apptStatusMap[status];
  if (apptStatus) {
    await tenantDb.appointment.updateMany({
      where: {
        patientId: token.patientId,
        dateTime: { gte: start, lte: end },
        status: { notIn: ["CANCELLED", "COMPLETED"] },
      },
      data: { status: apptStatus },
    });
  }

  return updated;
};

/**
 * Get today's stats for the token dashboard.
 */
const getTodayStats = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = todayRange();
  const prefix = await getBranchPrefix(branchId);

  const [total, waiting, completed, skipped] = await Promise.all([
    tenantDb.token.count({ where: { date: { gte: start, lte: end } } }),
    tenantDb.token.count({ where: { date: { gte: start, lte: end }, status: "Waiting" } }),
    tenantDb.token.count({ where: { date: { gte: start, lte: end }, status: "Completed" } }),
    tenantDb.token.count({ where: { date: { gte: start, lte: end }, status: "Skipped" } }),
  ]);

  const next = await getNextTokenNumber(tenantDb, branchId);

  return { total, waiting, completed, skipped, nextToken: formatDisplay(prefix, next), prefix };
};

module.exports = {
  resolveBranchId,
  getBranchPrefix,
  updateBranchPrefix,
  generateToken,
  getTodayTokens,
  getPatientsForTokening,
  getTokenHistory,
  updateTokenStatus,
  getTodayStats,
};
