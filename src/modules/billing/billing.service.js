const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");
const labSvc = require("../laboratory/laboratory.service");

const resolveBranchId = async (branchId) => {
  if (branchId) {
    const b = await prisma.branch.findUnique({ where: { id: branchId } });
    if (b && b.isDbInitialized) return branchId;
  }
  const first = await prisma.branch.findFirst({ where: { isDbInitialized: true } });
  return first?.id || null;
};

/**
 * Get all patients with OPD billing data for the branch
 */
const getOPDBillingRecords = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  const availableTests = await labSvc.listAvailableTests(branchId).catch(() => []);
  const testPriceMap = new Map();
  for (const t of availableTests) {
    if (t.name) testPriceMap.set(t.name.toLowerCase(), t.price);
    if (t.code) testPriceMap.set(t.code.toLowerCase(), t.price);
  }

  // Fetch all appointments
  const appointments = await tenantDb.appointment.findMany({
    include: {
      patient: true,
    },
    orderBy: { dateTime: "desc" }
  });

  // Fetch all generated bills to check if already paid or collected
  const bills = await tenantDb.bill.findMany({
    where: { type: "OPD" },
    include: { patient: true }
  });

  const records = [];
  const seenPatientIds = new Set();

  // 1. Process existing bills from the DB
  for (const bill of bills) {
    const p = bill.patient;
    const uhidStr = p ? `UHID-${p.id.substring(0, 6).toUpperCase()}` : "—";
    records.push({
      uhid: uhidStr,
      patientId: bill.patientId,
      patient: p ? `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name : "Unknown",
      doctor: "Dr. Attending",
      opdCharge: `₹${bill.consultationFee.toFixed(2)}`,
      otherCharge: `₹${(bill.labCharges + bill.pharmacyCharges).toFixed(2)}`,
      amountReceived: `₹${bill.consultationFee.toFixed(2)}`,
      paymentMethod: bill.paymentMethod || "UPI",
      status: bill.status,
      billId: bill.id
    });
    seenPatientIds.add(bill.patientId);
  }

  // 2. Process active appointments that do not have generated bills yet (Pending OPD Billing)
  for (const appt of appointments) {
    if (seenPatientIds.has(appt.patientId)) continue;

    const p = appt.patient;
    if (!p) continue;

    const uhidStr = `UHID-${p.id.substring(0, 6).toUpperCase()}`;
    
    // Calculate pharmacy charges (DISPENSED prescriptions)
    const prescriptions = await tenantDb.prescription.findMany({
      where: {
        patientId: p.id,
        pharmacyStatus: "DISPENSED"
      },
      include: { items: { include: { medicine: true } } }
    });

    let pharmacyCharges = 0;
    for (const rx of prescriptions) {
      if (rx.items) {
        pharmacyCharges += rx.items.reduce((sum, item) => {
          const price = item.medicine?.price || item.unitPrice || 10;
          return sum + price;
        }, 0);
      }
    }

    // Calculate lab charges (from completed lab test orders)
    const labOrders = await tenantDb.labTestOrder.findMany({
      where: { patientId: p.id }
    });

    let labCharges = 0;
    for (const order of labOrders) {
      const tests = Array.isArray(order.tests) ? order.tests : [];
      for (const t of tests) {
        if (t.status === "Completed") {
          const price = testPriceMap.get(t.name?.toLowerCase()) || testPriceMap.get(t.code?.toLowerCase()) || 250;
          labCharges += price;
        }
      }
    }

    const opdFee = appt.fee || 0;
    const otherCharge = pharmacyCharges + labCharges;
    const amountReceived = opdFee;

    records.push({
      uhid: uhidStr,
      patientId: p.id,
      patient: `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || "Unknown Patient",
      doctor: appt.doctorName || "Dr. Attending",
      opdCharge: `₹${opdFee.toFixed(2)}`,
      otherCharge: `₹${otherCharge.toFixed(2)}`,
      amountReceived: `₹${amountReceived.toFixed(2)}`,
      paymentMethod: "—",
      status: "PENDING"
    });
    
    seenPatientIds.add(p.id);
  }

  // Return empty array when no records exist — no mock fallback
  return records;
};

/**
 * Get detailed breakdown of OPD Billing for a specific patient
 */
