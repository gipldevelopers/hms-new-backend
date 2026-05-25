const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");

const resolveBranchId = async (branchId) => {
  if (branchId) {
    const b = await prisma.branch.findUnique({ where: { id: branchId } });
    if (b && b.isDbInitialized) return branchId;
  }
  const first = await prisma.branch.findFirst({ where: { isDbInitialized: true } });
  return first?.id || null;
};

/**
 * Get prescription queue — all prescriptions from COMPLETED consultations
 * that are PENDING, PROCESSING, or READY (not yet DISPENSED)
 */
const getPrescriptionQueue = async (branchId, filters = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const { search, status, doctorId } = filters;

  const where = {
    consultation: { status: "COMPLETED" },
  };

  // Filter by pharmacy status
  if (status && status !== "All") {
    where.pharmacyStatus = status;
  }
  // Default "All": show everything including DISPENSED

  if (doctorId) where.doctorId = doctorId;

  const prescriptions = await tenantDb.prescription.findMany({
    where,
    include: {
      patient: {
        select: { id: true, name: true, age: true, gender: true, contact: true, bloodGroup: true }
      },
      consultation: {
        select: {
          id: true, status: true, finalDiagnosis: true, followUpNotes: true,
          appointmentId: true, createdAt: true
        }
      },
      items: {
        include: { medicine: { select: { id: true, medicineName: true, type: true, rackId: true, quantity: true, status: true } } }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  // Apply search filter
  let result = prescriptions;
  if (search) {
    const q = search.toLowerCase();
    result = prescriptions.filter(p =>
      p.patient?.name?.toLowerCase().includes(q) ||
      p.patient?.contact?.includes(search) ||
      p.doctorName?.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  }

  return result;
};

/**
 * Get prescription queue stats
 */
const getPrescriptionQueueStats = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);

  const [pending, processing, ready, dispensedToday] = await Promise.all([
    tenantDb.prescription.count({
      where: { pharmacyStatus: "PENDING", consultation: { status: "COMPLETED" } }
    }),
    tenantDb.prescription.count({
      where: { pharmacyStatus: "PROCESSING", consultation: { status: "COMPLETED" } }
    }),
    tenantDb.prescription.count({
      where: { pharmacyStatus: "READY", consultation: { status: "COMPLETED" } }
    }),
    tenantDb.prescription.count({
      where: {
        pharmacyStatus: "DISPENSED",
        dispensedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    })
  ]);

  return { pending, processing, ready, dispensedToday };
};

/**
 * Get single prescription with full details
 */
const getPrescriptionById = async (branchId, prescriptionId) => {
  const tenantDb = await getTenantClient(branchId);

  const prescription = await tenantDb.prescription.findUnique({
    where: { id: prescriptionId },
    include: {
      patient: true,
      consultation: {
        select: {
          id: true, status: true, chiefComplaints: true, finalDiagnosis: true,
          followUpNotes: true, followUpDate: true, appointmentId: true, createdAt: true
        }
      },
      items: {
        include: {
          medicine: {
            select: { id: true, medicineName: true, type: true, rackId: true, quantity: true, status: true, mfg: true }
          }
        }
      }
    }
  });

  if (!prescription) throw new Error("Prescription not found");
  return prescription;
};

/**
 * Update pharmacy status of a prescription
 * PENDING → PROCESSING → READY → DISPENSED
 */
const updatePrescriptionStatus = async (branchId, prescriptionId, newStatus, pharmacistName, notes) => {
  const tenantDb = await getTenantClient(branchId);

  const allowed = ["PENDING", "PROCESSING", "READY", "DISPENSED"];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Invalid status. Must be one of: ${allowed.join(", ")}`);
  }

  const prescription = await tenantDb.prescription.findUnique({ where: { id: prescriptionId } });
  if (!prescription) throw new Error("Prescription not found");

  const updateData = {
    pharmacyStatus: newStatus,
    pharmacyNotes: notes || prescription.pharmacyNotes,
  };

  if (newStatus === "PROCESSING") {
    updateData.processedBy = pharmacistName || null;
    updateData.processedAt = new Date();
  }

  if (newStatus === "DISPENSED") {
    updateData.dispensedAt = new Date();
  }

  return await tenantDb.prescription.update({
    where: { id: prescriptionId },
    data: updateData,
    include: {
      patient: { select: { id: true, name: true, age: true, gender: true } },
      items: { include: { medicine: true } }
    }
  });
};

/**
 * Mark individual prescription item as picked
 * Stores picked state in a simple JSON field on the prescription
 */
const toggleItemPicked = async (branchId, prescriptionId, itemId, picked) => {
  const tenantDb = await getTenantClient(branchId);

  const prescription = await tenantDb.prescription.findUnique({
    where: { id: prescriptionId },
    include: { items: true }
  });
  if (!prescription) throw new Error("Prescription not found");

  // Store picked items as JSON in pharmacyNotes (simple approach)
  let pickedItems = {};
  try {
    pickedItems = prescription.pharmacyNotes
      ? JSON.parse(prescription.pharmacyNotes)
      : {};
  } catch {
    pickedItems = {};
  }

  if (typeof pickedItems !== "object" || Array.isArray(pickedItems)) {
    pickedItems = {};
  }

  pickedItems[itemId] = picked;

  await tenantDb.prescription.update({
    where: { id: prescriptionId },
    data: { pharmacyNotes: JSON.stringify(pickedItems) }
  });

  return { prescriptionId, itemId, picked, pickedItems };
};

/**
 * Dispense prescription with payment info
 */
const dispensePrescription = async (branchId, prescriptionId, paymentData, pharmacistName) => {
  const tenantDb = await getTenantClient(branchId);

  const prescription = await tenantDb.prescription.findUnique({
    where: { id: prescriptionId },
    include: { items: { include: { medicine: true } } }
  });
  if (!prescription) throw new Error("Prescription not found");

  const updateData = {
    pharmacyStatus: "DISPENSED",
    dispensedAt: new Date(),
    processedBy: pharmacistName || prescription.processedBy || null,
    pharmacyNotes: paymentData.pharmacistNotes || prescription.pharmacyNotes || null,
  };

  return await tenantDb.prescription.update({
    where: { id: prescriptionId },
    data: updateData,
    include: {
      patient: true,
      items: { include: { medicine: true } },
      consultation: {
        select: { id: true, finalDiagnosis: true, chiefComplaints: true, followUpNotes: true }
      }
    }
  });
};

module.exports = {
  resolveBranchId,
  getPrescriptionQueue,
  getPrescriptionQueueStats,
  getPrescriptionById,
  updatePrescriptionStatus,
  toggleItemPicked,
  dispensePrescription
};
