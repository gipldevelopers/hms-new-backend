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
const tasksRoutes = require('./tasks/tasks.routes');
const pharmacyRoutes = require('./pharmacy/pharmacy.routes');
const doctorOpdRoutes = require('./doctor-opd/doctor-opd.routes');
const billingRoutes = require('./billing/billing.routes');
const financeRoutes = require('./finance/finance.routes');
const laboratoryRoutes = require('./laboratory/laboratory.routes');
const servicesRoutes = require('./services/services.routes');
const labInventoryRoutes = require('./lab-inventory/lab-inventory.routes');
const stockInventoryRoutes = require('./stock-inventory/stock-inventory.routes');
const stockTransferRoutes = require('./stock-transfer/stock-transfer.routes');
const batchExpiryRoutes = require('./batch-expiry/batch-expiry.routes');
const purchaseRoutes = require('./purchase/purchase.routes');
const supplierRoutes = require('./supplier/supplier.routes');
const departmentInventoryRoutes = require('./department-inventory/department-inventory.routes');
const otSuppliesRoutes = require('./ot-supplies/ot-supplies.routes');

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
router.use('/tasks', tasksRoutes);
router.use('/pharmacy', pharmacyRoutes);
router.use('/doctor-opd', doctorOpdRoutes);
router.use('/billing', billingRoutes);
router.use('/finance', financeRoutes);
router.use('/laboratory', laboratoryRoutes);
router.use('/services', servicesRoutes);
router.use('/lab-inventory', labInventoryRoutes);
router.use('/stock-inventory', stockInventoryRoutes);
router.use('/stock-transfer', stockTransferRoutes);
router.use('/batch-expiry', batchExpiryRoutes);
router.use('/purchase', purchaseRoutes);
router.use('/supplier', supplierRoutes);
router.use('/department-inventory', departmentInventoryRoutes);
router.use('/ot-supplies', otSuppliesRoutes);

module.exports = router;
// Trigger restart for newly generated Prisma tenant client 1234567