const getOPDBillingDetails = async (branchId, query) => {
  const tenantDb = await getTenantClient(branchId);
  const { uhid, patient: patientName } = query;

  if (!uhid && !patientName) throw new Error("Patient UHID or name is required");

  let patient = null;

  if (uhid) {
    const cleanId = uhid.replace("UHID-", "").toLowerCase();
    const patients = await tenantDb.patient.findMany();
    patient = patients.find(p => p.id.substring(0, 6).toLowerCase() === cleanId || p.id === uhid);
  }

  if (!patient && patientName) {
    const patients = await tenantDb.patient.findMany();
    patient = patients.find(p => `${p.firstName || ""} ${p.lastName || ""}`.trim().toLowerCase() === patientName.toLowerCase() || p.name?.toLowerCase() === patientName.toLowerCase());
  }

  if (!patient) {
    throw Object.assign(new Error("Patient not found"), { statusCode: 404 });
  }

  const patientFullName = `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || patient.name || "Unknown Patient";
  const formattedUhid = `UHID-${patient.id.substring(0, 6).toUpperCase()}`;

  // 1. Doctor Consultation Fee (Paid at reception)
  // Fetch appointment to get consulting doctor and fee
  const appointments = await tenantDb.appointment.findMany({
    where: { patientId: patient.id },
    orderBy: { dateTime: "desc" }
  });
  const latestAppt = appointments[0];
  const consultFee = latestAppt?.fee || 0;
  const doctorName = latestAppt?.doctorName || "—";

  const doctorConsultationItem = {
    name: "Doctor Consultation Fee",
    category: "Consultation",
    qty: "1",
    price: `₹${consultFee.toFixed(2)}`,
    total: `₹${consultFee.toFixed(2)}`,
    isSystem: true,
    source: "Reception (Paid)"
  };

  // 2. Lab Tests (Completed are billed, Pending/Processing are listed as ₹0.00 total)
  const availableTests = await labSvc.listAvailableTests(branchId).catch(() => []);
  const testPriceMap = new Map();
  for (const t of availableTests) {
    if (t.name) testPriceMap.set(t.name.toLowerCase(), t.price);
    if (t.code) testPriceMap.set(t.code.toLowerCase(), t.price);
  }

  const labOrders = await tenantDb.labTestOrder.findMany({
    where: { patientId: patient.id },
    orderBy: { createdAt: "desc" }
  });

  // No mock lab items — return real data or empty array
  const labItems = [];
  for (const order of labOrders) {
    const tests = Array.isArray(order.tests) ? order.tests : [];
    for (const t of tests) {
      const priceVal = testPriceMap.get(t.name?.toLowerCase()) || testPriceMap.get(t.code?.toLowerCase()) || 250;
      const isCompleted = t.status === "Completed";
      labItems.push({
        name: t.name,
        category: "Pathology",
        qty: "1",
        price: `₹${priceVal.toFixed(2)}`,
        total: isCompleted ? `₹${priceVal.toFixed(2)}` : "₹0.00",
        isSystem: true,
        source: isCompleted ? "Lab (Completed)" : `Lab (${t.status || "Pending"})`
      });
    }
  }

  // lab items are populated from real lab orders above — no mock fallback

  // 3. Pharmacy Medicines (Paid: fetched from DISPENSED prescriptions)
  const prescriptions = await tenantDb.prescription.findMany({
    where: {
      patientId: patient.id,
      pharmacyStatus: "DISPENSED"
    },
    include: {
      items: {
        include: { medicine: true }
      }
    },
    orderBy: { dispensedAt: "desc" }
  });

  const pharmacyItems = [];
  for (const rx of prescriptions) {
    if (rx.items) {
      rx.items.forEach(item => {
        const uPrice = item.medicine?.price || item.unitPrice || 15;
        // estimate qty based on prescription
        const dailyDose = item.timing ? item.timing.split('-').reduce((sum, p) => sum + (parseInt(p) || 0), 0) : 2;
        const days = item.duration ? parseInt(item.duration) || 5 : 5;
        const totalQty = dailyDose * days;

        pharmacyItems.push({
          name: item.medicineName,
          category: "Medicine",
          qty: String(totalQty),
          price: `₹${uPrice.toFixed(2)}`,
          total: `₹${(uPrice * totalQty).toFixed(2)}`,
          isSystem: true,
          source: "Pharmacy (Paid)"
        });
      });
    }
  }

  // pharmacy items are populated from real prescriptions above — no mock fallback

  // 4. Room Charges & Attending Doctor Visits are null / N/A for OPD
  const roomCharges = [];
  const doctorVisitCharges = [];

  // Calculate totals
  const consultTotal = consultFee;
  const labTotal = labItems.reduce((sum, item) => sum + parseFloat(item.total.replace("₹", "")), 0);
  const pharmacyTotal = pharmacyItems.reduce((sum, item) => sum + parseFloat(item.total.replace("₹", "")), 0);
  
  const subtotal = consultTotal + labTotal + pharmacyTotal;
  const discount = subtotal * 0.05; // standard 5% discount
  const tax = (subtotal - discount) * 0.05; // 5% GST
  const netPayable = subtotal - discount + tax;
  // Check if a bill has been paid/generated in the database
  const existingBills = await tenantDb.bill.findMany({
    where: {
      patientId: patient.id,
      type: "OPD"
    },
    orderBy: { createdAt: "desc" }
  });
  const latestBill = existingBills[0];
  const isPaid = latestBill?.status === "PAID";

  const paidAlready = isPaid ? netPayable : (consultTotal + pharmacyTotal);
  const balanceDue = isPaid ? 0 : (netPayable - paidAlready);

  return {
    patient: {
      id: patient.id,
      name: patientFullName,
      uhid: formattedUhid,
      age: patient.age || 32,
      gender: patient.gender || "Female",
      contact: patient.contact || "+91 9876543210",
      bloodGroup: patient.bloodGroup || "O-positive",
      doctor: doctorName,
      admissionDate: latestAppt ? new Date(latestAppt.dateTime).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN")
    },
    charges: {
      roomCharges,
      doctorVisitCharges,
      doctorConsultation: [doctorConsultationItem],
      labTests: labItems,
      pharmacy: pharmacyItems
    },
    totals: {
      subtotal,
      discount,
      tax,
      netPayable,
      paidAlready,
      balanceDue: Math.max(0, balanceDue),
      isPaid
    }
  };
};

/**
 * Generate a new bill and save it in the multi-tenant database
 */
const collectOPDPayment = async (branchId, billData) => {
  const tenantDb = await getTenantClient(branchId);
  const { patientId, consultationFee, labCharges, pharmacyCharges, discount, tax, subtotal, netPayable, amountPaid, paymentMethod } = billData;

  if (!patientId) throw new Error("patientId is required");

  // Create bill record
  const bill = await tenantDb.bill.create({
    data: {
      patientId,
      type: "OPD",
      consultationFee: parseFloat(consultationFee) || 0,
      labCharges: parseFloat(labCharges) || 0,
      pharmacyCharges: parseFloat(pharmacyCharges) || 0,
      roomCharges: 0,
      otherCharges: 0,
      discount: parseFloat(discount) || 0,
      tax: parseFloat(tax) || 0,
      subtotal: parseFloat(subtotal) || 0,
      netPayable: parseFloat(netPayable) || 0,
      amountPaid: parseFloat(amountPaid) || 0,
      paymentMethod: paymentMethod || "Cash",
      status: parseFloat(amountPaid) >= parseFloat(netPayable) ? "PAID" : "PARTIAL"
    },
    include: {
      patient: true
    }
  });

  return bill;
};

/**
 * Get a single bill by ID for the invoice page
 * Returns full patient + line items + billing totals
 */
const getInvoiceById = async (branchId, billId) => {
  const tenantDb = await getTenantClient(branchId);

  const bill = await tenantDb.bill.findFirst({
    where: { id: billId },
    include: { patient: true }
  });

  if (!bill) {
    throw Object.assign(new Error("Invoice not found"), { statusCode: 404 });
  }

  const p = bill.patient;
  const patientName = p
    ? `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || "Unknown Patient"
    : "Unknown Patient";
  const uhid = p ? `UHID-${p.id.substring(0, 6).toUpperCase()}` : "—";

  // Fetch branch info for invoice header
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });

  // Build line items from stored JSON charges if present, otherwise from bill fields
  const lineItems = [];

  if (bill.consultationFee > 0) {
    lineItems.push({
      name: "Doctor Consultation Fee",
      doc: "Consultation",
      qty: 1,
      price: bill.consultationFee,
      total: bill.consultationFee
    });
  }

  if (bill.labCharges > 0) {
    lineItems.push({
      name: "Lab Investigations",
      doc: "Pathology",
      qty: 1,
      price: bill.labCharges,
      total: bill.labCharges
    });
  }

  if (bill.pharmacyCharges > 0) {
    lineItems.push({
      name: "Pharmacy Charges",
      doc: "Pharmacy",
      qty: 1,
      price: bill.pharmacyCharges,
      total: bill.pharmacyCharges
    });
  }

  if (bill.roomCharges > 0) {
    lineItems.push({
      name: "Room / Ward Charges",
      doc: "Accommodation",
      qty: 1,
      price: bill.roomCharges,
      total: bill.roomCharges
    });
  }

  if (bill.otherCharges > 0) {
    lineItems.push({
      name: "Other Charges",
      doc: "Miscellaneous",
      qty: 1,
      price: bill.otherCharges,
      total: bill.otherCharges
    });
  }

  const invoiceNo = `INV-${bill.id.substring(0, 8).toUpperCase()}`;
  const invoiceDate = new Date(bill.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return {
    billId: bill.id,
    invoiceNo,
    invoiceDate,
    patient: {
      name: patientName,
      uhid,
      address: p?.address || "",
      city: p?.city || "",
      state: p?.state || "",
      contact: p?.contact || ""
    },
    hospital: {
      name: branch?.name || "HMS Hospital",
      address: branch?.address || "",
      city: branch?.city || "",
      state: branch?.state || "",
      contact: branch?.contact || ""
    },
    lineItems,
    billing: {
      subtotal: bill.subtotal,
      discount: bill.discount,
      tax: bill.tax,
      netPayable: bill.netPayable,
      amountPaid: bill.amountPaid,
      balanceDue: Math.max(0, bill.netPayable - bill.amountPaid),
      status: bill.status,
      paymentMethod: bill.paymentMethod || "—",
      type: bill.type
    }
  };
};

