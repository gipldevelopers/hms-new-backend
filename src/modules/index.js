const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth/auth.routes');
const branchRoutes = require('./branch/branch.routes');

// Define routes
router.use('/auth', authRoutes);
router.use('/branches', branchRoutes);

module.exports = router;
