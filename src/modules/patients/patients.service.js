const { getTenantClient } = require("../../database/tenant-manager");
const prisma = require("../../database/prisma");
const crypto = require("crypto");

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

const getOrCreatePatientPrescription = async (branchId, patientId, userId, userName) => {
  const tenantDb = await getTenantClient(branchId);

  // 1. Try to find the latest prescription for this patient
  let prescription = await tenantDb.prescription.findFirst({
    where: { patientId },
    include: {
      items: {
        include: {
          medicine: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  if (prescription) {
    return prescription;
  }

  // 2. If no prescription exists, check for a completed consultation for this patient
  let consultation = await tenantDb.consultation.findFirst({
    where: { patientId },
    orderBy: { createdAt: "desc" }
  });

  if (!consultation) {
    // We need to create an ad-hoc appointment and consultation first
    const appointmentId = crypto.randomUUID();
    const appt = await tenantDb.appointment.create({
      data: {
        id: appointmentId,
        patientId,
        dateTime: new Date(),
        status: "COMPLETED",
        notes: "Auto-generated for admitted patient medication",
        tokenNumber: `IPD-${patientId.substring(0, 4).toUpperCase()}`
      }
    });

    // Create a consultation
    consultation = await tenantDb.consultation.create({
      data: {
        id: crypto.randomUUID(),
        appointmentId: appt.id,
        patientId,
        doctorId: userId || null,
        doctorName: userName || "Staff",
        chiefComplaints: "Admitted Patient Medication MAR",
        status: "COMPLETED"
      }
    });
  }

  // 3. Create the prescription
  prescription = await tenantDb.prescription.create({
    data: {
      id: crypto.randomUUID(),
      consultationId: consultation.id,
      patientId,
      doctorId: userId || null,
      doctorName: userName || "Staff",
      instructions: "Medication MAR"
    },
    include: {
      items: {
        include: {
          medicine: true
        }
      }
    }
  });

  return prescription;
};

const getPatientNotes = async (branchId, patientId) => {
  const tenantDb = await getTenantClient(branchId);
  return await tenantDb.patientNote.findMany({
    where: { patientId },
    orderBy: { createdAt: 'desc' }
  });
};

const createPatientNote = async (branchId, patientId, noteData) => {
  const tenantDb = await getTenantClient(branchId);
  return await tenantDb.patientNote.create({
    data: {
      patientId,
      authorId: noteData.authorId || null,
      authorName: noteData.authorName || "Staff",
      authorRole: noteData.authorRole || "Staff",
      content: noteData.content,
      fileUrl: noteData.fileUrl || null
    }
  });
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getOrCreatePatientPrescription,
  getPatientNotes,
  createPatientNote
};
