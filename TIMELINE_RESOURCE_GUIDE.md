# Timeline Resource Guide

## Overview

This guide explains how to implement timeline resource queries using the single endpoint pattern with the `X-Resource-Type` header. The timeline resource follows the unified API architecture where all resources use a single endpoint with the resource type specified in headers and request parameters.

## API Endpoint Pattern

### Base Endpoint
```
/api/resources/{businessId-locationId}
```

### Example URL
```
http://localhost:3000/api/resources/b1-loc1/date-range/?startDate=2025-08-18&endDate=2025-08-26
```

## Required Headers

### Authentication Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Business Context Headers
```
X-Resource-Type: timeline
```

**Note:** Business ID și Location ID sunt incluse în URL (ex: `/api/resources/b1-loc1/...`), nu ca headers separate.

## Request Examples

### 1. GET Timeline Data

**URL:** `GET /api/resources/b1-loc1/date-range/`

**Query Parameters:**
```
?resourceType=timeline&startDate=2025-08-18&endDate=2025-08-26&status=scheduled
```

**Headers:**
```
X-Resource-Type: timeline
Authorization: Bearer <token>
Content-Type: application/json
```

**Note:** Business ID (b1) și Location ID (loc1) sunt în URL, nu ca headers.

**JavaScript Example:**
```javascript
const timelineService = new TimelineService();

const data = await timelineService.getTimeline({
  startDate: '2025-08-18',
  endDate: '2025-08-26',
  status: 'scheduled',
  clientId: 'optional-client-id',
  serviceId: 'optional-service-id',
  medicId: 'optional-medic-id'
});
```

### 2. POST Create Timeline Entry

**URL:** `POST /api/resources/b1-loc1`

**Headers:**
```
X-Resource-Type: timeline
X-Tenant-ID: b1
X-Location-ID: loc1
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "resourceType": "timeline",
  "operation": "create",
  "data": {
    "clientId": "client-123",
    "medicId": "medic-456",
    "serviceId": "service-789",
    "appointmentDate": "2025-08-20T10:00:00Z",
    "duration": 60,
    "notes": "Consultație de rutină",
    "status": "scheduled"
  }
}
```

**JavaScript Example:**
```javascript
const newEntry = {
  clientId: 'client-123',
  medicId: 'medic-456',
  serviceId: 'service-789',
  appointmentDate: '2025-08-20T10:00:00Z',
  duration: 60,
  notes: 'Consultație de rutină',
  status: 'scheduled'
};

const result = await timelineService.createTimelineEntry(newEntry);
```

### 3. PUT Update Timeline Entry

**URL:** `PUT /api/resources/b1-loc1`

**Headers:**
```
X-Resource-Type: timeline
X-Tenant-ID: b1
X-Location-ID: loc1
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "resourceType": "timeline",
  "operation": "update",
  "resourceId": "entry-id",
  "data": {
    "status": "completed",
    "notes": "Consultație finalizată cu succes"
  }
}
```

**JavaScript Example:**
```javascript
const updatedData = {
  status: 'completed',
  notes: 'Consultație finalizată cu succes'
};

const result = await timelineService.updateTimelineEntry('entry-id', updatedData);
```

### 4. DELETE Timeline Entry

**URL:** `DELETE /api/resources/b1-loc1`

**Headers:**
```
X-Resource-Type: timeline
X-Tenant-ID: b1
X-Location-ID: loc1
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "resourceType": "timeline",
  "operation": "delete",
  "resourceId": "entry-id"
}
```

**JavaScript Example:**
```javascript
const result = await timelineService.deleteTimelineEntry('entry-id');
```

## Business and Location Context

### Setting Business and Location IDs

The business ID and location ID are obtained from the user's selection in the Locations page and stored in localStorage:

```javascript
// From LocationsPage.jsx
const handleContinue = () => {
  if (selectedLocation) {
    // Set the selected location in localStorage
    localStorage.setItem('selectedLocation', selectedLocation.id);
    localStorage.setItem('locationId', selectedLocation.id);
    // Navigate to dashboard
    navigate('/dashboard');
  }
};
```

### Retrieving Context in Services

The TimelineService automatically retrieves the business and location context from localStorage:

