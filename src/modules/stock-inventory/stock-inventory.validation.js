// src/modules/stock-inventory/stock-inventory.validation.js
const Joi = require("joi");

const createItemValidation = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  sku: Joi.string().min(1).max(100).required(),
  category: Joi.string().min(1).required(),
  qty: Joi.string().required(),
  expiry: Joi.string().required(),
  status: Joi.string().optional().allow("", null),
  supplier: Joi.string().optional().allow("", null),
  minThreshold: Joi.string().optional().allow("", null),
  notes: Joi.string().optional().allow("", null),
  unitPrice: Joi.number().optional().allow(null),
  branchId: Joi.string().optional().allow("", null)
});

const updateItemValidation = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  sku: Joi.string().min(1).max(100).optional(),
  category: Joi.string().min(1).optional(),
  qty: Joi.string().optional(),
  expiry: Joi.string().optional(),
  status: Joi.string().optional().allow("", null),
  supplier: Joi.string().optional().allow("", null),
  minThreshold: Joi.string().optional().allow("", null),
  notes: Joi.string().optional().allow("", null),
  unitPrice: Joi.number().optional().allow(null),
  branchId: Joi.string().optional().allow("", null)
});

const adjustStockValidation = Joi.object({
  type: Joi.string().valid("Addition", "Usage").required(),
  qtyChanged: Joi.number().positive().required(),
  notes: Joi.string().optional().allow("", null),
  branchId: Joi.string().optional().allow("", null)
});

module.exports = {
  createItemValidation,
  updateItemValidation,
  adjustStockValidation
};
