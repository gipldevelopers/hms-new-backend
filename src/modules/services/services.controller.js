const svc = require("./services.service");

const getBranchId = async (req) => {
  const raw = req.body?.branchId || req.query?.branchId || req.branchId || req.user?.branchId;
  return svc.resolveBranchId(raw);
};

const listRequests = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const requests = await svc.listRequests(branchId);
    res.json({ success: true, data: requests });
  } catch (e) {
    console.error("Error listing service requests:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const createRequest = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const request = await svc.createRequest(branchId, req.body);
    res.status(201).json({ success: true, data: request, message: "Service request created successfully" });
  } catch (e) {
    console.error("Error creating service request:", e);
    res.status(400).json({ success: false, message: e.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status parameter is required" });
    }

    const request = await svc.updateRequestStatus(branchId, req.params.id, status);
    res.json({ success: true, data: request, message: "Request status updated successfully" });
  } catch (e) {
    console.error("Error updating request status:", e);
    const status = e.message.includes("not found") ? 404 : 400;
    res.status(status).json({ success: false, message: e.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) {
      return res.status(400).json({ success: false, message: "No initialized branch found." });
    }

    const request = await svc.getRequestById(branchId, req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Service request not found." });
    }
    res.json({ success: true, data: request });
  } catch (e) {
    console.error("Error getting service request:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = {
  listRequests,
  createRequest,
  updateRequestStatus,
  getRequestById
};
