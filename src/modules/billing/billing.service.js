const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");
const labSvc = require("../laboratory/laboratory.service");

const resolveBranchId = async (branchId) => {
  // 1. If a specific branchId was provided, verify it is initialized
  if (branchId) {
    const b = await prisma.branch.findUnique({ where: { id: branchId } });
    if (b && b.isDbInitialized) return branchId;
  }

  // 2. Fall back to any initialized branch (covers SUPERADMIN who has no branchId)
  const first = await prisma.branch.findFirst({
    where: { isDbInitialized: true },
    orderBy: { createdAt: "asc" }
  });
  if (first) return first.id;

  // 3. Nothing initialized — return null so callers can surface a clear error
  return null;
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

/**
 * Get all active IPD (in-patient) admissions with billing summary
 * Source: admission records joined with bill records from tenant DB
 *
 * Returned fields per row:
 *   admissionId  — real UUID, used for the View button href
 *   patientId    — real UUID
 *   uhid         — "UHID-XXXXXX" derived from patient.id
 *   patient      — full name
 *   admissionDate— formatted locale date string
 *   room         — "WardName / BedLabel"
 *   doctor       — doctor name or "—"
 *   totalBill    — "₹X.XX" net payable from IPD bill, or "₹0.00" if no bill yet
 *   advancePaid  — "₹X.XX" amount already paid
 *   balanceDue   — "₹X.XX" outstanding amount
 *   status       — "Active" | "Discharged" | "Pending"
 *   billId       — bill UUID if one exists, null otherwise
 */
const getIPDBillingRecords = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);

  // Fetch all admissions with full relations in one query
  const admissions = await tenantDb.admission.findMany({
    include: {
      patient: true,
      ward:    true,
      bed:     true,
      doctor:  true
    },
    orderBy: { admissionDate: "desc" }
  });

  if (admissions.length === 0) return [];

  // Fetch all IPD bills, build a map patientId → most recent IPD bill (O(1) lookup)
  const ipdBills = await tenantDb.bill.findMany({
    where:   { type: "IPD" },
    orderBy: { createdAt: "desc" }
  });

  const billByPatient = new Map();
  for (const bill of ipdBills) {
    if (!billByPatient.has(bill.patientId)) {
      billByPatient.set(bill.patientId, bill);
    }
  }

  const fmt = (n) => `₹${Number(n || 0).toFixed(2)}`;

  return admissions.map((admission) => {
    const p   = admission.patient;
    const ward = admission.ward;
    const bed  = admission.bed;
    const doc  = admission.doctor;

    const patientName = p
      ? `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || "Unknown Patient"
      : "Unknown Patient";

    const uhid = p ? `UHID-${p.id.substring(0, 6).toUpperCase()}` : "—";

    const room =
      ward && bed ? `${ward.name} / ${bed.label}`
      : ward      ? ward.name
      :             "—";

    const doctorName = doc?.name || "—";

    const admissionDate = new Date(admission.admissionDate).toLocaleDateString("en-IN", {
      day:    "2-digit",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit"
    });

    // Billing figures from the linked IPD bill (if any)
    const bill        = billByPatient.get(p?.id) || null;
    const totalBill   = bill ? bill.netPayable                           : 0;
    const advancePaid = bill ? bill.amountPaid                           : 0;
    const balanceDue  = bill ? Math.max(0, bill.netPayable - bill.amountPaid) : 0;

    // Map admission.status → UI display value
    let status = "Pending";
    if (admission.status === "In Progress") status = "Active";
    else if (admission.status === "Completed") status = "Discharged";

    return {
      admissionId:  admission.id,
      patientId:    p?.id || "—",
      uhid,
      patient:      patientName,
      admissionDate,
      room,
      doctor:       doctorName,
      totalBill:    fmt(totalBill),
      advancePaid:  fmt(advancePaid),
      balanceDue:   fmt(balanceDue),
      status,
      billId:       bill?.id || null
    };
  });
};

/**
 * GET /api/billing/ipd-details/:admissionId
 *
 * Returns full IPD billing detail for a single admission.
 * All charges are sourced from real tenant DB relations:
 *   - Room charges  → admission.ward + bed + days occupied
 *   - Doctor visits → consultations linked to patient during this admission
 *   - Lab tests     → labTestOrders for the patient
 *   - Pharmacy      → DISPENSED prescriptions for the patient
 *   - Totals        → derived from the above + any existing IPD bill record
 */
const getIPDBillingDetails = async (branchId, admissionId) => {
  const tenantDb = await getTenantClient(branchId);

  // ── 1. Load admission with all relations ──────────────────────────────────
  const admission = await tenantDb.admission.findUnique({
    where: { id: admissionId },
    include: {
      patient:    true,
      ward:       true,
      bed:        true,
      doctor:     true,
      department: true
    }
  });

  if (!admission) {
    throw Object.assign(new Error("Admission not found"), { statusCode: 404 });
  }

  const p    = admission.patient;
  const ward = admission.ward;
  const bed  = admission.bed;
  const doc  = admission.doctor;

  if (!p) {
    throw Object.assign(new Error("Patient data missing for this admission"), { statusCode: 404 });
  }

  // ── 2. Patient & admission meta ───────────────────────────────────────────
  const patientName = `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || "Unknown Patient";
  const uhid        = `UHID-${p.id.substring(0, 6).toUpperCase()}`;
  const roomLabel   = ward && bed ? `${ward.name} / ${bed.label}` : ward ? ward.name : "—";
  const doctorName  = doc?.name || "—";

  const admissionDateObj = new Date(admission.admissionDate);
  const admissionDate    = admissionDateObj.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });

  // Days admitted (used for room charge calculation)
  const dischargeDate = admission.dischargeDate ? new Date(admission.dischargeDate) : new Date();
  const daysAdmitted  = Math.max(
    1,
    Math.ceil((dischargeDate - admissionDateObj) / (1000 * 60 * 60 * 24))
  );

  // Map admission.status → UI label
  let admissionStatus = "Pending";
  if (admission.status === "In Progress") admissionStatus = "Active";
  else if (admission.status === "Completed") admissionStatus = "Discharged";

  // ── 3. Room charges ───────────────────────────────────────────────────────
  // Standard ward rate: ₹500/day (default; no rate table in schema yet)
  const WARD_RATE_PER_DAY = 500;
  const roomTotal = daysAdmitted * WARD_RATE_PER_DAY;

  const fromDate  = admissionDateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  const toDate    = dischargeDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  const roomCharges = ward ? [
    {
      name:     `${ward.name} — ${bed?.label || "Bed"} (${fromDate} – ${toDate})`,
      category: "Accommodation",
      qty:      daysAdmitted,
      price:    WARD_RATE_PER_DAY,
      total:    roomTotal,
      source:   "System"
    }
  ] : [];

  // ── 4. Doctor visits / consultations ─────────────────────────────────────
  const consultations = await tenantDb.consultation.findMany({
    where: { patientId: p.id },
    orderBy: { createdAt: "asc" }
  });

  const doctorVisitCharges = [];
  const VISIT_FEE = 200; // default fee per visit

  if (consultations.length > 0) {
    // First consultation = Initial
    doctorVisitCharges.push({
      name:     "Initial Consultation",
      category: "Consultation",
      qty:      1,
      price:    VISIT_FEE * 1.5,   // first visit premium
      total:    VISIT_FEE * 1.5,
      source:   "IPD"
    });
    // Subsequent = Follow-ups
    const followUps = consultations.length - 1;
    if (followUps > 0) {
      doctorVisitCharges.push({
        name:     "Follow-up Visit",
        category: "Consultation",
        qty:      followUps,
        price:    VISIT_FEE,
        total:    VISIT_FEE * followUps,
        source:   "IPD"
      });
    }
  } else if (doctorName !== "—") {
    // No consultation records but doctor assigned → show 1 initial visit
    doctorVisitCharges.push({
      name:     "Initial Consultation",
      category: "Consultation",
      qty:      1,
      price:    VISIT_FEE * 1.5,
      total:    VISIT_FEE * 1.5,
      source:   "IPD"
    });
  }

  // Diagnosis from most recent consultation
  const latestConsultation = consultations[consultations.length - 1] || null;
  const diagnosis = latestConsultation?.finalDiagnosis
    || latestConsultation?.provisionalDiagnosis
    || admission.reason
    || "—";

  // ── 5. Lab tests ──────────────────────────────────────────────────────────
  const availableTests = await labSvc.listAvailableTests(branchId).catch(() => []);
  const testPriceMap   = new Map();
  for (const t of availableTests) {
    if (t.name) testPriceMap.set(t.name.toLowerCase(), t.price);
    if (t.code) testPriceMap.set(t.code.toLowerCase(), t.price);
  }

  const labOrders = await tenantDb.labTestOrder.findMany({
    where:   { patientId: p.id },
    orderBy: { createdAt: "asc" }
  });

  const labCharges = [];
  for (const order of labOrders) {
    const tests = Array.isArray(order.tests) ? order.tests : [];
    for (const t of tests) {
      const priceVal   = testPriceMap.get(t.name?.toLowerCase())
                      || testPriceMap.get(t.code?.toLowerCase())
                      || 250;
      const isComplete = t.status === "Completed";
      labCharges.push({
        name:     t.name || "Lab Test",
        category: "Pathology",
        qty:      1,
        price:    priceVal,
        total:    isComplete ? priceVal : 0,
        source:   isComplete ? "Lab (Completed)" : `Lab (${t.status || "Pending"})`
      });
    }
  }

  // ── 6. Pharmacy ───────────────────────────────────────────────────────────
  const prescriptions = await tenantDb.prescription.findMany({
    where:   { patientId: p.id, pharmacyStatus: "DISPENSED" },
    include: { items: { include: { medicine: true } } },
    orderBy: { dispensedAt: "desc" }
  });

  const pharmacyCharges = [];
  for (const rx of prescriptions) {
    for (const item of rx.items || []) {
      const uPrice    = item.medicine?.price ?? 15;
      const dailyDose = item.timing
        ? item.timing.split("-").reduce((s, x) => s + (parseInt(x) || 0), 0)
        : 2;
      const days    = parseInt(item.duration) || 5;
      const qty     = Math.max(1, dailyDose * days);

      pharmacyCharges.push({
        name:     item.medicineName,
        category: "Medicine",
        qty,
        price:    uPrice,
        total:    uPrice * qty,
        source:   "Pharmacy"
      });
    }
  }

  // ── 7. Billing totals ─────────────────────────────────────────────────────
  const sumItems   = (arr) => arr.reduce((s, i) => s + (i.total || 0), 0);

  const roomTotal2    = sumItems(roomCharges);
  const visitTotal    = sumItems(doctorVisitCharges);
  const labTotal      = sumItems(labCharges);
  const pharmacyTotal = sumItems(pharmacyCharges);
  const subtotal      = roomTotal2 + visitTotal + labTotal + pharmacyTotal;

  // Check for an existing IPD bill for this patient
  const ipdBill = await tenantDb.bill.findFirst({
    where:   { patientId: p.id, type: "IPD" },
    orderBy: { createdAt: "desc" }
  });

  // If a bill exists, use its stored figures; otherwise derive from charges
  const discount           = ipdBill ? ipdBill.discount           : subtotal * 0.05;
  const insuranceCovered   = 0;   // No InsuranceClaim model yet — placeholder
  const netPayable         = ipdBill
    ? ipdBill.netPayable
    : Math.max(0, subtotal - discount - insuranceCovered);
  const advancePaid        = ipdBill ? ipdBill.amountPaid          : 0;
  const balanceDue         = Math.max(0, netPayable - advancePaid);

  const billId = ipdBill?.id || null;

  // ── 8. Assemble response ──────────────────────────────────────────────────
  return {
    admissionId:  admission.id,
    admissionStatus,
    patient: {
      id:          p.id,
      name:        patientName,
      uhid,
      age:         p.age    || null,
      gender:      p.gender || null,
      contact:     p.contact || null,
      bloodGroup:  p.bloodGroup || null,
      address:     p.address || null
    },
    admission: {
      admissionDate,
      dischargeDate: admission.dischargeDate
        ? new Date(admission.dischargeDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : null,
      daysAdmitted,
      ward:       ward?.name || "—",
      bed:        bed?.label || "—",
      room:       roomLabel,
      department: admission.department?.name || "—",
      doctor:     doctorName,
      diagnosis
    },
    insurance: {
      // No InsuranceClaim model yet — return nulls so UI shows "Not Available"
      name:     null,
      provider: null,
      policyNo: null,
      status:   null,
      covered:  insuranceCovered
    },
    charges: {
      roomCharges,
      doctorVisitCharges,
      labCharges,
      pharmacyCharges
    },
    totals: {
      subtotal,
      discount,
      insuranceCovered,
      netPayable,
      advancePaid,
      balanceDue,
      billId
    }
  };
};

