// src/modules/billing/billing.validation.js
const Joi = require('joi');

const commonBranchQuery = Joi.object({
  branchId: Joi.string().uuid().optional()
});

const getOPDBillingRecords = {
  query: commonBranchQuery
};

const getOPDBillingDetails = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    uhid: Joi.string().max(50).optional(),
    patient: Joi.string().max(100).optional()
  }).or('uhid', 'patient')
};

const collectOPDPayment = {
  query: commonBranchQuery,
  body: Joi.object({
    patientId: Joi.string().uuid().required(),
    consultationFee: Joi.number().min(0).optional(),
    labCharges: Joi.number().min(0).optional(),
    pharmacyCharges: Joi.number().min(0).optional(),
    discount: Joi.number().min(0).optional(),
    tax: Joi.number().min(0).optional(),
    subtotal: Joi.number().min(0).optional(),
    netPayable: Joi.number().min(0).required(),
    amountPaid: Joi.number().min(0).required(),
    paymentMethod: Joi.string().max(50).optional(),
    branchId: Joi.string().uuid().optional()
  })
};

const getIPDBillingRecords = {
  query: commonBranchQuery
};

const getIPDBillingDetails = {
  params: Joi.object({
    admissionId: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

const getServiceCatalog = {
  query: commonBranchQuery
};

const createBill = {
  query: commonBranchQuery,
  body: Joi.object({
    patientId: Joi.string().uuid().required(),
    type: Joi.string().valid('OPD', 'IPD').optional(),
    items: Joi.array().items(
      Joi.object({
        name: Joi.string().max(200).required(),
        category: Joi.string().max(100).optional(),
        qty: Joi.number().integer().positive().required(),
        price: Joi.number().min(0).required(),
        total: Joi.number().min(0).optional(),
        source: Joi.string().max(100).optional()
      })
    ).min(1).required(),
    discount: Joi.number().min(0).optional(),
    tax: Joi.number().min(0).optional(),
    paymentMethod: Joi.string().max(50).optional(),
    amountPaid: Joi.number().min(0).optional(),
    notes: Joi.string().max(1000).optional().allow('', null),
    branchId: Joi.string().uuid().optional()
  })
};

const getInvoiceById = {
  params: Joi.object({
    billId: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

const getAllPayments = {
  query: commonBranchQuery
};

const getPaymentSummary = {
  query: commonBranchQuery
};

const collectInstallmentPayment = {
  params: Joi.object({
    billId: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object({
    amount: Joi.number().positive().required(),
    paymentMethod: Joi.string().max(50).optional(),
    transactionId: Joi.string().max(100).optional().allow('', null),
    notes: Joi.string().max(500).optional().allow('', null),
    branchId: Joi.string().uuid().optional()
  })
};

const getBillPayments = {
  params: Joi.object({
    billId: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

const processRefund = {
  params: Joi.object({
    billId: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object({
    amount: Joi.number().positive().required(),
    reason: Joi.string().max(500).required(),
    paymentTransactionId: Joi.string().uuid().optional().allow('', null),
    branchId: Joi.string().uuid().optional()
  })
};

const listRefunds = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    status: Joi.string().max(50).optional(),
    billId: Joi.string().uuid().optional()
  })
};

const submitClaim = {
  query: commonBranchQuery,
  body: Joi.object({
    billId: Joi.string().max(100).optional().allow('', null),
    patientId: Joi.string().uuid().required(),
    insuranceProvider: Joi.string().max(200).required(),
    policyNumber: Joi.string().max(100).required(),
    cardNumber: Joi.string().max(100).optional().allow('', null),
    preAuthAmount: Joi.number().min(0).optional(),
    claimAmount: Joi.number().positive().required(),
    notes: Joi.string().max(1000).optional().allow('', null),
    branchId: Joi.string().uuid().optional()
  })
};

const getClaim = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

const updateClaim = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object({
    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED', 'SETTLED').optional(),
    approvedAmount: Joi.number().min(0).optional(),
    notes: Joi.string().max(1000).optional().allow('', null),
    settlementDate: Joi.string().isoDate().optional().allow('', null),
    branchId: Joi.string().uuid().optional()
  })
};

const listClaims = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED', 'SETTLED').optional(),
    patientId: Joi.string().uuid().optional(),
    billId: Joi.string().uuid().optional()
  })
};

const submitDiscountRequest = {
  query: commonBranchQuery,
  body: Joi.object({
    billId: Joi.string().uuid().required(),
    discountAmount: Joi.number().positive().required(),
    discountType: Joi.string().valid('percentage', 'flat').required(),
    discountValue: Joi.number().min(0).required(),
    reason: Joi.string().max(500).required(),
    branchId: Joi.string().uuid().optional()
  })
};

const getDiscountRequest = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery
};

const updateDiscountRequest = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  query: commonBranchQuery,
  body: Joi.object({
    status: Joi.string().valid('APPROVED', 'REJECTED').required(),
    notes: Joi.string().max(500).optional().allow('', null),
    branchId: Joi.string().uuid().optional()
  })
};

const listDiscountRequests = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').optional(),
    billId: Joi.string().uuid().optional()
  })
};

const listTariffs = {
  query: Joi.object({
    branchId: Joi.string().uuid().optional(),
    category: Joi.string().max(100).optional(),
    active: Joi.string().valid('true', 'false').optional()
  })
};

const upsertTariff = {
  query: commonBranchQuery,
  body: Joi.object({
    category: Joi.string().max(100).required(),
    serviceCode: Joi.string().max(100).required(),
    serviceName: Joi.string().max(200).required(),
    standardPrice: Joi.number().min(0).required(),
    active: Joi.boolean().optional(),
    branchId: Joi.string().uuid().optional()
  })
};

const getFinanceReports = {
  query: commonBranchQuery
};

const getFinanceAlerts = {
  query: commonBranchQuery
};

module.exports = {
  getOPDBillingRecords,
  getOPDBillingDetails,
  collectOPDPayment,
  getIPDBillingRecords,
  getIPDBillingDetails,
  getServiceCatalog,
  createBill,
  getInvoiceById,
  getAllPayments,
  getPaymentSummary,
  collectInstallmentPayment,
  getBillPayments,
  processRefund,
  listRefunds,
  submitClaim,
  getClaim,
  updateClaim,
  listClaims,
  submitDiscountRequest,
  getDiscountRequest,
  updateDiscountRequest,
  listDiscountRequests,
  listTariffs,
  upsertTariff,
  getFinanceReports,
  getFinanceAlerts
};
