# Architecture Changes: Single Endpoint Pattern & Connectivity Management

## Overview

This document outlines the major architectural changes made to implement a unified single endpoint pattern, remove hardcoded business type dependencies, and implement robust offline/online connectivity management.

## Key Changes

### 1. Single Endpoint Pattern

**Before:**
- Multiple endpoints: `/dental/timeline`, `/gym/clients`, `/hotel/packages`, etc.
- Business type hardcoded in URLs
- Separate endpoints for each resource type

**After:**
- Single unified endpoint: `/api/resources/{businessId-locationId}`
- Resource type specified in request body/parameters
- Business and location context from business info

### 2. Endpoint Structure

#### New Endpoints:
- **Resources:** `/api/resources/{businessId-locationId}`
- **Authentication:** `/api/auth` (unchanged)
- **Business Info:** `/api/businessInfo/{businessId}` (new pattern)

#### Request Pattern:
```javascript
// GET Request
GET /api/resources/123-456?resourceType=timeline&startDate=2024-01-01

// POST Request  
POST /api/resources/123-456
{
  "resourceType": "clients",
  "operation": "create",
  "data": { ... }
}
```

### 3. Connectivity Management

#### New ConnectivityManager
- Handles server pinging and offline detection
- Supports two-server architecture
- Prevents API errors when offline
- Automatic fallback to IndexedDB/mock data

#### Features:
- Server health checks (`/api/health`)
- Separate monitoring for auth/resources and business info servers
- Configurable ping intervals and timeouts
- Event-based connectivity status

### 4. Business Type Integration

**Before:**
- Business type passed as parameter to hooks
- Hardcoded in resource configurations
- Manual business type management

**After:**
- Business type extracted from business info
- Automatic detection from business configuration
- No hardcoded dependencies

## Component Changes

### 1. ConnectivityManager (New)
```javascript
// Location: src/design-patterns/data-sync/ConnectivityManager.js
- Ping servers for connectivity
- Manage offline/online state
- Support two-server architecture
- Emit connectivity events
```

### 2. ResourceRegistry (Updated)
```javascript
// Key Changes:
- Removed business type specific endpoint registration
- Added useSingleEndpoint flag for resources
- Added getSingleEndpointUrl() method
- Business and location ID management
```

### 3. ApiSyncManager (Updated)
```javascript
// Key Changes:
- Updated to use single endpoint pattern
- Connectivity checking before API calls
- Resource type in request parameters
- Support for business info server routing
```

### 4. DataSyncManager (Updated)
```javascript
// Key Changes:
- Integrated ConnectivityManager
- Updated setBusinessInfo() method
- Removed network listeners (handled by ConnectivityManager)
- Updated API sync calls with new signatures
```

### 5. useDataSync Hook (Updated)
```javascript
// Key Changes:
- Deprecated businessType parameter
- Dynamic business type from business info
- Warning for deprecated usage
- Strategy initialization from business info
```

### 6. ApiClient (Updated)
```javascript
// Key Changes:
- Support for multiple base URLs
- getBaseURLForRequest() method
- Business info server routing
- Two-server architecture support
```

### 7. GeneralService (Updated)
```javascript
// Key Changes:
- Updated getBusinessInfo() to accept businessId
- Support for separate business info server
- New endpoint pattern: /api/businessInfo/{businessId}
```

## Environment Variables

### New Variables:
```bash
# Business info server (optional, defaults to VITE_API_URL)
VITE_BUSINESS_INFO_URL=https://business-info.example.com

# Main API server
VITE_API_URL=https://api.example.com
```

## Migration Guide

### 1. Update Environment Configuration
```bash
# Add business info server URL if using separate server
VITE_BUSINESS_INFO_URL=https://business-info.example.com
```

### 2. Update Business Info Initialization
```javascript
// Before:
dataSyncManager.setBusinessType('dental');

// After:
const businessInfo = await getBusinessInfo(businessId);
dataSyncManager.setBusinessInfo(businessInfo);
```

### 3. Update useDataSync Usage
```javascript
// Before:
const { data } = useDataSync('timeline', { businessType: 'dental' });

// After (businessType determined automatically):
const { data } = useDataSync('timeline');
```

### 4. Server Health Endpoint
Ensure your server implements:
```javascript
GET /api/health
// Should return 200 OK for connectivity checks
```

## Benefits

### 1. Simplified Architecture
- Single endpoint reduces complexity
- Unified request/response handling
- Easier server-side routing

### 2. Better Offline Support
- Proactive connectivity checking
- Automatic fallback mechanisms
- No redundant error handling

### 3. Flexible Deployment
- Support for microservices architecture
- Separate business info and resources servers
- Independent scaling

### 4. Maintainability
- Removed hardcoded dependencies
- Dynamic business type resolution
- Centralized connectivity management

### 5. Performance
- Reduced API calls when offline
- Efficient caching strategies
- Background sync when online

## Event System

### New Events:
```javascript
// Connectivity events
'connectivity:online'
'connectivity:offline'
'connectivity:mode-changed'
'connectivity:auth-resources-server'
'connectivity:business-info-server'

// Business info events
'datasync:business-info-set'
```

## Testing

### Offline Mode Testing
```javascript
// Force offline mode for testing
connectivityManager.forceOfflineMode();

// Test mode (simulates offline)
VITE_TEST_MODE=true
```

### Server Testing
```javascript
// Test connectivity
const status = connectivityManager.getStatus();
console.log(status);
```

## Future Considerations

1. **Load Balancing:** Support for multiple resource servers
2. **Caching Strategy:** Enhanced caching with TTL
3. **Sync Optimization:** Batch operations for efficiency
4. **Error Recovery:** Advanced retry mechanisms
5. **Analytics:** Request/response monitoring

## Backwards Compatibility

- Old `setBusinessType()` method still works with deprecation warning
- Existing `businessType` parameter in `useDataSync` still supported
- Gradual migration path available
- No breaking changes in data structures

## Conclusion

These changes provide a more robust, scalable, and maintainable architecture that supports:
- Better offline functionality
- Simplified server-side implementation  
- Dynamic business configuration
- Multi-server deployment flexibility
- Enhanced error handling and recovery 