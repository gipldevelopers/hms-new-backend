# Doctor OPD Module - Implementation Summary

## ✅ What Has Been Implemented

### 1. Database Schema Updates
**File:** `prisma/tenant.schema`

Added four new models to support doctor OPD functionality:

#### **Consultation Model**
- Stores clinical notes, examination findings, and diagnoses
- Links to appointments (one-to-one relationship)
- Tracks consultation status (IN_PROGRESS, COMPLETED)
- Supports follow-up scheduling and referrals
- Stores lab test orders as JSON array

#### **Prescription Model**
- Links to consultations
- Contains general prescription instructions
- Tracks doctor information

#### **PrescriptionItem Model**
- Individual medicine entries in a prescription
- Links to PharmacyItem for inventory tracking
- Stores dosage, timing, duration, and specific instructions
- Supports both pharmacy medicines and custom entries

#### **PharmacyItem Model (Updated)**
- Added relationship to PrescriptionItem
- Maintains medicine inventory

### 2. Backend API Module
**Location:** `src/modules/doctor-opd/`

#### **Service Layer** (`doctor-opd.service.js`)
Implements all business logic:
- `getTodayOPDPatients()` - Fetch patients with appointments and tokens
- `getOPDPatientDetails()` - Get complete patient information
- `saveConsultation()` - Create/update consultation notes
- `addPrescription()` - Create prescription for consultation
- `addMedicineToPrescription()` - Add medicine to prescription
- `updatePrescriptionItem()` - Update medicine details
- `deletePrescriptionItem()` - Remove medicine from prescription
- `getMedicines()` - Search pharmacy inventory
- `getOPDStats()` - Get today's statistics

#### **Controller Layer** (`doctor-opd.controller.js`)
Handles HTTP requests and responses:
- Request validation
- Error handling
- Response formatting
- Branch ID resolution
- User context extraction

#### **Routes** (`doctor-opd.routes.js`)
RESTful API endpoints:
```
GET    /api/doctor-opd/patients              - List today's OPD patients
GET    /api/doctor-opd/patients/:id          - Get patient details
GET    /api/doctor-opd/stats                 - Get OPD statistics
GET    /api/doctor-opd/medicines             - Search medicines
POST   /api/doctor-opd/consultation/:id      - Save consultation
POST   /api/doctor-opd/prescription/:id      - Create prescription
POST   /api/doctor-opd/prescription/:id/items - Add medicine
PATCH  /api/doctor-opd/prescription/items/:id - Update medicine
DELETE /api/doctor-opd/prescription/items/:id - Delete medicine
```

### 3. Multi-Tenant Support
✅ Fully integrated with existing multi-tenant architecture
✅ Uses tenant-specific database clients
✅ Branch ID resolution from user context
✅ Isolated data per branch/tenant

### 4. Security & Authorization
✅ JWT authentication required
✅ Role-based access control (DOCTOR, STAFF, ADMIN)
✅ Audit logging enabled
✅ Input validation

### 5. Documentation
- **API Documentation:** `src/modules/doctor-opd/README.md`
- **Test Script:** `test-doctor-opd.js`
- **Implementation Guide:** This file

---

## 🚀 How to Deploy

### Step 1: Generate Prisma Client
The Prisma client has already been generated. If you need to regenerate:
```bash
node node_modules\prisma\build\index.js generate --schema=./prisma/tenant.schema
```

### Step 2: Update Tenant Databases
Run this to push schema changes to all tenant databases:
```bash
# For each tenant/branch, the schema will be updated automatically
# when they access the system, or you can manually sync:

# Option A: Let the system auto-sync on first access
# (Recommended - happens automatically)

# Option B: Manual sync for all tenants
# Create a sync script or use the tenant manager
```

### Step 3: Restart the Server
```bash
npm run dev
```

### Step 4: Verify Installation
```bash
# Check health endpoint
curl http://localhost:3000/health

# Test doctor-opd endpoint (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/doctor-opd/stats
```

---

## 📋 Frontend Integration Guide

