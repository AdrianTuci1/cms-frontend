# Mock Data Organization - Sharded Database Architecture

This directory contains mock data organized by business types and tenant management system, following a **sharded database architecture** with composed keys.

## Sharded Database Architecture

### Key Principles
- **Composed Keys**: `{tenantId}-{locationId}` format for all resources
- **Data Nesting**: All resource data is stored under a `data` field
- **Non-Relational**: No traditional foreign keys, denormalized structure
- **Special Markings**: Date ranges and metadata for sharding

### Data Structure Pattern

```javascript
// Resource Document Structure
{
  id: "T0001-01",                   // Composed key: tenantId-locationId
  tenantId: "T0001",                // Tenant identifier
  locationId: "T0001-01",           // Location identifier
  resourceType: "CLIENTS",          // Resource type (not in key)
  dateRange: {                      // Sharding metadata
    startDate: "2024-01-01",
    endDate: "2024-12-31"
  },
  data: [                           // Array of resource items (single resource type)
    {
      id: "T0001-01-CLIENT-001",    // Resource-specific ID
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

## Structure

```
mockData/
├── dental/           # Dental clinic specific mock data
│   ├── clientsMock.js
│   ├── servicesMock.js
│   ├── timelineMock.js
│   └── ...
├── gym/              # Gym specific mock data
│   ├── clientsMock.js
│   ├── servicesMock.js
│   ├── timelineMock.js
│   └── ...
├── hotel/            # Hotel specific mock data
│   ├── clientsMock.js
│   ├── servicesMock.js
│   ├── timelineMock.js
│   └── ...
├── businessInfoMock.js  # Business information with tenant management
├── index.js            # Main entry point with tenant-based data fetching
└── README.md          # This file
```

## Tenant Configuration

The application uses environment variables to determine the current tenant:

- `VITE_TENANT_ID`: The tenant identifier (T0001, T0002, T0003)
- `VITE_BUSINESS_TYPE`: The business type (dental, gym, hotel)

### Tenant Mapping

| Tenant ID | Business Type | Name | Default Location |
|-----------|---------------|------|------------------|
| T0001     | dental        | Dental Clinic Mock | T0001-01 |
| T0002     | gym           | Fitness Center Mock | T0002-01 |
| T0003     | hotel         | Hotel Mock | T0003-01 |

## ID Format

### Location IDs
Format: `{TENANT_ID}-{LOCATION_NUMBER}`
- Example: `T0001-01`, `T0002-01`, `T0003-01`

### Resource Document IDs
Format: `{LOCATION_ID}` (same as location ID)
- Example: `T0001-01`, `T0002-01`

### Resource Item IDs
Format: `{LOCATION_ID}-{RESOURCE_TYPE}-{RESOURCE_NUMBER}`
- Example: `T0001-01-CLIENT-001`, `T0002-01-MEMBER-001`

## Usage

### Basic Usage

```javascript
import { getMockData, tenantUtils } from '@/api/mockData';

// Get clients for current tenant (returns sharded document)
const clientsDocument = getMockData('clients');

// Access the actual data
const clients = clientsDocument.data;  // Direct array of clients
const metadata = clientsDocument.metadata;

// Get clients for specific tenant and location
const clientsDocument = getMockData('clients', 'T0001', 'T0001-01');

// Get current tenant ID
const tenantId = tenantUtils.getTenantId();

// Get default location for tenant
const locationId = tenantUtils.getDefaultLocationId();
```

### Sharded Data Access

```javascript
// Get sharded document
const document = getMockData('clients', 'T0001', 'T0001-01');

// Document structure:
{
  id: "T0001-01",
  tenantId: "T0001",
  locationId: "T0001-01", 
  resourceType: "CLIENTS",
  dateRange: { startDate: "2024-01-01", endDate: "2024-12-31" },
  data: [
    { id: "T0001-01-CLIENT-001", name: "John Doe", ... },
    { id: "T0001-01-CLIENT-002", name: "Jane Smith", ... }
  ],
  metadata: { totalCount: 150, lastUpdated: "..." }
}

// Access specific data
const clients = document.data;  // Direct array of clients
const metadata = document.metadata;
```

### Tenant Configuration

```javascript
import { tenantUtils } from '@/config/tenant';

// Get current tenant config
const config = tenantUtils.getTenantConfig();

// Check if feature is enabled
const hasAppointments = tenantUtils.isFeatureEnabled('appointments');

// Get all features for tenant
const features = tenantUtils.getTenantFeatures();
```

### Location Management

```javascript
import { locationUtils } from '@/config/tenant';

// Generate location ID
const locationId = locationUtils.generateLocationId('T0001', 1); // T0001-01

// Parse location ID
const parsed = locationUtils.parseLocationId('T0001-01');
// Returns: { tenantId: 'T0001', locationNumber: 1, fullLocationId: 'T0001-01' }
```

### Resource Management

```javascript
import { resourceUtils } from '@/config/tenant';

// Generate resource document ID
const documentId = resourceUtils.generateDocumentId('T0001', 'T0001-01', 'CLIENTS');
// Returns: T0001-01

// Generate resource item ID
const clientId = resourceUtils.generateResourceId('T0001', 'T0001-01', 'CLIENT', 1);
// Returns: T0001-01-CLIENT-001

// Parse resource ID
const parsed = resourceUtils.parseResourceId('T0001-01-CLIENT-001');
// Returns: { tenantId: 'T0001', locationId: 'T0001-01', resourceType: 'CLIENT', ... }
```

## Business Type Specific Data

Each business type has its own directory with specialized mock data following the sharded structure:

### Dental (`/dental/`)
- **Clients**: Patients with medical history, dental records
- **Services**: Dental treatments, consultations
- **Timeline**: Appointments, procedures

### Gym (`/gym/`)
- **Clients**: Members with fitness profiles, membership types
- **Services**: Classes, personal training, memberships
- **Timeline**: Classes, check-ins, workouts

### Hotel (`/hotel/`)
- **Clients**: Guests with loyalty profiles, room preferences
- **Services**: Room bookings, conference facilities, spa
- **Timeline**: Reservations, check-ins, events

## Migration from Legacy Structure

The old structure used business type parameters directly. The new structure uses tenant IDs and sharded documents:

### Old Way
```javascript
const clients = getClientsMock('dental');
```

### New Way
```javascript
// Get sharded document
const clientsDocument = getMockData('clients', 'T0001');

// Access data
const clients = clientsDocument.data;  // Direct array of clients
```

## Environment Setup

To set up different tenants for development:

### Dental Clinic
```bash
VITE_TENANT_ID=T0001 VITE_BUSINESS_TYPE=dental npm run dev
```

### Gym
```bash
VITE_TENANT_ID=T0002 VITE_BUSINESS_TYPE=gym npm run dev
```

### Hotel
```bash
VITE_TENANT_ID=T0003 VITE_BUSINESS_TYPE=hotel npm run dev
```

## Adding New Business Types

1. Add tenant configuration to `businessInfoMock.js`
2. Create new directory in `mockData/`
3. Add business-specific mock files following sharded structure
4. Update `index.js` to handle the new business type
5. Update tenant configuration in `config/tenant.js`

## Best Practices

1. **Always use composed keys** for resource identification
2. **Store all data under the `data` field** in sharded documents
3. **Use location IDs** for resource organization
4. **Follow the ID format conventions** consistently
5. **Use the utility functions** for ID generation and parsing
6. **Keep business-specific data** in their respective directories
7. **Include date ranges** for sharding metadata
8. **Use denormalized structure** - no foreign key relationships 