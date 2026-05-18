const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");

const getAllPatients = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);
  return await tenantDb.patient.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      admissions: {
        where: { status: 'In Progress' },
        select: { id: true }
      }
    }
  });
};

const getPatientById = async (branchId, patientId) => {
  const tenantDb = await getTenantClient(branchId);
  return await tenantDb.patient.findUnique({
    where: { id: patientId },
    include: {
      admissions: {
        include: {
          bed: true,
          ward: true,
          doctor: true,
          department: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
};

const createPatient = async (branchId, data) => {
  const tenantDb = await getTenantClient(branchId);
  
  // 1. Create in Tenant DB
  const tenantPatient = await tenantDb.patient.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || null,
      age: data.age ? parseInt(data.age) : null,
      gender: data.gender || null,
      dob: data.dob ? new Date(data.dob) : null,
      contact: data.contact,
      alternateMobile: data.alternateMobile,
      email: data.email,
      maritalStatus: data.maritalStatus,
      bloodGroup: data.bloodGroup,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,
      aadhaar: data.aadhaar,
      pan: data.pan,
      passport: data.passport,
      idProofUrl: data.idProofUrl,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      status: data.status || "Complete",
    }
  });

  // 2. Create in Main DB for global tracking
  await prisma.patient.create({
    data: {
      id: tenantPatient.id, // Sync ID
      firstName: data.firstName,
      lastName: data.lastName,
      name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || null,
      age: data.age ? parseInt(data.age) : null,
      gender: data.gender || null,
      dob: data.dob ? new Date(data.dob) : null,
      contact: data.contact,
      alternateMobile: data.alternateMobile,
      email: data.email,
      maritalStatus: data.maritalStatus,
      bloodGroup: data.bloodGroup,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,
      aadhaar: data.aadhaar,
      pan: data.pan,
      passport: data.passport,
      idProofUrl: data.idProofUrl,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      status: data.status || "Complete",
      branchId: branchId
    }
  });

  return tenantPatient;
};

const updatePatient = async (branchId, patientId, data) => {
  const tenantDb = await getTenantClient(branchId);

  // 1. Update in Tenant DB
  const updatedTenantPatient = await tenantDb.patient.update({
    where: { id: patientId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || null,
      age: data.age ? parseInt(data.age) : null,
      gender: data.gender || null,
      dob: data.dob ? new Date(data.dob) : null,
      contact: data.contact,
      alternateMobile: data.alternateMobile,
      email: data.email,
      maritalStatus: data.maritalStatus,
      bloodGroup: data.bloodGroup,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,
      aadhaar: data.aadhaar,
      pan: data.pan,
      passport: data.passport,
      idProofUrl: data.idProofUrl,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      status: data.status || "Complete",
    }
  });

  // 2. Update in Main DB
  await prisma.patient.update({
    where: { id: patientId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || null,
      age: data.age ? parseInt(data.age) : null,
      gender: data.gender || null,
      dob: data.dob ? new Date(data.dob) : null,
      contact: data.contact,
      alternateMobile: data.alternateMobile,
      email: data.email,
      maritalStatus: data.maritalStatus,
      bloodGroup: data.bloodGroup,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,
      aadhaar: data.aadhaar,
      pan: data.pan,
      passport: data.passport,
      idProofUrl: data.idProofUrl,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      status: data.status || "Complete",
    }
  });

  return updatedTenantPatient;
};

const deletePatient = async (branchId, patientId) => {
  const tenantDb = await getTenantClient(branchId);

  // 1. Delete from Tenant DB
  await tenantDb.patient.delete({
    where: { id: patientId }
  });

  // 2. Delete from Main DB
  await prisma.patient.delete({
    where: { id: patientId }
  });

  return true;
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};
