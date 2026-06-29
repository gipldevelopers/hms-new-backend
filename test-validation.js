const Joi = require('joi');
const billingValidation = require('./src/modules/billing/billing.validation');
const financeValidation = require('./src/modules/finance/finance.validation');
const labValidation = require('./src/modules/lab-inventory/lab-inventory.validation');
const batchExpiryValidation = require('./src/modules/batch-expiry/batch-expiry.validation');

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

console.log('\nTesting Lab Inventory Validation Schemas...');

// Lab createItemValidation
assertPass(labValidation.createItemValidation, {
  name: 'Lab Test Tube',
  sku: 'TT-500',
  category: 'Glassware',
  qty: '500 Pcs',
  expiry: '2028-12-31',
  unitPrice: 1.5
}, 'valid lab item creation');

assertFail(labValidation.createItemValidation, {
  name: 'Lab Test Tube',
  sku: 'TT-500',
  category: 'Glassware'
}, 'invalid lab item creation (missing qty & expiry)');

// Lab updateItemValidation
assertPass(labValidation.updateItemValidation, {
  name: 'Updated Tube Name',
  unitPrice: 2.0
}, 'valid lab item update');

// Lab adjustStockValidation
assertPass(labValidation.adjustStockValidation, {
  type: 'Addition',
  qtyChanged: 10,
  notes: 'Received shipment'
}, 'valid lab stock addition');

assertPass(labValidation.adjustStockValidation, {
  type: 'Usage',
  qtyChanged: 5.5,
  notes: 'Used in blood lab'
}, 'valid lab stock usage');

assertFail(labValidation.adjustStockValidation, {
  type: 'Addition',
  qtyChanged: -10
}, 'invalid lab stock adjust (negative qtyChanged)');

assertFail(labValidation.adjustStockValidation, {
  type: 'InvalidType',
  qtyChanged: 10
}, 'invalid lab stock adjust (invalid type enum)');

console.log('\nTesting Batch Expiry Validation Schemas...');

assertPass(batchExpiryValidation.processReturnValidation, {
  itemId: 'item-uuid-1234',
  returnQty: 25,
  vendor: 'Pfizer Inc.',
  reason: 'Near Expiry',
  settlementMode: 'Credit Note',
  returnNote: 'Near expiry batch return'
}, 'valid batch return with number quantity');

assertPass(batchExpiryValidation.processReturnValidation, {
  itemId: 'item-uuid-1234',
  returnQty: '10.5',
  vendor: 'Roche Diagnostics'
}, 'valid batch return with string decimal quantity');

assertFail(batchExpiryValidation.processReturnValidation, {
  itemId: 'item-uuid-1234',
  returnQty: -5
}, 'invalid batch return (negative returnQty)');

assertFail(batchExpiryValidation.processReturnValidation, {
  returnQty: 25,
  vendor: 'Pfizer Inc.'
}, 'invalid batch return (missing itemId)');

console.log('\n🎉 Programmatic validation check successful!');
