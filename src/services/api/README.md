# API System Documentation

## Overview

This API system provides a robust, modular, and easy-to-understand architecture for handling data fetching and sending requests to the server. It's designed to support multiple business types (Dental Clinic, Gym, Hotel) with business-specific data structures and endpoints.

## Architecture

The system uses several design patterns to ensure modularity and extensibility:

- **Singleton Pattern**: HttpClient, OfflineQueue, NetworkMonitor, ApiClientFactory, ApiManager
- **Strategy Pattern**: Business-specific strategies for different business types
- **Factory Pattern**: ApiClientFactory for creating API clients
- **Template Method Pattern**: BaseApiService for common API operations
- **Observer Pattern**: NetworkMonitor for network status changes
- **Command Pattern**: OfflineQueue for queuing offline actions

## Business Types and Data Structures

### Dental Clinic
- **Calendar**: Appointments (weekly view)
- **Clients**: Patients (with pagination)
- **Services**: Treatments

### Gym
- **Calendar**: Today view with 3 components:
  - Members (active/inactive)
  - Classes
  - Occupancy
- **Clients**: Members (with pagination)
- **Services**: Packages

### Hotel
- **Calendar**: Reservations (date-range with this week as default)
- **Clients**: Guests (with pagination)
- **Services**: Rooms

## Core Components

### HttpClient
Singleton HTTP client with retry logic, timeout, and error handling.

```javascript
import { httpClient } from './core/HttpClient.js';

// Make a request
const response = await httpClient.request('GET', '/api/endpoint');
```

### OfflineQueue
Singleton queue for managing offline actions using the Command pattern.

```javascript
import { offlineQueue } from './core/OfflineQueue.js';

// Add action to queue
offlineQueue.addToQueue({
  id: 'unique-id',
  method: 'POST',
  endpoint: '/api/endpoint',
  payload: { data: 'value' },
  timestamp: Date.now()
});

// Process queue when online
await offlineQueue.processQueue(async (item) => {
  // Process each item
});
```

### NetworkMonitor
Singleton monitor for network connectivity using the Observer pattern.

```javascript
import { networkMonitor } from './core/NetworkMonitor.js';

// Subscribe to network changes
networkMonitor.subscribe((status) => {
  console.log('Network status:', status.isOnline);
});

// Get current status
const status = networkMonitor.getStatus();
```

### Business Strategies

Each business type has its own strategy that defines:
- Endpoints configuration
- Data structure
- Data types (calendar, clients, services)
- Validation rules
- Default values
- Demo data

```javascript
import { DentalClinicStrategy, GymStrategy, HotelStrategy } from './strategies/BusinessStrategy.js';

// Create strategy
const strategy = new DentalClinicStrategy();
const endpoints = strategy.getEndpoints();
const dataTypes = {
  calendar: strategy.getCalendarDataType(), // 'appointments'
  clients: strategy.getClientsDataType(),   // 'patients'
  services: strategy.getServicesDataType()  // 'treatments'
};
```

### ApiClientFactory
Singleton factory for creating API clients based on business type.

```javascript
import { apiClientFactory } from './factories/ApiClientFactory.js';

// Create API client
const apiClient = apiClientFactory.createApiClient('dental-clinic', {
  baseURL: 'https://api.example.com',
  timeout: 5000
});
```

## Services

### CalendarService
Handles calendar-related operations with business-specific data types.

```javascript
import { apiManager } from './index.js';

// Initialize for dental clinic
apiManager.initialize(1, 1, 'dental-clinic');

// Get appointments (dental clinic)
const appointments = await apiManager.calendar.getAppointments();

// Get today's data (gym)
const todayData = await apiManager.calendar.getTodayData();
// Returns: { date, members, classes, occupancy }

// Get reservations (hotel)
const reservations = await apiManager.calendar.getReservations();

// Get specific components for gym
const members = await apiManager.calendar.getMembers();
const classes = await apiManager.calendar.getClasses();
const occupancy = await apiManager.calendar.getOccupancy();
```

### ClientsService
Handles client-related operations with business-specific data types.

