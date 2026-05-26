# Doctor OPD Module API Documentation

## Overview
This module provides complete functionality for doctors to manage OPD (Outpatient Department) consultations, including patient lists, clinical notes, prescriptions, and follow-ups.

## Features
- ✅ View today's OPD patient list with appointments and tokens
- ✅ Access complete patient details and history
- ✅ Record clinical notes and examination findings
- ✅ Add diagnoses and lab investigations
- ✅ Create and manage prescriptions
- ✅ Add medicines from pharmacy inventory
- ✅ Set follow-up appointments and referrals
- ✅ Multi-tenant database support

## Base URL
```
/api/doctor-opd
```

## Authentication
All endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get OPD Statistics
Get today's OPD statistics for the logged-in doctor.

**Endpoint:** `GET /stats`

**Query Parameters:**
- `doctorId` (optional) - Filter by specific doctor ID

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "waiting": 8,
    "inProgress": 5,
    "completed": 12
  }
}
```

---

### 2. Get Today's OPD Patient List
Fetch all patients with appointments and tokens for today.

**Endpoint:** `GET /patients`

**Query Parameters:**
- `search` (optional) - Search by patient name, contact, or token number
- `status` (optional) - Filter by appointment status (SCHEDULED, CHECKED_IN, WAITING, COMPLETED)
- `doctorId` (optional) - Filter by doctor ID (defaults to logged-in doctor)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "appt-uuid",
      "appointmentId": "appt-uuid",
      "patientId": "patient-uuid",
      "patient": {
        "id": "patient-uuid",
        "name": "John Doe",
        "age": 45,
        "gender": "Male",
        "contact": "9876543210",
        "bloodGroup": "O+"
      },
      "doctorId": "doctor-uuid",
      "doctorName": "Dr. Smith",
      "departmentId": "dept-uuid",
      "departmentName": "General Medicine",
      "dateTime": "2026-05-22T10:30:00.000Z",
      "tokenNumber": "A-001",
      "token": {
        "id": "token-uuid",
        "displayToken": "OPD-001",
        "status": "Waiting"
      },
      "fee": 500,
      "status": "CHECKED_IN",
      "notes": null,
      "createdAt": "2026-05-22T08:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Patient Details for Consultation
Get complete patient details including vitals, consultation history, and prescriptions.

**Endpoint:** `GET /patients/:appointmentId`

**Response:**
```json
{
  "success": true,
  "data": {
    "appointment": {
      "id": "appt-uuid",
      "patientId": "patient-uuid",
      "doctorId": "doctor-uuid",
      "doctorName": "Dr. Smith",
      "dateTime": "2026-05-22T10:30:00.000Z",
      "tokenNumber": "A-001",
      "status": "CHECKED_IN"
    },
    "patient": {
      "id": "patient-uuid",
      "name": "John Doe",
      "age": 45,
      "gender": "Male",
      "contact": "9876543210",
      "bloodGroup": "O+",
      "address": "123 Main St",
      "emergencyContactName": "Jane Doe",
      "emergencyContactPhone": "9876543211"
    },
    "vitals": {
      "id": "vitals-uuid",
      "systolic": 120,
      "diastolic": 80,
      "heartRate": 72,
      "spo2": 98,
      "temperature": 98.6,
      "respiratoryRate": 16,
      "painLevel": 2,
      "recordedBy": "Nurse Mary",
      "createdAt": "2026-05-22T10:00:00.000Z"
    },
    "consultation": {
      "id": "consult-uuid",
      "chiefComplaints": "Fever and headache",
      "clinicalHistory": "Patient has fever for 3 days",
      "examination": "Temperature elevated, throat congestion",
      "provisionalDiagnosis": "Viral fever",
      "finalDiagnosis": "Upper respiratory tract infection",
      "labTests": ["CBC", "CRP"],
      "prescriptions": [
        {
          "id": "rx-uuid",
          "instructions": "Take medicines after food",
          "items": [
            {
              "id": "item-uuid",
              "medicineName": "Paracetamol 500mg",
              "dosage": "1 Tablet",
              "timing": "1-1-1 (After Food)",
              "duration": "5 Days",
              "instructions": "Take with water"
            }
          ]
        }
      ],
      "followUpDate": "2026-05-29T10:30:00.000Z",
      "followUpNotes": "Review after 1 week",
      "status": "IN_PROGRESS"
    },
    "previousConsultations": [
      {
        "id": "prev-consult-uuid",
        "createdAt": "2026-04-15T10:00:00.000Z",
        "chiefComplaints": "Back pain",
        "finalDiagnosis": "Muscle strain",
        "doctorName": "Dr. Smith"
      }
    ]
  }
}
```

---

### 4. Save Consultation
Create or update consultation notes for a patient.

**Endpoint:** `POST /consultation/:appointmentId`

**Request Body:**
```json
{
  "chiefComplaints": "Fever and headache for 3 days",
  "clinicalHistory": "No previous history of similar symptoms. No known allergies.",
  "examination": "Temperature: 101°F, Throat: Congested, Lungs: Clear",
  "provisionalDiagnosis": "Viral fever",
  "finalDiagnosis": "Upper respiratory tract infection",
  "labTests": ["CBC", "CRP", "Throat Swab"],
  "followUpDate": "2026-05-29T10:30:00.000Z",
  "followUpNotes": "Review lab reports and reassess",
  "referralDoctor": null,
  "referralDepartment": null,
  "status": "IN_PROGRESS"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Consultation saved successfully",
  "data": {
    "id": "consult-uuid",
    "appointmentId": "appt-uuid",
    "patientId": "patient-uuid",
    "doctorId": "doctor-uuid",
    "doctorName": "Dr. Smith",
    "chiefComplaints": "Fever and headache for 3 days",
    "status": "IN_PROGRESS",
    "createdAt": "2026-05-22T10:30:00.000Z"
  }
}
```

---

### 5. Add Prescription
Create a prescription for a consultation.

**Endpoint:** `POST /prescription/:consultationId`

**Request Body:**
```json
{
  "instructions": "Take all medicines after food. Drink plenty of water."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prescription created successfully",
  "data": {
    "id": "rx-uuid",
    "consultationId": "consult-uuid",
    "patientId": "patient-uuid",
    "doctorId": "doctor-uuid",
    "doctorName": "Dr. Smith",
    "instructions": "Take all medicines after food. Drink plenty of water.",
    "createdAt": "2026-05-22T10:35:00.000Z"
  }
}
```

---

### 6. Add Medicine to Prescription
Add a medicine item to an existing prescription.

**Endpoint:** `POST /prescription/:prescriptionId/items`

**Request Body:**
```json
{
  "medicineId": "medicine-uuid",
  "medicineName": "Paracetamol 500mg",
  "dosage": "1 Tablet",
  "timing": "1-1-1 (After Food)",
  "duration": "5 Days",
  "instructions": "Take with plenty of water"
}
```

**Note:** Either `medicineId` (from pharmacy) or `medicineName` (custom) is required.

**Response:**
```json
{
  "success": true,
  "message": "Medicine added successfully",
  "data": {
    "id": "item-uuid",
    "prescriptionId": "rx-uuid",
    "medicineId": "medicine-uuid",
    "medicineName": "Paracetamol 500mg",
    "dosage": "1 Tablet",
    "timing": "1-1-1 (After Food)",
    "duration": "5 Days",
    "instructions": "Take with plenty of water",
    "medicine": {
      "id": "medicine-uuid",
      "medicineName": "Paracetamol 500mg",
      "type": "Tablet",
      "mfg": "PharmaCorp",
      "quantity": 500,
      "status": "IN STOCK"
    }
  }
}
```

---

### 7. Update Medicine in Prescription
Update an existing medicine item in a prescription.

**Endpoint:** `PATCH /prescription/items/:itemId`

**Request Body:**
```json
{
  "dosage": "2 Tablets",
  "timing": "1-0-1 (After Food)",
  "duration": "7 Days",
  "instructions": "Updated instructions"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Medicine updated successfully",
  "data": {
    "id": "item-uuid",
    "medicineName": "Paracetamol 500mg",
    "dosage": "2 Tablets",
    "timing": "1-0-1 (After Food)",
    "duration": "7 Days"
  }
}
```

---

### 8. Delete Medicine from Prescription
Remove a medicine item from a prescription.

**Endpoint:** `DELETE /prescription/items/:itemId`

**Response:**
```json
{
  "success": true,
  "message": "Medicine removed successfully"
}
```

---

### 9. Get Medicines from Pharmacy
Search and retrieve medicines from the pharmacy inventory.

**Endpoint:** `GET /medicines`

**Query Parameters:**
- `search` (optional) - Search by medicine name or type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "medicine-uuid",
      "medicineName": "Paracetamol 500mg",
      "type": "Tablet",
      "mfg": "PharmaCorp",
      "quantity": 500,
      "expiryDate": "2027-12-31T00:00:00.000Z",
      "storageType": "Room Temperature",
      "status": "IN STOCK"
    },
    {
      "id": "medicine-uuid-2",
      "medicineName": "Amoxicillin 250mg",
      "type": "Capsule",
      "mfg": "MediLabs",
      "quantity": 200,
      "status": "IN STOCK"
    }
  ]
}
```

