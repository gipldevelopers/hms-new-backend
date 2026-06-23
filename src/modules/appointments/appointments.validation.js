const Joi = require('joi');

const commonBranchQuery = Joi.object({
  branchId: Joi.string().uuid().optional()
});

const book = {
  query: commonBranchQuery,
  body: Joi.object({
    patientId: Joi.string().uuid().required(),
    doctorId: Joi.string().uuid().optional().allow('', null),
    doctorName: Joi.string().max(200).optional().allow('', null),
    departmentId: Joi.string().uuid().optional().allow('', null),
    departmentName: Joi.string().max(200).optional().allow('', null),
    dateTime: Joi.string().isoDate().required(),
    tokenNumber: Joi.string().max(50).optional().allow('', null),
    fee: Joi.number().min(0).optional().allow('', null),
    notes: Joi.string().max(1000).optional().allow('', null),
    branchId: Joi.string().uuid().optional()
  })
};

const updateStatus = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object({
    status: Joi.string().valid('SCHEDULED', 'CHECKED_IN', 'WAITING', 'COMPLETED', 'CANCELLED', 'NO_SHOW').required(),
    cancelReason: Joi.string().max(500).optional().allow('', null),
    branchId: Joi.string().uuid().optional()
  })
};

const reschedule = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object({
    dateTime: Joi.string().isoDate().required(),
    notes: Joi.string().max(1000).optional().allow('', null),
    branchId: Joi.string().uuid().optional()
  })
};

module.exports = {
  book,
  updateStatus,
  reschedule
};
