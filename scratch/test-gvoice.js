const fs = require('fs');
const path = require('path');

const API_KEY = "gvoice_cloude_token_91397451381891287337006525737690";
const BASE_URL = "https://cloud.gvoice.app/api/";

async function testUpload(endpoint, fileFieldName = 'file', reduceSize = 'true') {
  console.log(`\nTesting ${endpoint} with field '${fileFieldName}', reduce_size: '${reduceSize}'`);
  
  try {
    const formData = new FormData();
    // Create a simple valid 1x1 PNG image buffer
    const validPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    const blob = new Blob([validPng], { type: 'image/png' });
    
    formData.append(fileFieldName, blob, 'test.png');
    formData.append('api_key', API_KEY);
    formData.append('reduce_size', reduceSize);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
    });
    
    const status = response.status;
    const text = await response.text();
    console.log(`Status: ${status}`);
    console.log(`Response: ${text}`);
  } catch (error) {
    console.error(`Error testing:`, error.message);
  }
}

async function main() {
  // Test 1: upload-image.php with reduce_size = true
  await testUpload('upload-image.php', 'image', 'true');
  
  // Test 2: upload-image.php with reduce_size = false
  await testUpload('upload-image.php', 'image', 'false');
  
  // Test 3: upload-image.php WITHOUT reduce_size
  console.log("\nTesting upload-image.php without reduce_size");
  try {
    const formData = new FormData();
    const validPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    const blob = new Blob([validPng], { type: 'image/png' });
    formData.append('image', blob, 'test.png');
    formData.append('api_key', API_KEY);
    const response = await fetch(`${BASE_URL}upload-image.php`, {
      method: 'POST',
      body: formData,
    });
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${await response.text()}`);
  } catch (e) {
    console.error(e);
  }
}

main();
