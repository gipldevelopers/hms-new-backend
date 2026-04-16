const express = require('express');
const router = express.Router();
const assignmentController = require('./assignments.controller');
const { auth, authorize } = require('../../middleware/auth');

router.use(auth);
router.use(authorize('SUPERADMIN'));

router.get('/', assignmentController.getBranchAssignments);
router.post('/', assignmentController.saveAssignments);

module.exports = router;
