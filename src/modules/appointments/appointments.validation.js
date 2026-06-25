const Joi = require('joi');

const commonBranchQuery = Joi.object({
  branchId: Joi.string().uuid().optional()
});

const getStats = {
  query: commonBranchQuery
};

const getList = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    search: Joi.string().allow('', null).optional(),
    status: Joi.string().optional(),
    departmentId: Joi.string().uuid().optional(),
    doctorId: Joi.string().uuid().optional()
  })
};

const searchPatients = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    q: Joi.string().allow('', null).optional()
  })
};

const getDoctors = {
  query: commonBranchQuery
};

const getDepartments = {
  query: commonBranchQuery
};

const getBookedSlots = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    doctorId: Joi.string().uuid().required(),
    date: Joi.string().isoDate().required()
  })
};

const getPatientSummary = {
  params: Joi.object({
    patientId: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

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
  getStats,
  getList,
  searchPatients,
  getDoctors,
  getDepartments,
  getBookedSlots,
  getPatientSummary,
  book,
  updateStatus,
  reschedule
};
