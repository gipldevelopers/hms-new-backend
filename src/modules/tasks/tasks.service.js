const tenantManager = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");

const createTask = async (branchId, data) => {
  const tx = await tenantManager.getTenantClient(branchId);

  // Sync to global as well
  const globalPatient = await prisma.patient.findUnique({
    where: { id: data.patientId }
  });

  const task = await tx.task.create({
    data: {
      patientId: data.patientId,
      title: data.title,
      description: data.description || "",
      bedLabel: data.bedLabel || "",
      priority: data.priority || "MEDIUM",
      dueDate: data.dueDate || "",
      assignedToId: data.assignedToId || null,
      status: data.status || "Pending",
    },
    include: {
      patient: true,
      assignedTo: true,
    }
  });

  if (globalPatient) {
    try {
      await prisma.task.create({
        data: {
          id: task.id,
          patientId: task.patientId,
          branchId: branchId,
          title: task.title,
          description: task.description,
          bedLabel: task.bedLabel,
          priority: task.priority,
          dueDate: task.dueDate,
          assignedToId: task.assignedToId,
          status: task.status,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        }
      });
    } catch (e) {
      console.error("Failed to sync task to global", e);
    }
  }

  return task;
};

const getTasks = async (branchId, query = {}) => {
  const tx = await tenantManager.getTenantClient(branchId);
  const { search, priority, status, ward, patientId, time } = query;

  const whereClause = {};

  if (patientId) {
    whereClause.patientId = patientId;
  }

  if (priority) {
    whereClause.priority = priority;
  }

  if (status) {
    whereClause.status = status;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      {
        patient: {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } }
          ]
        }
      }
    ];
  }

  if (ward) {
    // If ward is e.g. "A-", filter bedLabel starting with ward
    whereClause.bedLabel = { startsWith: ward, mode: 'insensitive' };
  }

  const tasks = await tx.task.findMany({
    where: whereClause,
    include: {
      patient: true,
      assignedTo: true,
    },
    orderBy: { createdAt: "desc" },
  });

  let filteredTasks = tasks;

  if (time) {
    const isToday = (d) => {
      const today = new Date();
      return d.getDate() === today.getDate() &&
             d.getMonth() === today.getMonth() &&
             d.getFullYear() === today.getFullYear();
    };

    const isThisWeek = (d) => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 7);
      endOfWeek.setHours(23, 59, 59, 999);
      
      return d >= startOfWeek && d <= endOfWeek;
    };

    filteredTasks = tasks.filter(t => {
      if (!t.dueDate) return false;
      try {
        const datePart = t.dueDate.split(",")[0].trim();
        const parsedDate = new Date(datePart);
        if (isNaN(parsedDate.getTime())) return false;
        
        if (time === "today") {
          return isToday(parsedDate);
        }
        if (time === "week") {
          return isThisWeek(parsedDate);
        }
      } catch (err) {
        console.error("Failed to parse dueDate string:", t.dueDate, err);
      }
      return false;
    });
  }

  // Map to frontend expected shape
  return filteredTasks.map(t => {
    const patientName = t.patient.name || `${t.patient.firstName || ""} ${t.patient.lastName || ""}`.trim() || "Unknown";
    return {
      id: t.id,
      patientId: t.patientId,
      patient: patientName,
      bed: t.bedLabel || "--",
      title: t.title,
      description: t.description || "",
      priority: t.priority,
      dueTime: t.dueDate || "--",
      assignedTo: t.assignedTo ? t.assignedTo.name || t.assignedTo.email : "Unassigned",
      status: t.status,
    };
  });
};

const getTasksFilters = async (branchId) => {
  const tx = await tenantManager.getTenantClient(branchId);

  // Get active admissions to fetch patients + bed labels
  const admissions = await tx.admission.findMany({
    where: { status: "In Progress" },
    include: {
      patient: true,
      bed: true
    }
  });

  // Deduplicate patients by unique ID
  const uniquePatientsMap = new Map();
  admissions.forEach(adm => {
    if (adm.patient && !uniquePatientsMap.has(adm.patient.id)) {
      const p = adm.patient;
      const name = p.name || `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Unknown";
      uniquePatientsMap.set(p.id, {
        id: p.id,
        name: name,
        bed: adm.bed?.label || ""
      });
    }
  });
  const formattedPatients = Array.from(uniquePatientsMap.values());

  // Fetch all staff users
  const staffUsers = await tx.tenantUser.findMany({
    where: {
      role: { in: ["STAFF", "DOCTOR", "BRANCH_ADMIN"] }
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  const formattedNurses = staffUsers.map(u => ({
    id: u.id,
    name: u.name || u.email
  }));

  return {
    patients: formattedPatients,
    nurses: formattedNurses
  };
};

const getTaskById = async (branchId, id) => {
  const tx = await tenantManager.getTenantClient(branchId);
  const task = await tx.task.findUnique({
    where: { id },
    include: {
      patient: true,
      assignedTo: true,
    }
  });
  if (!task) return null;
  const patientName = task.patient.name || `${task.patient.firstName || ""} ${task.patient.lastName || ""}`.trim() || "Unknown";
  return {
    id: task.id,
    patientId: task.patientId,
    patient: patientName,
    bed: task.bedLabel || "--",
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    dueTime: task.dueDate || "--",
    assignedTo: task.assignedTo ? task.assignedTo.name || task.assignedTo.email : "Unassigned",
    status: task.status,
    createdAt: task.createdAt,
  };
};

const updateTask = async (branchId, id, data) => {
  const tx = await tenantManager.getTenantClient(branchId);
  const updated = await tx.task.update({
    where: { id },
    data: {
      status: data.status,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate,
      assignedToId: data.assignedToId,
    },
    include: {
      patient: true,
      assignedTo: true,
    }
  });

  // Sync to global
  try {
    await prisma.task.update({
      where: { id },
      data: {
        status: updated.status,
        description: updated.description,
        priority: updated.priority,
        dueDate: updated.dueDate,
        assignedToId: updated.assignedToId,
      }
    });
  } catch (e) {
    console.error("Failed to sync updated task to global", e);
  }

  const patientName = updated.patient.name || `${updated.patient.firstName || ""} ${updated.patient.lastName || ""}`.trim() || "Unknown";
  return {
    id: updated.id,
    patientId: updated.patientId,
    patient: patientName,
    bed: updated.bedLabel || "--",
    title: updated.title,
    description: updated.description || "",
    priority: updated.priority,
    dueTime: updated.dueDate || "--",
    assignedTo: updated.assignedTo ? updated.assignedTo.name || updated.assignedTo.email : "Unassigned",
    status: updated.status,
    createdAt: updated.createdAt,
  };
};

module.exports = {
  createTask,
  getTasks,
  getTasksFilters,
  getTaskById,
  updateTask,
};
