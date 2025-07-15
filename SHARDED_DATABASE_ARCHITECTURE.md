# Sharded Database Architecture

## Overview

This application uses a **sharded database architecture** with composed keys and denormalized data storage. This approach is designed for high scalability, multi-tenant isolation, and efficient data distribution across shards.

## Key Principles

### 1. **Composed Keys**
All resources use composed keys in the format: `{tenantId}-{locationId}`

- **Document IDs**: `T0001-01` (for entire resource collections)
- **Item IDs**: `T0001-01-CLIENT-001` (for individual resources)

### 2. **Data Nesting**
All actual data is stored under a `data` field within sharded documents:

```javascript
{
  id: "T0001-01",
  tenantId: "T0001",
  locationId: "T0001-01",
  resourceType: "CLIENTS",
  dateRange: { startDate: "2024-01-01", endDate: "2024-12-31" },
  data: [                           // Array of resource items (single resource type)
    {
      id: "T0001-01-CLIENT-001",
      name: "John Doe",
      email: "john@example.com",
      // ... other client data
    },
    {
      id: "T0001-01-CLIENT-002", 
      name: "Jane Smith",
      email: "jane@example.com",
      // ... other client data
    }
  ],
  metadata: {                       // Collection metadata
    totalCount: 150,
    lastUpdated: "2024-01-15T10:00:00Z"
  },
  _syncTimestamp: "2024-01-15T10:00:00Z",
  _version: 1
}
```

### 3. **Non-Relational Structure**
- No traditional foreign keys
- Denormalized data storage
- Self-contained documents
- No JOIN operations needed

### 4. **Special Markings**
- **Date Ranges**: For time-based sharding
- **Tenant IDs**: For multi-tenant isolation
- **Location IDs**: For geographic distribution
- **Resource Types**: For data categorization

## Architecture Benefits

### 1. **Horizontal Scalability**
- Data can be distributed across multiple shards
- Each shard can be on different servers
- Easy to add new shards as data grows

### 2. **Multi-Tenant Isolation**
- Complete data isolation between tenants
- No cross-tenant data contamination
- Secure by design

### 3. **Geographic Distribution**
- Location-based sharding for global deployments
- Reduced latency for local data access
- Compliance with data residency requirements

### 4. **Time-Based Sharding**
- Historical data can be archived in separate shards
- Current data stays in active shards
- Efficient querying of time ranges

## Data Structure Patterns

### Resource Document Structure

```javascript
{
  // Document Identification
  id: "T0001-01",                   // Composed key: tenantId-locationId
  tenantId: "T0001",                // Tenant identifier
  locationId: "T0001-01",           // Location identifier
  resourceType: "CLIENTS",          // Resource type (not in key)
  
  // Sharding Metadata
  dateRange: {
    startDate: "2024-01-01",
    endDate: "2024-12-31"
  },
  
  // Actual Data (Nested)
  data: [
    {
      id: "T0001-01-CLIENT-001",
      name: "John Doe",
      email: "john@example.com",
      // ... other fields
    },
    {
      id: "T0001-01-CLIENT-002", 
      name: "Jane Smith",
      email: "jane@example.com",
      // ... other fields
    }
  ],
  metadata: {
    totalCount: 150,
    activeCount: 120,
    lastUpdated: "2024-01-15T10:00:00Z"
  },
  
  // System Metadata
  _syncTimestamp: "2024-01-15T10:00:00Z",
  _lastModified: "2024-01-15T10:00:00Z",
  _version: 1,
  _source: "api" // api, mock, indexeddb
}
```

### Business Type Specific Examples

#### Dental Clinic (T0001)
```javascript
{
  id: "T0001-01",
  tenantId: "T0001",
  locationId: "T0001-01",
  resourceType: "CLIENTS",
  data: [
    {
      id: "T0001-01-CLIENT-001",
      name: "Maria Popescu",
      type: "patient",
      medicalHistory: [...],
      dentalRecords: {
        lastCleaning: "2024-01-10",
        treatments: [...]
      }
    }
  ],
  metadata: {
    totalPatients: 150,
    activePatients: 120,
    pendingAppointments: 25
  }
}
```

#### Gym (T0002)
```javascript
{
  id: "T0002-01",
  tenantId: "T0002",
  locationId: "T0002-01",
  resourceType: "CLIENTS",
  data: [
    {
      id: "T0002-01-CLIENT-001",
      name: "Alexandru Popa",
      type: "member",
      membership: {
        type: "Premium",
        startDate: "2024-01-01",
        endDate: "2024-12-31"
      },
      fitnessGoals: ["Weight Loss", "Muscle Building"]
    }
  ],
  metadata: {
    totalMembers: 200,
    activeMembers: 180,
    premiumMembers: 50
  }
}
```

#### Hotel (T0003)
```javascript
{
  id: "T0003-01",
  tenantId: "T0003",
  locationId: "T0003-01",
  resourceType: "CLIENTS",
  data: [
    {
      id: "T0003-01-CLIENT-001",
      name: "Carmen Dumitrescu",
      type: "guest",
      roomNumber: "201",
      checkIn: "2024-01-20",
      checkOut: "2024-01-25",
      roomType: "Deluxe"
    }
  ],
  metadata: {
    totalGuests: 75,
    checkedIn: 45,
    reserved: 30
  }
}
```

