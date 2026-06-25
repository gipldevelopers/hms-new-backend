const Joi = require('joi');

const commonBranchQuery = Joi.object({
  branchId: Joi.string().uuid().optional()
});

const getPatientsList = {
  query: commonBranchQuery
};

const getPatientDetails = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

const searchPatients = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    q: Joi.string().allow('', null).optional()
  })
};

const deletePatient = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

const getPatientPrescription = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

const getPatientNotesList = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

const createPatientNoteRecord = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object({
    content: Joi.string().required(),
    fileUrl: Joi.string().allow('', null).optional(),
    branchId: Joi.string().uuid().optional()
  })
};

const patientFields = {
  firstName: Joi.string().max(100).optional().allow('', null),
  lastName: Joi.string().max(100).optional().allow('', null),
  name: Joi.string().max(200).optional().allow('', null),
  age: Joi.number().integer().min(0).max(150).optional().allow('', null),
  gender: Joi.string().valid('Male', 'Female', 'Other').optional().allow('', null),
  dob: Joi.string().isoDate().optional().allow('', null),
  contact: Joi.string().max(20).optional().allow('', null),
  alternateMobile: Joi.string().max(20).optional().allow('', null),
  email: Joi.string().email().optional().allow('', null),
  maritalStatus: Joi.string().max(50).optional().allow('', null),
  bloodGroup: Joi.string().max(20).optional().allow('', null),
  address: Joi.string().max(500).optional().allow('', null),
  city: Joi.string().max(100).optional().allow('', null),
  state: Joi.string().max(100).optional().allow('', null),
  pincode: Joi.string().max(20).optional().allow('', null),
  country: Joi.string().max(100).optional().allow('', null),
  aadhaar: Joi.string().max(20).optional().allow('', null),
  pan: Joi.string().max(20).optional().allow('', null),
  passport: Joi.string().max(50).optional().allow('', null),
  idProofUrl: Joi.string().max(500).optional().allow('', null),
  emergencyContactName: Joi.string().max(200).optional().allow('', null),
  emergencyContactPhone: Joi.string().max(20).optional().allow('', null),
  status: Joi.string().max(50).optional().allow('', null),
  arrivalMode: Joi.string().max(50).optional().allow('', null),
  triagePriority: Joi.string().max(50).optional().allow('', null),
  emergencyType: Joi.string().max(100).optional().allow('', null),
  arrivalTime: Joi.string().isoDate().optional().allow('', null),
  isEmergency: Joi.boolean().optional(),
  branchId: Joi.string().uuid().optional()
};

const createPatient = {
  query: commonBranchQuery,
  body: Joi.object(patientFields)
};

const updatePatient = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object(patientFields)
};

module.exports = {
  getPatientsList,
  getPatientDetails,
  searchPatients,
  deletePatient,
  getPatientPrescription,
  getPatientNotesList,
  createPatientNoteRecord,
  createPatient,
  updatePatient
};
