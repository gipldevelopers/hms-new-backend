# Quick Start Guide - Doctor OPD Module

## 🚀 Getting Started in 5 Minutes

### Step 1: Start the Backend Server
```bash
cd d:\HMS\hms-new-backend
npm run dev
```

The server should start on `http://localhost:3000`

### Step 2: Verify the Module is Loaded
Open your browser or use curl:
```bash
curl http://localhost:3000/health
```

You should see:
```json
{
  "status": "OK",
  "message": "HMS Platform API Online ✅",
  "timestamp": "2026-05-22T...",
  "uptime": 123.456
}
```

### Step 3: Test the Doctor OPD Endpoints

#### Get Authentication Token
First, login to get a JWT token:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "your-password"
  }'
```

Save the token from the response.

#### Test OPD Stats
```bash
curl http://localhost:3000/api/doctor-opd/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "total": 0,
    "waiting": 0,
    "inProgress": 0,
    "completed": 0
  }
}
```

#### Test OPD Patient List
```bash
curl http://localhost:3000/api/doctor-opd/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected response:
```json
{
  "success": true,
  "data": []
}
```

(Empty array is normal if no appointments exist for today)

### Step 4: Create Test Data

#### 1. Register a Patient
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "age": 35,
    "gender": "Male",
    "contact": "9876543210",
    "bloodGroup": "O+"
  }'
```

Save the patient ID from the response.

#### 2. Book an Appointment
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PATIENT_ID_FROM_STEP_1",
    "dateTime": "2026-05-22T10:30:00.000Z",
    "doctorId": "YOUR_DOCTOR_ID",
    "notes": "Regular checkup"
  }'
```

Save the appointment ID from the response.

#### 3. Check OPD List Again
```bash
curl http://localhost:3000/api/doctor-opd/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

You should now see the patient in the list!

### Step 5: Test Full Consultation Flow

#### 1. Get Patient Details
```bash
curl http://localhost:3000/api/doctor-opd/patients/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 2. Save Consultation Notes
```bash
curl -X POST http://localhost:3000/api/doctor-opd/consultation/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "chiefComplaints": "Fever and headache",
    "examination": "Temperature elevated",
    "finalDiagnosis": "Viral fever",
    "status": "IN_PROGRESS"
  }'
```

Save the consultation ID from the response.

#### 3. Create Prescription
```bash
curl -X POST http://localhost:3000/api/doctor-opd/prescription/CONSULTATION_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "instructions": "Take medicines after food"
  }'
```

Save the prescription ID from the response.

#### 4. Add Medicine
```bash
curl -X POST http://localhost:3000/api/doctor-opd/prescription/PRESCRIPTION_ID/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "medicineName": "Paracetamol 500mg",
    "dosage": "1 Tablet",
    "timing": "1-1-1 (After Food)",
    "duration": "5 Days"
  }'
```

#### 5. Complete Consultation
```bash
curl -X POST http://localhost:3000/api/doctor-opd/consultation/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED"
  }'
```

### Step 6: Frontend Integration

Now that the backend is working, integrate with your frontend:

1. **Update your frontend API base URL** to point to `http://localhost:3000/api`

2. **Use the API functions** from the implementation guide:
   - See `DOCTOR_OPD_IMPLEMENTATION.md` for complete React examples

3. **Test the frontend pages**:
   - Navigate to `http://localhost:3000/doctor/opd` (your frontend URL)
   - You should see the patient list
   - Click on a patient to open consultation page
   - Add clinical notes and prescriptions

---

## 📋 Checklist

- [ ] Backend server running on port 3000
- [ ] Health check endpoint responding
- [ ] Authentication working (can get JWT token)
- [ ] OPD stats endpoint working
- [ ] OPD patients list endpoint working
- [ ] Patient details endpoint working
- [ ] Consultation save endpoint working
- [ ] Prescription creation working
- [ ] Medicine add/update/delete working
- [ ] Frontend connected to backend
- [ ] Frontend displaying patient list
- [ ] Frontend consultation page working
- [ ] Frontend prescription section working

---

## 🐛 Common Issues

### Issue: "No initialized branch found"
**Solution**: Make sure your user has a valid branchId and the branch database is initialized.

```bash
# Check your user's branch
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Issue: "Cannot find module"
**Solution**: Make sure all dependencies are installed:
```bash
npm install
```

### Issue: "Prisma Client not generated"
**Solution**: Regenerate Prisma client:
```bash
node node_modules\prisma\build\index.js generate --schema=./prisma/tenant.schema
```

### Issue: "Database connection error"
**Solution**: Check your `.env` file has correct DATABASE_URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/hms_db"
```

### Issue: "Empty patient list"
**Solution**: Make sure:
1. Appointments exist for today
2. Appointment status is not CANCELLED
3. Your doctor ID matches the appointments' doctorId

---

## 📞 Need Help?

1. Check the detailed documentation: `DOCTOR_OPD_IMPLEMENTATION.md`
2. Review API documentation: `src/modules/doctor-opd/README.md`
3. Check server logs for error messages
4. Verify database schema is up to date

---

## ✅ Success!

If all steps completed successfully, your Doctor OPD module is now fully functional! 🎉

You can now:
- ✅ View today's OPD patient list
- ✅ Access patient details and history
- ✅ Record clinical notes
- ✅ Create prescriptions
- ✅ Add medicines from pharmacy
- ✅ Complete consultations

**Next Steps:**
- Customize the frontend UI to match your design
- Add more features like lab test integration
- Set up automated testing
- Deploy to production