## ID Generation and Parsing

### Utility Functions

```javascript
import { resourceUtils, locationUtils } from '@/config/tenant';

// Generate document ID
const documentId = resourceUtils.generateDocumentId('T0001', 'T0001-01', 'CLIENTS');
// Returns: "T0001-01"

// Generate resource item ID
const clientId = resourceUtils.generateResourceId('T0001', 'T0001-01', 'CLIENT', 1);
// Returns: "T0001-01-CLIENT-001"

// Parse document ID
const parsed = resourceUtils.parseDocumentId('T0001-01');
// Returns: { tenantId: 'T0001', locationId: 'T0001-01' }

// Parse resource ID
const parsed = resourceUtils.parseResourceId('T0001-01-CLIENT-001');
// Returns: { tenantId: 'T0001', locationId: 'T0001-01', resourceType: 'CLIENT', resourceNumber: 1 }
```

## Usage Patterns

### 1. **Getting Sharded Documents**

```javascript
import { getMockData } from '@/api/mockData';

// Get sharded document
const document = getMockData('clients', 'T0001', 'T0001-01');

// Access data
const clients = document.data;  // Direct array of clients
const metadata = document.metadata;
```

### 2. **Legacy Compatibility**

```javascript
import { getMockDataArray } from '@/api/mockData';

// Get just the data (legacy compatibility)
const data = getMockDataArray('clients', 'T0001');
const clients = data;  // Direct array
```

### 3. **Creating Sharded Documents**

```javascript
import { resourceUtils } from '@/config/tenant';

const document = resourceUtils.generateShardedDocument(
  'T0001',
  'T0001-01',
  'CLIENTS',
  [
    { id: 'T0001-01-CLIENT-001', name: 'John Doe', email: 'john@example.com' },
    { id: 'T0001-01-CLIENT-002', name: 'Jane Smith', email: 'jane@example.com' }
  ],
  {
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
);
```

### 4. **Data Validation**

```javascript
import { resourceUtils } from '@/config/tenant';

// Check if document follows sharded structure
const isValid = resourceUtils.isShardedDocument(document);

// Extract data safely
const data = resourceUtils.extractDataFromDocument(document);
```

## Migration Strategy

### From Legacy Structure

**Before (Legacy):**
```javascript
const clients = getClientsMock('dental');
// Returns: { clients: [...], metadata: {...} }
```

**After (Sharded):**
```javascript
const document = getMockData('clients', 'T0001');
// Returns: { id: "T0001-01", tenantId: "T0001", data: [...], metadata: {...} }

// Access data
const clients = document.data;  // Direct array of clients
```

### Backward Compatibility

The system provides both patterns:

```javascript
// New sharded pattern
const document = getMockData('clients');

// Legacy compatibility
const data = getMockDataArray('clients');
const clients = getClientsArray();
```

## Best Practices

### 1. **Always Use Composed Keys**
- Generate IDs using utility functions
- Never hardcode IDs
- Validate ID formats

### 2. **Store Data Under `data` Field**
- All business data goes in `data`
- Keep document metadata separate
- Use consistent data structure

### 3. **Include Sharding Metadata**
- Always include `dateRange`
- Use meaningful date ranges
- Consider time-based sharding

### 4. **Validate Document Structure**
- Use `isShardedDocument()` for validation
- Extract data safely with `extractDataFromDocument()`
- Handle missing data gracefully

### 5. **Maintain Tenant Isolation**
- Never mix tenant data
- Validate tenant IDs
- Use tenant-specific queries

### 6. **Use Denormalized Structure**
- Avoid foreign key relationships
- Duplicate data when needed
- Keep documents self-contained

## Implementation Examples

### Mock Data Structure

```javascript
// src/api/mockData/dental/clientsMock.js
export const dentalClientsMock = resourceUtils.generateShardedDocument(
  'T0001',
  'T0001-01',
  'CLIENTS',
  {
    clients: [...],
    metadata: {...}
  },
  {
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
);
```

### API Response Structure

```javascript
// API responses should follow the same pattern
{
  id: "T0001-01",
  tenantId: "T0001",
  locationId: "T0001-01",
  resourceType: "CLIENTS",
  dateRange: { startDate: "2024-01-01", endDate: "2024-12-31" },
  data: {
    clients: [...],
    metadata: {...}
  }
}
```

### Database Storage

```javascript
// IndexedDB stores the entire sharded document
await db.put('clients', {
  id: "T0001-01",
  tenantId: "T0001",
  locationId: "T0001-01",
  resourceType: "CLIENTS",
  data: { clients: [...], metadata: {...} },
  _syncTimestamp: "2024-01-15T10:00:00Z",
  _version: 1
});
```

## Future Considerations

### 1. **Dynamic Sharding**
- Implement automatic shard creation
- Add shard management utilities
- Support shard migration

### 2. **Cross-Shard Queries**
- Implement query aggregation
- Add shard routing logic
- Support distributed transactions

### 3. **Shard Monitoring**
- Add shard health checks
- Implement shard metrics
- Monitor shard performance

### 4. **Advanced Sharding**
- Implement hash-based sharding
- Add range-based sharding
- Support custom sharding strategies 