module.exports = {
  resolveBranchId,
  getOPDBillingRecords,
  getOPDBillingDetails,
  collectOPDPayment,
  getInvoiceById,
  getAllPayments,
  getPaymentSummary,
  getIPDBillingRecords,
  getIPDBillingDetails
};

/**
 * GET /api/billing/service-catalog
 *
 * Returns all billable services the finance team can select when creating a bill.
 * Sources (in priority order):
 *   1. Lab available tests  → category "Lab Test"
 *   2. Pharmacy items       → category "Medicine"
 *   3. Hard-coded standard  → Consultation, Room, Nursing (always available)
 */
const getServiceCatalog = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);

  const catalog = [];

  // ── Standard clinical services (always available) ─────────────────────────
  const STANDARD = [
    { id: "std-consult",   name: "Doctor Consultation",       category: "Consultation",  price: 300,  unit: "visit" },
    { id: "std-followup",  name: "Follow-up Visit",           category: "Consultation",  price: 200,  unit: "visit" },
    { id: "std-room-gen",  name: "General Ward",              category: "Accommodation", price: 500,  unit: "day"   },
    { id: "std-room-priv", name: "Private Room",              category: "Accommodation", price: 1500, unit: "day"   },
    { id: "std-room-icu",  name: "ICU Bed",                   category: "Accommodation", price: 3000, unit: "day"   },
    { id: "std-nursing",   name: "Nursing Charges",           category: "Nursing",       price: 200,  unit: "day"   },
    { id: "std-emg",       name: "Emergency Consultation",    category: "Emergency",     price: 500,  unit: "visit" },
    { id: "std-proc",      name: "Minor Procedure",           category: "Procedure",     price: 800,  unit: "each"  },
    { id: "std-xray",      name: "X-Ray",                     category: "Radiology",     price: 350,  unit: "each"  },
    { id: "std-ecg",       name: "ECG",                       category: "Diagnostics",   price: 200,  unit: "each"  },
    { id: "std-echo",      name: "Echocardiography",          category: "Diagnostics",   price: 1200, unit: "each"  },
    { id: "std-physio",    name: "Physiotherapy Session",     category: "Therapy",       price: 400,  unit: "session"},
  ];
  catalog.push(...STANDARD);

  // ── Lab tests from tenant DB ───────────────────────────────────────────────
  const labTests = await labSvc.listAvailableTests(branchId).catch(() => []);
  for (const t of labTests) {
    catalog.push({
      id:       `lab-${t.id || t.code || t.name}`,
      name:     t.name,
      category: "Lab Test",
      price:    t.price || 250,
      unit:     "test"
    });
  }

  // ── Pharmacy items from tenant DB ──────────────────────────────────────────
  const medicines = await tenantDb.pharmacyItem.findMany({
    where:   { status: { not: "OUT OF STOCK" } },
    orderBy: { medicineName: "asc" },
    take:    100
  });
  for (const m of medicines) {
    catalog.push({
      id:       `med-${m.id}`,
      name:     m.medicineName,
      category: "Medicine",
      price:    0,   // medicine prices stored in stock items, not here
      unit:     "strip"
    });
  }

  return catalog;
};

