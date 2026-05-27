const crypto = require("crypto");
const { getTenantClient } = require("../../database/tenant-manager");
const { resolveBranchId } = require("../doctor-opd/doctor-opd.service");
const prisma = require("../../database/prisma");

const STATUSES = ["Pending", "Collecting", "Processing", "Completed"];
const PRIORITIES = ["Normal", "High", "Urgent"];

const normalizePriority = (priority) => {
  const value = String(priority || "Normal").trim();
  if (value.toLowerCase() === "urgant") return "Urgent";
  return PRIORITIES.find((p) => p.toLowerCase() === value.toLowerCase()) || "Normal";
};

const normalizeTests = (labTests = [], existingTests = []) => {
  const existingByName = new Map(
    existingTests.map((test) => [String(test.name || test).toLowerCase(), test])
  );

  return labTests
    .map((test) => {
      const name = typeof test === "string" ? test : test?.name;
      if (!name || !String(name).trim()) return null;
      const cleanName = String(name).trim();
      const existing = existingByName.get(cleanName.toLowerCase());
      return {
        id: existing?.id || crypto.randomUUID(),
        name: cleanName,
        code: (typeof test === "object" && test?.code) || existing?.code || cleanName.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 18),
        status: STATUSES.includes(existing?.status) ? existing.status : "Pending",
        timeline: Array.isArray(existing?.timeline) ? existing.timeline : [
          { status: "Pending", at: new Date().toISOString(), note: "Order placed by doctor" }
        ],
      };
    })
    .filter(Boolean);
};

const aggregateStatus = (tests) => {
  if (!tests.length) return "Pending";
  if (tests.every((test) => test.status === "Completed")) return "Completed";
  if (tests.some((test) => test.status === "Processing")) return "Processing";
  if (tests.some((test) => test.status === "Collecting")) return "Collecting";
  return "Pending";
};

const buildOrderNumber = () => {
  const stamp = Date.now().toString().slice(-6);
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `LAB-${stamp}${suffix}`;
};

const getLabOrderFields = (tenantDb) => {
  const fields = tenantDb?._runtimeDataModel?.models?.LabTestOrder?.fields || [];
  return new Set(fields.map((field) => field.name));
};

const hasField = (fields, name) => fields.size === 0 || fields.has(name);

