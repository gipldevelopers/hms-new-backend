// src/modules/finance/finance.validation.js
const Joi = require('joi');

const commonBranchQuery = Joi.object({
  branchId: Joi.string().uuid().optional()
});

const getDashboardStats = {
  query: commonBranchQuery
};

const getRecentInvoices = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    limit: Joi.number().integer().positive().optional()
  })
};

const getRunningBills = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    limit: Joi.number().integer().positive().optional()
  })
};

const getDashboardAlerts = {
  query: commonBranchQuery
};

module.exports = {
  getDashboardStats,
  getRecentInvoices,
  getRunningBills,
  getDashboardAlerts
};
