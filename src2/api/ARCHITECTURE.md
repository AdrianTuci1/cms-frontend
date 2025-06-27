# API Architecture - Separarea Responsabilităților

Acest document explică arhitectura API-ului și când să folosești fiecare componentă.

## 🏗️ Arhitectura Generală

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Componente    │    │   Servicii      │    │   Utilitare     │
│   React         │    │   API           │    │   (Utils)       │
│                 │    │                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │ useApiCall│  │    │  │Timeline   │  │    │  │request    │  │
│  │ useAuth   │  │    │  │Service    │  │    │  │Builder    │  │
│  │ useApiError│ │    │  │Secure     │  │    │  │response   │  │
│  └───────────┘  │    │  │Service    │  │    │  │Parser     │  │
│                 │    │  │General    │  │    │  │authUtils  │  │
└─────────────────┘    │  │Service    │  │    └───────────┘  │
                       │  └───────────┘  │                 │
                       └─────────────────┘                 │
                                │                          │
                                ▼                          │
                       ┌─────────────────┐                 │
                       │   Core API      │                 │
                       │                 │                 │
                       │  ┌───────────┐  │                 │
                       │  │ApiClient  │  │                 │
                       │  │ApiError   │  │                 │
                       │  │ApiConfig  │  │                 │
                       │  └───────────┘  │                 │
                       └─────────────────┘                 │
                                │                          │
                                ▼                          │
                       ┌─────────────────┐                 │
                       │   API Extern    │                 │
                       │                 │                 │
                       │ /api/dental/    │                 │
                       │ /api/invoices   │                 │
                       │ /api/auth       │                 │
                       └─────────────────┘                 │
```

## 📋 Separarea Responsabilităților

### 🎣 **Hooks** - Pentru Componente React
**Când să folosești:** În componente React pentru a integra API-ul

**Responsabilități:**
- Gestionarea stării de loading în componente
- Gestionarea erorilor în componente
- Executarea cererilor API din componente
- Re-renderizarea componentelor când se schimbă datele

**Exemplu:**
```javascript
// În componente React
import { useApiCall } from '@/api/hooks';
import { TimelineService } from '@/api';

