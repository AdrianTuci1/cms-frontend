# API Directory Documentation

Acest director se ocupă **exclusiv de preluarea resurselor** din API-uri externe folosind endpoint-urile documentate în `requests.md`. Responsabilitatea sa este să facă cereri HTTP simple și să returneze date brute, fără să se ocupe de caching, state management sau comunicarea cu componentele.

## Responsabilități API

✅ **DOAR preluarea datelor** - HTTP requests către API-uri externe
✅ **Parsing răspunsuri** - Transformarea răspunsurilor în format standard
✅ **Gestionarea erorilor API** - Network errors, HTTP status codes
✅ **Autentificare** - Token management, refresh tokens
✅ **Multi-tenant support** - Tenant ID și Location ID în headers
✅ **Endpoint-uri simple** - Folosește exact endpoint-urile din requests.md
✅ **Validare parametri** - Folosește utilitarele pentru validare consistentă

❌ **NU se ocupă de:**
- Caching local (IndexedDB)
- State management
- Comunicarea cu componentele
- Decizia de a prelua din cache sau API
- Actualizări live (WebSocket)

## Structura Directorului

```
api/
├── core/                    # Componente de bază API
│   ├── ApiClient.js        # Client HTTP principal
│   ├── ApiError.js         # Gestionarea erorilor HTTP
│   └── ApiConfig.js        # Configurații API
├── utils/                  # Utilitare pentru construirea cererilor
│   ├── requestBuilder.js   # Constructor de cereri HTTP cu validare
│   ├── responseParser.js   # Parser de răspunsuri HTTP
│   └── authUtils.js        # Utilitare pentru autentificare
├── services/               # Servicii API per resource
│   ├── GeneralService.js   # Endpoint-uri fără JWT (/api/auth, /api/business-info)
│   ├── SecureService.js    # Endpoint-uri cu JWT (/api/invoices, /api/stocks, etc.)
│   ├── TimelineService.js  # Endpoint-uri business type (/api/{businessType}/timeline, etc.)
│   ├── AuthService.js      # Autentificare cu Amazon Cognito
│   └── LocationService.js  # Gestionarea locațiilor
├── hooks/                  # React hooks pentru componente
│   ├── useApiCall.js       # Hook generic pentru API calls în componente
│   ├── useAuth.js          # Hook pentru autentificare în componente
│   ├── useApiError.js      # Hook pentru gestionarea erorilor în componente
│   └── index.js            # Exporturi hooks
└── index.js                # Exporturi principale
```

## Separarea Responsabilităților

### 🔧 **Core** - Componente de Bază
Responsabilitate: **Infrastructura API**
- `ApiClient` - Client HTTP principal
- `ApiError` - Gestionarea erorilor HTTP
- `ApiConfig` - Configurații API

**Când să folosești:**
```javascript
// Pentru configurarea API-ului
import { ApiClient, ApiConfig } from '@/api/core';

const config = new ApiConfig();
const client = new ApiClient(config);
```

### 🛠️ **Utils** - Utilitare pentru Construirea Cererilor
Responsabilitate: **Construirea și validarea cererilor HTTP**
- `requestBuilder` - Construiește URL-uri, headers, validează parametri
- `responseParser` - Parsează răspunsurile HTTP
- `authUtils` - Utilitare pentru autentificare

**Când să folosești:**
```javascript
// În servicii pentru construirea cererilor
import { requestBuilder } from '@/api/utils';

const validatedParams = requestBuilder.validateParams(params, ['requiredParam']);
const requestConfig = requestBuilder.requestUtils.get('/api/endpoint', validatedParams);
```

### 🎣 **Hooks** - React Hooks pentru Componente
Responsabilitate: **Integrarea API în componente React**
- `useApiCall` - Hook pentru cereri API în componente
- `useAuth` - Hook pentru autentificare în componente
- `useApiError` - Hook pentru gestionarea erorilor în componente

**Când să folosești:**
```javascript
// În componente React
import { useApiCall } from '@/api/hooks';
import { TimelineService } from '@/api';

const MyComponent = () => {
  const { data, loading, error } = useApiCall(
    () => TimelineService.getTimeline('dental')
  );
  
  return <div>...</div>;
};
```

### 🚀 **Services** - Servicii pentru Endpoint-uri
Responsabilitate: **Preluarea datelor din endpoint-uri specifice**
- `TimelineService` - Pentru endpoint-urile business type
- `SecureService` - Pentru endpoint-urile cu JWT
- `GeneralService` - Pentru endpoint-urile fără JWT

**Când să folosești:**
```javascript
// Pentru preluarea datelor din API
import { TimelineService, SecureService } from '@/api';

const timeline = await TimelineService.getTimeline('dental');
const invoices = await SecureService.getInvoices();
```

## Fluxul de Date

```
Componente React (hooks)
    ↓
Servicii API (services)
    ↓ (folosesc utils pentru construirea cererilor)
Utilitare (utils)
    ↓
Componente de bază (core)
    ↓
API Extern (endpoint-uri simple)
```

## Endpoint-uri Suportate

### Fără JWT (GeneralService)
- `/api/auth` - Autentificare
- `/api/business-info` - Informații business și locații

### Cu JWT (SecureService)
- `/api/invoices` - Facturi
- `/api/stocks` - Stoc
- `/api/sales` - Vânzări
- `/api/agent` - Date agent
- `/api/history` - Istoric
- `/api/workflows` - Workflow-uri
- `/api/reports` - Rapoarte
- `/api/roles` - Roluri
- `/api/permissions` - Permisiuni
- `/api/userData` - Date utilizator

