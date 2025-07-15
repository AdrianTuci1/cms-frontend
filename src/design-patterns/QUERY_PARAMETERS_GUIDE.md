# Query Parameters Guide

## Overview

The enhanced data sync system now supports flexible query parameters for searching, filtering, sorting, and pagination across all resources. This guide shows how to use these features effectively.

## Basic Usage

### Simple Search
```javascript
const { data, loading, error } = useDataSync('clients', {
  search: 'john doe'  // Search across searchable fields
});
```

### Filtering
```javascript
const { data } = useDataSync('clients', {
  filters: {
    status: 'active',
    businessType: 'dental'
  }
});
```

### Sorting
```javascript
const { data } = useDataSync('clients', {
  sortBy: 'name',
  sortOrder: 'desc'
});
```

### Pagination
```javascript
const { data } = useDataSync('clients', {
  page: 2,
  limit: 50
});
```

### Date Range Filtering
```javascript
const { data } = useDataSync('timeline', {
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

## Advanced Usage

### Combined Parameters
```javascript
const { data } = useDataSync('clients', {
  search: 'john',
  filters: {
    status: 'active',
    businessType: 'dental'
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 20
});
```

### Dynamic Query Building
```javascript
const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    data, 
    loading, 
    error,
    getSupportedQueryParams,
    buildSearchQuery 
  } = useDataSync('clients', {
    search: searchTerm,
    filters: { 
      status: selectedStatus 
    },
    page: currentPage,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Get what parameters this resource supports
  const supportedParams = getSupportedQueryParams();
  console.log('Supported query params:', supportedParams);

  // Build search query manually if needed
  const searchQuery = buildSearchQuery(searchTerm);
  console.log('Search query:', searchQuery);

  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search clients..."
      />
      
      <select 
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* Render data... */}
    </div>
  );
};
```

## Resource-Specific Parameters

### Clients Resource
```javascript
const { data } = useDataSync('clients', {
  // Search fields: name, email, phone, address
  search: 'john@example.com',
  
  // Filter fields: status, businessType, gender, ageGroup
  filters: {
    status: 'active',
    businessType: 'dental',
    gender: 'male'
  },
  
  // Sort fields: name, email, createdAt, lastVisit
  sortBy: 'lastVisit',
  sortOrder: 'desc',
  
  // Pagination
  page: 1,
  limit: 25
});
```

### Timeline Resource
```javascript
const { data } = useDataSync('timeline', {
  // Search fields: clientName, displayTreatment, medicName
  search: 'root canal',
  
  // Filter fields: status, clientId, serviceId, medicId, date
  filters: {
    status: 'scheduled',
    medicId: 123
  },
  
  // Date range (required for timeline)
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  
  // Sort fields: date, clientName, displayTreatment
  sortBy: 'date',
  sortOrder: 'asc'
});
```

### Invoices Resource
```javascript
const { data } = useDataSync('invoices', {
  // Search fields: clientName, invoiceNumber
  search: 'INV-001',
  
  // Filter fields: status, paymentMethod, date
  filters: {
    status: 'paid',
    paymentMethod: 'card',
    amountMin: 100,
    amountMax: 1000
  },
  
  // Date filtering
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  
  // Sort fields: date, amount, clientName, invoiceNumber
  sortBy: 'date',
  sortOrder: 'desc'
});
```

### Stocks Resource
```javascript
const { data } = useDataSync('stocks', {
  // Search fields: name, description, sku
  search: 'dental supplies',
  
  // Filter fields: category, status, lowStock
  filters: {
    category: 'medical',
    lowStock: true
  },
  
  // Sort fields: name, quantity, price, lastUpdated
  sortBy: 'quantity',
  sortOrder: 'asc'
});
```

## URL Patterns

### Single Endpoint Pattern
All resource requests use the single endpoint pattern:

```
GET /api/resources/{businessId-locationId}?resourceType=clients&search=john&status=active&page=1&limit=20
```

### Query Parameters
- `resourceType`: Required - specifies the resource type
- `search`: General search term
- `page`, `limit`: Pagination
- `sortBy`, `sortOrder`: Sorting
- `startDate`, `endDate`: Date range filtering
- Custom filters based on resource configuration

## Parameter Validation

The system automatically validates query parameters:

```javascript
// Only supported parameters are sent to the API
const { data } = useDataSync('clients', {
  search: 'john',
  status: 'active',        // ✅ Supported
  invalidParam: 'value'    // ❌ Filtered out
});
```

## Getting Supported Parameters

```javascript
const { getSupportedQueryParams } = useDataSync('clients');
const params = getSupportedQueryParams();

console.log(params);
// Output:
// {
//   supported: ['search', 'name', 'email', 'phone', 'status', 'businessType', 'page', 'limit', 'sortBy', 'sortOrder'],
//   searchable: ['name', 'email', 'phone', 'address'],
//   filterable: ['status', 'businessType', 'gender', 'ageGroup'],
//   sortable: ['name', 'email', 'createdAt', 'lastVisit']
// }
```

## Real-time Updates

Query parameters work seamlessly with real-time updates:

```javascript
const ClientsList = () => {
  const [filters, setFilters] = useState({ status: 'active' });
  
  const { data } = useDataSync('clients', {
    filters,
    page: 1,
    limit: 20
  });

  // Data automatically updates when filters change
  // Real-time updates are preserved
  
  return (
    <div>
      <button onClick={() => setFilters({ status: 'inactive' })}>
        Show Inactive Clients
      </button>
      {/* Render clients... */}
    </div>
  );
};
```

## Offline Support

Query parameters work in offline mode:

- Cached data is filtered client-side when possible
- Full query functionality when back online
- Seamless transition between online/offline states

## Performance Tips

1. **Use specific filters**: More specific filters reduce data transfer
2. **Implement pagination**: Large datasets should use pagination
3. **Debounce search**: Prevent excessive API calls during typing
4. **Cache strategies**: The system automatically caches filtered results

```javascript
// Example with debounced search
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 300);
  
  return () => clearTimeout(timer);
}, [searchTerm]);

const { data } = useDataSync('clients', {
  search: debouncedSearch,  // Use debounced value
  page: 1,
  limit: 20
});
```

## Migration from Old System

### Before
```javascript
// Old hardcoded approach
const { data } = useDataSync('timeline', {
  businessType: 'dental',
  params: {
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  }
});
```

### After
```javascript
// New flexible approach
const { data } = useDataSync('timeline', {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  search: 'John Doe',
  filters: {
    status: 'scheduled',
    medicId: 123
  }
});
```

This enhanced query parameter system provides powerful, flexible data filtering while maintaining the same simple API and excellent offline support. 