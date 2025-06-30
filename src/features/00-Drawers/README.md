# Unified Drawer System

A comprehensive drawer management system for React applications that supports multiple data types, business-specific forms, and advanced features like auto-save, database querying, and AI assistant integration.

## Key Features

- **Auto-Save**: Edit mode drawers save automatically when closed, create mode requires manual save
- **Database Querying**: Phone/email fields query database for existing users as you type
- **Searchable Options**: Select fields support real-time search through options
- **Multiple Drawer Support**: Only AI Assistant can open multiple drawers simultaneously
- **Business-Type Specific Forms**: Tailored forms for Dental Clinic, Gym, and Hotel businesses
- **Member Integration**: Open member drawer directly from appointment forms
- **Real-time Change Tracking**: Visual indicators for unsaved changes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support

## Quick Start

```jsx
import { useDrawer } from './features/00-Drawers';

const MyComponent = () => {
  const { openAppointmentDrawer, openAIAssistantDrawer } = useDrawer();

  const handleOpenAppointment = () => {
    openAppointmentDrawer({
      data: {
        patientName: 'John Doe',
        phoneNumber: '+1234567890',
        date: '2024-01-15',
        time: '10:00'
      },
      onSave: async (data) => {
        console.log('Appointment saved:', data);
      }
    });
  };

  return (
    <button onClick={handleOpenAppointment}>
      Open Appointment
    </button>
  );
};
```

## Auto-Save Functionality

The drawer system now defaults to edit mode and automatically saves changes when drawers are closed:

```jsx
// Edit mode - auto-save on close
openAppointmentDrawer({
  mode: 'edit',
  data: existingData,
  onSave: async (data) => {
    // This will be called automatically when the drawer closes
    await saveToDatabase(data);
  }
});

// Create mode - manual save required
openAppointmentDrawer({
  mode: 'create',
  data: {},
  onSave: async (data) => {
    // This will be called when user clicks "Create" button
    await createInDatabase(data);
  }
});
```

### Auto-Save Features

- **Edit Mode**: Auto-save on drawer close
- **Create Mode**: Manual save button required
- **Real-time Change Tracking**: Changes are tracked as you type
- **Visual Indicators**: Shows when there are unsaved changes
- **Toggle Control**: Can be enabled/disabled globally
- **Error Handling**: Graceful handling of save failures

## Database Querying Features

### Phone/Email Field Querying

Fields like phone number and email automatically query the database for existing users:

```jsx
// As user types in phone/email fields, the system queries the database
// Results appear in a dropdown below the field
// Clicking a result auto-fills the form with user data
```

### Searchable Select Options

Select fields support real-time search through options:

```jsx
// Treatment type, doctor, trainer fields show search input
// Type to filter through available options
// Results appear in a dropdown below the search input
```

### Query Configuration

Configure which fields support querying in the business type config:

```jsx
const BUSINESS_TYPE_CONFIGS = {
  'Dental Clinic': {
    appointment: {
      queryFields: ['phoneNumber', 'email'], // Fields that query database
      searchFields: ['treatmentType', 'medicId'] // Fields with search options
    }
  }
};
```

### API Integration

Replace mock functions with actual API calls:

```jsx
// In drawerStore.js, replace mockQueryDatabase and mockSearchOptions
const mockQueryDatabase = async (fieldName, value) => {
  // Replace with actual API call
  const response = await fetch(`/api/users/search?field=${fieldName}&value=${value}`);
  return await response.json();
};

const mockSearchOptions = async (fieldName, searchTerm) => {
  // Replace with actual API call
  const response = await fetch(`/api/options/search?field=${fieldName}&term=${searchTerm}`);
  return await response.json();
};
```

## Multiple Drawer Restrictions

Only the AI Assistant can open multiple drawers simultaneously:

```jsx
// AI Assistant can open multiple drawers
openAIAssistantDrawer({
  data: { message: 'Help me with tasks' },
  allowMultiple: true // This is automatically set for AI Assistant
});

// Other drawers will close existing ones
openAppointmentDrawer({
  data: appointmentData
  // allowMultiple: false (default)
});
```

### Drawer Opening Rules