```javascript
// Get patients (dental clinic)
const patients = await apiManager.clients.getPatients({ page: 1, limit: 20 });

// Get members (gym)
const members = await apiManager.clients.getMembers({ page: 1, limit: 20 });

// Get guests (hotel)
const guests = await apiManager.clients.getGuests({ page: 1, limit: 20 });

// Business-specific queries
const expiringMemberships = await apiManager.clients.getMembersWithExpiringMemberships(30);
const guestsWithReservations = await apiManager.clients.getGuestsWithCurrentReservations();
```

### ServicesService
Handles services-related operations with business-specific data types.

```javascript
// Get treatments (dental clinic)
const treatments = await apiManager.services.getTreatments();

// Get packages (gym)
const packages = await apiManager.services.getPackages();

// Get rooms (hotel)
const rooms = await apiManager.services.getRooms();

// Business-specific queries
const availableRooms = await apiManager.services.getAvailableRooms();
const roomsByType = await apiManager.services.getRoomsByType('Standard');
const treatmentsByCategory = await apiManager.services.getTreatmentsByCategory('cleaning');
```

## Usage Examples

### Basic Setup

```javascript
import { apiManager } from './services/api/index.js';

// Initialize API manager
apiManager.initialize(1, 1, 'dental-clinic', {
  baseURL: 'https://api.example.com',
  timeout: 5000
});

// Get business data types
const dataTypes = apiManager.getDataTypes();
console.log(dataTypes);
// Output: { calendar: 'appointments', clients: 'patients', services: 'treatments' }
```

### Calendar Operations

```javascript
// Dental Clinic - Get weekly appointments
const appointments = await apiManager.calendar.getAppointments({
  startDate: '2025-01-13',
  endDate: '2025-01-19'
});

// Gym - Get today's data
const todayData = await apiManager.calendar.getTodayData();
console.log(todayData);
// Output: {
//   date: '2025-01-15',
//   members: [...],
//   classes: [...],
//   occupancy: [...],
//   type: 'today'
// }

// Hotel - Get reservations for this week
const reservations = await apiManager.calendar.getReservations();
```

### Client Operations

```javascript
// Get paginated clients based on business type
const clients = await apiManager.clients.getClientsData({
  page: 1,
  limit: 20,
  search: 'John'
});

// Business-specific client queries
if (apiManager.getBusinessType() === 'gym') {
  const expiringMemberships = await apiManager.clients.getMembersWithExpiringMemberships(30);
  const membersByTrainer = await apiManager.clients.getMembersByTrainer(1);
} else if (apiManager.getBusinessType() === 'hotel') {
  const guestsWithReservations = await apiManager.clients.getGuestsWithCurrentReservations();
  const platinumGuests = await apiManager.clients.getGuestsByLoyaltyLevel('platinum');
}
```

### Service Operations

```javascript
// Get services based on business type
const services = await apiManager.services.getServicesData();

// Business-specific service queries
if (apiManager.getBusinessType() === 'hotel') {
  const availableRooms = await apiManager.services.getAvailableRooms();
  const roomsByFloor = await apiManager.services.getRoomsByFloor(2);
} else if (apiManager.getBusinessType() === 'dental-clinic') {
  const treatmentsByCategory = await apiManager.services.getTreatmentsByCategory('cleaning');
  const treatmentsByPrice = await apiManager.services.getTreatmentsByPriceRange(50, 200);
}
```

### Offline Support

```javascript
// Enable offline mode
apiManager.enableOfflineMode();

// Operations will be queued when offline
await apiManager.calendar.createEvent({
  patientName: 'John Doe',
  date: '2025-01-20T10:00:00',
  duration: 30
});

// Check offline queue stats
const stats = apiManager.getOfflineQueueStats();
console.log(stats);
// Output: { pending: 1, processed: 0, failed: 0 }

// Process queue when online
await apiManager.processOfflineQueue();
```

### Demo Mode

```javascript
// Enable demo mode
apiManager.enableDemoMode();

// All API calls will return demo data
const demoData = await apiManager.calendar.getCalendarData();
console.log(demoData);
// Output: Demo data based on business type
```

## Error Handling

The system provides comprehensive error handling:

