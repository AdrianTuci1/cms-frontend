# Business ID Integration

## Overview

The application now supports fetching business information using a `VITE_BUSINESS_ID` environment variable and making API calls to `/api/business-info/{businessId}`.

## Environment Configuration

### Required Environment Variables

Add the following to your `.env` file:

```bash
# Business ID for API calls to /api/business-info/{businessId}
# This will be used as tenantId in API headers
VITE_BUSINESS_ID = your-business-id-here

# Other existing variables
VITE_TENANT_ID = TN25-100000
VITE_BUSINESS_TYPE = DENTAL
VITE_API_URL = http://localhost:3000
```

## API Endpoint

The application will make a GET request to:
```
GET /api/business-info/{businessId}
```

### Expected Response Format

The API should return a JSON response with the following structure:

```json
{
  "companyName": "Your Company Name",
  "locations": [
    {
      "id": "location-1",
      "name": "Main Office",
      "address": {
        "street": "123 Main St",
        "city": "City Name",
        "state": "State",
        "zipCode": "12345"
      }
    }
  ]
}
```

## Implementation Details

### 1. Tenant Configuration (`src/config/tenant.js`)

Added `VITE_BUSINESS_ID` to the environment configuration:

```javascript
export const ENV_CONFIG = {
  VITE_TENANT_ID: localStorage.getItem('VITE_TENANT_ID') || import.meta.env.VITE_TENANT_ID || 'T0001',
  VITE_BUSINESS_TYPE: localStorage.getItem('VITE_BUSINESS_TYPE') || import.meta.env.VITE_BUSINESS_TYPE || 'dental',
  VITE_BUSINESS_ID: import.meta.env.VITE_BUSINESS_ID || null,
  VITE_TEST_MODE: import.meta.env.VITE_TEST_MODE === 'true'
};
```

**Note**: In this implementation, `tenantId` is actually used as `businessId` and `locationId` is the selected location ID.

Added utility method to get business ID:

```javascript
getCurrentBusinessId() {
  return ENV_CONFIG.VITE_BUSINESS_ID;
}
```

### 2. General Service (`src/api/services/GeneralService.js`)

Updated `getBusinessInfo()` method to use the business ID:

```javascript
async getBusinessInfo(businessId = null) {
  // Use provided businessId or get from environment variable
  const targetBusinessId = businessId || tenantUtils.getCurrentBusinessId();
  
  if (!targetBusinessId) {
    throw new Error('Business ID is required. Please set VITE_BUSINESS_ID environment variable or provide businessId parameter.');
  }

  const endpoint = `/api/business-info/${targetBusinessId}`;
  // ... rest of implementation
}
```

### 3. ApiClient Configuration (`src/api/core/client/ApiClient.js`)

Updated to use businessId as tenantId:

```javascript
// Multi-tenant support - tenantId is actually businessId
this.tenantId = config.tenantId || import.meta.env.VITE_BUSINESS_ID;
this.locationId = config.locationId;
```

### 3. Locations Page (`src/pages/LocationsPage.jsx`)

Updated to use the business ID when fetching business information:

```javascript
const currentBusinessId = tenantUtils.getCurrentBusinessId();

// In useEffect
const info = await generalService.getBusinessInfo(currentBusinessId);
```

### 4. Location Selection

When a location is selected, the locationId is stored in localStorage:

```javascript
const handleContinue = () => {
  if (selectedLocation) {
    localStorage.setItem('selectedLocation', selectedLocation.id);
    localStorage.setItem('locationId', selectedLocation.id);
    navigate('/dashboard');
  }
};
```

The `locationId` will be used in subsequent API calls as `X-Location-ID` header.

## Usage Examples

### 1. Basic Usage

```javascript
import { tenantUtils } from '../config/tenant.js';
import GeneralService from '../api/services/GeneralService.js';

// Get business info using environment variable
const generalService = new GeneralService();
const businessInfo = await generalService.getBusinessInfo();
```

### 2. With Custom Business ID

```javascript
// Override business ID for specific request
const businessInfo = await generalService.getBusinessInfo('custom-business-id');
```

### 3. Check if Business ID is Set

```javascript
const businessId = tenantUtils.getCurrentBusinessId();
if (businessId) {
  console.log('Business ID is configured:', businessId);
} else {
  console.log('Business ID not set');
}
```

## Error Handling

The system handles the following scenarios:

1. **Missing Business ID**: Throws an error if `VITE_BUSINESS_ID` is not set
2. **API Failure**: Shows error message if API call fails

## Testing

### API Testing

To test the API endpoint, you can use curl:

```bash
curl -X GET "http://localhost:3000/api/business-info/your-business-id"
```

## Migration Guide

### From Previous Implementation

1. **Add Business ID**: Set `VITE_BUSINESS_ID` in your environment
2. **Update API Calls**: The `getBusinessInfo()` method now requires a business ID
3. **Verify Response Format**: Ensure your API returns the expected JSON structure

### Error Handling

The system handles errors gracefully:
- Shows clear error messages if API fails
- Gracefully handles missing business ID with clear error messages
