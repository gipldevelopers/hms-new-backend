const bedMapService = require("./bed-map.service");

const prisma = require("../../database/prisma");

const getBedMapData = async (req, res) => {
  try {
    let branchId = req.query.branchId || req.user.branchId;

    if (branchId) {
      const branch = await prisma.branch.findUnique({ where: { id: branchId } });
      if (!branch || !branch.isDbInitialized) branchId = null;
    }

    if (!branchId) {
      const firstBranch = await prisma.branch.findFirst({
        where: { isDbInitialized: true }
      });
      if (firstBranch) branchId = firstBranch.id;
    }

    if (!branchId) {
      return res.status(400).json({ error: "Branch ID is required" });
    }

    console.log(`🔍 Fetching Bed Map Hierarchy for Branch: ${branchId} (User: ${req.user?.email})`);
    const data = await bedMapService.getBedMapHierarchy(branchId);
    console.log(`📦 Hierarchy Result: ${data.length} departments found.`);
    
    res.json(data);
  } catch (error) {
    console.error("Error in getBedMapData:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBedMapData
};