---

## Workflow Example

### Complete Patient Consultation Flow

1. **Doctor logs in and views OPD list**
   ```
   GET /api/doctor-opd/patients
   ```

2. **Doctor clicks on a patient to view details**
   ```
   GET /api/doctor-opd/patients/{appointmentId}
   ```

3. **Doctor records clinical notes**
   ```
   POST /api/doctor-opd/consultation/{appointmentId}
   Body: { chiefComplaints, examination, diagnosis, etc. }
   ```

4. **Doctor creates prescription**
   ```
   POST /api/doctor-opd/prescription/{consultationId}
   Body: { instructions }
   ```

5. **Doctor searches for medicines**
   ```
   GET /api/doctor-opd/medicines?search=paracetamol
   ```

6. **Doctor adds medicines to prescription**
   ```
   POST /api/doctor-opd/prescription/{prescriptionId}/items
   Body: { medicineId, dosage, timing, duration }
   ```

7. **Doctor completes consultation**
   ```
   POST /api/doctor-opd/consultation/{appointmentId}
   Body: { status: "COMPLETED" }
   ```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Multi-Tenant Support

This module fully supports multi-tenant architecture:
- Each branch has its own isolated database
- Data is automatically scoped to the user's branch
- Branch ID is resolved from user context or request parameters
- All queries use tenant-specific Prisma clients

---

## Database Models

### Consultation
Stores clinical notes and examination findings for each appointment.

### Prescription
Contains prescription header with general instructions.

### PrescriptionItem
Individual medicine entries with dosage, timing, and duration.

### PharmacyItem
Medicine inventory with stock levels and details.

---

## Testing

Use the provided test script:
```bash
node test-doctor-opd.js
```

Or test with curl:
```bash
# Get OPD patients
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/doctor-opd/patients

# Get patient details
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/doctor-opd/patients/APPOINTMENT_ID
```

---

## Notes

- All dates are in ISO 8601 format
- Timestamps are in UTC
- Token numbers are auto-generated daily
- Prescriptions are linked to consultations
- Medicines can be selected from pharmacy or entered manually
- Follow-up dates are optional
- Lab tests are stored as JSON array
