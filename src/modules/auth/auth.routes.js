const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const auditLogger = require('../../middleware/audit-logger');

const { auth } = require('../../middleware/auth');

router.post('/login', auditLogger('AUTHENTICATION'), authController.login);
router.post('/forgot-password', auditLogger('AUTHENTICATION'), authController.forgotPassword);
router.post('/reset-password', auditLogger('AUTHENTICATION'), authController.resetPassword);
router.get('/me', auth, authController.getMe);

module.exports = router;
