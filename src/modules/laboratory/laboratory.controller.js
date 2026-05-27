const svc = require("./laboratory.service");

const getBranchId = async (req) => {
  const raw = req.body?.branchId || req.query?.branchId || req.branchId || req.user?.branchId;
  return svc.resolveBranchId(raw);
};

const listOrders = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const orders = await svc.listOrders(branchId);
    res.json({ success: true, data: orders });
  } catch (e) {
    console.error("Error fetching lab orders:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const searchPatients = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const patients = await svc.searchPatients(branchId, req.query.search || "");
    res.json({ success: true, data: patients });
  } catch (e) {
    console.error("Error searching lab patients:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const listTests = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const tests = await svc.listAvailableTests(branchId, req.query.search || "");
    res.json({ success: true, data: tests });
  } catch (e) {
    console.error("Error fetching lab tests:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const getClinicalOptions = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const options = await svc.getClinicalOptions(branchId);
    res.json({ success: true, data: options });
  } catch (e) {
    console.error("Error fetching lab clinical options:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const order = await svc.createOrder(branchId, req.body, req.user);
    res.status(201).json({ success: true, data: order, message: "Lab test order created" });
  } catch (e) {
    console.error("Error creating lab order:", e);
    res.status(400).json({ success: false, message: e.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const order = await svc.getOrder(branchId, req.params.id);
    res.json({ success: true, data: order });
  } catch (e) {
    console.error("Error fetching lab order:", e);
    const status = e.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const updateTestStatus = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const order = await svc.updateTestStatus(branchId, req.params.id, req.params.testId);
    res.json({ success: true, data: order, message: "Test status updated" });
  } catch (e) {
    console.error("Error updating lab test status:", e);
    const status = e.message.includes("not found") ? 404 : 400;
    res.status(status).json({ success: false, message: e.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status parameter is required" });
    }

    const order = await svc.updateOrderStatus(branchId, req.params.id, status);
    res.json({ success: true, data: order, message: "Order status updated" });
  } catch (e) {
    console.error("Error updating order status:", e);
    const status = e.message.includes("not found") ? 404 : 400;
    res.status(status).json({ success: false, message: e.message });
  }
};

module.exports = {
  searchPatients,
  listTests,
  getClinicalOptions,
  listOrders,
  createOrder,
  getOrder,
  updateTestStatus,
  updateOrderStatus,
};
