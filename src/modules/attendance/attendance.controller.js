const attendanceService = require("./attendance.service");

const checkIn = async (req, res) => {
  try {
    const { branchId } = req.params;
    const attendance = await attendanceService.checkIn(branchId, req.body);
    res.status(201).json({
      success: true,
      message: "Check-in recorded successfully",
      data: attendance
    });
  } catch (error) {
    console.error("Attendance Controller Error [checkIn]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const { id, branchId } = req.params;
    const attendance = await attendanceService.checkOut(id, branchId, req.body);
    res.json({
      success: true,
      message: "Check-out recorded successfully",
      data: attendance
    });
  } catch (error) {
    console.error("Attendance Controller Error [checkOut]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Start date and end date are required" });
    }

    const logs = await attendanceService.getAttendance(branchId, startDate, endDate);
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error("Attendance Controller Error [getAttendance]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStaffAttendance = async (req, res) => {
  try {
    const { branchId, staffId } = req.params;
    const logs = await attendanceService.getStaffAttendance(branchId, staffId);
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error("Attendance Controller Error [getStaffAttendance]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getAttendance,
  getStaffAttendance
};
