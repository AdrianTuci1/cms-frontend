# UserDrawer Component

The `UserDrawer` component is a comprehensive user profile drawer that integrates with the `useDataSync` hook to provide real-time data synchronization with the backend API.

## Features

- **Real-time Data Sync**: Uses `useDataSync` hook to fetch and sync user data
- **Offline Support**: Falls back to cached data when offline
- **Loading States**: Shows loading spinner while fetching data
- **Error Handling**: Displays error messages with retry functionality
- **Sync Status**: Shows online/offline status and last update time
- **Profile Management**: Displays user profile information with edit capabilities
- **Authentication Integration**: Shows user roles, permissions, and business type
- **Empty States**: Shows appropriate empty states for notifications and notes

## Integration with useDataSync

The component uses the `useDataSync` hook with the `userData` resource:

```javascript
const {
  data: userData,
  loading: userDataLoading,
  error: userDataError,
  update: updateUserData,
  refresh: refreshUserData,
  lastUpdated,
  isOnline
} = useDataSync('userData', {
  enableValidation: true,
  enableBusinessLogic: true
});
```

### Data Flow

1. **Authentication**: User data is initially returned from backend during login
2. **JWT Token**: Basic user info (id, email, name, roles, permissions) is stored in JWT
3. **Profile Data**: Additional profile data is fetched via `/api/userData` endpoint
4. **Fallback**: If API is unavailable, uses cached data from IndexedDB
5. **Mock Data**: If no cached data, falls back to mock data from `userDataMock`
6. **Real-time Updates**: Listens for data changes via WebSocket/API events
7. **Manual Refresh**: Users can manually refresh data

### API Endpoints

The `userData` resource is configured to use:
- `GET /api/userData` - Fetch user profile data
- `PUT /api/userData/:id` - Update user profile data
- `POST /api/userData` - Create user profile data
- `DELETE /api/userData/:id` - Delete user profile data

## Usage

### Basic Usage

```javascript
import { openDrawer } from '../index';

// Open user drawer
openDrawer('view', 'user', null, {
  onClose: () => console.log('User drawer closed')
});
```

### With Custom Handlers

```javascript
openDrawer('view', 'user', null, {
  onClose: () => {
    // Handle drawer close
  },
  onSave: (data) => {
    // Handle profile updates
  }
});
```

## Component Structure

### Tabs
- **Profile**: User information and sync status
- **Notifications**: Empty state (ready for future implementation)
- **Notes**: Empty state (ready for future implementation)

### Profile Section
- Avatar with edit capability
- User information (name, roles, department, business type)
- Contact details (email, phone, location)
- Last login information
- Permissions count
- Sync status indicator
- Action buttons (Edit Profile, Settings)

### Sync Status Indicator
- Shows online/offline status
- Displays last update time
- Manual refresh button
- Loading state during refresh

## Data Structure

The component expects the following data structure from `userDataMock`:

```javascript
{
  // Basic user info (from JWT token)
  id: 'user-001',
  email: 'john.doe@example.com',
  name: 'John Doe',
  businessType: 'dental',
  roles: ['dental_manager'],
  permissions: ['read:all', 'write:all', 'manage:appointments'],
  
  // Profile data (from /api/userData)
  profile: {
    phone: '+40 123 456 789',
    avatar: null,
    location: 'Bucharest, Romania',
    department: 'Dental Operations',
    lastLogin: '2024-01-15 09:30 AM',
    preferences: {
      theme: 'light',
      language: 'ro',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  }
}
```

### Business Type Support

The mock data can be customized based on business type:
- **dental**: Dental Manager role with dental-specific permissions
- **gym**: Gym Manager role with gym-specific permissions  
- **hotel**: Hotel Manager role with hotel-specific permissions

### Authentication Data

The component also supports the basic authentication data structure:

```javascript
{
  id: 'user-001',
  email: 'john.doe@example.com',
  name: 'John Doe',
  businessType: 'dental',
  roles: ['manager'],
  permissions: ['read:all', 'write:all']
}
```

## Styling

The component uses CSS modules with the following key classes:
- `.userDrawer` - Main container
- `.profileSection` - Profile content area
- `.syncStatus` - Sync status indicator
- `.loadingState` - Loading state
- `.errorState` - Error state
- `.emptyState` - Empty state for notifications/notes
- `.profileHeader` - Profile header with avatar
- `.profileDetails` - User details list
- `.profileActions` - Action buttons
- `.businessType` - Business type display

## Mock Data

The component relies entirely on mock data from `src/api/mockData/userDataMock.js` when:
- API is unavailable
- No cached data exists
- Running in test mode

The mock data includes:
- Complete user profile information
- Business type-specific customization
- Authentication data structure
- Structured data matching component expectations

## Error Handling

The component handles various error scenarios:
- **Network Errors**: Shows retry button
- **API Errors**: Displays error message
- **No Data**: Shows empty state
- **Validation Errors**: Uses strategy pattern validation
- **Business Logic Errors**: Uses strategy pattern business rules

## Future Enhancements

Potential improvements:
- Real notifications system integration
- Real notes system integration
- Profile image upload functionality
- Advanced settings panel
- Activity history tracking
- Permission management integration
- Role-based UI customization 