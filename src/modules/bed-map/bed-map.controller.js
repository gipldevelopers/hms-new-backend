const bedMapService = require("./bed-map.service");

const getBedMapData = async (req, res) => {
  try {
    const branchId = req.query.branchId || req.user.branchId;
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID is required" });
    }

    const data = await bedMapService.getBedMapHierarchy(branchId);
    res.json(data);
  } catch (error) {
    console.error("Error in getBedMapData:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBedMapData
};