1. **AI Assistant**: Can open multiple drawers (including member drawer from appointment)
2. **Regular Drawers**: Will close existing drawers before opening
3. **Member from Appointment**: Can be opened as a second drawer when called from appointment form

## Business-Type Specific Forms

The system automatically adapts forms based on your business type:

### Dental Clinic
- **Appointments**: Patient name, phone, date, time, treatment type, dentist
- **Services**: Treatment name, price, duration, category
- **Members**: Patient records with medical history
- **Query Fields**: phoneNumber, email
- **Search Fields**: treatmentType, medicId

### Gym
- **Appointments**: Client name, phone, date, time, session type, trainer
- **Services**: Package name, price, duration, features
- **Members**: Membership details, fitness goals
- **Query Fields**: phoneNumber, email
- **Search Fields**: sessionType, trainerId

### Hotel
- **Appointments**: Guest name, phone, check-in/out dates, room type
- **Services**: Room details, price, capacity, amenities
- **Members**: Guest profiles, preferences
- **Query Fields**: phoneNumber, email
- **Search Fields**: roomType

## API Reference

### useDrawer Hook

```jsx
const {
  // Drawer opening functions
  openAppointmentDrawer,
  openStockDrawer,
  openMemberDrawer,
  openServiceDrawer,
  openAIAssistantDrawer,
  
  // Drawer management
  closeDrawer,
  closeAllDrawers,
  
  // Data management
  updateDrawerData,
  manualSaveDrawer,
  
  // Database querying functions
  queryField,
  searchOptions,
  getQueryResults,
  getSearchResults,
  clearFieldResults,
  
  // State queries
  isDrawerOpen,
  hasUnsavedChanges,
  isCreateMode,
  getDrawerConfig,
  getActiveDrawerInfo,
  
  // Settings
  setDrawerLoading,
  toggleAutoSave,
  autoSaveEnabled,
  
  // Constants
  DRAWER_TYPES,
  DRAWER_MODES
} = useDrawer();
```

### Drawer Opening Functions

All drawer opening functions accept the same parameters:

```jsx
openAppointmentDrawer({
  data: {}, // Initial data
  mode: 'edit', // Default mode (create, edit, view, delete)
  onSave: async (data, mode) => {}, // Auto-save callback
  onDelete: async (data) => {}, // Delete callback
  onCancel: () => {} // Cancel callback
});
```

### Database Querying Functions

```jsx
// Query database for field values
const results = await queryField('phoneNumber', '+1234567890');

// Search through options
const options = await searchOptions('treatmentType', 'cleaning');

// Get cached results
const queryResults = getQueryResults('phoneNumber');
const searchResults = getSearchResults('treatmentType');

// Clear cached results
clearFieldResults('phoneNumber');
```

### Auto-Save Configuration

```jsx
// Toggle auto-save globally
toggleAutoSave();

// Check if auto-save is enabled
console.log(autoSaveEnabled); // true/false

// Check for unsaved changes
const hasChanges = hasUnsavedChanges();

// Check if current drawer is in create mode
const isCreate = isCreateMode();
```

## Member Integration from Appointment

The appointment form includes a special section for managing member/patient/guest details:

```jsx
// When an appointment has a name, a member management section appears
// Clicking "Edit Patient/Member/Guest Details" opens the member drawer
// This works as a second drawer (only possible from appointment forms)
```

## Form Validation

All forms include comprehensive validation:

- **Required Fields**: Visual indicators and error messages
- **Email Validation**: Proper email format checking
- **Phone Validation**: International phone number support
- **Number Validation**: Positive number validation for prices
- **Real-time Feedback**: Errors clear as user types

## Styling and Theming

The system uses CSS custom properties for easy theming:

```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --border-color: #e5e7eb;
}
```

### Responsive Design

- **Desktop**: Full-width drawers with side-by-side fields
- **Tablet**: Responsive grid layouts
- **Mobile**: Stacked fields, full-width buttons

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and descriptions
- **Focus Management**: Automatic focus handling
- **High Contrast**: Support for high contrast themes
- **Reduced Motion**: Respects user motion preferences

## Error Handling

