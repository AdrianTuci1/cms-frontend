# Business Type Management & IndexedDB Clearing

## Overview

This document describes the implementation of business type management with organized mock data by business types. Business types are configured via environment variables.

## Features Implemented

### 1. Business Type Configuration

**File**: `src/config/businessTypes.js`

- **`getBusinessType()`**: Gets current business type from environment variables
- **`getBusinessTypeKey(businessTypeName)`**: Converts business type name to lowercase key

**Key Features**:
- ✅ Reads business type from environment variables
- ✅ Supports DENTAL, GYM, and HOTEL business types
- ✅ Defaults to DENTAL if no environment variable is set
- ✅ No runtime business type changes (configured via .env file)

### 3. Organized Mock Data by Business Types

#### Timeline Data
- **Dental**: Appointments, treatments, patient data
- **Gym**: Member check-ins, classes, occupancy
- **Hotel**: Reservations, room bookings, hotel occupancy

#### Clients Data
- **Dental**: Patients with medical history, insurance info
- **Gym**: Members with fitness goals, membership types
- **Hotel**: Guests with preferences, loyalty numbers

#### Services Data
- **Dental**: Treatments with medical categories
- **Gym**: Packages with fitness categories
- **Hotel**: Rooms with amenities and capacity

#### Members Data
- **Dental**: Dentists, assistants, receptionists
- **Gym**: Trainers, coaches, instructors
- **Hotel**: Managers, receptionists, housekeepers

## How It Works

### 1. Business Type Configuration

```javascript
// Set in .env file
VITE_BUSINESS_TYPE=DENTAL
VITE_BUSINESS_TYPE=GYM
VITE_BUSINESS_TYPE=HOTEL

// Get current business type
const businessType = getBusinessType();
console.log(businessType.name); // "Dental Clinic", "Gym", or "Hotel"
```

### 2. Mock Data Organization

```javascript
// Get business-specific data
const dentalClients = getClientsMock('dental');
const gymServices = getServicesMock('gym');
const hotelMembers = getMembersMock('hotel');
```

### 3. Data Sync Integration

```javascript
// useDataSync automatically uses correct business type
const clientsSync = useDataSync('clients', {
  businessType: 'dental', // or 'gym', 'hotel'
  enableValidation: true,
  enableBusinessLogic: true
});
```

## Benefits

### 1. Data Isolation
- Each business type has completely separate data
- No data contamination between business types
- Clean slate when switching business types

### 2. Business-Specific Features
- Dental: Medical history, insurance, treatments
- Gym: Fitness goals, membership types, classes
- Hotel: Guest preferences, room types, amenities

### 3. Configuration Benefits
- Simple environment variable configuration
- No runtime business type changes needed
- Consistent business type across application
- Easy deployment configuration

### 4. Development Benefits
- Organized mock data structure
- Business-specific validation rules
- Consistent data patterns across business types
- Easy testing of different business scenarios

## Usage Examples

### Getting Current Business Type
```javascript
import { getBusinessType } from '../config/businessTypes';

const businessType = getBusinessType();
console.log(businessType.name); // "Dental Clinic", "Gym", or "Hotel"
```

### Getting Business-Specific Data
```javascript
import { getClientsMock, getServicesMock } from '../api/mockData';

// Get dental patients
const dentalPatients = getClientsMock('dental');

// Get gym packages
const gymPackages = getServicesMock('gym');
```

### Using Business Type in Components
```javascript
import { getBusinessType } from '../config/businessTypes';

const MyComponent = () => {
  const businessType = getBusinessType();
  
  if (businessType.name === 'Dental Clinic') {
    return <DentalSpecificComponent />;
  } else if (businessType.name === 'Gym') {
    return <GymSpecificComponent />;
  } else {
    return <HotelSpecificComponent />;
  }
};
```

## Configuration

### Environment Variables
```bash
# Set default business type
VITE_BUSINESS_TYPE=DENTAL
VITE_BUSINESS_TYPE=GYM
VITE_BUSINESS_TYPE=HOTEL
```

### Default Business Type
```javascript
// In businessTypes.js
const DEFAULT_BUSINESS_TYPE = 'DENTAL';
```

## Files Modified

1. **`src/config/businessTypes.js`** - Simplified business type configuration
2. **`src/api/mockData/clientsMock.js`** - Organized by business types
3. **`src/api/mockData/servicesMock.js`** - Organized by business types
4. **`src/api/mockData/membersMock.js`** - Organized by business types
5. **`src/api/mockData/index.js`** - Updated exports for business-specific data

## Future Enhancements

1. **Business Type Templates**: Pre-configured settings for each business type
2. **Business Type Validation**: Ensure data consistency within business types
3. **Business Type Analytics**: Track usage patterns by business type
4. **Environment-based Configuration**: Additional business type settings via environment variables
5. **Business Type Documentation**: Auto-generated documentation for each business type 