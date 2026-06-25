// src/modules/demo/demo.routes.js
const express = require('express');
const router = express.Router();
const demoController = require('./demo.controller');
const demoValidation = require('./demo.validation');
const validate = require('../../middleware/validate');
const upload = require('../../middleware/upload');

// Demo CRUD routes
router.post('/', validate(demoValidation.createDemoValidation), demoController.createDemo);
router.get('/', demoController.getAllDemos);
router.get('/:id', validate(demoValidation.getDemoById), demoController.getDemoById);
router.put('/:id', validate(demoValidation.updateDemoValidation), demoController.updateDemo);
router.delete('/:id', validate(demoValidation.deleteDemo), demoController.deleteDemo);

// File upload routes
router.post('/upload', upload.single('file'), demoController.uploadFile);
router.get('/files/all', demoController.getUserFiles);
router.delete('/files/:fileId', validate(demoValidation.deleteFile), demoController.deleteFile);

module.exports = router;