const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");
const crypto = require("crypto");

const resolveBranchId = async (branchId) => {
  if (branchId) {
    const b = await prisma.branch.findUnique({ where: { id: branchId } });
    if (b && b.isDbInitialized) return branchId;
  }
  const first = await prisma.branch.findFirst({ where: { isDbInitialized: true } });
  return first?.id || null;
};

const todayRange = () => {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end   = new Date(); end.setHours(23, 59, 59, 999);
  return { start, end };
};

const getNextAppointmentToken = async (tenantDb) => {
  const { start, end } = todayRange();
  const count = await tenantDb.appointment.count({
    where: { dateTime: { gte: start, lte: end } },
  });
  return `A-${String(count + 1).padStart(3, "0")}`;
};

const searchPatients = async (branchId, query) => {
  const tenantDb = await getTenantClient(branchId);
  if (!query || query.trim().length < 2) return [];
  const q = query.trim();
  return await tenantDb.patient.findMany({
    where: {
      OR: [
        { name:    { contains: q, mode: "insensitive" } },
        { contact: { contains: q, mode: "insensitive" } },
        { id:      { startsWith: q } },
      ],
    },
    select: { id: true, name: true, age: true, gender: true, contact: true, status: true },
    take: 10,
    orderBy: { createdAt: "desc" },
  });
};

const getDoctors = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  return await tenantDb.tenantUser.findMany({
    where: { role: "DOCTOR", status: "Active" },
    select: { id: true, name: true, shiftStartTime: true, shiftEndTime: true },
    orderBy: { name: "asc" },
  });
};

const getDepartments = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  return await tenantDb.department.findMany({
    where: { active: true },
    select: { id: true, name: true, code: true },
    orderBy: { name: "asc" },
  });
};

const getBookedSlots = async (branchId, doctorId, date) => {
  const tenantDb = await getTenantClient(branchId);
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  const dEnd = new Date(date); dEnd.setHours(23, 59, 59, 999);
  const appts = await tenantDb.appointment.findMany({
    where: { doctorId, dateTime: { gte: d, lte: dEnd }, status: { not: "CANCELLED" } },
    select: { dateTime: true, status: true },
  });
  return appts.map((a) => ({
    time: a.dateTime.toTimeString().slice(0, 5),
    status: a.status,
  }));
};

const getTodayAppointments = async (branchId, query = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = todayRange();
  const { search, status, departmentId, doctorId } = query;

  const where = { dateTime: { gte: start, lte: end } };
  if (status && status !== "All")  where.status       = status;
  if (departmentId)                where.departmentId = departmentId;
  if (doctorId)                    where.doctorId     = doctorId;

  const appts = await tenantDb.appointment.findMany({
    where,
    include: { patient: { select: { id: true, name: true, contact: true, age: true, gender: true } } },
    orderBy: { dateTime: "asc" },
  });

  return search
    ? appts.filter((a) =>
        a.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.patient?.contact?.includes(search) ||
        a.tokenNumber?.toLowerCase().includes(search.toLowerCase()) ||
        a.doctorName?.toLowerCase().includes(search.toLowerCase())
      )
    : appts;
};

const getTodayStats = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = todayRange();
  const base = { dateTime: { gte: start, lte: end } };
  const [total, checkedIn, waiting, cancelled, noShow] = await Promise.all([
    tenantDb.appointment.count({ where: base }),
    tenantDb.appointment.count({ where: { ...base, status: "CHECKED_IN" } }),
    tenantDb.appointment.count({ where: { ...base, status: "WAITING" } }),
    tenantDb.appointment.count({ where: { ...base, status: "CANCELLED" } }),
    tenantDb.appointment.count({ where: { ...base, status: "NO_SHOW" } }),
  ]);
  return { total, checkedIn, waiting, cancelled, noShow };
};

