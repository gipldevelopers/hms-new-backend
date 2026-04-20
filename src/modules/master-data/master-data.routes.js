const express = require('express');
const router = express.Router();
const masterDataController = require('./master-data.controller');
const { auth, authorize } = require('../../middleware/auth');
const auditLogger = require('../../middleware/audit-logger');

router.use(auth);
router.use(authorize('SUPERADMIN'));
router.use(auditLogger('MASTER_DATA'));

router.get('/', masterDataController.getAll);
router.get('/:id', masterDataController.getById);
router.post('/', masterDataController.create);
router.put('/:id', masterDataController.update);
router.delete('/:id', masterDataController.delete);

// Records
router.post('/:id/records', masterDataController.addRecord);
router.put('/records/:recordId', masterDataController.updateRecord);
router.delete('/records/:recordId', masterDataController.deleteRecord);

module.exports = router;
