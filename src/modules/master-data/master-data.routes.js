const express = require('express');
const router = express.Router();
const masterDataController = require('./master-data.controller');
// Assuming there's a protect middleware for superadmin
// const { protect, authorize } = require('../../middleware/auth');

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
