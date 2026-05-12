const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");
const crypto = require("crypto");

/**
 * Resolve a valid, initialized branchId with fallback to first available branch.
 */
const resolveBranchId = async (branchId) => {
  if (branchId) {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (branch && branch.isDbInitialized) return branchId;
  }
  const first = await prisma.branch.findFirst({ where: { isDbInitialized: true } });
  if (first) return first.id;
  return null;
};

/**
 * List emergency registrations for a branch with search, filters, and pagination.
 *
 * Query params:
 *   search   – name or contact substring (case-insensitive)
 *   priority – Red | Yellow | Green  (omit or "All" for no filter)
 *   status   – Emergency | Draft | Complete  (omit or "All" for no filter)
 *   page     – 1-based page number (default: 1)
 *   limit    – records per page (default: 10, max: 100)
 *
 * Returns: { data, total, page, limit, totalPages }
 */
const getEmergencyList = async (branchId, query = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const { search, priority, status } = query;

  // ── Pagination ──────────────────────────────────────────────────────────────
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip  = (page - 1) * limit;

  // ── Where clause ────────────────────────────────────────────────────────────
  const where = { isEmergency: true };

  if (priority && priority !== "All") {
    where.triagePriority = priority;
  }

  if (status && status !== "All") {
    where.status = status;
  }

  if (search && search.trim()) {
    where.OR = [
      { name:    { contains: search.trim(), mode: "insensitive" } },
      { contact: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  const select = {
    id: true, name: true, age: true, gender: true, contact: true,
    arrivalMode: true, triagePriority: true, emergencyType: true,
    arrivalTime: true, status: true, createdAt: true,
  };

  // Run count + data fetch in parallel
  const [total, patients] = await Promise.all([
    tenantDb.patient.count({ where }),
    tenantDb.patient.findMany({
      where,
      orderBy: { arrivalTime: "desc" },
      select,
      skip,
      take: limit,
    }),
  ]);

  return {
    data:       patients,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a single emergency patient by ID.
 */
const getEmergencyById = async (branchId, patientId) => {
  const tenantDb = await getTenantClient(branchId);

  const patient = await tenantDb.patient.findFirst({
    where: { id: patientId, isEmergency: true },
  });

  if (!patient) throw new Error("Emergency registration not found.");
  return patient;
};

/**
 * Create a new emergency registration.
 * Writes to both tenant DB and main DB (dual-write pattern).
 */
const createEmergencyRegistration = async (branchId, data) => {
  const tenantDb = await getTenantClient(branchId);
  const patientId = crypto.randomUUID();
  const arrivalTime = data.arrivalTime ? new Date(data.arrivalTime) : new Date();

  // Determine status: "Draft" if saved as draft, "Emergency" if confirmed
  const status = data.isDraft ? "Draft" : "Emergency";

  const patientData = {
    name: data.name || "Unknown",
    age: data.age ? parseInt(data.age) : null,
    gender: data.gender || null,
    contact: data.contact || null,
    arrivalMode: data.arrivalMode || "Walk-In",
    triagePriority: data.triagePriority || "Red",
    emergencyType: data.emergencyType || null,
    arrivalTime,
    isEmergency: true,
    status,
  };

  // Write to tenant DB
  const tenantPatient = await tenantDb.patient.create({
    data: { id: patientId, ...patientData },
  });

  // Write to main DB (sync)
  await prisma.patient.create({
    data: {
      id: patientId,
      ...patientData,
      branchId,
    },
  });

  return tenantPatient;
};

/**
 * Update an existing emergency registration.
 * Supports partial updates — only provided fields are changed.
 */
const updateEmergencyRegistration = async (branchId, patientId, data) => {
  const tenantDb = await getTenantClient(branchId);

  const existing = await tenantDb.patient.findFirst({
    where: { id: patientId, isEmergency: true },
  });
  if (!existing) throw new Error("Emergency registration not found.");

  const updateData = {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.age !== undefined && { age: data.age ? parseInt(data.age) : null }),
    ...(data.gender !== undefined && { gender: data.gender }),
    ...(data.contact !== undefined && { contact: data.contact }),
    ...(data.arrivalMode !== undefined && { arrivalMode: data.arrivalMode }),
    ...(data.triagePriority !== undefined && { triagePriority: data.triagePriority }),
    ...(data.emergencyType !== undefined && { emergencyType: data.emergencyType }),
    ...(data.arrivalTime !== undefined && { arrivalTime: new Date(data.arrivalTime) }),
    ...(data.status !== undefined && { status: data.status }),
  };

  // Update tenant DB
  const updated = await tenantDb.patient.update({
    where: { id: patientId },
    data: updateData,
  });

  // Update main DB
  await prisma.patient.update({
    where: { id: patientId },
    data: updateData,
  });

  return updated;
};

/**
 * Confirm a draft emergency registration (status: Draft → Emergency).
 */
const confirmEmergencyRegistration = async (branchId, patientId) => {
  return updateEmergencyRegistration(branchId, patientId, { status: "Emergency" });
};

/**
 * Delete an emergency registration from both DBs.
 */
const deleteEmergencyRegistration = async (branchId, patientId) => {
  const tenantDb = await getTenantClient(branchId);

  const existing = await tenantDb.patient.findFirst({
    where: { id: patientId, isEmergency: true },
  });
  if (!existing) throw new Error("Emergency registration not found.");

  await tenantDb.patient.delete({ where: { id: patientId } });
  await prisma.patient.delete({ where: { id: patientId } });

  return { success: true };
};

/**
 * Get summary stats for the emergency dashboard.
 */
const getEmergencyStats = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total, todayCount, critical, urgent, stable, draft] = await Promise.all([
    tenantDb.patient.count({ where: { isEmergency: true } }),
    tenantDb.patient.count({ where: { isEmergency: true, arrivalTime: { gte: today } } }),
    tenantDb.patient.count({ where: { isEmergency: true, triagePriority: "Red" } }),
    tenantDb.patient.count({ where: { isEmergency: true, triagePriority: "Yellow" } }),
    tenantDb.patient.count({ where: { isEmergency: true, triagePriority: "Green" } }),
    tenantDb.patient.count({ where: { isEmergency: true, status: "Draft" } }),
  ]);

  return { total, todayCount, critical, urgent, stable, draft };
};

module.exports = {
  resolveBranchId,
  getEmergencyList,
  getEmergencyById,
  createEmergencyRegistration,
  updateEmergencyRegistration,
  confirmEmergencyRegistration,
  deleteEmergencyRegistration,
  getEmergencyStats,
};