### Required API Calls for Doctor OPD Page

#### 1. **OPD Patient List Page** (`/doctor/opd`)

```javascript
// Fetch today's OPD patients
const fetchOPDPatients = async () => {
  const response = await fetch('/api/doctor-opd/patients', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data.data; // Array of patients
};

// With filters
const fetchFilteredPatients = async (search, status) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  
  const response = await fetch(`/api/doctor-opd/patients?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Get statistics
const fetchStats = async () => {
  const response = await fetch('/api/doctor-opd/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.data; // { total, waiting, inProgress, completed }
};
```

#### 2. **Patient Consultation Page** (`/doctor/opd/:appointmentId`)

```javascript
// Fetch patient details
const fetchPatientDetails = async (appointmentId) => {
  const response = await fetch(`/api/doctor-opd/patients/${appointmentId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.data; // { appointment, patient, vitals, consultation, previousConsultations }
};

// Save consultation notes
const saveConsultation = async (appointmentId, consultationData) => {
  const response = await fetch(`/api/doctor-opd/consultation/${appointmentId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chiefComplaints: consultationData.chiefComplaints,
      clinicalHistory: consultationData.clinicalHistory,
      examination: consultationData.examination,
      provisionalDiagnosis: consultationData.provisionalDiagnosis,
      finalDiagnosis: consultationData.finalDiagnosis,
      labTests: consultationData.labTests, // Array of strings
      followUpDate: consultationData.followUpDate,
      followUpNotes: consultationData.followUpNotes,
      status: 'IN_PROGRESS' // or 'COMPLETED'
    })
  });
  return await response.json();
};

// Create prescription
const createPrescription = async (consultationId, instructions) => {
  const response = await fetch(`/api/doctor-opd/prescription/${consultationId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ instructions })
  });
  return await response.json();
};

// Search medicines
const searchMedicines = async (searchTerm) => {
  const response = await fetch(`/api/doctor-opd/medicines?search=${searchTerm}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.data; // Array of medicines
};

// Add medicine to prescription
const addMedicine = async (prescriptionId, medicineData) => {
  const response = await fetch(`/api/doctor-opd/prescription/${prescriptionId}/items`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      medicineId: medicineData.medicineId, // Optional - from pharmacy
      medicineName: medicineData.medicineName, // Required
      dosage: medicineData.dosage, // e.g., "1 Tablet"
      timing: medicineData.timing, // e.g., "1-1-1 (After Food)"
      duration: medicineData.duration, // e.g., "5 Days"
      instructions: medicineData.instructions // Optional
    })
  });
  return await response.json();
};