const normalizePatientForSearch = (patient) => ({
  id: patient.id,
  name: patient.name || [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "Patient",
  uhid: `UHID-${patient.id.slice(0, 8).toUpperCase()}`,
  age: patient.age,
  gender: patient.gender,
  phone: patient.contact,
  email: patient.email,
  address: patient.address,
});

const searchPatients = async (branchId, search = "") => {
  const tenantDb = await getTenantClient(branchId);
  const q = String(search || "").trim();
  const where = q
    ? {
        OR: [
          { id: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { contact: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const patients = await tenantDb.patient.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return patients.map(normalizePatientForSearch);
};

const valueFromRecord = (data, keys) => {
  for (const key of keys) {
    const value = data?.[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return "";
};

const normalizeLabProfileRecord = (record) => {
  const data = record.data || {};
  const code = valueFromRecord(data, ["l1", "testCode", "Test Code", "code"]);
  const name = valueFromRecord(data, ["l2", "testName", "Test Name", "name"]);
  const category = valueFromRecord(data, ["category", "Category", "department"]) || "Laboratory";
  const price = Number(valueFromRecord(data, ["price", "Price", "amount", "Amount", "rate", "Rate"])) || 0;
  if (!name && !code) return null;
  return {
    id: record.id,
    name: name || code,
    code: code || (name || "LAB").toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 18),
    category,
    price,
  };
};

const listAvailableTests = async (branchId, search = "") => {
  const q = String(search || "").trim().toLowerCase();
  const assignedLabProfile = await prisma.branchAssignment.findFirst({
    where: {
      branchId,
      masterData: {
        OR: [
          { code: { equals: "LAB_PROFILES", mode: "insensitive" } },
          { name: { contains: "Laboratory", mode: "insensitive" } },
        ],
      },
    },
    include: {
      masterData: {
        include: {
          records: {
            orderBy: { createdAt: "desc" },
            take: 200,
          },
        },
      },
    },
  });

  const labProfile = assignedLabProfile?.masterData || await prisma.masterData.findFirst({
    where: {
      OR: [
        { code: { equals: "LAB_PROFILES", mode: "insensitive" } },
        { name: { contains: "Laboratory", mode: "insensitive" } },
      ],
    },
    include: {
      records: {
        orderBy: { createdAt: "desc" },
        take: 200,
      },
    },
  });

  const masterTests = (labProfile?.records || [])
    .map(normalizeLabProfileRecord)
    .filter(Boolean);

  if (masterTests.length > 0) {
    return masterTests.filter((test) => (
      !q ||
      test.name.toLowerCase().includes(q) ||
      test.code.toLowerCase().includes(q) ||
      test.category.toLowerCase().includes(q)
    ));
  }

  const tenantDb = await getTenantClient(branchId);
  const orders = await tenantDb.labTestOrder.findMany({
    select: { tests: true },
    take: 200,
    orderBy: { createdAt: "desc" },
  });
  const byCode = new Map();
  for (const order of orders) {
    for (const test of Array.isArray(order.tests) ? order.tests : []) {
      const name = test?.name;
      if (!name) continue;
      const code = test.code || name.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 18);
      if (!byCode.has(code)) {
        byCode.set(code, { id: code, name, code, category: "Previous Orders", price: 0 });
      }
    }
  }

  return Array.from(byCode.values()).filter((test) => (
    !q ||
    test.name.toLowerCase().includes(q) ||
    test.code.toLowerCase().includes(q) ||
    test.category.toLowerCase().includes(q)
  ));
};

const getClinicalOptions = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  const [doctors, departments] = await Promise.all([
    tenantDb.tenantUser.findMany({
      where: {
        OR: [
          { role: "DOCTOR" },
          { consoleRoles: { array_contains: "DOCTOR" } },
        ],
      },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
      take: 100,
    }).catch(() => []),
    tenantDb.department.findMany({
      where: { active: true },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
      take: 100,
    }).catch(() => []),
  ]);

  return {
    doctors: doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.name || doctor.email || "Doctor",
      email: doctor.email,
    })),
    departments,
  };
};

const upsertOrderFromConsultation = async (branchId, consultation, appointment, data = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const fields = getLabOrderFields(tenantDb);
  const tests = Array.isArray(data.labTests) ? data.labTests : [];

  const existing = consultation.id
    ? await tenantDb.labTestOrder.findUnique({ where: { consultationId: consultation.id } }).catch(() => null)
    : null;

  if (tests.length === 0) {
    if (existing && existing.status === "Pending") {
      await tenantDb.labTestOrder.delete({ where: { id: existing.id } });
    }
    return null;
  }

  const normalizedTests = normalizeTests(tests, Array.isArray(existing?.tests) ? existing.tests : []);
  const orderData = {
    patientId: consultation.patientId,
    consultationId: consultation.id,
    doctorId: consultation.doctorId,
    doctorName: consultation.doctorName,
    departmentName: appointment?.departmentName || null,
    priority: normalizePriority(data.labPriority || data.priority || existing?.priority),
    status: aggregateStatus(normalizedTests),
    tests: normalizedTests,
    clinicalNotes: data.chiefComplaints || data.clinicalHistory || null,
    completedAt: aggregateStatus(normalizedTests) === "Completed" ? new Date() : null,
  };
  if (!hasField(fields, "departmentName")) delete orderData.departmentName;
  if (!hasField(fields, "clinicalNotes")) delete orderData.clinicalNotes;
  if (!hasField(fields, "completedAt")) delete orderData.completedAt;

  if (existing) {
    return tenantDb.labTestOrder.update({
      where: { id: existing.id },
      data: orderData,
    });
  }

  const orderNumber = buildOrderNumber();
  const orderIdentifier = hasField(fields, "orderNumber")
    ? { orderNumber }
    : hasField(fields, "orderId")
      ? { orderId: orderNumber }
      : {};

  return tenantDb.labTestOrder.create({
    data: {
      id: crypto.randomUUID(),
      ...orderIdentifier,
      ...orderData,
    },
  });
};

const listOrders = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  const fields = getLabOrderFields(tenantDb);
  
  // Auto-seeder: seed initial patient data and lab test orders if empty
  const count = await tenantDb.labTestOrder.count();
  if (count === 0) {
    console.log("No lab orders found. Seeding initial lab orders for testing...");
    let patients = await tenantDb.patient.findMany({ take: 5 });
    if (patients.length === 0) {
      console.log("No patients found. Seeding initial patients first...");
      const mockPatientsData = [
        {
          id: crypto.randomUUID(),
          name: "Robert Fox",
          age: 45,
          gender: "Male",
          contact: "9876543210",
          email: "robert.fox@example.com",
          address: "123 Main St, Central City",
        },
        {
          id: crypto.randomUUID(),
          name: "Jane Cooper",
          age: 34,
          gender: "Female",
          contact: "9876543211",
          email: "jane.cooper@example.com",
          address: "456 Oak Ave, Central City",
        },
        {
          id: crypto.randomUUID(),
          name: "Albert Flores",
          age: 52,
          gender: "Male",
          contact: "9876543212",
          email: "albert.flores@example.com",
          address: "789 Pine Rd, Central City",
        },
        {
          id: crypto.randomUUID(),
          name: "Esther Howard",
          age: 29,
          gender: "Female",
          contact: "9876543213",
          email: "esther.howard@example.com",
          address: "321 Maple Dr, Central City",
        }
      ];

      for (const p of mockPatientsData) {
        await tenantDb.patient.create({ data: p }).catch(e => console.error("Error seeding patient:", e));
      }
      patients = await tenantDb.patient.findMany({ take: 5 });
    }

    const mockOrders = [
      {
        patientId: patients[0]?.id,
        tests: [
          { id: crypto.randomUUID(), name: "Complete Blood Count (CBC)", code: "CBC", status: "Pending" },
          { id: crypto.randomUUID(), name: "Lipid Profile", code: "LIPID", status: "Pending" },
          { id: crypto.randomUUID(), name: "Liver Function Test (LFT)", code: "LFT", status: "Pending" }
        ],
        priority: "Urgent",
        status: "Pending"
      },
      {
        patientId: patients[1]?.id || patients[0]?.id,
        tests: [
          { id: crypto.randomUUID(), name: "Thyroid Profile (T3, T4, TSH)", code: "THYROID", status: "Pending" },
          { id: crypto.randomUUID(), name: "HbA1c", code: "HBA1C", status: "Pending" }
        ],
        priority: "High",
        status: "Pending"
      },
      {
        patientId: patients[2]?.id || patients[0]?.id,
        tests: [
          { id: crypto.randomUUID(), name: "Urine Routine", code: "URINE", status: "Pending" },
          { id: crypto.randomUUID(), name: "Renal Function Test (RFT)", code: "RFT", status: "Pending" }
        ],
        priority: "Normal",
        status: "Pending"
      },
      {
        patientId: patients[3]?.id || patients[0]?.id,
        tests: [
          { id: crypto.randomUUID(), name: "D-Dimer", code: "DDIMER", status: "Pending" },
          { id: crypto.randomUUID(), name: "Troponin I", code: "TROPONIN", status: "Pending" }
        ],
        priority: "Urgent",
        status: "Pending"
      }
    ];

    for (const mo of mockOrders) {
      if (!mo.patientId) continue;
      const orderNumber = buildOrderNumber();
      const orderIdentifier = hasField(fields, "orderNumber")
        ? { orderNumber }
        : hasField(fields, "orderId")
          ? { orderId: orderNumber }
          : {};

      await tenantDb.labTestOrder.create({
        data: {
          id: crypto.randomUUID(),
          patientId: mo.patientId,
          tests: mo.tests,
          priority: mo.priority,
          status: mo.status,
          doctorName: "Laboratory",
          ...orderIdentifier
        }
      }).catch(e => console.error("Error seeding order:", e));
    }
  }

  const orderBy = [];
  if (hasField(fields, "orderedAt")) {
    orderBy.push({ orderedAt: "desc" });
  } else if (hasField(fields, "createdAt")) {
    orderBy.push({ createdAt: "desc" });
  }

  return tenantDb.labTestOrder.findMany({
    where: {
      tests: { not: [] },
    },
    include: {
      patient: true,
    },
    orderBy,
  });
};

