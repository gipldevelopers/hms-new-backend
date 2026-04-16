const express = require('express');
const router = express.Router();
const templateController = require('./template.controller');

router.get('/', templateController.getAll);
router.get('/:id', templateController.getById);
router.post('/', templateController.create);
router.put('/:id', templateController.update);
router.delete('/:id', templateController.delete);

module.exports = router;