### Business Type (TimelineService)
- `/api/{businessType}/timeline` - Timeline pentru business
- `/api/{businessType}/clients` - Clienți pentru business
- `/api/{businessType}/packages` - Pachete pentru business
- `/api/{businessType}/members` - Membri pentru business

## Servicii API cu Utilitare

### GeneralService
Serviciu pentru endpoint-urile care nu necesită JWT.

```javascript
import { GeneralService } from '@/api';

// Autentificare cu validare automată
const authResult = await GeneralService.authenticate({
  code: 'auth_code',
  userId: 'user_123'
});

// Informații business
const businessInfo = await GeneralService.getBusinessInfo();
```

### SecureService
Serviciu pentru endpoint-urile care necesită JWT.

```javascript
import { SecureService } from '@/api';

// Preluare date cu JWT și validare parametri
const invoices = await SecureService.getInvoices({ 
  status: 'pending',
  limit: 50 
});

const stocks = await SecureService.getStocks({ 
  category: 'electronics',
  lowStock: true 
});
```

### TimelineService
Serviciu pentru endpoint-urile specifice tipului de business.

```javascript
import { TimelineService } from '@/api';

// Preluare date pentru business specific cu validare
const timeline = await TimelineService.getTimeline('dental', {
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});

const clients = await TimelineService.getClients('dental', {
  hasUpcomingAppointments: true
});
```

## Hook-uri API Simple

### useApiCall
Hook simplu pentru a face cereri API în componente.

```javascript
import { useApiCall } from '@/api/hooks/useApiCall';
import { TimelineService } from '@/api';

const MyComponent = () => {
  const { data, loading, error, execute } = useApiCall(
    () => TimelineService.getTimeline('dental')
  );

  return <div>...</div>;
};
```

### useApiCallWithParams
Hook pentru cereri API cu parametri în componente.

```javascript
import { useApiCallWithParams } from '@/api/hooks/useApiCall';
import { SecureService } from '@/api';

const MyComponent = () => {
  const { data, loading, error, execute } = useApiCallWithParams(
    SecureService.getInvoices,
    { status: 'pending' }
  );

  return <div>...</div>;
};
```

### useAuth
Hook pentru autentificare în componente.

```javascript
import { useAuth } from '@/api/hooks/useAuth';

const LoginComponent = () => {
  const { authenticate, loading, error } = useAuth();

  const handleLogin = async (authData) => {
    try {
      const result = await authenticate(authData);
      console.log('Login successful:', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <div>...</div>;
};
```

## Exemplu de Utilizare Completă

```javascript
import React, { useState } from 'react';
import { 
  useApiCall, 
  TimelineService, 
  SecureService,
  GeneralService 
} from '@/api';

const BusinessDashboard = () => {
  const [businessType, setBusinessType] = useState('dental');

  // Hook-uri pentru diferite tipuri de date
  const { data: timeline, loading: timelineLoading, execute: fetchTimeline } = useApiCall(
    () => TimelineService.getTimeline(businessType)
  );

  const { data: invoices, loading: invoicesLoading, execute: fetchInvoices } = useApiCall(
    () => SecureService.getInvoices({ status: 'pending' })
  );

  const { data: businessInfo, loading: infoLoading, execute: fetchBusinessInfo } = useApiCall(
    () => GeneralService.getBusinessInfo()
  );

  // Handler pentru schimbarea tipului de business
  const handleBusinessTypeChange = (newType) => {
    setBusinessType(newType);
    fetchTimeline(); // Reîncarcă timeline-ul pentru noul tip
  };

  return (
    <div>
      <select value={businessType} onChange={(e) => handleBusinessTypeChange(e.target.value)}>
        <option value="dental">Dental</option>
        <option value="gym">Gym</option>
        <option value="hotel">Hotel</option>
      </select>

      {timelineLoading ? (
        <p>Se încarcă timeline...</p>
      ) : (
        <div>Timeline: {JSON.stringify(timeline)}</div>
      )}

      {invoicesLoading ? (
        <p>Se încarcă facturile...</p>
      ) : (
        <div>Facturi: {JSON.stringify(invoices)}</div>
      )}
    </div>
  );
};
```

## Beneficii ale Noii Structuri

1. **Endpoint-uri simple** - Folosește exact endpoint-urile documentate în requests.md
2. **Validare consistentă** - Toate serviciile folosesc aceleași utilitare pentru validare
3. **Separare clară** - Fiecare layer are responsabilități clare
4. **Reutilizare** - Utilitarele sunt folosite în toate serviciile
5. **Mentenanță ușoară** - Cod simplu și ușor de înțeles
6. **Performanță** - Mai puține cereri API, endpoint-uri optimizate

## Migrare de la Vechiul API

Pentru a migra de la vechiul API complex:

1. **Înlocuiește serviciile**:
   ```javascript
   // Vechiul mod
   import { DentalStrategy } from '@/api';
   const dental = new DentalStrategy();
   const appointments = await dental.getAppointments();

   // Noul mod
   import { TimelineService } from '@/api';
   const timeline = await TimelineService.getTimeline('dental');
   ```

2. **Simplifică hook-urile**:
   ```javascript
   // Vechiul mod
   const { data } = useApiCall(() => TimelineService.getAppointments());

   // Noul mod
   const { data } = useApiCall(() => TimelineService.getTimeline('dental'));
   ```

3. **Elimină strategiile** - Nu mai sunt necesare strategiile complexe 