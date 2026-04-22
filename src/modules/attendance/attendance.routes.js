const express = require("express");
const router = express.Router();
const attendanceController = require("./attendance.controller");

// Record Check-in
router.post("/:branchId/check-in", attendanceController.checkIn);

// Record Check-out
router.patch("/:branchId/:id/check-out", attendanceController.checkOut);

// Get branch attendance logs
router.get("/:branchId", attendanceController.getAttendance);

// Get specific staff logs
router.get("/:branchId/staff/:staffId", attendanceController.getStaffAttendance);

module.exports = router;
