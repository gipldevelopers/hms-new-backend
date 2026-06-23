const Joi = require('joi');
const billingValidation = require('./src/modules/billing/billing.validation');
const financeValidation = require('./src/modules/finance/finance.validation');

console.log('Testing Billing Validation Schemas...');

const assertPass = (schema, val, msg) => {
  const { error } = schema.validate(val);
  if (error) {
    console.error(`❌ FAILED: ${msg}. Error:`, error.message);
    process.exit(1);
  } else {
    console.log(`   ✅ PASSED: ${msg}`);
  }
};

const assertFail = (schema, val, msg) => {
  const { error } = schema.validate(val);
  if (!error) {
    console.error(`❌ FAILED: Expected failure for ${msg} but it passed.`);
    process.exit(1);
  } else {
    console.log(`   ✅ PASSED: ${msg} failed as expected. Error:`, error.message);
  }
};

// 1. getOPDBillingDetails (uhid or patient name required)
assertPass(billingValidation.getOPDBillingDetails.query, { uhid: 'UHID-123456' }, 'uhid provided');
assertPass(billingValidation.getOPDBillingDetails.query, { patient: 'John Doe' }, 'patient provided');
assertPass(billingValidation.getOPDBillingDetails.query, { uhid: 'UHID-123456', patient: 'John Doe' }, 'both provided');
assertFail(billingValidation.getOPDBillingDetails.query, {}, 'none provided');

// 2. createBill
assertPass(billingValidation.createBill.body, {
  patientId: 'a38fa2e0-264b-4a57-bc4f-4d4df0120194',
  items: [{ name: 'Consultation', qty: 1, price: 300 }]
}, 'valid createBill');

assertFail(billingValidation.createBill.body, {
  patientId: 'not-a-uuid',
  items: [{ name: 'Consultation', qty: 1, price: 300 }]
}, 'invalid patientId uuid');

assertFail(billingValidation.createBill.body, {
  patientId: 'a38fa2e0-264b-4a57-bc4f-4d4df0120194',
  items: []
}, 'empty items array');

// 3. updateClaim
assertPass(billingValidation.updateClaim.body, {
  status: 'APPROVED',
  approvedAmount: 1200
}, 'valid updateClaim');

assertFail(billingValidation.updateClaim.body, {
  status: 'INVALID_STATUS'
}, 'invalid status enum');

console.log('\n🎉 Programmatic validation check successful!');
