// src/modules/demo/demo.validation.js
const Joi = require('joi');

const createDemoValidation = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  description: Joi.string().max(500).optional(),
});

const updateDemoValidation = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  email: Joi.string().email().optional(),
  description: Joi.string().max(500).optional(),
});

const fileUploadValidation = Joi.object({
  title: Joi.string().min(1).max(100).optional(),
});

const getDemoById = {
  params: Joi.object({
    id: Joi.string().required()
  })
};

const deleteDemo = {
  params: Joi.object({
    id: Joi.string().required()
  })
};

const deleteFile = {
  params: Joi.object({
    fileId: Joi.string().required()
  })
};

module.exports = {
  createDemoValidation,
  updateDemoValidation,
  fileUploadValidation,
  getDemoById,
  deleteDemo,
  deleteFile
};