// src/modules/batch-expiry/batch-expiry.validation.js
const Joi = require("joi");

const processReturnValidation = Joi.object({
  itemId: Joi.string().required(),
  returnQty: Joi.alternatives().try(
    Joi.number().positive(),
    Joi.string().regex(/^\d+(\.\d+)?$/)
  ).required(),
  vendor: Joi.string().optional().allow("", null),
  reason: Joi.string().optional().allow("", null),
  settlementMode: Joi.string().optional().allow("", null),
  returnNote: Joi.string().optional().allow("", null),
  branchId: Joi.string().optional().allow("", null)
});

module.exports = {
  processReturnValidation
};
