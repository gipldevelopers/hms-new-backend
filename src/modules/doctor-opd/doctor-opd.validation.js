const Joi = require('joi');

const commonBranchQuery = Joi.object({
  branchId: Joi.string().uuid().optional()
});

const getSchedule = {
  query: commonBranchQuery
};

const createLeave = {
  query: commonBranchQuery,
  body: Joi.object({
    date: Joi.string().isoDate().required(),
    startTime: Joi.string().max(50).required(),
    endTime: Joi.string().max(50).required(),
    notes: Joi.string().max(500).allow('', null).optional(),
    department: Joi.string().max(100).required(),
    branchId: Joi.string().uuid().optional()
  })
};

const getOPDPatients = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    search: Joi.string().max(100).allow('', null).optional(),
    status: Joi.string().max(50).allow('', null).optional(),
    doctorId: Joi.string().uuid().optional()
  })
};

const getStats = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    doctorId: Joi.string().uuid().optional()
  })
};

const getPatientDetails = {
  params: Joi.object({
    appointmentId: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

const saveConsultation = {
  params: Joi.object({
    appointmentId: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object({
    chiefComplaints: Joi.string().max(1000).allow('', null).optional(),
    clinicalHistory: Joi.string().max(1000).allow('', null).optional(),
    finalDiagnosis: Joi.string().max(500).allow('', null).optional(),
    labTests: Joi.array().items(
      Joi.object({
        name: Joi.string().max(200).required()
      })
    ).optional(),
    labPriority: Joi.string().valid('Normal', 'Urgent', 'Critical').optional(),
    followUpNotes: Joi.string().max(1000).allow('', null).optional(),
    followUpDate: Joi.string().isoDate().allow('', null).optional(),
    referralDoctor: Joi.string().max(200).allow('', null).optional(),
    status: Joi.string().valid('IN_PROGRESS', 'COMPLETED').optional(),
    branchId: Joi.string().uuid().optional()
  })
};

const addPrescription = {
  params: Joi.object({
    consultationId: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object({
    instructions: Joi.string().max(1000).allow('', null).optional(),
    branchId: Joi.string().uuid().optional()
  })
};

const addMedicine = {
  params: Joi.object({
    prescriptionId: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object({
    medicineId: Joi.string().uuid().allow('', null).optional(),
    medicineName: Joi.string().max(200).required(),
    dosage: Joi.string().max(100).required(),
    timing: Joi.string().max(200).required(),
    duration: Joi.string().max(100).required(),
    instructions: Joi.string().max(500).allow('', null).optional(),
    branchId: Joi.string().uuid().optional()
  })
};

const deleteMedicine = {
  params: Joi.object({
    itemId: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

const acknowledgeAlert = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

module.exports = {
  getSchedule,
  createLeave,
  getOPDPatients,
  getStats,
  getPatientDetails,
  saveConsultation,
  addPrescription,
  addMedicine,
  deleteMedicine,
  acknowledgeAlert
};