const createOrder = async (branchId, data = {}, user = {}) => {
  const tenantDb = await getTenantClient(branchId);
  const fields = getLabOrderFields(tenantDb);
  const patient = await tenantDb.patient.findUnique({ where: { id: data.patientId } });
  if (!patient) throw new Error("Patient not found");

  const normalizedTests = normalizeTests(data.tests || data.labTests || []);
  if (normalizedTests.length === 0) throw new Error("At least one test is required");

  const orderNumber = buildOrderNumber();
  const orderIdentifier = hasField(fields, "orderNumber")
    ? { orderNumber }
    : hasField(fields, "orderId")
      ? { orderId: orderNumber }
      : {};

  const orderData = {
    id: crypto.randomUUID(),
    ...orderIdentifier,
    patientId: patient.id,
    doctorId: data.doctorId || user.id || null,
    doctorName: data.doctorName || user.name || "Laboratory",
    departmentName: data.departmentName || null,
    priority: normalizePriority(data.priority),
    status: aggregateStatus(normalizedTests),
    tests: normalizedTests,
    clinicalNotes: data.clinicalNotes || null,
  };

  if (!hasField(fields, "doctorId")) delete orderData.doctorId;
  if (!hasField(fields, "doctorName")) delete orderData.doctorName;
  if (!hasField(fields, "departmentName")) delete orderData.departmentName;
  if (!hasField(fields, "clinicalNotes")) delete orderData.clinicalNotes;

  return tenantDb.labTestOrder.create({
    data: orderData,
    include: {
      patient: true,
    },
  });
};