```javascript
// In TimelineService.js
const businessId = localStorage.getItem('businessId');
const locationId = localStorage.getItem('locationId');

if (!businessId || !locationId) {
  throw new Error('Business ID and Location ID must be set before accessing timeline. Please select a location first.');
}
```

## Supported Query Parameters

### Timeline Resource Parameters
- `startDate` (required) - Start date in YYYY-MM-DD format
- `endDate` (required) - End date in YYYY-MM-DD format
- `status` - Filter by status (scheduled, completed, cancelled)
- `clientId` - Filter by client ID
- `serviceId` - Filter by service ID
- `medicId` - Filter by medic/doctor ID

### Pagination Parameters (if supported)
- `page` - Page number
- `limit` - Items per page
- `sortBy` - Sort field
- `sortOrder` - Sort direction (asc, desc)

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Invalid timeline request",
  "message": "Start date must be in YYYY-MM-DD format"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized access to timeline",
  "message": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden access to timeline",
  "message": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "error": "Timeline not found",
  "message": "Resource not found"
}
```

**422 Validation Error:**
```json
{
  "error": "Timeline validation error",
  "message": "Validation failed",
  "details": {
    "field": "appointmentDate",
    "message": "Appointment date is required"
  }
}
```

## Integration with DataSyncManager

The timeline resource is integrated with the DataSyncManager for offline support and caching:

```javascript
// Using the useDataSync hook
const { data, loading, error, create, update, remove } = useDataSync('timeline', {
  startDate: '2025-08-18',
  endDate: '2025-08-26',
  status: 'scheduled'
});
```

## Business-Specific Timeline Data

### Dental Timeline
```javascript
{
  reservations: [
    {
      id: 1,
      treatmentId: 1,
      displayTreatment: 'Root Canal',
      color: '#fff',
      clientId: 2,
      clientName: 'John Doe',
      medicId: 1,
      medicName: 'Dr. Smith',
      treatments: [
        {
          treatmentId: 1,
          treatmentName: 'Root Canal',
          color: '#fff',
          price: 150
        }
      ]
    }
  ]
}
```

### Gym Timeline
```javascript
{
  checkedIn: [
    {
      memberId: 1,
      memberName: 'Mike Johnson',
      serviceId: 1,
      serviceName: 'Premium',
      serviceChecked: 1,
      checkInTime: '14:00',
      checkOutTime: '16:00'
    }
  ],
  classes: [
    {
      classId: 1,
      className: 'Zumba',
      occupancy: '15/20',
      teacher: 'Ion',
      startHour: '10:00'
    }
  ]
}
```

### Hotel Timeline
```javascript
{
  bookings: [
    {
      id: 1,
      rooms: [
        {
          roomId: 102,
          startDate: '2025-06-12',
          endDate: '2025-06-14'
        }
      ],
      client: {
        clientId: 2,
        clientName: 'Jane Smith',
        language: 'EN',
        email: 'jane@example.com',
        phone: '+1234567890',
        registered: true
      },
      general: {
        status: 'confirmed',
        isPaid: true,
        isConfirmed: true,
        createdBy: 'admin'
      }
    }
  ]
}
```

## Testing

### Manual Testing
You can test the timeline service using the provided example component:

```javascript
import TimelineExample from './design-patterns/examples/TimelineExample.jsx';

// Use the component in your app
<TimelineExample />
```

### Automated Testing
```javascript
import { testTimelineService } from './design-patterns/examples/TimelineServiceTest.js';

// Run the test
await testTimelineService();
```

## Best Practices

1. **Always set business and location context** before making timeline requests
2. **Use proper date formatting** (YYYY-MM-DD for dates, ISO 8601 for timestamps)
3. **Handle errors gracefully** with user-friendly messages
4. **Validate input parameters** before sending requests
5. **Use the DataSyncManager** for offline support and caching
6. **Include the X-Resource-Type header** in all timeline requests
7. **Follow the single endpoint pattern** for consistency

## Migration from Old Endpoints

If you're migrating from the old business-specific endpoints:

**Old:** `GET /api/dental/timeline`
**New:** `GET /api/resources/b1-loc1?resourceType=timeline`

**Old:** `POST /api/gym/timeline`
**New:** `POST /api/resources/b1-loc1` with `X-Resource-Type: timeline`

The new pattern provides better consistency and easier maintenance across all business types.
