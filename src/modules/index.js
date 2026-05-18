const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth/auth.routes');
const branchRoutes = require('./branch/branch.routes');
const masterDataRoutes = require('./master-data/master-data.routes');
const templateRoutes = require('./templates/template.routes');
const assignmentRoutes = require('./assignments/assignments.routes');
const userRoutes = require('./users/users.routes');
const auditLogRoutes = require('./audit-logs/audit-logs.routes');
const shiftRoutes = require('./shifts/shifts.routes');
const staffRoutes = require('./staff/staff.routes');
const attendanceRoutes = require('./attendance/attendance.routes');
const wardsRoutes = require('./wards/wards.routes');
const admissionsRoutes = require('./admissions/admissions.routes');
const bedMapRoutes = require('./bed-map/bed-map.routes');
const patientsRoutes = require('./patients/patients.routes');
const emergencyRoutes = require('./emergency/emergency.routes');
const tokensRoutes = require('./tokens/tokens.routes');
const appointmentsRoutes = require('./appointments/appointments.routes');
const vitalsRoutes = require('./vitals/vitals.routes');

// Define routes
router.use('/auth', authRoutes);
router.use('/branches', branchRoutes);
router.use('/master-data', masterDataRoutes);
router.use('/templates', templateRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/users', userRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/shifts', shiftRoutes);
router.use('/staff', staffRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/wards', wardsRoutes);
router.use('/admissions', admissionsRoutes);
router.use('/bed-map', bedMapRoutes);
router.use('/patients', patientsRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/tokens', tokensRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/vitals', vitalsRoutes);

module.exports = router;
