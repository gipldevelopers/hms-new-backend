const userService = require("./users.service");

const getAllUsers = async (req, res) => {
  try {
    const { role, branchId, search } = req.query;
    const users = await userService.getAllUsers({ role, branchId, search });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user, message: "User provisioned successfully across registries" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user, message: "User profile updated and synchronized" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: "User access revoked and purged from system" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await userService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getStats
};