const MyComponent = () => {
  const { data, loading, error } = useApiCall(
    () => TimelineService.getTimeline('dental')
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
};
```

### 🚀 **Services** - Pentru Preluarea Datelor
**Când să folosești:** Pentru a prelua date din API-uri specifice

**Responsabilități:**
- Preluarea datelor din endpoint-uri specifice
- Validarea parametrilor folosind utils
- Construirea cererilor folosind utils
- Gestionarea erorilor specifice serviciului

**Exemplu:**
```javascript
// Pentru preluarea datelor din API
import { TimelineService, SecureService } from '@/api';

// În funcții sau alte servicii
const timeline = await TimelineService.getTimeline('dental', {
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});

const invoices = await SecureService.getInvoices({
  status: 'pending',
  limit: 50
});
```

### 🛠️ **Utils** - Pentru Construirea Cererilor
**Când să folosești:** În servicii pentru a construi și valida cereri

**Responsabilități:**
- Construirea URL-urilor cu parametri
- Validarea parametrilor de cerere
- Construirea headers-urilor
- Formatarea body-urilor pentru cereri

**Exemplu:**
```javascript
// În servicii pentru construirea cererilor
import { requestBuilder } from '@/api/utils';

// Validare parametri
const validatedParams = requestBuilder.validateParams(params, ['requiredParam'], {
  optionalParam: (value) => {
    if (value && typeof value !== 'string') {
      return 'Optional param must be a string';
    }
    return true;
  }
});

// Construire cerere
const requestConfig = requestBuilder.requestUtils.get('/api/endpoint', validatedParams);
```

### 🔧 **Core** - Pentru Infrastructura API
**Când să folosești:** Pentru configurarea și gestionarea infrastructurii API

**Responsabilități:**
- Client HTTP principal
- Gestionarea erorilor HTTP
- Configurații API
- Inițializarea sistemului API

**Exemplu:**
```javascript
// Pentru configurarea API-ului
import { ApiClient, ApiConfig } from '@/api/core';

const config = new ApiConfig({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

const client = new ApiClient(config);
```

## 🔄 Fluxul de Date

### 1. **Din Componente React**
```javascript
// Componenta React
const MyComponent = () => {
  const { data, loading, error } = useApiCall(
    () => TimelineService.getTimeline('dental')
  );
  
  return <div>{JSON.stringify(data)}</div>;
};
```

### 2. **În Serviciu**
```javascript
// TimelineService.js
async getTimeline(businessType, params = {}) {
  // 1. Validează parametrii folosind utils
  const validatedParams = requestBuilder.validateParams(params, ['businessType']);
  
  // 2. Construiește cererea folosind utils
  const requestConfig = requestBuilder.requestUtils.get(
    `/api/${businessType}/timeline`,
    validatedParams
  );
  
  // 3. Face cererea folosind core
  const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
  
  return response.data;
}
```

### 3. **În Utils**
```javascript
// requestBuilder.js
export function validateParams(params, requiredParams, validators) {
  // Validare logică
  return validatedParams;
}

export const requestUtils = {
  get: (url, params) => buildRequest({ method: 'GET', url, params })
};
```

### 4. **În Core**
```javascript
// ApiClient.js
async get(url, options) {
  // Face cererea HTTP reală
  const response = await fetch(url, {
    method: 'GET',
    headers: this.buildHeaders(options),
    ...options
  });
  
  return this.handleResponse(response);
}
```

## 📝 Reguli de Utilizare

### ✅ **Când să folosești Hooks:**
- În componente React
- Pentru a gestiona loading state în UI
- Pentru a gestiona erori în UI
- Pentru a re-renderiza componentele când se schimbă datele

### ✅ **Când să folosești Services:**
- Pentru a prelua date din API
- În funcții non-React
- În alte servicii
- Pentru logica de business

### ✅ **Când să folosești Utils:**
- În servicii pentru validare
- În servicii pentru construirea cererilor
- Pentru logica comună de procesare
- Pentru utilitare reutilizabile

### ✅ **Când să folosești Core:**
- Pentru configurarea API-ului
- Pentru inițializarea sistemului
- Pentru gestionarea erorilor de nivel scăzut
- Pentru customizarea comportamentului API

## ❌ **Ce să NU faci:**

### ❌ **Nu folosi Hooks în Services:**
```javascript
// GREȘIT
class TimelineService {
  async getTimeline() {
    const { data } = useApiCall(() => this.apiCall()); // ❌ Hook în serviciu
    return data;
  }
}
```

### ❌ **Nu folosi Services direct în Utils:**
```javascript
// GREȘIT
export function buildRequest() {
  const data = await TimelineService.getTimeline(); // ❌ Serviciu în utils
  return data;
}
```

### ❌ **Nu folosi Core direct în Componente:**
```javascript
// GREȘIT
const MyComponent = () => {
  const client = new ApiClient(); // ❌ Core direct în componentă
  const data = await client.get('/api/endpoint');
  return <div>{data}</div>;
};
```

## 🎯 **Exemplu de Utilizare Corectă:**

```javascript
// 1. Core - Configurare (o singură dată la pornirea app-ului)
import { ApiClient, ApiConfig } from '@/api/core';

const config = new ApiConfig({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

const client = new ApiClient(config);

// 2. Services - Preluare date (în funcții sau alte servicii)
import { TimelineService } from '@/api';

const fetchData = async () => {
  const timeline = await TimelineService.getTimeline('dental', {
    startDate: '2024-01-01'
  });
  return timeline;
};

// 3. Hooks - În componente React
import { useApiCall } from '@/api/hooks';

const Dashboard = () => {
  const { data, loading, error } = useApiCall(fetchData);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
};
```

## 🔍 **Beneficii ale Acestei Arhitecturi:**

1. **Separare clară** - Fiecare layer are responsabilități specifice
2. **Reutilizare** - Utilitarele sunt folosite în toate serviciile
3. **Testare ușoară** - Fiecare layer poate fi testat independent
4. **Mentenanță simplă** - Modificările sunt izolate pe layer-uri
5. **Performanță** - Fără overhead, cereri optimizate
6. **Scalabilitate** - Ușor de extins cu funcționalități noi 