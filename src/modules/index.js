const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth/auth.routes');
const branchRoutes = require('./branch/branch.routes');
const masterDataRoutes = require('./master-data/master-data.routes');
const templateRoutes = require('./templates/template.routes');
const assignmentRoutes = require('./assignments/assignments.routes');

// Define routes
router.use('/auth', authRoutes);
router.use('/branches', branchRoutes);
router.use('/master-data', masterDataRoutes);
router.use('/templates', templateRoutes);
router.use('/assignments', assignmentRoutes);

module.exports = router;
 