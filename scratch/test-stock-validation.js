const Joi = require('joi');
const stockValidation = require('../src/modules/stock-inventory/stock-inventory.validation');

console.log('Testing Custom Stock Inventory Validation Schemas...');

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

// 1. createItemValidation
assertPass(stockValidation.createItemValidation, {
  name: 'Propofol 10mg/ml (20ml)',
  sku: 'ITM-90234',
  category: 'Anesthetics',
  qty: '3100 Ampoules',
  expiry: '24 Months',
  status: 'In Stock',
  supplier: 'Baxter Healthcare',
  minThreshold: '1000',
  notes: 'Induction agent',
  unitPrice: 12.5
}, 'valid createItemValidation with string values');

assertFail(stockValidation.createItemValidation, {
  sku: 'ITM-90234',
  category: 'Anesthetics',
  qty: '3100',
  expiry: '24 Months'
}, 'invalid createItemValidation missing name');

// 2. updateItemValidation
assertPass(stockValidation.updateItemValidation, {
  name: 'Propofol 10mg/ml'
}, 'valid updateItemValidation (partial name update)');

assertPass(stockValidation.updateItemValidation, {
  qty: '4000 Ampoules',
  minThreshold: '500'
}, 'valid updateItemValidation (partial qty/threshold)');

// 3. adjustStockValidation
assertPass(stockValidation.adjustStockValidation, {
  qtyChanged: 20,
  type: 'Addition',
  notes: 'Restocked'
}, 'valid adjustStockValidation with positive number');

assertPass(stockValidation.adjustStockValidation, {
  qtyChanged: '20',
  type: 'Usage'
}, 'valid adjustStockValidation with string representing positive number');

assertFail(stockValidation.adjustStockValidation, {
  qtyChanged: -20,
  type: 'Addition'
}, 'invalid adjustStockValidation with negative number');

assertFail(stockValidation.adjustStockValidation, {
  qtyChanged: 20,
  type: 'InvalidType'
}, 'invalid adjustStockValidation with bad type');

console.log('\n🎉 All custom Stock Inventory validation checks successful!');
