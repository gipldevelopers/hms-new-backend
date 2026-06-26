const Joi = require("joi");

const createTransferValidation = Joi.object({
  transferId: Joi.string().optional().allow("", null),
  source: Joi.string().required(),
  destination: Joi.string().required(),
  date: Joi.string().optional().allow("", null),
  items: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      sku: Joi.string().required(),
      name: Joi.string().required(),
      qty: Joi.string().required()
    })
  ).min(1).required(),
  notes: Joi.string().optional().allow("", null)
});

module.exports = {
  createTransferValidation
};
