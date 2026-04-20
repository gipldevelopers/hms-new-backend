const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const auditLogger = require('../../middleware/audit-logger');

router.post('/login', auditLogger('AUTHENTICATION'), authController.login);

module.exports = router;
