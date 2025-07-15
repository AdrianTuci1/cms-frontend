# Quick Reference Guide: Data Flow System

## Overview

This guide provides quick reference for implementing CRUD operations using the api-indexeddb-components data flow system.

## Basic Implementation Pattern

### 1. **Hook Setup**
```javascript
import { useDataSync } from '../design-patterns/hooks';

const { 
  data, 
  loading, 
  error, 
  create, 
  update, 
  remove, 
  refresh 
} = useDataSync('resourceName', {
  businessType: 'dental', // or 'gym', 'hotel'
  enableValidation: true,
  enableBusinessLogic: true
});
```

### 2. **Basic CRUD Operations**
```javascript
// CREATE
const handleCreate = async (newData) => {
  try {
    await create(newData);
    // Success is automatic with optimistic updates
  } catch (error) {
    // Error handling is automatic with rollback
    console.error('Create failed:', error);
  }
};

// UPDATE
const handleUpdate = async (updatedData) => {
  try {
    await update(updatedData);
  } catch (error) {
    console.error('Update failed:', error);
  }
};

// DELETE
const handleDelete = async (itemToDelete) => {
  try {
    await remove(itemToDelete);
  } catch (error) {
    console.error('Delete failed:', error);
  }
};
```

### 3. **Component Template**
```jsx
const ResourceComponent = () => {
  const resourceSync = useDataSync('resourceName', {
    businessType: 'dental',
    enableValidation: true,
    enableBusinessLogic: true
  });

  const { data, loading, error, create, update, remove } = resourceSync;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data && data.map(item => (
        <div key={item.id}>
          {/* Render item */}
          <button onClick={() => update({...item, modified: true})}>
            Update
          </button>
          <button onClick={() => remove(item)}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={() => create({/* new item data */})}>
        Add New
      </button>
    </div>
  );
};
```

---

## Resource Types

### Available Resources

| Resource | Business Type | Endpoint Pattern |
|----------|---------------|------------------|
| `timeline` | `dental`, `gym`, `hotel` | `/{businessType}/timeline` |
| `clients` | `dental`, `gym`, `hotel` | `/{businessType}/clients` |
| `packages` | `dental`, `gym`, `hotel` | `/{businessType}/packages` |
| `members` | `dental`, `gym`, `hotel` | `/{businessType}/members` |
| `invoices` | All | `/invoices` |
| `stocks` | All | `/stocks` |
| `sales` | All | `/sales` |
| `history` | All | `/history` |
| `workflows` | All | `/workflows` |
| `reports` | All | `/reports` |

### Special Features by Resource

#### Timeline (Requires Date Range)
```javascript
const timelineSync = useDataSync('timeline', {
  businessType: 'dental',
  startDate: '2024-01-15',
  endDate: '2024-01-21'
});
```

#### Clients/Members (Supports Pagination)
```javascript
const clientsSync = useDataSync('clients', {
  businessType: 'dental',
  page: 1,
  limit: 20
});
```

---

## Business Type Configuration

### Setting Business Type
```javascript
// Set business type early in your app
useEffect(() => {
  if (businessType && dataSyncManager.businessType !== businessType) {
    dataSyncManager.setBusinessType(businessType);
  }
}, [businessType]);
```

### Business Type Mapping
```javascript
const businessTypeMap = {
  'Dental Clinic': 'dental',
  'Gym': 'gym', 
  'Hotel': 'hotel'
};

const businessTypeKey = businessTypeMap[businessType.name] || 'dental';
```

---

## Data Structures

### Timeline Data (Business-Specific)

#### Dental
```javascript
{
  id: 1,
  treatmentId: 1,
  displayTreatment: 'Root Canal',
  clientId: 2,
  clientName: 'John Doe',
  medicId: 1,
  medicName: 'Dr. Smith',
  date: '2024-01-16T10:00:00Z',
  duration: 60,
  status: 'scheduled'
}
```

#### Gym
```javascript
{
  memberId: 1,
  memberName: 'Mike Johnson',
  serviceId: 1,
  serviceName: 'Premium',
  checkInTime: '14:00',
  checkOutTime: '16:00'
}
```

#### Hotel
```javascript
{
  id: 1,
  rooms: [{ roomId: 102, startDate: '2024-06-12', endDate: '2024-06-14' }],
  client: { clientId: 2, clientName: 'Jane Smith' },
  general: { status: 'confirmed', isPaid: true }
}
```

---

## Error Handling Patterns

### Connectivity Errors (Automatic)
```javascript
// These are handled automatically - no user action needed
// - Operations are queued when offline
// - Cache is used as fallback
// - Sync happens when online
```

