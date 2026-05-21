const tasksService = require("./tasks.service");
const prisma = require("../../database/prisma");

const resolveBranchId = async (req) => {
  let branchId = req.query.branchId || req.body.branchId || req.user.branchId;

  if (branchId) {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch || !branch.isDbInitialized) branchId = null;
  }

  if (!branchId) {
    const firstBranch = await prisma.branch.findFirst({ where: { isDbInitialized: true } });
    if (firstBranch) branchId = firstBranch.id;
  }

  return branchId;
};

const getTasks = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    const tasks = await tasksService.getTasks(branchId, req.query);
    res.json(tasks);
  } catch (error) {
    console.error("Error in getTasks:", error);
    res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    const task = await tasksService.createTask(branchId, req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error in createTask:", error);
    res.status(500).json({ error: error.message });
  }
};

const getTasksFilters = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    const filters = await tasksService.getTasksFilters(branchId);
    res.json(filters);
  } catch (error) {
    console.error("Error in getTasksFilters:", error);
    res.status(500).json({ error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    const task = await tasksService.getTaskById(branchId, req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (error) {
    console.error("Error in getTaskById:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const branchId = await resolveBranchId(req);
    if (!branchId) return res.status(400).json({ error: "No initialized branches found." });

    const task = await tasksService.updateTask(branchId, req.params.id, req.body);
    res.json(task);
  } catch (error) {
    console.error("Error in updateTask:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTasksFilters,
  getTaskById,
  updateTask,
};
