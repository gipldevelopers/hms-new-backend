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
    
    console.log('📡 Fetching occupancy analytics...');
    const res = await fetch('http://localhost:5050/api/wards/occupancy-analytics', {
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
    console.log('Stats:', data.stats);
    console.log('Metrics count:', data.metrics.length);
    console.log('WardOverview:', data.wardOverview);
    console.log('Alerts count:', data.alerts.length);
    console.log('Actions count:', data.actions.length);
    console.log('Activity count:', data.activity.length);
    console.log('Live Bed Status count:', data.liveBedStatus.length);
    console.log('Sample Live Bed:', data.liveBedStatus.slice(0, 3));
    
  } catch (err) {
    console.error('❌ API Test Failed:', err.message);
  }
}

test();
