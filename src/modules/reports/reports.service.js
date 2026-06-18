const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");

const resolveBranchId = async (branchId) => {
  if (branchId) {
    const b = await prisma.branch.findUnique({ where: { id: branchId } });
    if (b && b.isDbInitialized) return branchId;
  }
  const first = await prisma.branch.findFirst({
    where: { isDbInitialized: true },
    orderBy: { createdAt: "asc" }
  });
  if (first) return first.id;
  return null;
};

const getDashboardData = async (branchId) => {
  const resolvedBranchId = await resolveBranchId(branchId);
  if (!resolvedBranchId) {
    throw new Error("No initialized branch found.");
  }
  const tenantDb = await getTenantClient(resolvedBranchId);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 1. Bed Occupancy
  const beds = await tenantDb.bed.findMany();
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === "OCCUPIED" || b.status === "Occupied").length;
  const bedOccupancyRate = totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // 2. Emergency Cases Today
  const emergencyCases = await tenantDb.patient.count({
    where: {
      isEmergency: true,
      createdAt: { gte: todayStart, lte: todayEnd }
    }
  });

  // 3. Revenue Today
  const billsToday = await tenantDb.bill.findMany({
    where: { createdAt: { gte: todayStart, lte: todayEnd } }
  });
  const revenueToday = billsToday.reduce((sum, b) => sum + (b.amountPaid || 0), 0);

  // 4. Average LOS
  const completedAdmissions = await tenantDb.admission.findMany({
    where: { status: { in: ["Completed", "Discharged"] }, dischargeDate: { not: null } }
  });
  let totalLosDays = 0;
  completedAdmissions.forEach(adm => {
    const diffTime = Math.abs(new Date(adm.dischargeDate) - new Date(adm.admissionDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    totalLosDays += diffDays || 1;
  });
  const avgLos = completedAdmissions.length ? (totalLosDays / completedAdmissions.length).toFixed(1) : 0;

  // 5. Ward / Bed Overview
  const wards = await tenantDb.ward.findMany({ include: { beds: true } });
  const wardOverview = wards.map(w => {
    const wTotal = w.beds.length;
    const wOccupied = w.beds.filter(b => b.status === "OCCUPIED" || b.status === "Occupied").length;
    return {
      id: w.id,
      name: w.name,
      total: wTotal,
      occupied: wOccupied,
      available: wTotal - wOccupied,
      occupancyRate: wTotal ? Math.round((wOccupied / wTotal) * 100) : 0
    };
  });

  // 6. Running Bills (Active IPD patients)
  const activeAdmissions = await tenantDb.admission.findMany({
    where: { status: { in: ["In Progress", "Active"] } },
    include: { patient: true, ward: true, bed: true },
    orderBy: { admissionDate: 'desc' },
    take: 10
  });

  const activePatientIds = activeAdmissions.map(a => a.patientId);
  const currentBills = activePatientIds.length > 0 ? await tenantDb.bill.findMany({
    where: { patientId: { in: activePatientIds }, type: "IPD" }
  }) : [];
  
  const runningBills = activeAdmissions.map(adm => {
    const p = adm.patient;
    const b = currentBills.find(x => x.patientId === adm.patientId);
    return {
      id: adm.id,
      patientName: p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.name : 'Unknown',
      uhid: p ? `UHID-${p.id.substring(0, 6).toUpperCase()}` : '—',
      wardBed: `${adm.ward?.name || '—'} / ${adm.bed?.label || '—'}`,
      admittedDate: new Date(adm.admissionDate).toLocaleDateString(),
      totalAmount: b ? b.netPayable : 0,
      deposit: b ? b.amountPaid : 0
    };
  });

  // 7. Recent Activity (Recent admissions)
  const recentAdmissions = await tenantDb.admission.findMany({
    include: { patient: true, ward: true, bed: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  const recentActivity = recentAdmissions.map(adm => {
    const p = adm.patient;
    const name = p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.name : 'Unknown';
    const status = (adm.status === 'Completed' || adm.status === 'Discharged') ? 'Discharge' : 'Admission';
    return {
      id: adm.id,
      type: status,
      title: `${status} - ${name}`,
      description: status === 'Discharge' ? `Patient discharged from ${adm.ward?.name || 'Ward'}` : `Patient admitted to ${adm.ward?.name || 'Ward'}, Bed ${adm.bed?.label || '—'}`,
      time: new Date(adm.createdAt).toISOString()
    };
  });

  // 8. Alerts
  const alerts = [
    { id: 1, type: "Warning", message: "Review pending pharmacy requests", time: new Date().toISOString() },
    { id: 2, type: "Critical", message: "Check ICU Ward capacity", time: new Date(Date.now() - 3600000).toISOString() }
  ];

  return {
    stats: {
      bedOccupancy: bedOccupancyRate,
      otUtilization: 65, 
      emergencyCases,
      revenueToday,
      avgLos,
      infectionRate: 1.2, 
      readmissionRate: 4.5, 
      mortalityCount: 0 
    },
    wardOverview,
    runningBills,
    recentActivity,
    alerts
  };
};

module.exports = {
  getDashboardData
};
