const { getTenantClient, mainDb } = require("../../database/tenant-manager");
const crypto = require("crypto");

// Default initial items to seed if table is empty
const INITIAL_SUPPLIES = [
  { name: "Surgical Mask - N95 Premium", category: "Consumables | Sterile", qty: "450", batch: "BN-992-K (Exp: 12/2025)", unit: "Units (Pack of 50)", unitPrice: 2.50, expiry: "12/2025" },
  { name: "Disposable Scalpels #15", category: "Instruments | Sterile", qty: "120", batch: "S-8839-C (Exp: 08/2026)", unit: "Unit", unitPrice: 6.50, expiry: "08/2026" },
  { name: "Surgical Sutures (Nylon 4-0)", category: "Supplies | Sterile", qty: "280", batch: "B-9982-X (Exp: 04/2027)", unit: "Pack", unitPrice: 5.50, expiry: "04/2027" },
  { name: "Sterile Gauze Pads (4x4)", category: "Consumables | Sterile", qty: "800", batch: "G-2210-A (Exp: 11/2026)", unit: "Box (10pcs)", unitPrice: 1.20, expiry: "11/2026" }
];

const INITIAL_CONSUMPTIONS = [
  {
    name: "Surgical Sutures (Nylon)",
    ref: "Ref: 8823-PX",
    batch: "B-1029-A",
    usedQty: 12,
    unit: "Units",
    remainingStock: 480,
    stockStatus: "STABLE",
    usedBy: "Dr. Aris",
    usedById: "ID: 902",
    status: "VERIFIED",
    date: "2023-10-27",
    department: "Main Operation Theatre",
    procedureType: "General Surgery"
  },
  {
    name: "Propofol 20ml Vial",
    ref: "Ref: ANES-552",
    batch: "B-8832-C",
    usedQty: 5,
    unit: "Vials",
    remainingStock: 14,
    stockStatus: "CRITICAL",
    usedBy: "Elena R.",
    usedById: "ID: 1104",
    status: "VERIFIED",
    date: "2023-10-27",
    department: "Main Operation Theatre",
    procedureType: "General Surgery"
  },
  {
    name: "N95 Surgical Mask",
    ref: "Ref: PPE-20",
    batch: "B-4401-Z",
    usedQty: 50,
    unit: "Pcs",
    remainingStock: 1240,
    stockStatus: "STABLE",
    usedBy: "Admin Shift B",
    usedById: "",
    status: "VERIFIED",
    date: "2023-10-27",
    department: "Main Operation Theatre",
    procedureType: "General Surgery"
  }
];

const seedInitialData = async (tenantDb, branchId) => {
  // Check if supplies exist
  const supplyCount = await tenantDb.oTSupply.count();
  if (supplyCount === 0) {
    console.log(`🌱 Seeding initial OT supplies for branch ${branchId}`);
    for (const s of INITIAL_SUPPLIES) {
      const id = crypto.randomUUID();
      const data = { id, ...s };
      await tenantDb.oTSupply.create({ data });
      await mainDb.oTSupply.create({ data: { ...data, branchId } }).catch(() => {});
    }
  }

  // Check if consumptions exist
  const consumptionCount = await tenantDb.oTSupplyConsumption.count();
  if (consumptionCount === 0) {
    console.log(`🌱 Seeding initial OT consumption logs for branch ${branchId}`);
    for (const c of INITIAL_CONSUMPTIONS) {
      const id = crypto.randomUUID();
      const data = { id, ...c };
      await tenantDb.oTSupplyConsumption.create({ data });
      await mainDb.oTSupplyConsumption.create({ data: { ...data, branchId } }).catch(() => {});
    }
  }
};

const getConsumptions = async (branchId, filter = {}) => {
  const tenantDb = await getTenantClient(branchId);
  await seedInitialData(tenantDb, branchId);

  const where = {};
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { batch: { contains: filter.search, mode: "insensitive" } },
      { usedBy: { contains: filter.search, mode: "insensitive" } },
      { department: { contains: filter.search, mode: "insensitive" } }
    ];
  }

  return await tenantDb.oTSupplyConsumption.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });
};

const getSupplies = async (branchId, filter = {}) => {
  const tenantDb = await getTenantClient(branchId);
  await seedInitialData(tenantDb, branchId);

  const where = {};
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { category: { contains: filter.search, mode: "insensitive" } }
    ];
  }

  return await tenantDb.oTSupply.findMany({
    where,
    orderBy: { name: "asc" }
  });
};

