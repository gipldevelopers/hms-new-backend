const prisma = require("../../database/prisma");

const createBranch = async (data) => {
  return await prisma.branch.create({
    data,
  });
};

const getAllBranches = async () => {
  return await prisma.branch.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const getBranchById = async (id) => {
  return await prisma.branch.findUnique({
    where: { id },
  });
};

const updateBranch = async (id, data) => {
  return await prisma.branch.update({
    where: { id },
    data,
  });
};

const deleteBranch = async (id) => {
  return await prisma.branch.delete({
    where: { id },
  });
};

const getBranchStats = async () => {
  const totalBranches = await prisma.branch.count();
  // Since we don't have depts, beds, staff data yet, we'll return 0 or placeholder
  return {
    totalBranches,
    totalDepartments: 0,
    totalBeds: 0,
    totalStaff: 0,
  };
};

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getBranchStats,
};
