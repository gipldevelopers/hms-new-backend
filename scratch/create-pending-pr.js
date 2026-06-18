const API_URL = "http://localhost:5050/api";

async function run() {
  // Login
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "super.developer@gohilinfotech.com", password: "super@123" })
  });
  const loginResult = await loginRes.json();
  const token = loginResult.data.authtoken;
  const user = loginResult.data.user;
  console.log("✅ Login OK, token acquired.", user);

  const branchId = user.branchId;

  // Create a new pending Purchase Request
  const prRes = await fetch(`${API_URL}/approvals?branchId=${branchId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      prNumber: `PR-2024-TEST-${Math.floor(100 + Math.random() * 900)}`,
      department: "Cardiology Department",
      requestedBy: "Dr. Gregory House",
      priority: "Urgent",
      items: [
        { id: 1, name: "Premium Heart Valves (Model A)", qty: 10, unitPrice: 9000, total: 90000, sku: "SKU-VALVE-A", unit: "Units" }
      ]
    })
  });

  const prResult = await prRes.json();
  console.log("Create PR Result:", JSON.stringify(prResult, null, 2));
}

run().catch(console.error);
