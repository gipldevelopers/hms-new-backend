async function run() {
  const API_URL = "http://localhost:5050/api";

  // Login
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "super.developer@gohilinfotech.com", password: "super@123" })
  });
  const loginResult = await loginRes.json();
  const token = loginResult.data.authtoken;
  console.log("✅ Login OK, token acquired.");

  const branchId = "0369346a-3e61-4872-90b8-a575a0c5f4df";

  // Hit the stats endpoint
  const statsRes = await fetch(`${API_URL}/supplier/stats/summary?branchId=${branchId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log("Stats response status:", statsRes.status);
  const statsResult = await statsRes.json();
  console.log("Stats data:", JSON.stringify(statsResult, null, 2));
}

run().catch(console.error);