/**
 * POST /api/billing/create
 *
 * Creates a new Bill record (OPD or IPD) in the tenant database.
 * Body shape:
 *   patientId      string   (required)
 *   type           "OPD" | "IPD"
 *   items          Array<{ name, category, qty, price, total, source }>
 *   discount       number  (flat amount)
 *   tax            number  (flat amount)
 *   paymentMethod  string
 *   amountPaid     number
 *   notes          string  (optional)
 */
const createBill = async (branchId, body) => {
  const tenantDb = await getTenantClient(branchId);

  const {
    patientId,
    type = "OPD",
    items = [],
    discount = 0,
    tax = 0,
    paymentMethod = "Cash",
    amountPaid = 0,
    notes
  } = body;

  if (!patientId) throw Object.assign(new Error("patientId is required"), { statusCode: 400 });
  if (!items.length) throw Object.assign(new Error("At least one charge item is required"), { statusCode: 400 });

  // Verify patient exists
  const patient = await tenantDb.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw Object.assign(new Error("Patient not found"), { statusCode: 404 });

  // Aggregate charge buckets from items
  const parseNum = (v) => parseFloat(String(v).replace(/[^\d.]/g, "")) || 0;

  let consultationFee = 0;
  let labCharges = 0;
  let pharmacyCharges = 0;
  let roomCharges = 0;
  let otherCharges = 0;

  for (const item of items) {
    const total = parseNum(item.total) || parseNum(item.price) * (parseInt(item.qty) || 1);
    const cat = (item.category || "").toLowerCase();

    if (cat.includes("consultation") || cat.includes("emergency") || cat.includes("visit")) {
      consultationFee += total;
    } else if (cat.includes("lab") || cat.includes("pathology") || cat.includes("diagnostic") || cat.includes("radiology")) {
      labCharges += total;
    } else if (cat.includes("medicine") || cat.includes("pharmacy")) {
      pharmacyCharges += total;
    } else if (cat.includes("accommodation") || cat.includes("room") || cat.includes("ward") || cat.includes("nursing")) {
      roomCharges += total;
    } else {
      otherCharges += total;
    }
  }

  const subtotal  = consultationFee + labCharges + pharmacyCharges + roomCharges + otherCharges;
  const discountN = parseNum(discount);
  const taxN      = parseNum(tax);
  const netPayable = Math.max(0, subtotal - discountN + taxN);
  const amountPaidN = parseNum(amountPaid);

  let status = "UNPAID";
  if (amountPaidN >= netPayable) status = "PAID";
  else if (amountPaidN > 0)      status = "PARTIAL";

  const bill = await tenantDb.bill.create({
    data: {
      patientId,
      type:            type.toUpperCase() === "IPD" ? "IPD" : "OPD",
      consultationFee,
      labCharges,
      pharmacyCharges,
      roomCharges,
      otherCharges,
      discount:        discountN,
      tax:             taxN,
      subtotal,
      netPayable,
      amountPaid:      amountPaidN,
      paymentMethod,
      status
    },
    include: { patient: true }
  });

  const invoiceNo = `INV-${bill.id.substring(0, 8).toUpperCase()}`;

  return {
    billId:    bill.id,
    invoiceNo,
    patientId: bill.patientId,
    patient: {
      name: `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || patient.name || "Unknown",
      uhid: `UHID-${patient.id.substring(0, 6).toUpperCase()}`
    },
    type:         bill.type,
    subtotal:     bill.subtotal,
    discount:     bill.discount,
    tax:          bill.tax,
    netPayable:   bill.netPayable,
    amountPaid:   bill.amountPaid,
    balanceDue:   Math.max(0, bill.netPayable - bill.amountPaid),
    status:       bill.status,
    paymentMethod: bill.paymentMethod,
    createdAt:    bill.createdAt
  };
};