```javascript
try {
  const data = await apiManager.calendar.getCalendarData();
} catch (error) {
  if (error.name === 'NetworkError') {
    // Handle network errors
    console.log('Network error, using offline queue');
  } else if (error.name === 'ValidationError') {
    // Handle validation errors
    console.log('Validation error:', error.message);
  } else {
    // Handle other errors
    console.error('API error:', error);
  }
}
```

## State Management Integration

The API system is designed to work with state management libraries like Zustand:

```javascript
// Example with Zustand
import { create } from 'zustand';

const useApiStore = create((set, get) => ({
  calendarData: null,
  clientsData: null,
  servicesData: null,
  loading: false,
  error: null,

  fetchCalendarData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiManager.calendar.getCalendarData();
      set({ calendarData: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchClientsData: async (pagination) => {
    set({ loading: true, error: null });
    try {
      const data = await apiManager.clients.getClientsData(pagination);
      set({ clientsData: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));
```

## Configuration

### Environment Variables

```javascript
// .env
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=5000
VITE_API_RETRY_ATTEMPTS=3
VITE_API_RETRY_DELAY=1000
```

### API Configuration

```javascript
const config = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT),
  retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS),
  retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY),
  enableOfflineMode: true,
  enableDemoMode: false
};

apiManager.initialize(1, 1, 'dental-clinic', config);
```

## Future Enhancements

### SQLite Integration
- Local database for offline persistence
- Data synchronization between local and remote
- Conflict resolution strategies

### WebSocket Support
- Real-time updates
- Live data synchronization
- Event-driven architecture

### Advanced Features
- Data caching strategies
- Request/response interceptors
- Rate limiting
- API versioning
- Multi-language support

## Testing

```javascript
// Example test with Jest
import { apiManager } from './services/api/index.js';

describe('API Manager', () => {
  beforeEach(() => {
    apiManager.initialize(1, 1, 'dental-clinic');
  });

  test('should get calendar data', async () => {
    const data = await apiManager.calendar.getCalendarData();
    expect(data).toBeDefined();
  });

  test('should handle offline mode', async () => {
    apiManager.enableOfflineMode();
    const data = await apiManager.calendar.getCalendarData();
    expect(data).toBeDefined();
  });
});
```

## Contributing

1. Follow the existing code structure and patterns
2. Add proper JSDoc documentation
3. Include error handling
4. Add tests for new functionality
5. Update this documentation

## License

This project is licensed under the MIT License.

# API Services

Această secțiune conține toate serviciile API pentru aplicație, organizate într-un mod modular și extensibil.

## Servicii Disponibile

- **CalendarService** - Gestionarea calendarului și programărilor
- **ClientsService** - Gestionarea clienților (pacienți, membri, oaspeți)
- **ServicesService** - Gestionarea serviciilor (tratamente, pachete, camere)
- **HistoryService** - Gestionarea istoricului acțiunilor
- **StocksService** - Gestionarea stocurilor
- **EmployeesService** - Gestionarea angajaților și rolurilor
- **InvoicesService** - Gestionarea facturilor și sugestiilor de facturare

## Obținerea tenantId și locationId

`tenantId` și `locationId` sunt gestionate diferit:

- **`tenantId`** este obținut din variabila de mediu `VITE_TENANT_ID`
- **`locationId`** este returnat ca parametru la signIn și poate fi schimbat dinamic

### Structura la SignIn

La signIn, serverul returnează:
```js
{
  userData: {
    userId: "123",
    email: "user@example.com", 
    name: "John Doe",
    avatar: "https://...",
    businessType: "hotel",
    roles: ["admin"],
    permissions: ["read", "write"]
  },
  userLocationData: [
    {
      locationId: "loc1",
      locationName: "Hotel București",
      businessType: "hotel",
      roles: ["admin"],
      permissions: ["read", "write"],
      isActive: true
    },
    {
      locationId: "loc2", 
      locationName: "Hotel Cluj",
      businessType: "hotel",
      roles: ["manager"],
      permissions: ["read"],
      isActive: true
    },
    {
      locationId: "loc3",
      locationName: "Hotel Timișoara",
      businessType: "hotel",
      roles: ["manager"],
      permissions: ["read"],
      isActive: true
    }
  ],
  tokens: {
    accessToken: "...",
    expiresAt: 1234567890,
    refreshToken: "...",
    scope: "read write",
    idToken: "..."
  }
}
```

