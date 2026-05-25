/**
 * Test script for Doctor OPD API endpoints
 * Run with: node test-doctor-opd.js
 */

const BASE_URL = 'http://localhost:3000/api/doctor-opd';

// You'll need to replace this with a valid JWT token from your login
const AUTH_TOKEN = 'YOUR_JWT_TOKEN_HERE';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`
};

async function testEndpoints() {
  console.log('🧪 Testing Doctor OPD API Endpoints\n');

  try {
    // 1. Get OPD Stats
    console.log('1️⃣ Testing GET /stats');
    const statsRes = await fetch(`${BASE_URL}/stats`, { headers });
    const stats = await statsRes.json();
    console.log('Stats:', stats);
    console.log('');

    // 2. Get Today's OPD Patients
    console.log('2️⃣ Testing GET /patients');
    const patientsRes = await fetch(`${BASE_URL}/patients`, { headers });
    const patients = await patientsRes.json();
    console.log('Patients:', patients);
    console.log('');

    // 3. Get Medicines
    console.log('3️⃣ Testing GET /medicines');
    const medicinesRes = await fetch(`${BASE_URL}/medicines?search=para`, { headers });
    const medicines = await medicinesRes.json();
    console.log('Medicines:', medicines);
    console.log('');

    // If there are patients, test patient details
    if (patients.success && patients.data.length > 0) {
      const firstPatient = patients.data[0];
      console.log(`4️⃣ Testing GET /patients/${firstPatient.appointmentId}`);
      const detailsRes = await fetch(`${BASE_URL}/patients/${firstPatient.appointmentId}`, { headers });
      const details = await detailsRes.json();
      console.log('Patient Details:', details);
      console.log('');
    }

    console.log('✅ All tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testEndpoints();