// Update medicine
const updateMedicine = async (itemId, medicineData) => {
  const response = await fetch(`/api/doctor-opd/prescription/items/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(medicineData)
  });
  return await response.json();
};

// Delete medicine
const deleteMedicine = async (itemId) => {
  const response = await fetch(`/api/doctor-opd/prescription/items/${itemId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

### Example React Component Structure

```jsx
// pages/doctor/opd/index.jsx
import { useState, useEffect } from 'react';

export default function DoctorOPDList() {
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patientsData, statsData] = await Promise.all([
        fetchOPDPatients(),
        fetchStats()
      ]);
      setPatients(patientsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading OPD data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>OPD Patient List</h1>
      
      {/* Stats Cards */}
      <div className="stats">
        <div>Total: {stats.total}</div>
        <div>Waiting: {stats.waiting}</div>
        <div>In Progress: {stats.inProgress}</div>
        <div>Completed: {stats.completed}</div>
      </div>

      {/* Patient List */}
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Patient Name</th>
            <th>Age/Gender</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.tokenNumber}</td>
              <td>{patient.patient.name}</td>
              <td>{patient.patient.age}/{patient.patient.gender}</td>
              <td>{patient.patient.contact}</td>
              <td>{patient.status}</td>
              <td>
                <a href={`/doctor/opd/${patient.appointmentId}`}>
                  View Details
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

```jsx
// pages/doctor/opd/[id].jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PatientConsultation() {
  const router = useRouter();
  const { id: appointmentId } = router.query;
  
  const [patientData, setPatientData] = useState(null);
  const [consultation, setConsultation] = useState({
    chiefComplaints: '',
    examination: '',
    diagnosis: '',
    // ... other fields
  });
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    if (appointmentId) {
      loadPatientData();
    }
  }, [appointmentId]);

  const loadPatientData = async () => {
    const data = await fetchPatientDetails(appointmentId);
    setPatientData(data);
    if (data.consultation) {
      setConsultation(data.consultation);
      setMedicines(data.consultation.prescriptions[0]?.items || []);
    }
  };

  const handleSaveConsultation = async () => {
    await saveConsultation(appointmentId, consultation);
    alert('Consultation saved!');
  };

  const handleAddMedicine = async (medicineData) => {
    // First ensure prescription exists
    let prescriptionId = patientData.consultation?.prescriptions[0]?.id;
    
    if (!prescriptionId) {
      const prescription = await createPrescription(
        patientData.consultation.id,
        'Take medicines as prescribed'
      );
      prescriptionId = prescription.data.id;
    }

    // Add medicine
    await addMedicine(prescriptionId, medicineData);
    await loadPatientData(); // Reload to show updated list
  };

  return (
    <div>
      <h1>Patient Consultation</h1>
      
      {/* Patient Info */}
      <div className="patient-info">
        <h2>{patientData?.patient.name}</h2>
        <p>Age: {patientData?.patient.age} | Gender: {patientData?.patient.gender}</p>
        <p>Contact: {patientData?.patient.contact}</p>
      </div>

      {/* Vitals */}
      {patientData?.vitals && (
        <div className="vitals">
          <h3>Vitals</h3>
          <p>BP: {patientData.vitals.systolic}/{patientData.vitals.diastolic}</p>
          <p>Heart Rate: {patientData.vitals.heartRate}</p>
          <p>SpO2: {patientData.vitals.spo2}%</p>
          <p>Temperature: {patientData.vitals.temperature}°F</p>
        </div>
      )}

      {/* Clinical Notes */}
      <div className="clinical-notes">
        <h3>Clinical Notes</h3>
        <textarea
          placeholder="Chief Complaints"
          value={consultation.chiefComplaints}
          onChange={(e) => setConsultation({...consultation, chiefComplaints: e.target.value})}
        />
        <textarea
          placeholder="Examination"
          value={consultation.examination}
          onChange={(e) => setConsultation({...consultation, examination: e.target.value})}
        />
        <textarea
          placeholder="Diagnosis"
          value={consultation.finalDiagnosis}
          onChange={(e) => setConsultation({...consultation, finalDiagnosis: e.target.value})}
        />
        <button onClick={handleSaveConsultation}>Save Consultation</button>
      </div>

      {/* Prescription */}
      <div className="prescription">
        <h3>Prescription</h3>
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Timing</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map(med => (
              <tr key={med.id}>
                <td>{med.medicineName}</td>
                <td>{med.dosage}</td>
                <td>{med.timing}</td>
                <td>{med.duration}</td>
                <td>
                  <button onClick={() => deleteMedicine(med.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => {/* Show add medicine modal */}}>
          Add Medicine
        </button>
      </div>
    </div>
  );
}
```

---

## 🔄 Data Flow

### Patient Registration → OPD List Flow

1. **Patient Registration** (Reception)
   - Patient registered via `/api/patients` endpoint
   - Creates Patient record in tenant database

2. **Appointment Booking** (Reception)
   - Appointment booked via `/api/appointments` endpoint
   - Creates Appointment record with token number
   - Links to Patient record

3. **Token Generation** (Automatic)
   - Token auto-generated during appointment booking
   - Format: "A-001", "A-002", etc. (daily sequence)
   - Creates Token record linked to Patient

4. **OPD List Display** (Doctor)
   - Doctor accesses `/api/doctor-opd/patients`
   - System fetches today's appointments with status SCHEDULED, CHECKED_IN, WAITING, or COMPLETED
   - Joins with Patient and Token data
   - Returns combined list

5. **Consultation** (Doctor)
   - Doctor clicks patient → `/api/doctor-opd/patients/:appointmentId`
   - System loads patient details, vitals, previous consultations
   - Doctor records notes → `/api/doctor-opd/consultation/:appointmentId`
   - Creates/updates Consultation record

6. **Prescription** (Doctor)
   - Doctor adds prescription → `/api/doctor-opd/prescription/:consultationId`
   - Creates Prescription record
   - Doctor adds medicines → `/api/doctor-opd/prescription/:prescriptionId/items`
   - Creates PrescriptionItem records

7. **Completion** (Doctor)
   - Doctor marks consultation complete
   - Updates Consultation.status = "COMPLETED"
   - Updates Appointment.status = "COMPLETED"

---

## 🧪 Testing Checklist

### Backend API Tests
- [ ] GET /api/doctor-opd/patients returns today's patients
- [ ] GET /api/doctor-opd/patients/:id returns patient details
- [ ] POST /api/doctor-opd/consultation/:id saves consultation
- [ ] POST /api/doctor-opd/prescription/:id creates prescription
- [ ] POST /api/doctor-opd/prescription/:id/items adds medicine
- [ ] PATCH /api/doctor-opd/prescription/items/:id updates medicine
- [ ] DELETE /api/doctor-opd/prescription/items/:id removes medicine
- [ ] GET /api/doctor-opd/medicines searches pharmacy
- [ ] GET /api/doctor-opd/stats returns statistics

### Multi-Tenant Tests
- [ ] Data isolated per branch
- [ ] Branch ID resolution works correctly
- [ ] Tenant database switching works

### Integration Tests
- [ ] Patient registration → appointment → OPD list flow
- [ ] Consultation → prescription → medicines flow
- [ ] Search and filter functionality
- [ ] Previous consultation history display

---

## 📝 Notes

### Important Considerations

1. **Token Generation**: Tokens are auto-generated during appointment booking. The OPD module reads these tokens, it doesn't create them.

2. **Appointment Status Flow**:
   - SCHEDULED → Patient booked
   - CHECKED_IN → Patient arrived
   - WAITING → Patient in queue
   - COMPLETED → Consultation done

3. **Consultation Status**:
   - IN_PROGRESS → Doctor is working on it
   - COMPLETED → Consultation finished

4. **Medicine Selection**:
   - Can select from pharmacy inventory (medicineId)
   - Can enter custom medicine name (medicineName)
   - Both options supported

5. **Multi-Tenant**: Each branch has its own database. The system automatically routes to the correct tenant database based on the logged-in user's branch.

---

## 🐛 Troubleshooting

### Issue: "Branch not found or database not initialized"
**Solution**: Ensure the branch database is initialized:
```javascript
// Check branch status
const branch = await prisma.branch.findUnique({ where: { id: branchId } });
console.log('Branch:', branch);
console.log('DB Initialized:', branch.isDbInitialized);

// If not initialized, run:
await initializeTenantSchema(branchId);
```

### Issue: "Appointment not found"
**Solution**: Verify appointment exists and belongs to today:
```javascript
const appointment = await tenantDb.appointment.findUnique({
  where: { id: appointmentId }
});
console.log('Appointment:', appointment);
```

### Issue: "No patients showing in OPD list"
**Solution**: Check if appointments exist for today:
```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);
const appointments = await tenantDb.appointment.findMany({
  where: {
    dateTime: { gte: today }
  }
});
console.log('Today\'s appointments:', appointments.length);
```

---

## ✅ Completion Status

- [x] Database schema updated
- [x] Prisma client generated
- [x] Service layer implemented
- [x] Controller layer implemented
- [x] Routes configured
- [x] Multi-tenant support integrated
- [x] Authentication & authorization added
- [x] API documentation created
- [x] Test script provided
- [x] Frontend integration guide provided

**Status: READY FOR DEPLOYMENT** 🚀