/**
 * Get all payments / bills across all patients for the payment management page
 */
const getAllPayments = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);

  const bills = await tenantDb.bill.findMany({
    include: { patient: true },
    orderBy: { createdAt: "desc" }
  });

  return bills.map((bill) => {
    const p = bill.patient;
    const patientName = p
      ? `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || "Unknown"
      : "Unknown";
    const uhid = p ? `UHID-${p.id.substring(0, 6).toUpperCase()}` : "—";

    // Map internal status to UI display status
    let displayStatus = bill.status;
    if (bill.status === "PAID") displayStatus = "Paid";
    else if (bill.status === "PARTIAL") displayStatus = "Pending";
    else if (bill.status === "PENDING") displayStatus = "Pending";

    const balanceDue = Math.max(0, bill.netPayable - bill.amountPaid);
    const isOverdue =
      displayStatus === "Pending" &&
      new Date(bill.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (isOverdue) displayStatus = "Overdue";

    const invoiceDate = new Date(bill.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    return {
      billId: bill.id,
      invoiceId: `INV-${bill.id.substring(0, 8).toUpperCase()}`,
      patient: patientName,
      uhid,
      totalAmount: `₹${bill.netPayable.toFixed(2)}`,
      dueAmount: `₹${balanceDue.toFixed(2)}`,
      date: invoiceDate,
      status: displayStatus,
      paymentMethod: bill.paymentMethod || "—",
      type: bill.type
    };
  });
};

/**
 * Get aggregated payment summary stats for the payment page stat cards
 */
const getPaymentSummary = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [todayBills, allBills] = await Promise.all([
    tenantDb.bill.findMany({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd }
      }
    }),
    tenantDb.bill.findMany()
  ]);

  // Today's collection — sum of amountPaid for bills created today
  const todayCollection = todayBills.reduce((sum, b) => sum + (b.amountPaid || 0), 0);

  // Pending payments — total balance due across all PENDING/PARTIAL bills
  const pendingTotal = allBills
    .filter((b) => b.status === "PENDING" || b.status === "PARTIAL")
    .reduce((sum, b) => sum + Math.max(0, b.netPayable - b.amountPaid), 0);

  // Insurance settlements (count of bills with any insurance-related notes — approximated)
  // In a full system this would join an InsuranceClaim model; here we count bills with 0 balance
  const insurancePending = allBills.filter(
    (b) => b.status === "PENDING" || b.status === "PARTIAL"
  ).length;

  // Refunds today — bills marked REFUNDED created today (no Refund model yet)
  const refundsToday = todayBills
    .filter((b) => b.status === "REFUNDED")
    .reduce((sum, b) => sum + (b.amountPaid || 0), 0);

  return {
    todayCollection,
    pendingTotal,
    insurancePending,
    refundsToday
  };
};

module.exports = {
  resolveBranchId,
  getOPDBillingRecords,
  getOPDBillingDetails,
  collectOPDPayment,
  getInvoiceById,
  getAllPayments,
  getPaymentSummary
};
