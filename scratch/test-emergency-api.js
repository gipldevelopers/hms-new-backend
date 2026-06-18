async function test() {
  try {
    console.log('🔑 Attempting to login...');
    const loginRes = await fetch('http://localhost:5050/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'reports.developer@gohilinfotech.com',
        password: 'reports@123'
      })
    });
    
    if (!loginRes.ok) {
      const errText = await loginRes.text();
      throw new Error(`Login failed with status ${loginRes.status}: ${errText}`);
    }
    
    const loginData = await loginRes.json();
    const token = loginData.data && loginData.data.authtoken;
    if (!token) {
      throw new Error(`No token found in login response: ${JSON.stringify(loginData)}`);
    }
    console.log('✅ Logged in successfully. Token:', token.substring(0, 15) + '...');
    
    console.log('📡 Fetching emergency analytics...');
    const res = await fetch('http://localhost:5050/api/emergency/emergency-analytics', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API call failed with status ${res.status}: ${errText}`);
    }
    
    const data = await res.json();
    console.log('✅ API Response Success!');
    console.log('Full Data Keys:', Object.keys(data.data));
    console.log('Live Alerts:', data.data.liveAlerts);
    console.log('Stats:', data.data.stats);
    console.log('WardOverview:', data.data.wardOverview);
    console.log('Alerts count:', data.data.alerts.length);
    console.log('Incoming count:', data.data.incoming.length);
    console.log('Triage Board count:', data.data.triageBoard.length);
    console.log('Sample Triage Row:', data.data.triageBoard[0]);
    
  } catch (err) {
    console.error('❌ API Test Failed:', err.message);
  }
}

test();