const bookAppointment = async (branchId, data) => {
  const tenantDb = await getTenantClient(branchId);

  if (!data.patientId)  throw new Error("patientId is required.");
  if (!data.dateTime)   throw new Error("dateTime is required.");

  const patient = await tenantDb.patient.findUnique({ where: { id: data.patientId } });
  if (!patient) throw new Error("Patient not found.");

  let doctorName = data.doctorName || null;
  if (data.doctorId) {
    const doctor = await tenantDb.tenantUser.findUnique({ where: { id: data.doctorId } });
    if (!doctor) throw new Error("Doctor not found.");
    doctorName = doctor.name;
  }

  let departmentName = data.departmentName || null;
  if (data.departmentId) {
    const dept = await tenantDb.department.findUnique({ where: { id: data.departmentId } });
    if (!dept) throw new Error("Department not found.");
    departmentName = dept.name;
  }

  // Slot conflict check
  if (data.doctorId) {
    const slotStart = new Date(data.dateTime); slotStart.setSeconds(0, 0);
    const slotEnd   = new Date(slotStart.getTime() + 14 * 60 * 1000);
    const conflict  = await tenantDb.appointment.findFirst({
      where: { doctorId: data.doctorId, dateTime: { gte: slotStart, lt: slotEnd }, status: { not: "CANCELLED" } },
    });
    if (conflict) throw new Error("This time slot is already booked for the selected doctor.");
  }

  const tokenNumber = data.tokenNumber || await getNextAppointmentToken(tenantDb);

  return await tenantDb.appointment.create({
    data: {
      id:             crypto.randomUUID(),
      patientId:      data.patientId,
      doctorId:       data.doctorId     || null,
      doctorName,
      departmentId:   data.departmentId || null,
      departmentName,
      dateTime:       new Date(data.dateTime),
      tokenNumber,
      fee:            data.fee ? parseFloat(data.fee) : null,
      notes:          data.notes || null,
      status:         "SCHEDULED",
    },
    include: { patient: true },
  });
};

const updateAppointmentStatus = async (branchId, appointmentId, status, cancelReason) => {
  const tenantDb = await getTenantClient(branchId);
  const allowed = ["SCHEDULED", "CHECKED_IN", "WAITING", "COMPLETED", "CANCELLED", "NO_SHOW"];
  if (!allowed.includes(status)) throw new Error(`Invalid status. Must be one of: ${allowed.join(", ")}`);
  return await tenantDb.appointment.update({
    where: { id: appointmentId },
    data: { status, ...(cancelReason && { cancelReason }) },
    include: { patient: true },
  });
};

const rescheduleAppointment = async (branchId, appointmentId, newDateTime, notes) => {
  const tenantDb = await getTenantClient(branchId);
  const existing = await tenantDb.appointment.findUnique({ where: { id: appointmentId } });
  if (!existing) throw new Error("Appointment not found.");

  if (existing.doctorId) {
    const slotStart = new Date(newDateTime); slotStart.setSeconds(0, 0);
    const slotEnd   = new Date(slotStart.getTime() + 14 * 60 * 1000);
    const conflict  = await tenantDb.appointment.findFirst({
      where: { id: { not: appointmentId }, doctorId: existing.doctorId, dateTime: { gte: slotStart, lt: slotEnd }, status: { not: "CANCELLED" } },
    });
    if (conflict) throw new Error("The new time slot is already booked for this doctor.");
  }

  return await tenantDb.appointment.update({
    where: { id: appointmentId },
    data: { dateTime: new Date(newDateTime), status: "SCHEDULED", ...(notes && { notes }) },
    include: { patient: true },
  });
};

const getPatientTodaySummary = async (branchId, patientId) => {
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = todayRange();

  const [appointment, token] = await Promise.all([
    tenantDb.appointment.findFirst({
      where: { patientId, dateTime: { gte: start, lte: end } },
      include: { patient: { select: { id: true, name: true, contact: true } } },
      orderBy: { dateTime: "asc" },
    }),
    tenantDb.token.findFirst({
      where: { patientId, date: { gte: start, lte: end }, status: { not: "Skipped" } },
    }),
  ]);

  return { appointment, token };
};

module.exports = {
  resolveBranchId, searchPatients, getDoctors, getDepartments,
  getBookedSlots, getTodayAppointments, getTodayStats,
  bookAppointment, updateAppointmentStatus, rescheduleAppointment,
  getPatientTodaySummary,
};
