const Joi = require('joi');
const { createTransferValidation } = require('../src/modules/stock-transfer/stock-transfer.validation');

console.log('Testing Custom Stock Transfer Validation Schemas...');

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

// 1. Valid payload
assertPass(createTransferValidation, {
  transferId: 'TX-2026-9999',
  source: 'Central Store',
  destination: 'O.T. Recovery Unit',
  date: '2026-06-26',
  items: [
    {
      id: 'e2555bbe-b238-4dcf-b847-66189d55d34f',
      sku: 'ITM-90234',
      name: 'Propofol 10mg/ml',
      qty: '5'
    }
  ],
  notes: 'test transfer'
}, 'valid stock transfer payload');

// 2. Invalid: empty items list
assertFail(createTransferValidation, {
  source: 'Central Store',
  destination: 'O.T. Recovery Unit',
  items: []
}, 'empty items array should fail');

// 3. Invalid: missing name in item object
assertFail(createTransferValidation, {
  source: 'Central Store',
  destination: 'O.T. Recovery Unit',
  items: [
    {
      id: 'e2555bbe-b238-4dcf-b847-66189d55d34f',
      sku: 'ITM-90234',
      qty: '5'
    }
  ]
}, 'missing item name should fail');

console.log('\n🎉 ALL STOCK TRANSFER VALIDATION TESTS PASSED!');
