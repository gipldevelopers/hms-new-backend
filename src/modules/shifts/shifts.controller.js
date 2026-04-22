const shiftsService = require("./shifts.service");

// --- SHIFT TEMPLATES ---

const getAllTemplates = async (req, res) => {
  try {
    const { branchId } = req.query;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    const templates = await shiftsService.getAllTemplates(branchId);
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTemplate = async (req, res) => {
  try {
    const { branchId } = req.body;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    const template = await shiftsService.createTemplate(branchId, req.body);
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchId } = req.body;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    const template = await shiftsService.updateTemplate(id, branchId, req.body);
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchId } = req.query;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    await shiftsService.deleteTemplate(id, branchId);
    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- SHIFT ROSTER ---

const getRoster = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;
    if (!branchId || !startDate || !endDate) {
      return res.status(400).json({ error: "branchId, startDate and endDate are required" });
    }
    
    const roster = await shiftsService.getRoster(branchId, startDate, endDate);
    res.json(roster);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRosterEntry = async (req, res) => {
  try {
    const { branchId } = req.body;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    const entry = await shiftsService.createRosterEntry(branchId, req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRosterEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchId } = req.body;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    const entry = await shiftsService.updateRosterEntry(id, branchId, req.body);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRosterEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchId } = req.query;
    if (!branchId) return res.status(400).json({ error: "Branch ID is required" });
    
    await shiftsService.deleteRosterEntry(id, branchId);
    res.json({ message: "Roster entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getRoster,
  createRosterEntry,
  updateRosterEntry,
  deleteRosterEntry
};
