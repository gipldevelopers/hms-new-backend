const prisma = require("../../database/prisma");

const getAssignmentsByBranch = async (branchId) => {
  if (!prisma.branchAssignment) {
    console.error("CRITICAL: prisma.branchAssignment is undefined. Available models:", Object.keys(prisma).filter(k => !k.startsWith('$')));
    throw new Error("Database model 'branchAssignment' not initialized in Prisma Client.");
  }
  return await prisma.branchAssignment.findMany({
    where: { branchId },
    include: {
      masterData: {
        select: { id: true, name: true, code: true }
      },
      template: {
        select: { id: true, name: true, category: true }
      }
    }
  });
};

const updateAssignments = async (branchId, masterDataIds, templateIds) => {
  if (!prisma.branchAssignment) {
      throw new Error("Database model 'branchAssignment' not initialized in Prisma Client.");
  }
  // Use a transaction to ensure atomic update
  return await prisma.$transaction(async (tx) => {
    // 1. Delete existing assignments for this branch
    await tx.branchAssignment.deleteMany({
      where: { branchId }
    });

    // 2. Create new master data assignments
    const mdAssignments = masterDataIds.map(id => ({
      branchId,
      masterDataId: id
    }));

    // 3. Create new template assignments
    const tAssignments = templateIds.map(id => ({
      branchId,
      templateId: id
    }));

    // 4. Batch create
    if (mdAssignments.length > 0) {
      await tx.branchAssignment.createMany({
        data: mdAssignments
      });
    }
    
    if (tAssignments.length > 0) {
      await tx.branchAssignment.createMany({
        data: tAssignments
      });
    }

    return { success: true };
  });
};

module.exports = {
  getAssignmentsByBranch,
  updateAssignments
};
