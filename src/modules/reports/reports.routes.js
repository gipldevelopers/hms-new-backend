const express = require('express');
const router = express.Router();
const reportsController = require('./reports.controller');
const { auth } = require('../../middleware/auth');

router.use(auth);

router.get('/dashboard', reportsController.getDashboard);

module.exports = router;