### Metoda 1: Inițializare automată cu AuthService

```js
import { apiManager } from './api/index.js';
import { authManager } from '../auth/index.js';

// Setează referința către AuthManager
apiManager.setAuthManager(authManager);

// Inițializează API Manager cu datele de autentificare
await apiManager.initializeWithAuth({ enableDemoMode: true });

// Acum poți folosi toate serviciile
const clients = await apiManager.clients.getClientsData();
const invoices = await apiManager.invoices.getInvoices();
```

### Metoda 2: Gestionarea locațiilor multiple

```js
import { authManager } from '../auth/index.js';

// Obține toate locațiile disponibile
const locations = authManager.getUserLocations();
console.log('Available locations:', locations);

// Obține locația curentă
const currentLocation = authManager.getCurrentLocationId();
console.log('Current location:', currentLocation);

// Schimbă locația
authManager.setCurrentLocation('loc2');

// Reinițializează API Manager cu noua locație
await apiManager.initializeWithAuth();
```

### Metoda 3: SignIn cu locații multiple

```js
import { authManager } from '../auth/index.js';

// Exemplu de signIn cu multiple locații
const signInResult = await authManager.handleSignIn({
  userData: {
    userId: "123",
    email: "user@example.com",
    name: "John Doe",
    businessType: "hotel"
  },
  userLocationData: [
    {
      locationId: "loc1",
      locationName: "Hotel București",
      businessType: "hotel"
    },
    {
      locationId: "loc2", 
      locationName: "Hotel Cluj",
      businessType: "hotel"
    },
    {
      locationId: "loc3",
      locationName: "Hotel Timișoara",
      businessType: "hotel"
    }
  ],
  tokens: {
    accessToken: "token123",
    expiresAt: Date.now() + 3600000
  }
});

console.log('SignIn successful:', signInResult);
```

### Metoda 4: Obținere directă

```js
import { authManager } from '../auth/index.js';

// Obține tenantId din variabila de mediu
const tenantId = authManager.getTenantId();
console.log('Tenant ID:', tenantId);

// Obține locationId curent
const locationId = authManager.getCurrentLocationId();
console.log('Location ID:', locationId);

// Obține toate locațiile
const allLocations = authManager.getUserLocations();
console.log('All locations:', allLocations);
```

## Utilizarea Serviciilor

După inițializare, toate serviciile sunt accesibile prin `apiManager`:

```js
// Calendar
const calendarData = await apiManager.calendar.getCalendarData();

// Clienți
const clients = await apiManager.clients.getClientsData();
const client = await apiManager.clients.getClient(1);

// Servicii
const services = await apiManager.services.getServicesData();

// Istoric
const history = await apiManager.history.getHistoryData();

// Stocuri
const stocks = await apiManager.stocks.getStocks();

// Angajați
const employees = await apiManager.employees.getEmployees();
const roles = await apiManager.employees.getAvailableRoles();

// Facturi
const invoices = await apiManager.invoices.getInvoices();
const suggestions = await apiManager.invoices.getBillingSuggestions();
```

## Configurare

### Demo Mode
```js
apiManager.initializeWithAuth({ enableDemoMode: true });
```

### Offline Mode
```js
apiManager.initializeWithAuth({ enableOfflineMode: true });
```

### Configurare completă
```js
apiManager.initializeWithAuth({
  enableDemoMode: true,
  enableOfflineMode: false,
  timeout: 30000,
  retryAttempts: 3
});
```

## Structura Endpoint-urilor

Toate endpoint-urile urmează pattern-ul:
```
/api/{tenantId}/{locationId}/{resource}
```

Exemple:
- `/api/1/1/calendar`
- `/api/1/1/clients`
- `/api/1/1/stocks`
- `/api/1/1/employees`
- `/api/1/1/invoices`

## Integrare cu AuthService

API Manager este proiectat să se integreze cu AuthService pentru a obține automat `tenantId` și `locationId`. Aceasta asigură că toate cererile API folosesc ID-urile corecte ale utilizatorului autentificat. 