The system includes comprehensive error handling:

```jsx
openAppointmentDrawer({
  onSave: async (data) => {
    try {
      await saveToDatabase(data);
      // Success handling
    } catch (error) {
      console.error('Save failed:', error);
      // Error handling (show toast, etc.)
    }
  }
});
```

## Performance Optimizations

- **Lazy Loading**: Forms are loaded only when needed
- **Debounced Updates**: Change tracking is debounced
- **Debounced Queries**: Database queries are debounced (500ms)
- **Debounced Searches**: Option searches are debounced (300ms)
- **Memoized Components**: Prevents unnecessary re-renders
- **Efficient State Management**: Optimized Zustand store

## Examples

### Basic Usage

```jsx
import { useDrawer } from './features/00-Drawers';

function App() {
  const { openAppointmentDrawer } = useDrawer();

  return (
    <button onClick={() => openAppointmentDrawer()}>
      New Appointment
    </button>
  );
}
```

### Advanced Usage with Database Querying

```jsx
function AppointmentManager() {
  const { 
    openAppointmentDrawer, 
    openAIAssistantDrawer,
    hasUnsavedChanges,
    toggleAutoSave,
    autoSaveEnabled,
    queryField,
    getQueryResults
  } = useDrawer();

  const handleCreateAppointment = () => {
    openAppointmentDrawer({
      mode: 'create',
      data: {
        date: '2024-01-15',
        time: '10:00'
      },
      onSave: async (data) => {
        await api.createAppointment(data);
        showToast('Appointment created successfully!');
      }
    });
  };

  const handleEditAppointment = () => {
    openAppointmentDrawer({
      mode: 'edit',
      data: existingAppointment,
      onSave: async (data) => {
        await api.updateAppointment(data);
        showToast('Appointment updated!');
      }
    });
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={autoSaveEnabled}
          onChange={toggleAutoSave}
        />
        Enable Auto-Save
      </label>
      
      <button onClick={handleCreateAppointment}>
        Create Appointment
      </button>
      
      <button onClick={handleEditAppointment}>
        Edit Appointment
      </button>
      
      {hasUnsavedChanges() && (
        <div>You have unsaved changes</div>
      )}
    </div>
  );
}
```

### Business-Specific Example with Querying

```jsx
function DentalAppointmentForm() {
  const { openAppointmentDrawer, queryField } = useDrawer();

  const handleDentalAppointment = () => {
    openAppointmentDrawer({
      mode: 'edit',
      data: {
        patientName: 'Sarah Johnson',
        phoneNumber: '+1234567890',
        email: 'sarah@example.com',
        date: '2024-01-20',
        time: '14:30',
        treatmentType: 'cleaning',
        medicId: '1',
        duration: 60,
        notes: 'Regular cleaning and checkup'
      },
      onSave: async (data) => {
        // Auto-save will handle this
        await dentalApi.saveAppointment(data);
      }
    });
  };

  return (
    <button onClick={handleDentalAppointment}>
      Schedule Dental Appointment
    </button>
  );
}
```

## Migration Guide

### From Previous Version

1. **Update imports**: Use the new `useDrawer` hook
2. **Add database querying**: Configure queryFields and searchFields
3. **Update save logic**: Handle create vs edit mode differences
4. **Add API endpoints**: Replace mock functions with real API calls

### Breaking Changes

- Create mode now requires manual save (no auto-save)
- Database querying functions added to store and hook
- New configuration options for queryFields and searchFields
- Enhanced form validation for query results

## Troubleshooting

### Common Issues

1. **Auto-save not working**: Ensure `onSave` callback is provided and mode is 'edit'
2. **Database queries not working**: Replace mock functions with actual API calls
3. **Search options not showing**: Configure searchFields in business type config
4. **Multiple drawers not opening**: Only AI Assistant can open multiple drawers
5. **Form validation errors**: Check required fields and data types

### Debug Mode

Enable debug logging:

```jsx
// In your app initialization
localStorage.setItem('drawer-debug', 'true');
```

## Contributing

1. Follow the existing code structure
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure accessibility compliance
5. Test across different business types

## License

MIT License - see LICENSE file for details. 