const { getTenantClient, mainDb } = require("../../database/tenant-manager");
const crypto = require("crypto");

/**
 * Seed initial mock purchase requests if none exist
 */
const seedMockPurchaseRequests = async (tenantDb, branchId) => {
  const mockPRs = [
    {
      id: crypto.randomUUID(),
      prNumber: "PR-2024-402",
      department: "Anesthesia Department",
      requestedBy: "Dr. James Mercer",
      date: "2024-03-22",
      priority: "Urgent",
      totalItems: 3,
      status: "Pending Admin",
      items: [
        { id: 1, name: "Propofol 10mg/mL Injection (20ml)", qty: 2500, unitPrice: 3.00, total: 7500, sku: "SKU-PRP-9021", unit: "vials" },
        { id: 2, name: "Amoxicillin Trihydrate 500mg", qty: 10000, unitPrice: 0.15, total: 1500, sku: "SKU-AMX-1120", unit: "caps" },
        { id: 3, name: "Disposable Syringes 5ml with Needle", qty: 15000, unitPrice: 0.30, total: 4500, sku: "SKU-SYR-85ML", unit: "units" }
      ]
    },
    {
      id: crypto.randomUUID(),
      prNumber: "PR-2024-399",
      department: "Central Pharmacy",
      requestedBy: "Sarah Alvi",
      date: "2024-03-20",
      priority: "Normal",
      totalItems: 2,
      status: "Ordered",
      items: [
        { id: 1, name: "Surgical Gloves", qty: 50, unitPrice: 200, total: 10000, sku: "SKU-882", unit: "Boxes" },
        { id: 2, name: "Scalpels", qty: 10, unitPrice: 1500, total: 15000, sku: "SKU-102", unit: "Units" }
      ],
      poNumber: "PO-2024-399"
    },
    {
      id: crypto.randomUUID(),
      prNumber: "PR-2024-391",
      department: "Emergency & Trauma",
      requestedBy: "Nurse Head Julia",
      date: "2024-03-19",
      priority: "High",
      totalItems: 2,
      status: "Ordered",
      items: [
        { id: 1, name: "Premium Heart Valves (Model B)", qty: 5, unitPrice: 8000, total: 40000, sku: "SKU-VALVE-CV", unit: "Units" },
        { id: 2, name: "Pacemaker Electrodes", qty: 10, unitPrice: 521.05, total: 5210.50, sku: "SKU-ELECTRODE-CV", unit: "Units" }
      ],
      poNumber: "PO-2024-391"
    }
  ];

  console.log(`🌱 Seeding initial mock Purchase Requests for branch: ${branchId}`);
  for (const pr of mockPRs) {
    await tenantDb.purchaseRequest.create({ data: pr });
    await mainDb.purchaseRequest.create({
      data: {
        ...pr,
        branchId
      }
    });
  }
};

/**
 * Get all purchase requests
 */
const getPurchaseRequests = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  let requests = await tenantDb.purchaseRequest.findMany({
    orderBy: { createdAt: "desc" }
  });

  if (requests.length === 0) {
    await seedMockPurchaseRequests(tenantDb, branchId);
    requests = await tenantDb.purchaseRequest.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  return requests;
};

/**
 * Get single purchase request details
 */
const getPurchaseRequestDetails = async (branchId, id) => {
  const tenantDb = await getTenantClient(branchId);
  const request = await tenantDb.purchaseRequest.findFirst({
    where: { id }
  });

  if (!request) {
    throw new Error("Purchase request not found");
  }

  return request;
};

/**
 * Create a new purchase request
 */
const createPurchaseRequest = async (branchId, data) => {
  const tenantDb = await getTenantClient(branchId);
  const prId = crypto.randomUUID();

  // Auto-generate PR number if not provided
  let prNumber = data.prNumber;
  if (!prNumber) {
    const count = await tenantDb.purchaseRequest.count();
    prNumber = `PR-2026-${100 + count}`;
  }

  let exists = await tenantDb.purchaseRequest.findFirst({
    where: { prNumber }
  });

  let counter = 1;
  while (exists) {
    if (data.prNumber) {
      prNumber = `${data.prNumber}-${counter}`;
    } else {
      const count = await tenantDb.purchaseRequest.count();
      prNumber = `PR-2026-${100 + count + counter}`;
    }
    exists = await tenantDb.purchaseRequest.findFirst({
      where: { prNumber }
    });
    counter++;
  }

  const prData = {
    id: prId,
    prNumber,
    department: data.department,
    requestedBy: data.requestedBy,
    date: data.date || new Date().toISOString().split('T')[0],
    priority: data.priority || "Normal",
    totalItems: parseInt(data.totalItems) || (data.items ? data.items.length : 0),
    status: data.status || "Pending Admin",
    items: data.items || [],
    poNumber: data.poNumber || null
  };

  // Create in tenant DB
  const pr = await tenantDb.purchaseRequest.create({
    data: prData
  });

  // Create in main DB (including branchId)
  await mainDb.purchaseRequest.create({
    data: {
      ...prData,
      branchId
    }
  });

  return pr;
};

/**
 * Update an existing purchase request
 */
const updatePurchaseRequest = async (branchId, id, data) => {
  const tenantDb = await getTenantClient(branchId);

  // Check if exists
  const exists = await tenantDb.purchaseRequest.findFirst({
    where: { id }
  });

  if (!exists) {
    throw new Error("Purchase request not found");
  }

  const updateData = {
    department: data.department !== undefined ? data.department : exists.department,
    requestedBy: data.requestedBy !== undefined ? data.requestedBy : exists.requestedBy,
    date: data.date !== undefined ? data.date : exists.date,
    priority: data.priority !== undefined ? data.priority : exists.priority,
    totalItems: data.totalItems !== undefined ? parseInt(data.totalItems) : (data.items ? data.items.length : exists.totalItems),
    status: data.status !== undefined ? data.status : exists.status,
    items: data.items !== undefined ? data.items : exists.items,
    poNumber: data.poNumber !== undefined ? data.poNumber : exists.poNumber
  };

  // Update in Tenant DB
  const pr = await tenantDb.purchaseRequest.update({
    where: { id },
    data: updateData
  });

  // Update in Main DB
  await mainDb.purchaseRequest.upsert({
    where: { id },
    update: updateData,
    create: {
      id,
      branchId,
      prNumber: exists.prNumber,
      ...updateData
    }
  });

  return pr;
};

/**
 * Delete a purchase request
 */
const deletePurchaseRequest = async (branchId, id) => {
  const tenantDb = await getTenantClient(branchId);

  // Delete from tenant DB
  await tenantDb.purchaseRequest.deleteMany({
    where: { id }
  });

  // Delete from main DB
  await mainDb.purchaseRequest.deleteMany({
    where: { id }
  });

  return { success: true };
};

module.exports = {
  getPurchaseRequests,
  getPurchaseRequestDetails,
  createPurchaseRequest,
  updatePurchaseRequest,
  deletePurchaseRequest
};
