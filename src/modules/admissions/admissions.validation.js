const Joi = require('joi');

const commonBranchQuery = Joi.object({
  branchId: Joi.string().uuid().optional()
});

const getOverview = {
  query: Joi.object({
    id: Joi.string().uuid().optional(),
    branchId: Joi.string().uuid().optional(),
    search: Joi.string().allow('', null).optional(),
    status: Joi.string().allow('', null).optional(),
    type: Joi.string().valid('admissions', 'discharge', 'all').optional(),
    departmentId: Joi.string().uuid().allow('', null).optional(),
    wardId: Joi.string().uuid().allow('', null).optional()
  })
};

const getStats = {
  query: commonBranchQuery
};

const createAdmission = {
  query: commonBranchQuery,
  body: Joi.object({
    patientId: Joi.string().uuid().optional(),
    patientName: Joi.string().max(200).required(),
    patientAge: Joi.number().integer().min(0).max(150).required(),
    patientGender: Joi.string().valid('Male', 'Female', 'Other').required(),
    patientContact: Joi.string().max(20).required(),
    patientEmail: Joi.string().email().allow('', null).optional(),
    emergencyContactName: Joi.string().max(200).allow('', null).optional(),
    emergencyContactPhone: Joi.string().max(20).allow('', null).optional(),
    departmentId: Joi.string().uuid().required(),
    wardId: Joi.string().uuid().required(),
    bedId: Joi.string().uuid().required(),
    doctorId: Joi.string().uuid().allow('', null).optional(),
    reason: Joi.string().max(500).required(),
    status: Joi.string().valid('Pending', 'In Progress', 'Completed').optional(),
    admissionDate: Joi.string().isoDate().optional(),
    branchId: Joi.string().uuid().optional()
  })
};

const updateAdmission = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object({
    patientName: Joi.string().max(200).optional(),
    patientAge: Joi.number().integer().min(0).max(150).optional(),
    patientGender: Joi.string().valid('Male', 'Female', 'Other').optional(),
    patientContact: Joi.string().max(20).optional(),
    patientEmail: Joi.string().email().allow('', null).optional(),
    emergencyContactName: Joi.string().max(200).allow('', null).optional(),
    emergencyContactPhone: Joi.string().max(20).allow('', null).optional(),
    departmentId: Joi.string().uuid().optional(),
    wardId: Joi.string().uuid().optional(),
    bedId: Joi.string().uuid().optional(),
    doctorId: Joi.string().uuid().allow('', null).optional(),
    reason: Joi.string().max(500).optional(),
    status: Joi.string().valid('Pending', 'In Progress', 'Completed').optional(),
    admissionDate: Joi.string().isoDate().optional(),
    branchId: Joi.string().uuid().optional()
  })
};

const deleteAdmission = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

module.exports = {
  getOverview,
  getStats,
  createAdmission,
  updateAdmission,
  deleteAdmission
};