const getOrder = async (branchId, id) => {
  const tenantDb = await getTenantClient(branchId);
  const fields = getLabOrderFields(tenantDb);
  const OR = [{ id }];
  if (hasField(fields, "orderNumber")) OR.push({ orderNumber: id });
  if (hasField(fields, "orderId")) OR.push({ orderId: id });

  const order = await tenantDb.labTestOrder.findFirst({
    where: {
      OR,
    },
    include: {
      patient: true,
      consultation: true,
    },
  });
  if (!order) throw new Error("Lab test order not found");
  return order;
};

const updateTestStatus = async (branchId, orderId, testId) => {
  const tenantDb = await getTenantClient(branchId);
  const order = await getOrder(branchId, orderId);
  const tests = Array.isArray(order.tests) ? order.tests : [];
  const now = new Date().toISOString();
  let changed = false;

  const nextTests = tests.map((test) => {
    if (test.id !== testId && test.code !== testId && test.name !== testId) return test;
    const currentIndex = STATUSES.indexOf(test.status);
    if (currentIndex < 0 || test.status === "Completed") return test;
    const nextStatus = STATUSES[currentIndex + 1];
    changed = true;
    return {
      ...test,
      status: nextStatus,
      timeline: [
        ...(Array.isArray(test.timeline) ? test.timeline : []),
        { status: nextStatus, at: now, note: `Marked ${nextStatus}` },
      ],
    };
  });

  if (!changed) return order;

  const status = aggregateStatus(nextTests);
  const updateData = {
    tests: nextTests,
    status,
    completedAt: status === "Completed" ? new Date() : null,
  };
  const fields = getLabOrderFields(tenantDb);
  if (!hasField(fields, "completedAt")) delete updateData.completedAt;

  return tenantDb.labTestOrder.update({
    where: { id: order.id },
    data: updateData,
    include: {
      patient: true,
      consultation: true,
    },
  });
};

const updateOrderStatus = async (branchId, id, status) => {
  const tenantDb = await getTenantClient(branchId);
  const order = await getOrder(branchId, id);

  let updatedTests = Array.isArray(order.tests) ? order.tests : [];
  if (status === "Collected" || status === "Completed") {
    const testStatus = status === "Collected" ? "Collecting" : "Completed";
    updatedTests = updatedTests.map(t => ({
      ...t,
      status: testStatus,
      timeline: [
        ...(Array.isArray(t.timeline) ? t.timeline : []),
        { status: testStatus, at: new Date().toISOString(), note: `Marked as ${status}` }
      ]
    }));
  }

  const updateData = {
    status,
    tests: updatedTests,
    completedAt: status === "Completed" ? new Date() : null
  };

  const fields = getLabOrderFields(tenantDb);
  if (!hasField(fields, "completedAt")) delete updateData.completedAt;

  return tenantDb.labTestOrder.update({
    where: { id: order.id },
    data: updateData,
    include: {
      patient: true
    }
  });
};

module.exports = {
  resolveBranchId,
  normalizePriority,
  normalizeTests,
  aggregateStatus,
  searchPatients,
  listAvailableTests,
  getClinicalOptions,
  createOrder,
  upsertOrderFromConsultation,
  listOrders,
  getOrder,
  updateTestStatus,
  updateOrderStatus,
};
