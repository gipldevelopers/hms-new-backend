const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");

const resolveBranchId = async (branchId) => {
  if (branchId) {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (branch?.isDbInitialized) return branchId;
  }

  const firstInitializedBranch = await prisma.branch.findFirst({
    where: { isDbInitialized: true },
    orderBy: { createdAt: "asc" }
  });

  return firstInitializedBranch?.id || null;
};

const toMoney = (value) => Number(value || 0);

const patientName = (patient) => {
  if (!patient) return "Unknown";
  return `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || patient.name || "Unknown";
};

const patientUhid = (patient) => (patient?.id ? `UHID-${patient.id.slice(0, 6).toUpperCase()}` : null);

const billBalance = (bill) => Math.max(0, toMoney(bill?.netPayable) - toMoney(bill?.amountPaid));

const statusLabel = (status) => {
  if (status === "PAID") return "Paid";
  if (status === "PARTIAL") return "Partial";
  if (status === "UNPAID") return "Unpaid";
  if (status === "DISCHARGED") return "Discharged";
  return status || "Unknown";
};

const dateRangeForToday = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const getDashboardStats = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  const { start, end } = dateRangeForToday();

  const [billSummary, todayBillSummary, totalBills, pendingBillCount] = await Promise.all([
    tenantDb.bill.aggregate({
      _sum: { netPayable: true, amountPaid: true }
    }),
    tenantDb.bill.aggregate({
      where: { createdAt: { gte: start, lte: end } },
      _sum: { netPayable: true, amountPaid: true }
    }),
    tenantDb.bill.count(),
    tenantDb.bill.count({
      where: { status: { in: ["UNPAID", "PARTIAL"] } }
    })
  ]);

  const pendingBills = await tenantDb.bill.findMany({
    where: { status: { in: ["UNPAID", "PARTIAL"] } },
    select: { netPayable: true, amountPaid: true }
  });

  const totalRevenue = toMoney(billSummary._sum.netPayable);
  const totalCollections = toMoney(billSummary._sum.amountPaid);
  const pendingPayments = pendingBills.reduce((sum, bill) => sum + billBalance(bill), 0);
  const todayRevenue = toMoney(todayBillSummary._sum.netPayable);
  const todayCollections = toMoney(todayBillSummary._sum.amountPaid);

  return {
    totalRevenue,
    totalCollections,
    pendingPayments,
    totalBills,
    todayCollections,
    todayRevenue,
    pendingBillCount
  };
};

const getRecentInvoices = async (branchId, limit = 8) => {
  const tenantDb = await getTenantClient(branchId);

  const bills = await tenantDb.bill.findMany({
    include: { patient: true },
    orderBy: { createdAt: "desc" },
    take: Number(limit)
  });

  return bills.map((bill) => ({
    id: bill.id,
    invoiceNumber: `INV-${bill.id.slice(0, 8).toUpperCase()}`,
    patientName: patientName(bill.patient),
    uhid: patientUhid(bill.patient),
    amount: toMoney(bill.netPayable),
    status: statusLabel(bill.status),
    createdDate: bill.createdAt,
    type: bill.type
  }));
};

const getRunningBills = async (branchId, limit = 10) => {
  const tenantDb = await getTenantClient(branchId);

  const admissions = await tenantDb.admission.findMany({
    where: { status: "In Progress" },
    include: { patient: true, ward: true, bed: true, doctor: true },
    orderBy: { admissionDate: "desc" },
    take: Number(limit)
  });

  if (!admissions.length) return [];

  const patientIds = [...new Set(admissions.map((admission) => admission.patientId))];
  const bills = await tenantDb.bill.findMany({
    where: { patientId: { in: patientIds }, type: "IPD" },
    orderBy: { createdAt: "desc" }
  });

  const latestBillByPatient = new Map();
  for (const bill of bills) {
    if (!latestBillByPatient.has(bill.patientId)) latestBillByPatient.set(bill.patientId, bill);
  }

  return admissions.map((admission) => {
    const bill = latestBillByPatient.get(admission.patientId);
    const currentBillAmount = toMoney(bill?.netPayable);
    const advancePaid = toMoney(bill?.amountPaid);

    return {
      admissionId: admission.id,
      patientId: admission.patient?.id || null,
      patientName: patientName(admission.patient),
      uhid: patientUhid(admission.patient),
      admissionDate: admission.admissionDate,
      currentBillAmount,
      advancePaid,
      balanceDue: Math.max(0, currentBillAmount - advancePaid),
      billingStatus: bill ? statusLabel(bill.status) : "No Bill",
      wardBed: admission.ward && admission.bed
        ? `${admission.ward.name} / ${admission.bed.label}`
        : admission.ward?.name || null,
      doctorName: admission.doctor?.name || null,
      billId: bill?.id || null
    };
  });
};

const getDashboardAlerts = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [pendingPaymentBills, overdueBillRows, unpaidInvoiceRows, activeAdmissions] = await Promise.all([
    tenantDb.bill.findMany({
      where: { status: { in: ["UNPAID", "PARTIAL"] } },
      include: { patient: true },
      orderBy: { createdAt: "asc" },
      take: 10
    }),
    tenantDb.bill.findMany({
      where: { status: "UNPAID", createdAt: { lt: sevenDaysAgo } },
      include: { patient: true },
      orderBy: { createdAt: "asc" },
      take: 10
    }),
    tenantDb.bill.findMany({
      where: { status: "UNPAID" },
      include: { patient: true },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    tenantDb.admission.findMany({
      where: { status: "In Progress" },
      include: { patient: true },
      take: 20
    })
  ]);

  const serializeBillAlert = (bill, type, priority) => ({
    id: bill.id,
    type,
    priority,
    invoiceNumber: `INV-${bill.id.slice(0, 8).toUpperCase()}`,
    patientName: patientName(bill.patient),
    uhid: patientUhid(bill.patient),
    amount: billBalance(bill),
    status: statusLabel(bill.status),
    createdDate: bill.createdAt
  });

  const pendingPayments = pendingPaymentBills.map((bill) => serializeBillAlert(bill, "pending-payment", "medium"));
  const overdueBills = overdueBillRows.map((bill) => serializeBillAlert(bill, "overdue-bill", "high"));
  const unpaidInvoices = unpaidInvoiceRows.map((bill) => serializeBillAlert(bill, "unpaid-invoice", "medium"));

  const activePatientIds = activeAdmissions.map((admission) => admission.patientId);
  const activeIpdBills = activePatientIds.length
    ? await tenantDb.bill.findMany({ where: { patientId: { in: activePatientIds }, type: "IPD" } })
    : [];
  const billedPatientIds = new Set(activeIpdBills.map((bill) => bill.patientId));

  const unbilledAdmissions = activeAdmissions
    .filter((admission) => !billedPatientIds.has(admission.patientId))
    .map((admission) => ({
      id: admission.id,
      type: "missing-ipd-bill",
      priority: "high",
      patientName: patientName(admission.patient),
      uhid: patientUhid(admission.patient),
      admissionDate: admission.admissionDate,
      message: "Active admission has no IPD bill generated."
    }));

  const highBalanceBills = pendingPaymentBills
    .filter((bill) => billBalance(bill) >= 5000)
    .map((bill) => ({
      ...serializeBillAlert(bill, "high-balance", "high"),
      message: "Outstanding balance requires finance follow-up."
    }));

  return {
    pendingPayments,
    overdueBills,
    unpaidInvoices,
    highPriorityFinanceAlerts: [...overdueBills, ...highBalanceBills, ...unbilledAdmissions]
  };
};

module.exports = {
  resolveBranchId,
  getDashboardStats,
  getRecentInvoices,
  getRunningBills,
  getDashboardAlerts
};
