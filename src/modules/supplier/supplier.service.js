const { getTenantClient, mainDb } = require("../../database/tenant-manager");
const crypto = require("crypto");
const purchaseService = require("../purchase/purchase.service");


/**
 * Helper to map DB Supplier to Frontend Supplier format
 */
const mapSupplier = (supplier) => {
  if (!supplier) return null;
  return {
    ...supplier,
    contact: supplier.contactPerson || "",
    phone: supplier.phone1 || "",
    email: supplier.email || supplier.website || ""
  };
};

/**
 * Get all suppliers for a branch
 */
const getSuppliers = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  let suppliers = await tenantDb.supplier.findMany({
    orderBy: { createdAt: "desc" }
  });

  // Automatically seed initial mock data if none exist
  if (suppliers.length === 0) {
    const mockSuppliers = [
      {
        id: crypto.randomUUID(),
        name: "PharmaCorp Global",
        sku: "SUP-2024-001",
        category: "Pharmaceuticals",
        supplierType: "Distributor",
        contactPerson: "Mark Stevenson",
        designation: "Sales Director",
        phone1: "+1 (555) 012-3456",
        phone2: "+1 (555) 012-9876",
        email: "mark.s@pharmacorp.com",
        website: "www.pharmacorp.com",
        gstNumber: "07AAAAA1111A1Z1",
        panNumber: "ABCDE1234F",
        address: "12, Sourcing Valley, New Delhi, India",
        bankName: "HDFC Bank",
        accountNumber: "50100200300405",
        ifscCode: "HDFC0000123",
        accountType: "Current",
        branchName: "New Delhi",
        paymentType: "NEFT",
        taxCategory: "GST Registered",
        rating: 4,
        status: "Active",
        lastOrder: "Oct 24, 2023",
        documents: {
          gst: { name: "gst registration Certificate.pdf", size: "2.4 MB", uploaded: true },
          pan: { name: "Pan Card Copy.pdf", size: "1.1 MB", uploaded: true },
          drug: { name: "Drug License.pdf", size: "1.8 MB", uploaded: true },
          additional: []
        }
      },
      {
        id: crypto.randomUUID(),
        name: "Apex Medical Systems",
        sku: "SUP-2024-002",
        category: "Medical Devices",
        supplierType: "Manufacturer",
        contactPerson: "Sarah Jenkins",
        designation: "Key Accounts Manager",
        phone1: "+1 (555) 012-3457",
        phone2: "+1 (555) 012-9877",
        email: "s.jenkins@apexmed.com",
        website: "www.apexmed.com",
        gstNumber: "27BBBBB2222B2Z2",
        panNumber: "FGHIJ5678K",
        address: "88, Tech Park, Okhla, New Delhi, India",
        bankName: "ICICI Bank",
        accountNumber: "000405060708",
        ifscCode: "ICIC0000004",
        accountType: "Current",
        branchName: "New Delhi",
        paymentType: "RTGS",
        taxCategory: "GST Registered",
        rating: 5,
        status: "Active",
        lastOrder: "Nov 02, 2023",
        documents: {
          gst: { name: "gst registration Certificate.pdf", size: "2.4 MB", uploaded: true },
          pan: { name: "Pan Card Copy.pdf", size: "1.1 MB", uploaded: true },
          drug: { name: "Drug License.pdf", size: "1.8 MB", uploaded: true },
          additional: []
        }
      },
      {
        id: crypto.randomUUID(),
        name: "Surgical Supply Co.",
        sku: "SUP-2024-003",
        category: "Surgical Supplies",
        supplierType: "Manufacturer",
        contactPerson: "David Miller",
        designation: "Operations Head",
        phone1: "+1 (555) 012-3458",
        phone2: "+1 (555) 012-9878",
        email: "sales@surgicalsupply.co",
        website: "www.surgicalsupply.co",
        gstNumber: "19CCCCC3333C3Z3",
        panNumber: "LMNOP9012Q",
        address: "45, Surgical Street, Mumbai Fort, India",
        bankName: "State Bank of India",
        accountNumber: "300400500600",
        ifscCode: "SBIN0000001",
        accountType: "Current",
        branchName: "Mumbai",
        paymentType: "Cheque",
        taxCategory: "GST Registered",
        rating: 4,
        status: "Active",
        lastOrder: "Oct 12, 2023",
        documents: {
          gst: { name: "gst registration Certificate.pdf", size: "2.4 MB", uploaded: true },
          pan: { name: "Pan Card Copy.pdf", size: "1.1 MB", uploaded: true },
          drug: { name: "Drug License.pdf", size: "1.8 MB", uploaded: true },
          additional: []
        }
      }
    ];

    for (const sup of mockSuppliers) {
      await tenantDb.supplier.create({ data: sup });
      await mainDb.supplier.create({
        data: {
          ...sup,
          branchId
        }
      });
    }

    suppliers = await tenantDb.supplier.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  return suppliers.map(mapSupplier);
};

/**
 * Get single supplier details
 */
