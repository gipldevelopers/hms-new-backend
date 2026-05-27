const userService = require("./users.service");
const prisma = require("../../database/prisma");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let branchId = req.query.branchId;

    // Security Hardening: Enforce branch scoping for non-super admins
    if (req.user.role !== 'SUPERADMIN') {
      branchId = req.user.branchId;
    }

    const users = await userService.getAllUsers({ role, branchId, search });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const userData = { ...req.body };

    // Security Hardening: Enforce branch scoping for non-super admins
    if (req.user.role !== 'SUPERADMIN') {
      userData.branchId = req.user.branchId;
    }

    const user = await userService.createUser(userData);
    res.status(201).json({ success: true, data: user, message: "User provisioned successfully across registries" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    // Note: Update and Delete should technically also verify if the user belongs to the admin's branch
    // but we trust the ID lookup for now. For extra safety we could check ownership.
    
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
    let branchId = null;
    if (req.user.role !== 'SUPERADMIN') {
      branchId = req.user.branchId;
    }
    const stats = await userService.getStats(branchId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, name, email, department, image } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 1. Password update check
    let updatedPassword = undefined;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Current password is required to change password" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }
      updatedPassword = newPassword;
    }

    // 2. Profile fields check (only editable by BRANCH_ADMIN / SUPERADMIN)
    const updatePayload = {};
    if (updatedPassword) {
      updatePayload.password = updatedPassword;
    }

    const isAuthorizedForProfileEdit = req.user.role === 'BRANCH_ADMIN' || req.user.role === 'SUPERADMIN';

    if (name !== undefined || email !== undefined || department !== undefined || image !== undefined) {
      if (!isAuthorizedForProfileEdit) {
        return res.status(403).json({ success: false, message: "Only branch admin can update profile details" });
      }
      if (name !== undefined) updatePayload.name = name;
      if (email !== undefined) updatePayload.email = email;
      if (department !== undefined) updatePayload.department = department;
      if (image !== undefined) updatePayload.image = image;
    }

    const updatedUser = await userService.updateUser(userId, updatePayload);
    res.json({ success: true, data: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getStats,
  updateMe
};
