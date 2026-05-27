const crypto = require("crypto");
const { getTenantClient } = require("../../database/tenant-manager");
const { resolveBranchId } = require("../doctor-opd/doctor-opd.service");

const listRequests = async (branchId) => {
  const tenantDb = await getTenantClient(branchId);

  // Auto-seeder: if database table is empty, seed initial requests matching existing patients
  const count = await tenantDb.serviceRequest.count();
  if (count === 0) {
    console.log("No service requests found. Seeding initial requests...");
    let patients = await tenantDb.patient.findMany({ take: 5 });
    
    if (patients.length === 0) {
      console.log("No patients found in tenant database. Seeding mock patients first...");
      const mockPatients = [
        {
          id: crypto.randomUUID(),
          name: "John Smith",
          firstName: "John",
          lastName: "Smith",
          age: 45,
          gender: "Male",
          contact: "9876543210",
        },
        {
          id: crypto.randomUUID(),
          name: "Sarah Jenkins",
          firstName: "Sarah",
          lastName: "Jenkins",
          age: 34,
          gender: "Female",
          contact: "9876543211",
        },
        {
          id: crypto.randomUUID(),
          name: "Michael Chang",
          firstName: "Michael",
          lastName: "Chang",
          age: 52,
          gender: "Male",
          contact: "9876543212",
        },
        {
          id: crypto.randomUUID(),
          name: "Emma Davis",
          firstName: "Emma",
          lastName: "Davis",
          age: 29,
          gender: "Female",
          contact: "9876543213",
        },
        {
          id: crypto.randomUUID(),
          name: "Robert Wilson",
          firstName: "Robert",
          lastName: "Wilson",
          age: 62,
          gender: "Male",
          contact: "9876543214",
        }
      ];

      for (const p of mockPatients) {
        await tenantDb.patient.create({ data: p }).catch(e => console.error("Error seeding patient:", e));
      }
      patients = await tenantDb.patient.findMany({ take: 5 });
    }

    const INITIAL_MOCK_REQUESTS = [
      {
        patientId: patients[0]?.id || crypto.randomUUID(),
        patientName: patients[0]?.name || "John Smith",
        bed: "W1-B12",
        requestType: "Lab Pickup",
        requestDescription: "CBC Blood Sample",
        priority: "Normal",
        dept: "Laboratory",
        status: "Pending"
      },
      {
        patientId: patients[1]?.id || patients[0]?.id || crypto.randomUUID(),
        patientName: patients[1]?.name || "Sarah Jenkins",
        bed: "W3-B04",
        requestType: "X-ray",
        requestDescription: "Chest PA view",
        priority: "Urgent",
        dept: "Radiology",
        status: "Accepted"
      },
      {
        patientId: patients[2]?.id || patients[0]?.id || crypto.randomUUID(),
        patientName: patients[2]?.name || "Michael Chang",
        bed: "W1-B08",
        requestType: "Housekeeping",
        requestDescription: "Bed spill cleanup",
        priority: "Urgent",
        dept: "Facilities",
        status: "Pending"
      },
      {
        patientId: patients[3]?.id || patients[0]?.id || crypto.randomUUID(),
        patientName: patients[3]?.name || "Emma Davis",
        bed: "W2-B22",
        requestType: "Physiotherapy",
        requestDescription: "Post-op mobility",
        priority: "Normal",
        dept: "Therapy",
        status: "Completed"
      },
      {
        patientId: patients[4]?.id || patients[0]?.id || crypto.randomUUID(),
        patientName: patients[4]?.name || "Robert Wilson",
        bed: "ICU-02",
        requestType: "Blood Bank",
        requestDescription: "2 Units O+ PRBC",
        priority: "Urgent",
        dept: "Blood Bank",
        status: "Accepted"
      }
    ];

    for (const r of INITIAL_MOCK_REQUESTS) {
      await tenantDb.serviceRequest.create({ data: r }).catch(e => console.error("Error seeding request:", e));
    }
  }

  return tenantDb.serviceRequest.findMany({
    orderBy: { createdAt: "desc" }
  });
};

const createRequest = async (branchId, data) => {
  const tenantDb = await getTenantClient(branchId);
  return tenantDb.serviceRequest.create({
    data: {
      patientId: data.patientId,
      patientName: data.patientName,
      bed: data.bed || "N/A",
      requestType: data.requestType,
      requestDescription: data.requestDescription || null,
      priority: data.priority || "Normal",
      dept: data.dept || "Laboratory",
      status: data.status || "Pending"
    }
  });
};

const updateRequestStatus = async (branchId, id, status) => {
  const tenantDb = await getTenantClient(branchId);
  return tenantDb.serviceRequest.update({
    where: { id },
    data: { status }
  });
};

const getRequestById = async (branchId, id) => {
  const tenantDb = await getTenantClient(branchId);
  return tenantDb.serviceRequest.findUnique({
    where: { id }
  });
};

module.exports = {
  resolveBranchId,
  listRequests,
  createRequest,
  updateRequestStatus,
  getRequestById
};
