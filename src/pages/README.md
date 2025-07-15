# Pages Directory

This directory contains the main page components of the application.

## LocationsPage

The `LocationsPage` is the **first page** users see when they access the application. It serves as a location selection interface and user greeting page.

### Features

- **Business Information Display**: Shows business name, type, and icon
- **User Greeting**: Personalized greeting based on time of day and user authentication status
- **Location Selection**: Displays available locations with detailed information
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Shows loading spinner while fetching business data
- **Error Handling**: Displays error messages with retry functionality

### User Flow

1. **Landing**: User visits the application root (`/`)
2. **Business Info Fetch**: Page fetches business information using mock data
3. **User Greeting**: Displays personalized greeting if user is authenticated
4. **Location Display**: Shows all available locations for the business
5. **Location Selection**: User selects a location to work with
6. **Navigation**: User clicks "Continue to Dashboard" to proceed
7. **Storage**: Selected location is saved to localStorage
8. **Redirect**: User is redirected to the dashboard (`/dashboard`)

### Data Sources

- **Business Info**: Fetched from `getMockData('business-info')`
- **User Info**: Retrieved from `useAuthStore` (Zustand store)
- **Tenant Info**: Retrieved from `tenantUtils.getTenantId()` and `tenantUtils.getBusinessType()`

### Location Information Displayed

Each location card shows:
- **Location Name**: Primary identifier
- **Address**: Street and city
- **Phone Number**: Contact information
- **Business Hours**: Today's operating hours
- **Services**: Available services (up to 3, with "+X more" indicator)
- **Default Badge**: If it's the default location

### Authentication Integration

- **Authenticated Users**: See personalized greeting with their name
- **Unauthenticated Users**: See generic welcome message
- **User Avatar**: Shows first letter of user's name in a styled circle
- **User Details**: Displays name and email

### Styling

- **Modern Design**: Clean, professional appearance with gradients
- **Interactive Elements**: Hover effects and selection states
- **Responsive Grid**: Locations display in responsive grid layout
- **Business Type Icons**: Different icons for dental (🦷), gym (💪), hotel (🏨)
- **Color Scheme**: Purple gradient theme with white cards

### Technical Implementation

```javascript
// Main component structure
const LocationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [businessInfo, setBusinessInfo] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Fetch business info on mount
  useEffect(() => {
    const info = getMockData('business-info', currentTenantId);
    setBusinessInfo(info);
  }, []);
  
  // Handle location selection and navigation
  const handleContinue = () => {
    localStorage.setItem('selectedLocation', selectedLocation.id);
    navigate('/dashboard');
  };
};
```

### Integration with Dashboard

- **Location Persistence**: Selected location is stored in localStorage
- **Dashboard Access**: DashboardLayout checks for selected location
- **Redirect Logic**: If no location is selected, user is redirected back to locations page
- **Context Sharing**: Selected location is passed to dashboard components via React context

### Environment Variables

The page uses environment variables for tenant configuration:
- `VITE_TENANT_ID`: Current tenant identifier
- `VITE_BUSINESS_TYPE`: Current business type

### Future Enhancements

- **Location Switching**: Allow users to switch locations from dashboard
- **Location Management**: Add/remove locations for admin users
- **Geolocation**: Auto-select nearest location based on user's location
- **Offline Support**: Cache business info for offline access
- **Multi-language**: Support for multiple languages
- **Accessibility**: Enhanced keyboard navigation and screen reader support 