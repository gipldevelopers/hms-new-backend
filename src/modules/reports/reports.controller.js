const reportsService = require('./reports.service');

const getDashboard = async (req, res, next) => {
  try {
    const branchId = req?.user?.branchId || null; // safely handle user
    const data = await reportsService.getDashboardData(branchId);
    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard
};
