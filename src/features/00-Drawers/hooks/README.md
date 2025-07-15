# Drawer Action Hooks

This directory contains hooks for handling drawer actions with optimistic updates and design-patterns validation system integration.

## Overview

All drawer action hooks integrate with the design-patterns validation system and use business-specific logic for:
- **Validation**: Data validation before operations
- **Permissions**: Permission checks before each operation
- **Data Processing**: Business-specific data processing
- **Optimistic Updates**: Immediate UI feedback with automatic rollback

## Available Hooks

### 1. `useTimelineDrawerActions`

Specific hook for timeline/appointment management.

```javascript
import { useTimelineDrawerActions } from '@/features/00-Drawers';

const MyComponent = () => {
  const timelineSync = useDataSync('timeline', {
    businessType: 'dental',
    startDate,
    endDate,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    handleAddAppointment,
    handleAppointmentClick,
    handlePatientClick
  } = useTimelineDrawerActions(timelineSync, 'dental');

  return (
    <div>
      <button onClick={handleAddAppointment}>Add Appointment</button>
      {/* Appointment cards with onClick={handleAppointmentClick} */}
    </div>
  );
};
```

### 2. `useGenericDrawerActions`

Generic hook that can be used for any resource type.

```javascript
import { useGenericDrawerActions } from '@/features/00-Drawers';

const MyComponent = () => {
  const clientsSync = useDataSync('clients', {
    businessType: 'dental',
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    handleAdd,
    handleEdit,
    labels,
    businessType,
    resourceType
  } = useGenericDrawerActions(clientsSync, 'dental', 'client');

  return (
    <div>
      <button onClick={() => handleAdd({ name: '', email: '' })}>
        Add {labels.client}
      </button>
      {/* Client cards with onClick={handleEdit} */}
    </div>
  );
};
```

## Business Type Integration

### Business Type Keys

The hooks use the following business type keys:

- `'dental'` - Dental Clinic
- `'gym'` - Gym
- `'hotel'` - Hotel

### Business Type Mapping

```javascript
// In your component
import { getBusinessType } from '@/config/businessTypes';

const MyComponent = () => {
  const businessType = getBusinessType();
  
  // Map business type name to the format expected by the data sync system
  const businessTypeKey = businessType.name === 'Dental Clinic' ? 'dental' : 
                         businessType.name === 'Gym' ? 'gym' : 
                         businessType.name === 'Hotel' ? 'hotel' : 'dental';
  
  const drawerActions = useGenericDrawerActions(resourceSync, businessTypeKey, 'client');
};
```

## Resource Types

### Supported Resource Types

- `'timeline'` - Appointments/Sessions/Reservations
- `'client'` - Patients/Members/Guests
- `'member'` - Staff members
- `'service'` - Treatments/Packages/Rooms
- `'stock'` - Inventory items

### Business Type Specific Labels

Each business type has specific labels:

```javascript
// Dental Clinic
{
  appointment: 'Dental Appointment',
  client: 'Patient',
  service: 'Treatment'
}

// Gym
{
  appointment: 'Gym Session',
  client: 'Member',
  service: 'Package'
}

// Hotel
{
  appointment: 'Hotel Reservation',
  client: 'Guest',
  service: 'Room'
}
```

## Validation Integration

### Design-Patterns Validation

The hooks use the design-patterns validation system:

```javascript
// Validation is handled automatically
const validation = validateData(processedData, resourceType);
if (!validation.isValid) {
  alert(`Validation errors: ${validation.errors.join(', ')}`);
  return;
}
```

### Permission Checks

```javascript
// Permission checks are handled automatically
const operationName = `create${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`;
if (!isOperationAllowed(operationName, processedData)) {
  alert(`You do not have permission to create ${resourceType}s`);
  return;
}
```

## Data Processing

### Business Logic Processing

```javascript
// Data processing is handled automatically
const processedData = processData(data, resourceType);
```

### Optimistic Updates

All operations use optimistic updates for immediate UI feedback:

```javascript
// Optimistic update happens automatically
await create(processedData);
// UI updates immediately, rollback happens automatically on error
```

## Usage Examples

### Timeline Component

```javascript
const TimelineComponent = () => {
  const businessType = getBusinessType();
  const businessTypeKey = businessType.name === 'Dental Clinic' ? 'dental' : 'gym';
  
  const timelineSync = useDataSync('timeline', {
    businessType: businessTypeKey,
    startDate,
    endDate,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    handleAddAppointment,
    handleAppointmentClick,
    handlePatientClick
  } = useTimelineDrawerActions(timelineSync, businessTypeKey);

  return (
    <div>
      <button onClick={handleAddAppointment}>Add Appointment</button>
      {appointments.map(appointment => (
        <div key={appointment.id} onClick={() => handleAppointmentClick(appointment)}>
          {appointment.clientName}
        </div>
      ))}
    </div>
  );
};
```

### Clients Component

```javascript
const ClientsComponent = () => {
  const businessType = getBusinessType();
  const businessTypeKey = businessType.name === 'Dental Clinic' ? 'dental' : 'gym';
  
  const clientsSync = useDataSync('clients', {
    businessType: businessTypeKey,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    handleAdd,
    handleEdit,
    labels
  } = useGenericDrawerActions(clientsSync, businessTypeKey, 'client');

  return (
    <div>
      <button onClick={() => handleAdd({ name: '', email: '', phone: '' })}>
        Add {labels.client}
      </button>
      {clients.map(client => (
        <div key={client.id} onClick={() => handleEdit(client)}>
          {client.name}
        </div>
      ))}
    </div>
  );
};
```

### Services Component

```javascript
const ServicesComponent = () => {
  const businessType = getBusinessType();
  const businessTypeKey = businessType.name === 'Dental Clinic' ? 'dental' : 'gym';
  
  const servicesSync = useDataSync('services', {
    businessType: businessTypeKey,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    handleAdd,
    handleEdit,
    labels
  } = useGenericDrawerActions(servicesSync, businessTypeKey, 'service');

  return (
    <div>
      <button onClick={() => handleAdd({ name: '', price: 0, duration: 60 })}>
        Add {labels.service}
      </button>
      {services.map(service => (
        <div key={service.id} onClick={() => handleEdit(service)}>
          {service.name} - ${service.price}
        </div>
      ))}
    </div>
  );
};
```

## Benefits

1. **Centralized Logic**: All drawer actions are centralized in the drawer directory
2. **Business Type Aware**: Automatically adapts to different business types
3. **Validation Integration**: Uses design-patterns validation system
4. **Optimistic Updates**: Immediate UI feedback with automatic rollback
5. **Permission Checks**: Automatic permission checking before operations
6. **Reusable**: Generic hooks can be used across different components
7. **Type Safety**: Proper typing for different resource types
8. **Error Handling**: Comprehensive error handling with user feedback

## Error Handling

All hooks include comprehensive error handling:

- **Validation Errors**: User-friendly validation error messages
- **Permission Errors**: Clear permission denied messages
- **Network Errors**: Automatic retry with optimistic rollback
- **Business Logic Errors**: Business-specific error handling

## Current Week Integration

The timeline hooks automatically use the current week:

```javascript
// Helper function to get current week dates
const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  
  // Calculate start of week (Monday)
  const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
  startOfWeek.setDate(today.getDate() - daysToSubtract);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Calculate end of week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return {
    startDate: startOfWeek.toISOString().split('T')[0],
    endDate: endOfWeek.toISOString().split('T')[0]
  };
};
```

This ensures that all timeline operations work with the current week by default. 