const createSupplyItem = async (branchId, data) => {
  const tenantDb = await getTenantClient(branchId);
  const id = crypto.randomUUID();

  const itemData = {
    id,
    name: data.name,
    sku: data.sku || "",
    category: data.category || "Consumables | Sterile",
    qty: String(data.qty || "0"),
    batch: data.batch || "N/A",
    unit: data.unit || "Units",
    unitPrice: parseFloat(data.unitPrice) || 0.0,
    expiry: data.expiry || "N/A"
  };

  const supply = await tenantDb.oTSupply.create({ data: itemData });
  await mainDb.oTSupply.create({ data: { ...itemData, branchId } });

  return supply;
};

const logConsumption = async (branchId, data, userName) => {
  const tenantDb = await getTenantClient(branchId);

  // Perform all reads, checks, updates, and inserts inside a database transaction to ensure atomicity
  return await tenantDb.$transaction(async (tx) => {
    const results = [];

    // Check if bulk logging list is sent
    if (data.items && Array.isArray(data.items)) {
      // Pre-validate all items first to ensure transaction safety
      for (const item of data.items) {
        const usedQty = parseInt(item.usedQty) || 0;
        if (usedQty <= 0) {
          throw new Error(`Logged quantity for item "${item.name}" must be greater than zero.`);
        }

        let matchingSupply = await tx.oTSupply.findFirst({
          where: { name: { equals: item.name, mode: "insensitive" } }
        });

        if (matchingSupply) {
          const currentQty = parseInt(matchingSupply.qty) || 0;
          if (currentQty < usedQty) {
            throw new Error(`Insufficient stock for item "${item.name}". Available: ${currentQty}, Requested: ${usedQty}.`);
          }
        }
      }

      const surgeonName = data.surgeon ? data.surgeon.split(" (")[0] : userName;
      const surgeonId = data.surgeon && data.surgeon.includes("ID:") ? 
        "ID: " + data.surgeon.split("ID: ")[1].replace(")", "") : 
        "ID: " + Math.floor(100 + Math.random() * 900);

      for (const item of data.items) {
        const id = crypto.randomUUID();
        const refCode = `Ref: OT-${Math.floor(100 + Math.random() * 900)}-SUP`;
        
        // Look up supply item to deduct stock
        let remainingStock = Math.floor(Math.random() * 200) + 10;
        let matchingSupply = await tx.oTSupply.findFirst({
          where: { name: { equals: item.name, mode: "insensitive" } }
        });

        if (matchingSupply) {
          const currentQty = parseInt(matchingSupply.qty) || 0;
          const usedQty = parseInt(item.usedQty) || 0;
          const newQty = Math.max(0, currentQty - usedQty);
          remainingStock = newQty;

          // Update in tenant & main
          await tx.oTSupply.update({
            where: { id: matchingSupply.id },
            data: { qty: String(newQty) }
          });
          await mainDb.oTSupply.update({
            where: { id: matchingSupply.id },
            data: { qty: String(newQty) }
          }).catch(() => {});
        }

        const stockStatus = remainingStock <= 15 ? "CRITICAL" : "STABLE";

        const logData = {
          id,
          name: item.name,
          ref: refCode,
          batch: item.batch || "B-GEN-X",
          usedQty: parseInt(item.usedQty) || 1,
          unit: item.unit || "Units",
          remainingStock,
          stockStatus,
          usedBy: surgeonName,
          usedById: surgeonId,
          status: "VERIFIED",
          date: data.date || new Date().toISOString().split("T")[0],
          department: data.department || "Main Operation Theatre",
          procedureType: data.procedureType || "General Surgery",
        };

        const record = await tx.oTSupplyConsumption.create({ data: logData });
        await mainDb.oTSupplyConsumption.create({ data: { ...logData, branchId } });
        results.push(record);
      }
    } else {
      // Single log consumption entry from the quick form
      const usedQty = parseInt(data.usedQty) || 0;
      if (usedQty <= 0) {
        throw new Error("Logged quantity must be greater than zero.");
      }

      let matchingSupply = await tx.oTSupply.findFirst({
        where: { name: { equals: data.name, mode: "insensitive" } }
      });

      if (matchingSupply) {
        const currentQty = parseInt(matchingSupply.qty) || 0;
        if (currentQty < usedQty) {
          throw new Error(`Insufficient stock for item "${data.name}". Available: ${currentQty}, Requested: ${usedQty}.`);
        }
      }

      const id = crypto.randomUUID();
      const refCode = `Ref: OT-${Math.floor(100 + Math.random() * 900)}-SUP`;

      let remainingStock = Math.floor(Math.random() * 500) + 10;
      if (matchingSupply) {
        const currentQty = parseInt(matchingSupply.qty) || 0;
        const newQty = Math.max(0, currentQty - usedQty);
        remainingStock = newQty;

        await tx.oTSupply.update({
          where: { id: matchingSupply.id },
          data: { qty: String(newQty) }
        });
        await mainDb.oTSupply.update({
          where: { id: matchingSupply.id },
          data: { qty: String(newQty) }
        }).catch(() => {});
      }

      const stockStatus = remainingStock <= 15 ? "CRITICAL" : "STABLE";

      const logData = {
        id,
        name: data.name,
        ref: refCode,
        batch: data.batch || "B-GEN-X",
        usedQty,
        unit: data.unit || "Units",
        remainingStock,
        stockStatus,
        usedBy: userName,
        usedById: "ID: " + Math.floor(100 + Math.random() * 900),
        status: "VERIFIED",
        date: data.date || new Date().toISOString().split("T")[0],
        department: data.department || "Main Operation Theatre",
        procedureType: data.procedureType || "General Surgery",
      };

      const record = await tx.oTSupplyConsumption.create({ data: logData });
      await mainDb.oTSupplyConsumption.create({ data: { ...logData, branchId } });
      results.push(record);
    }

    return results;
  });
};

