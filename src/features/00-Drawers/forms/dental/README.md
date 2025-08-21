## Dental form payloads (objects sent to `@dental/`)

This document summarizes the payload objects produced by the dental forms for the three resources: appointment, patient, and service. These are the objects you would send to dental endpoints (e.g., `@dental/appointments`, `@dental/patient`, `@dental/service`).

Sources:
- `appointments`: `processAppointmentsData` in `appointments/actions/appointmentsActions.js`
- `patient`: `processPatientData` in `patient/actions/patientActions.js`
- `service` (Dental Clinic): `processServiceData` in `service/actions/serviceActions.js`

### Appointment payload
Produced by `processAppointmentsData(formData, mode)`.

Required fields: `clientName`, `medicName`, `displayTreatment`, `date`, `time`.

Shape:

```json
{
  "clientName": "string",
  "medicName": "string",
  "displayTreatment": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "type": "appointment",
  "status": "scheduled",
  "createdAt": "ISO-8601",  // set only on create; on update it preserves incoming createdAt
  "updatedAt": "ISO-8601"
}
```

Example:

```json
{
  "clientName": "John Doe",
  "medicName": "Dr. Smith",
  "displayTreatment": "Cavity Filling",
  "date": "2025-08-12",
  "time": "10:30",
  "type": "appointment",
  "status": "scheduled",
  "createdAt": "2025-08-01T09:00:00.000Z",
  "updatedAt": "2025-08-01T09:00:00.000Z"
}
```

### Patient payload
Produced by `processPatientData(formData, mode)`.

Required fields: `fullName`, `birthYear`, `gender`, `phone`.

Optional fields: `email`, `address`, `notes`, `tags` (comma‑separated string).

Shape:

```json
{
  "fullName": "string",
  "birthYear": 1970,
  "gender": "male|female|other",
  "phone": "+15551234567",
  "email": "string",        // optional
  "address": "string",      // optional
  "notes": "string",        // optional
  "tags": "string",         // optional, comma-separated
  "businessType": "string", // from getBusinessTypeKey() (e.g., "dental")
  "type": "patient",
  "status": "active",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

Example:

```json
{
  "fullName": "Jane Roe",
  "birthYear": 1989,
  "gender": "female",
  "phone": "+40722111222",
  "email": "jane@example.com",
  "address": "Str. Exemplu 10, București",
  "notes": "Allergic to penicillin",
  "tags": "vip,insurance",
  "businessType": "dental",
  "type": "patient",
  "status": "active",
  "createdAt": "2025-08-01T09:00:00.000Z",
  "updatedAt": "2025-08-01T09:00:00.000Z"
}
```

### Service payload (Dental Clinic)
Produced by `processServiceData(formData, mode)` for current business type. Below is the shape when the business type is `Dental Clinic`.

Required fields: `name`, `price`, `duration`, `category`, `description`.

Optional fields: `color`.

Shape:

```json
{
  "name": "string",          // treatment name
  "price": 100.0,
  "duration": 60,             // minutes
  "category": "preventive|restorative|cosmetic|surgical|emergency|other",
  "description": "string",
  "color": "#3B82F6",        // optional
  "businessType": "Dental Clinic",
  "status": "active",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

Example:

```json
{
  "name": "Scaling & Polishing",
  "price": 200,
  "duration": 45,
  "category": "preventive",
  "description": "Professional teeth cleaning.",
  "color": "#60A5FA",
  "businessType": "Dental Clinic",
  "status": "active",
  "createdAt": "2025-08-01T09:00:00.000Z",
  "updatedAt": "2025-08-01T09:00:00.000Z"
}
```

Notes:
- `createdAt` is set only on create; on update it preserves the incoming `createdAt` and refreshes `updatedAt`.
- For service payloads, additional keys like `features` or `amenities` may be processed for other business types (Gym/Hotel), but they are not part of the Dental Clinic form fields.

