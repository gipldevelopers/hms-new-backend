const { getTenantClient, mainDb } = require("../../database/tenant-manager");
const crypto = require("crypto");

/**
 * Get all purchase orders for a branch
 */
const getPurchaseOrders = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  let orders = await tenantDb.purchaseOrder.findMany({
    orderBy: { createdAt: "desc" }
  });

  // If no purchase orders exist in the database, automatically seed initial mock data for a realistic user experience
  if (orders.length === 0) {
    const mockOrders = [
      {
        id: crypto.randomUUID(),
        poNumber: "PO-2024-0892",
        vendor: "Global Health Medical",
        orderDate: "Oct 12, 2023",
        expectedDelivery: "Oct 20, 2023",
        totalAmount: "₹12,450.00",
        payment: "PAID",
        orderStatus: "PARTIAL RECEIVED",
        items: [
          { id: 1, name: "Reagent A (Hematology)", qty: 25, unitPrice: 200, total: 5000 },
          { id: 2, name: "Sterile Disposable Syringes (10ml)", qty: 100, unitPrice: 15, total: 1500 },
          { id: 3, name: "N95 Protective Masks", qty: 200, unitPrice: 25, total: 5000 },
          { id: 4, name: "Surgical Spirit (500ml)", qty: 15, unitPrice: 63.33, total: 950 }
        ],
        justification: "Critical hematology reagents and PPE stocks low.",
        deliveryStore: "Main Central Pharmacy Store",
        shippingUrgency: "Next-Day Priority (48h)"
      },
      {
        id: crypto.randomUUID(),
        poNumber: "PO-2024-0901",
        vendor: "Medtronic Inc.",
        orderDate: "Oct 14, 2023",
        expectedDelivery: "Oct 22, 2023",
        totalAmount: "₹45,210.50",
        payment: "PENDING",
        orderStatus: "ORDERED",
        items: [
          { id: 1, name: "Premium Heart Valves (Model B)", qty: 5, unitPrice: 8000, total: 40000 },
          { id: 2, name: "Pacemaker Electrodes", qty: 10, unitPrice: 521.05, total: 5210.50 }
        ],
        justification: "Surgical inventory requirements for upcoming cardiology schedule.",
        deliveryStore: "Surgical Ward Storage",
        shippingUrgency: "⚡ Emergency Expedited (24h)"
      },
      {
        id: crypto.randomUUID(),
        poNumber: "PO-2024-0850",
        vendor: "Surgical Supply Co.",
        orderDate: "Oct 01, 2023",
        expectedDelivery: "Oct 05, 2023",
        totalAmount: "₹3,120.00",
        payment: "PAID",
        orderStatus: "COMPLETED",
        items: [
          { id: 1, name: "Surgical Cotton Rolls", qty: 50, unitPrice: 42.40, total: 2120 },
          { id: 2, name: "Disposable Scalpels (Size 10)", qty: 20, unitPrice: 50, total: 1000 }
        ],
        justification: "Monthly replenishment of basic surgical consumables.",
        deliveryStore: "General ICU Stock Room",
        shippingUrgency: "Standard Delivery (3-5 business days)"
      }
    ];

    for (const order of mockOrders) {
      await tenantDb.purchaseOrder.create({ data: order });
      await mainDb.purchaseOrder.create({
        data: {
          ...order,
          branchId
        }
      });
    }

    // Refetch the newly seeded orders
    orders = await tenantDb.purchaseOrder.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  return orders;
};

/**
 * Get single purchase order details
 */
const getPurchaseOrderDetails = async (branchId, id) => {
  const tenantDb = await getTenantClient(branchId);
  const order = await tenantDb.purchaseOrder.findFirst({
    where: { id }
  });

  if (!order) {
    throw new Error("Purchase order not found");
  }

  return order;
};

/**
 * Create a new purchase order
 */
const createPurchaseOrder = async (branchId, data) => {
  const tenantDb = await getTenantClient(branchId);
  const id = crypto.randomUUID();

  // Handle unique poNumber constraint dynamically
  let finalPoNumber = data.poNumber;
  let exists = await tenantDb.purchaseOrder.findFirst({
    where: { poNumber: finalPoNumber }
  });
  
  let counter = 1;
  while (exists) {
    finalPoNumber = `${data.poNumber}-${counter}`;
    exists = await tenantDb.purchaseOrder.findFirst({
      where: { poNumber: finalPoNumber }
    });
    counter++;
  }

  const orderData = {
    id,
    poNumber: finalPoNumber,
    vendor: data.vendor,
    orderDate: data.orderDate,
    expectedDelivery: data.expectedDelivery || "Pending",
    totalAmount: data.totalAmount,
    payment: data.payment || "PENDING",
    orderStatus: data.orderStatus || "ORDERED",
    items: data.items || [],
    justification: data.justification || "",
    deliveryStore: data.deliveryStore || "",
    shippingUrgency: data.shippingUrgency || ""
  };

  // Create in tenant DB
  const order = await tenantDb.purchaseOrder.create({
    data: orderData
  });

  // Create in main DB (including branchId)
  await mainDb.purchaseOrder.create({
    data: {
      ...orderData,
      branchId
    }
  });

  return order;
};

/**
 * Update an existing purchase order
 */
const updatePurchaseOrder = async (branchId, id, data) => {
  const tenantDb = await getTenantClient(branchId);

  const currentOrder = await tenantDb.purchaseOrder.findFirst({
    where: { id }
  });

  if (!currentOrder) {
    throw new Error("Purchase order not found");
  }

  const updateData = {
    poNumber: data.poNumber,
    vendor: data.vendor,
    orderDate: data.orderDate,
    expectedDelivery: data.expectedDelivery,
    totalAmount: data.totalAmount,
    payment: data.payment,
    orderStatus: data.orderStatus,
    items: data.items,
    justification: data.justification || "",
    deliveryStore: data.deliveryStore || "",
    shippingUrgency: data.shippingUrgency || ""
  };

  // Update in tenant DB
  const updatedOrder = await tenantDb.purchaseOrder.update({
    where: { id },
    data: updateData
  });

  // Update in main DB
  await mainDb.purchaseOrder.upsert({
    where: { id },
    update: updateData,
    create: {
      id,
      branchId,
      ...updateData
    }
  });

  return updatedOrder;
};

/**
 * Delete a purchase order
 */
const deletePurchaseOrder = async (branchId, id) => {
  const tenantDb = await getTenantClient(branchId);

  // Delete from tenant DB
  await tenantDb.purchaseOrder.deleteMany({
    where: { id }
  });

  // Delete from main DB
  await mainDb.purchaseOrder.deleteMany({
    where: { id }
  });

  return { success: true };
};

module.exports = {
  getPurchaseOrders,
  getPurchaseOrderDetails,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder
};