const getSupplierDetails = async (branchId, id) => {
  const tenantDb = await getTenantClient(branchId);
  const supplier = await tenantDb.supplier.findFirst({
    where: { id }
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return mapSupplier(supplier);
};

/**
 * Create a new supplier
 */
const createSupplier = async (branchId, data) => {
  const tenantDb = await getTenantClient(branchId);
  const id = crypto.randomUUID();

  // Handle unique SKU generation if not provided
  const sku = data.sku || `SUP-2026-${Math.floor(100 + Math.random() * 900)}`;

  const supplierData = {
    id,
    name: data.name,
    sku,
    category: data.category || "Pharmaceuticals",
    supplierType: data.supplierType || "",
    contactPerson: data.contactPerson || data.contact || "",
    designation: data.designation || "",
    phone1: data.phone1 || data.phone || "",
    phone2: data.phone2 || "",
    email: data.email || "",
    website: data.website || "",
    gstNumber: data.gstNumber || "",
    panNumber: data.panNumber || "",
    address: data.address || "",
    bankName: data.bankName || "",
    accountNumber: data.accountNumber || "",
    ifscCode: data.ifscCode || "",
    accountType: data.accountType || "",
    branchName: data.branchName || "",
    paymentType: data.paymentType || "",
    taxCategory: data.taxCategory || "",
    rating: data.rating !== undefined ? Number(data.rating) : 5,
    status: data.status || "Active",
    lastOrder: data.lastOrder || "N/A",
    documents: data.documents || {}
  };

  // Create in tenant DB
  const supplier = await tenantDb.supplier.create({
    data: supplierData
  });

  // Create in main DB (including branchId)
  await mainDb.supplier.create({
    data: {
      ...supplierData,
      branchId
    }
  });

  return mapSupplier(supplier);
};

/**
 * Update an existing supplier
 */
const updateSupplier = async (branchId, id, data) => {
  const tenantDb = await getTenantClient(branchId);

  const currentSupplier = await tenantDb.supplier.findFirst({
    where: { id }
  });

  if (!currentSupplier) {
    throw new Error("Supplier not found");
  }

  const updateData = {
    name: data.name !== undefined ? data.name : currentSupplier.name,
    sku: data.sku !== undefined ? data.sku : currentSupplier.sku,
    category: data.category !== undefined ? data.category : currentSupplier.category,
    supplierType: data.supplierType !== undefined ? data.supplierType : currentSupplier.supplierType,
    contactPerson: (data.contactPerson !== undefined || data.contact !== undefined)
      ? (data.contactPerson || data.contact || "")
      : currentSupplier.contactPerson,
    designation: data.designation !== undefined ? data.designation : currentSupplier.designation,
    phone1: (data.phone1 !== undefined || data.phone !== undefined)
      ? (data.phone1 || data.phone || "")
      : currentSupplier.phone1,
    phone2: data.phone2 !== undefined ? data.phone2 : currentSupplier.phone2,
    email: data.email !== undefined ? data.email : currentSupplier.email,
    website: data.website !== undefined ? data.website : currentSupplier.website,
    gstNumber: data.gstNumber !== undefined ? data.gstNumber : currentSupplier.gstNumber,
    panNumber: data.panNumber !== undefined ? data.panNumber : currentSupplier.panNumber,
    address: data.address !== undefined ? data.address : currentSupplier.address,
    bankName: data.bankName !== undefined ? data.bankName : currentSupplier.bankName,
    accountNumber: data.accountNumber !== undefined ? data.accountNumber : currentSupplier.accountNumber,
    ifscCode: data.ifscCode !== undefined ? data.ifscCode : currentSupplier.ifscCode,
    accountType: data.accountType !== undefined ? data.accountType : currentSupplier.accountType,
    branchName: data.branchName !== undefined ? data.branchName : currentSupplier.branchName,
    paymentType: data.paymentType !== undefined ? data.paymentType : currentSupplier.paymentType,
    taxCategory: data.taxCategory !== undefined ? data.taxCategory : currentSupplier.taxCategory,
    rating: data.rating !== undefined ? Number(data.rating) : currentSupplier.rating,
    status: data.status !== undefined ? data.status : currentSupplier.status,
    lastOrder: data.lastOrder !== undefined ? data.lastOrder : currentSupplier.lastOrder,
    documents: data.documents !== undefined ? data.documents : currentSupplier.documents
  };

  // Update in tenant DB
  const updatedSupplier = await tenantDb.supplier.update({
    where: { id },
    data: updateData
  });

  // Update in main DB
  await mainDb.supplier.upsert({
    where: { id },
    update: updateData,
    create: {
      id,
      branchId,
      ...updateData
    }
  });

  return mapSupplier(updatedSupplier);
};

/**
 * Delete a supplier
 */
const deleteSupplier = async (branchId, id) => {
  const tenantDb = await getTenantClient(branchId);

  // Delete from tenant DB
  await tenantDb.supplier.deleteMany({
    where: { id }
  });

  // Delete from main DB
  await mainDb.supplier.deleteMany({
    where: { id }
  });

  return { success: true };
};

/**
 * Get supplier statistics (total, active, pending deliveries, delayed deliveries)
 */
const getSupplierStats = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);

  // Get total and active suppliers count
  const suppliers = await tenantDb.supplier.findMany();
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === "Active").length;

  // Retrieve purchase orders (getPurchaseOrders handles seeding if empty)
  const orders = await purchaseService.getPurchaseOrders(branchId);
  
  let pendingDeliveries = 0;
  let delayedDeliveries = 0;
  const now = new Date();

  for (const order of orders) {
    const status = (order.orderStatus || "").toUpperCase();
    if (status !== "COMPLETED" && status !== "CANCELLED" && status !== "DELIVERED") {
      pendingDeliveries++;
      
      if (order.expectedDelivery) {
        const expectedDate = new Date(order.expectedDelivery);
        if (!isNaN(expectedDate.getTime()) && expectedDate < now) {
          delayedDeliveries++;
        }
      }
    }
  }

  return {
    totalSuppliers,
    activeSuppliers,
    pendingDeliveries,
    delayedDeliveries
  };
};

module.exports = {
  getSuppliers,
  getSupplierDetails,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierStats
};

