const svc = require("./appointments.service");

const getBranchId = async (req) => {
  const raw = req.body?.branchId || req.query?.branchId || req.branchId || req.user?.branchId;
  return svc.resolveBranchId(raw);
};

const getStats = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    res.json({ success: true, data: await svc.getTodayStats(branchId) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getList = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    res.json({ success: true, data: await svc.getTodayAppointments(branchId, req.query) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const searchPatients = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { q } = req.query;
    res.json({ success: true, data: await svc.searchPatients(branchId, q) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getDoctors = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    res.json({ success: true, data: await svc.getDoctors(branchId) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getDepartments = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    res.json({ success: true, data: await svc.getDepartments(branchId) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getBookedSlots = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { doctorId, date } = req.query;
    if (!doctorId || !date) return res.status(400).json({ success: false, message: "doctorId and date are required." });
    res.json({ success: true, data: await svc.getBookedSlots(branchId, doctorId, date) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const book = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const data = await svc.bookAppointment(branchId, req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    const status = e.message.includes("not found") ? 404 : e.message.includes("already booked") ? 409 : 400;
    res.status(status).json({ success: false, message: e.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { status, cancelReason } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "status is required." });
    const data = await svc.updateAppointmentStatus(branchId, req.params.id, status, cancelReason);
    res.json({ success: true, data });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
};

const reschedule = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { dateTime, notes } = req.body;
    if (!dateTime) return res.status(400).json({ success: false, message: "dateTime is required." });
    const data = await svc.rescheduleAppointment(branchId, req.params.id, dateTime, notes);
    res.json({ success: true, data });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
};

const getPatientSummary = async (req, res) => {
  try {
    const branchId = await getBranchId(req);
    if (!branchId) return res.status(400).json({ success: false, message: "No initialized branch found." });
    const { patientId } = req.params;
    if (!patientId) return res.status(400).json({ success: false, message: "patientId is required." });
    const data = await svc.getPatientTodaySummary(branchId, patientId);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { getStats, getList, searchPatients, getDoctors, getDepartments, getBookedSlots, book, updateStatus, reschedule, getPatientSummary };