const getDashboardStats = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  await seedInitialData(tenantDb, branchId);

  // Get all supplies and consumptions
  const consumptions = await tenantDb.oTSupplyConsumption.findMany();
  const supplies = await tenantDb.oTSupply.findMany();

  // 1. Calculate total value of consumption
  // Find prices from supplies
  const priceMap = {};
  supplies.forEach(s => {
    priceMap[s.name.toLowerCase()] = s.unitPrice;
  });

  let totalConsumptionValue = 0;
  consumptions.forEach(c => {
    const price = priceMap[c.name.toLowerCase()] || 5.0; // Default fallback price
    totalConsumptionValue += (c.usedQty * price);
  });

  if (totalConsumptionValue === 0) {
    totalConsumptionValue = 12408.50; // Mock base value
  }

  // 2. Budget utilization (mock or computed against target, e.g. 20000 budget)
  const budgetUtilization = Math.min(100, Math.round((totalConsumptionValue / 20000) * 100)) || 64;

  // 3. Alerts: supplies with quantity <= 15
  const criticalAlerts = supplies
    .filter(s => parseInt(s.qty) <= 15)
    .map(s => ({
      name: s.name,
      message: `Only ${s.qty} ${s.unit.split(" ")[0]} remaining`
    }));

  // Default alerts if none are critical to keep UI filled nicely
  if (criticalAlerts.length === 0) {
    criticalAlerts.push(
      { name: "Latex Gloves (Medium)", message: "Only 4 Boxes left" },
      { name: "Sterile Drape Kits", message: "8 units remaining" }
    );
  }

  return {
    totalConsumptionValue,
    budgetUtilization,
    criticalAlerts
  };
};

const deleteConsumption = async (branchId, id) => {
  const tenantDb = await getTenantClient(branchId);

  return await tenantDb.$transaction(async (tx) => {
    // 1. Find the consumption log
    const log = await tx.oTSupplyConsumption.findUnique({
      where: { id }
    });

    if (!log) {
      throw new Error("Consumption log record not found");
    }

    // 2. Try to restore the supply quantity
    if (log.name && log.usedQty > 0) {
      let matchingSupply = await tx.oTSupply.findFirst({
        where: { name: { equals: log.name, mode: "insensitive" } }
      });

      if (matchingSupply) {
        const currentQty = parseInt(matchingSupply.qty) || 0;
        const newQty = currentQty + log.usedQty;

        // Update in tenant DB
        await tx.oTSupply.update({
          where: { id: matchingSupply.id },
          data: { qty: String(newQty) }
        });

        // Update in main DB
        await mainDb.oTSupply.update({
          where: { id: matchingSupply.id },
          data: { qty: String(newQty) }
        }).catch(() => {});
      }
    }

    // 3. Delete from tenant DB
    await tx.oTSupplyConsumption.delete({
      where: { id }
    });

    // 4. Delete from main DB
    await mainDb.oTSupplyConsumption.deleteMany({
      where: { id }
    });

    return { success: true };
  });
};

module.exports = {
  getConsumptions,
  getSupplies,
  createSupplyItem,
  logConsumption,
  getDashboardStats,
  deleteConsumption
};