### Business Logic Errors (Manual)
```javascript
try {
  await create(data);
} catch (error) {
  if (!error.message.includes('Backend indisponibil')) {
    // Handle business logic errors
    showUserError(error.message);
  }
  // Connectivity errors are automatic
}
```

### Validation Errors
```javascript
const { validateData, isOperationAllowed } = useDataSync('resource');

// Before operations
const validation = validateData(formData, 'create');
if (!validation.isValid) {
  showValidationErrors(validation.errors);
  return;
}

if (!isOperationAllowed('createResource', formData)) {
  showPermissionError();
  return;
}
```

---

## Advanced Features

### Optimistic Updates
```javascript
const { optimisticUpdate } = useDataSync('resource');

// Manual optimistic update
optimisticUpdate(prevData => {
  // Update UI immediately
  return modifiedData;
});

// Automatic with CRUD operations
await create(data); // UI updates immediately, syncs in background
```

### Real-time Updates
```javascript
useEffect(() => {
  const unsubscribe = eventBus.on('timeline:updated', (eventData) => {
    // Handle real-time updates from WebSocket
    console.log('Timeline updated:', eventData.data);
  });

  return unsubscribe;
}, []);
```

### Cache Management
```javascript
const { clearDuplicates, clearResourceData } = useDataSync('resource');

// Clear duplicates
const duplicatesCount = await clearDuplicates();

// Clear all data for resource
const clearedCount = await clearResourceData();
```

---

## Common Patterns

### Loading States
```jsx
if (loading) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading {resourceName}...</p>
    </div>
  );
}
```

### Error States
```jsx
if (error) {
  return (
    <div className="error-container">
      <h3>Error loading {resourceName}</h3>
      <p>{error.message}</p>
      <button onClick={refresh}>Retry</button>
      {!isOnline && <p>You're offline. Using cached data.</p>}
    </div>
  );
}
```

### Form Submission
```jsx
const handleSubmit = async (formData) => {
  try {
    if (selectedItem?.id) {
      await update({ ...selectedItem, ...formData });
    } else {
      await create(formData);
    }
    setSelectedItem(null);
  } catch (error) {
    // Error handling is automatic
  }
};
```

### Search/Filter
```jsx
const [searchTerm, setSearchTerm] = useState('');

const filteredData = data?.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.email.toLowerCase().includes(searchTerm.toLowerCase())
) || [];
```

### Pagination
```jsx
const [currentPage, setCurrentPage] = useState(1);

const resourceSync = useDataSync('clients', {
  businessType: 'dental',
  page: currentPage,
  limit: 20
});

// Pagination controls
<button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>
  Previous
</button>
<span>Page {currentPage}</span>
<button onClick={() => setCurrentPage(prev => prev + 1)}>
  Next
</button>
```

---

## Debugging

### Debug Data Sync
```javascript
const { data, loading, error, lastUpdated, isOnline, strategy } = useDataSync('resource');

console.log('Sync State:', {
  data: data?.length || 'no data',
  loading,
  error: error?.message,
  lastUpdated,
  isOnline,
  strategy
});
```

### Debug Events
```javascript
// Listen to all data sync events
eventBus.on('datasync:*', (eventName, data) => {
  console.log(`DataSync Event: ${eventName}`, data);
});
```

### Check Queue Status
```javascript
// Check sync queue manually
const queue = await dataSyncManager.databaseManager.getSyncQueue();
console.log('Pending sync operations:', queue);
```

---

## Performance Tips

1. **Use Pagination**: For large datasets, always enable pagination
2. **Optimize Re-renders**: Use `useMemo` for derived data
3. **Batch Operations**: Group multiple operations when possible
4. **Cache Effectively**: Let the system handle caching automatically
5. **Monitor Queue**: Check sync queue during development

---

## Testing

### Test Mode
```javascript
// Enable test mode to use mock data
// Set VITE_TEST_MODE=true in .env file

// Test mode behavior:
// - API calls are disabled
// - Mock data is used instead
// - Sync operations are simulated
```

### Mock Data Integration
```javascript
// Mock data is automatically used when:
// 1. Test mode is enabled
// 2. API is unavailable
// 3. No cached data exists
```

---

## Migration Checklist

When implementing new resources:

- [ ] Add resource configuration to ResourceRegistry
- [ ] Create business-specific data models
- [ ] Implement component with useDataSync
- [ ] Add validation rules if needed
- [ ] Test CRUD operations
- [ ] Test offline functionality
- [ ] Add error handling
- [ ] Document usage patterns

---

This system provides a robust foundation for building data-driven applications with offline functionality, real-time updates, and excellent user experience across all network conditions. 