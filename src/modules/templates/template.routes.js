const express = require('express');
const router = express.Router();
const templateController = require('./template.controller');
const { auth, authorize } = require('../../middleware/auth');
const auditLogger = require('../../middleware/audit-logger');

router.use(auth);
router.use(authorize('SUPERADMIN'));
router.use(auditLogger('TEMPLATES'));

router.get('/', templateController.getAll);
router.get('/:id', templateController.getById);
router.post('/', templateController.create);
router.put('/:id', templateController.update);
router.delete('/:id', templateController.delete);

module.exports = router;
