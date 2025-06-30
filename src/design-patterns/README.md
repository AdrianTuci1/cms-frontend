# Design Patterns Directory

Acest director gestionează **toată logica de business, caching, state management și comunicarea cu componentele**. Este centrul de coordonare pentru toate operațiunile de date din aplicație și se integrează cu serviciile API pentru a oferi o experiență completă.

## Responsabilități Design Patterns

✅ **Gestionarea datelor** - Decizia de a prelua din IndexedDB sau API
✅ **Caching local** - IndexedDB pentru date offline
✅ **State management** - Gestionarea stării componentelor
✅ **Comunicarea cu componentele** - Event handling și updates
✅ **Actualizări live** - Integrarea cu WebSocket pentru real-time
✅ **Business logic** - Strategii și algoritmi business-specific
✅ **Cross-feature communication** - Comunicarea între features
✅ **Integrarea cu API** - Folosește serviciile API pentru HTTP requests

❌ **NU se ocupă de:**
- HTTP requests directe (API se ocupă de asta)
- Parsing răspunsuri HTTP
- Gestionarea erorilor de rețea

## Arhitectura de Date

```
Componente React
    ↓ (cereri de date)
useDataSync Hook
    ↓ (decide sursa datelor)
DataSyncManager
    ↓ (folosește serviciile API)
API Services (GeneralService, SecureService, etc.)
    ↓ (HTTP requests)
API Extern
    ↓ (răspunsuri)
DataSyncManager (procesează și cache-ază)
    ↓ (returnează date procesate)
useDataSync Hook
    ↓ (actualizează state-ul)
Componente React (re-render)
```

## Structura Directorului

```
design-patterns/
├── data-sync/         # DataSyncManager - Centrul de coordonare
├── observer/          # Observer Pattern - Event handling
├── strategy/          # Strategy Pattern - Business logic
├── factory/           # Factory Pattern - Object creation
├── command/           # Command Pattern - Undo/Redo
├── template/          # Template Pattern - Workflows
├── offline/           # Offline Management
├── hooks/             # React Hooks pentru design patterns
├── initialization/    # Inițializarea sistemului
├── examples/          # Exemple de utilizare
└── README.md          # Această documentație
```

## Integrarea cu API Services

### DataSyncManager - Centrul de Coordonare

`DataSyncManager` este componenta principală care coordonează toate operațiunile de date și se integrează cu serviciile API conform structurii din `requests.md`:

```javascript
import { DataSyncManager } from '@/design-patterns/data-sync/DataSyncManager';

// Configurare business type pentru resurse business-specific
DataSyncManager.setBusinessType('dental');

// Preluare date cu fallback automat
const data = await DataSyncManager.getDataWithFallback('timeline', {
  forceRefresh: false,
  useCache: true,
  maxAge: 5 * 60 * 1000 // 5 minute
});
```

### Resurse API Suportate

#### Resurse Generale (cu JWT)
- `invoices` - `/api/invoices`
- `stocks` - `/api/stocks`
- `sales` - `/api/sales`
- `agent` - `/api/agent`
- `history` - `/api/history`
- `workflows` - `/api/workflows`
- `reports` - `/api/reports`
- `roles` - `/api/roles`
- `permissions` - `/api/permissions`
- `userData` - `/api/userData`

#### Resurse Business-Specific (cu JWT)
- `timeline` - `/api/{businessType}/timeline`
- `clients` - `/api/{businessType}/clients`
- `packages` - `/api/{businessType}/packages`
- `members` - `/api/{businessType}/members`

#### Resurse Fără JWT
- `businessInfo` - `/api/business-info`
- `auth` - `/api/auth`

### Fluxul de Date în DataSyncManager

```javascript
class DataSyncManager {
  constructor() {
    // Inițializează serviciile API
    this.apiManager = createApiManager({
      baseURL: 'http://localhost:3001/api',
      debug: false,
      timeout: 30000
    });
    
    this.businessType = null;
    this.initializeResources();
  }

  async getDataWithFallback(resource, options = {}) {
    // 1. Verifică dacă suntem online
    if (!this.isOnline) {
      return this.getFromIndexedDB(resource);
    }

    // 2. Verifică cache-ul local
    const cachedData = await this.getFromIndexedDB(resource);
    if (cachedData && !this.isDataStale(cachedData, resource)) {
      return cachedData;
    }

    // 3. Prelucrează de la API folosind serviciile API
    try {
      const apiData = await this.fetchFromAPI(resource, options);
      await this.storeInIndexedDB(resource, apiData);
      return apiData;
    } catch (error) {
      // 4. Fallback la cache dacă API eșuează
      if (cachedData) {
        return cachedData;
      }
      throw error;
    }
  }

  async fetchFromAPI(resource, options = {}) {
    const config = this.resources.get(resource);
    let endpoint = config.apiEndpoints.get;
    
    // Handle business-specific endpoints
    if (this.businessType && endpoint.includes('{businessType}')) {
      endpoint = endpoint.replace('{businessType}', this.businessType);
    }

    // Determine which API service to use
    if (config.requiresAuth === false) {
      return await this.apiManager.generalRequest('GET', endpoint);
    } else {
      return await this.apiManager.secureRequest('GET', endpoint);
    }
  }
}
```

## React Hooks pentru Design Patterns

### useDataSync - Hook Principal

Hook-ul principal pentru sincronizarea datelor cu API și IndexedDB:

```javascript
import { useDataSync } from '@/design-patterns/hooks/useDataSync';

const TimelineComponent = () => {
  const { data, loading, error, refresh, create, update, remove } = useDataSync('timeline', {
    autoRefresh: true,
    refreshInterval: 30000,
    useCache: true,
    maxAge: 5 * 60 * 1000,
    businessType: 'dental',
    onDataUpdate: (data) => {
      console.log('Timeline data updated:', data);
    },
    onError: (error) => {
      console.error('Timeline error:', error);
    }
  });

  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data && <Timeline data={data} />}
    </div>
  );
};
```

### useObserver - Hook pentru Event Handling

Hook pentru observer pattern și comunicarea între componente:

```javascript
import { useObserver } from '@/design-patterns/hooks/useObserver';

const MyComponent = () => {
  const { subscribe, emit } = useObserver();

  useEffect(() => {
    const unsubscribe = subscribe('timeline:created', (data) => {
      console.log('Timeline created:', data);
      // Actualizează alte componente
    });

    return unsubscribe;
  }, [subscribe]);

  const handleCreateTimeline = async (timelineData) => {
    await create(timelineData);
    
    // Emite eveniment pentru alte componente
    emit('timeline:created', {
      timeline: timelineData,
      timestamp: new Date().toISOString()
    });
  };

  return <div>...</div>;
};
```

### useBusinessLogic - Hook pentru Business Logic

Hook pentru business logic și strategii business-specific:

```javascript
import { useBusinessLogic } from '@/design-patterns/hooks/useBusinessLogic';

const DentalComponent = () => {
  const {
    processData,
    validateData,
    calculate,
    format,
    getConfig,
    isOperationAllowed
  } = useBusinessLogic('dental');

  const handleSubmit = (formData) => {
    // Validare business logic
    const validation = validateData(formData, 'timeline');
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors);
      return;
    }

    // Verificare permisiuni
    if (!isOperationAllowed('createTimeline', formData)) {
      console.error('Operation not allowed');
      return;
    }

    // Procesare date business-specific
    const processedData = processData(formData, 'timeline');
    
    // Submit data
    create(processedData);
  };

  return <div>...</div>;
};
```

## Inițializarea Sistemului

### DataSyncInitializer

Inițializatorul care configurează toate serviciile și resursele:

```javascript
import dataSyncInitializer from '@/design-patterns/initialization/DataSyncInitializer';

// În App.jsx
useEffect(() => {
  const initializeApp = async () => {
    try {
      // 1. Inițializează serviciile API
      const apiResult = await initializeAPI();
      
      if (apiResult.success && apiResult.isAuthenticated) {
        // 2. Inițializează design patterns
        await dataSyncInitializer.initialize({
          websocketUrl: import.meta.env.VITE_WEBSOCKET_URL,
          businessType: 'dental'
        });
        
        console.log('App initialized successfully');
      }
    } catch (error) {
      console.error('App initialization failed:', error);
    }
  };

  initializeApp();
}, []);
```

## Exemple de Utilizare

### Exemplu Complet de Integrare

```javascript
import React, { useState } from 'react';
import { useDataSync, useObserver, useBusinessLogic } from '@/design-patterns/hooks';

const IntegrationExample = ({ businessType = 'dental' }) => {
  const [selectedResource, setSelectedResource] = useState('timeline');

  // Hook pentru sincronizarea datelor
  const {
    data: resourceData,
    loading,
    error,
    lastUpdated,
    isOnline,
    refresh,
    create,
    update,
    remove
  } = useDataSync(selectedResource, {
    autoRefresh: true,
    refreshInterval: 30000,
    useCache: true,
    businessType
  });

  // Hook pentru observer pattern
  const { subscribe, emit } = useObserver();

  // Hook pentru business logic
  const businessLogic = useBusinessLogic(businessType);

  // Procesează datele conform strategiei business
  const processedData = businessLogic.processData(resourceData, selectedResource);

  // Setup event listeners
  useEffect(() => {
    const unsubscribe = subscribe(`${selectedResource}:created`, (data) => {
      console.log(`${selectedResource} created event:`, data);
    });

    return unsubscribe;
  }, [subscribe, selectedResource]);

  // Handler pentru crearea unei resurse
  const handleCreate = async (resourceData) => {
    try {
      // Validare business logic
      const validation = businessLogic.validateData(resourceData, selectedResource);
      if (!validation.isValid) return;

      // Verificare permisiuni
      if (!businessLogic.isOperationAllowed(`create${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, resourceData)) return;

      // Creare
      await create(resourceData);

      // Emitere eveniment
      emit(`${selectedResource}:created`, {
        data: resourceData,
        businessType,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`Error creating ${selectedResource}:`, error);
    }
  };

  return (
    <div>
      <h2>Resource Management - {businessType}</h2>
      
      {/* Resource Selection */}
      <select value={selectedResource} onChange={(e) => setSelectedResource(e.target.value)}>
        <option value="timeline">Timeline</option>
        <option value="clients">Clients</option>
        <option value="packages">Packages</option>
        <option value="members">Members</option>
        <option value="invoices">Invoices</option>
        <option value="stocks">Stocks</option>
        <option value="sales">Sales</option>
        <option value="agent">Agent</option>
        <option value="history">History</option>
        <option value="workflows">Workflows</option>
        <option value="reports">Reports</option>
        <option value="roles">Roles</option>
        <option value="permissions">Permissions</option>
        <option value="userData">User Data</option>
        <option value="businessInfo">Business Info</option>
      </select>

      {/* Status Information */}
      <div>
        <p>Status: {isOnline ? '🟢 Online' : '🔴 Offline'}</p>
        <p>Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}</p>
        <p>Business Type: {businessType}</p>
        <p>Data Count: {Array.isArray(processedData) ? processedData.length : (processedData ? 1 : 0)}</p>
      </div>

      {/* Error Display */}
      {error && (
        <div>
          <h3>Error:</h3>
          <p>{error.message}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && <div>Loading {selectedResource} data...</div>}

      {/* Resource Data */}
      <div>
        <h3>{selectedResource} Data (Processed by {businessType} Strategy)</h3>
        {processedData && Array.isArray(processedData) && processedData.length > 0 ? (
          <div>
            {processedData.map((item) => (
              <div key={item.id}>
                <h4>{businessLogic.format(selectedResource, item)}</h4>
                <p>ID: {item.id}</p>
                <p>Type: {item.type}</p>
                
                <div>
                  <button onClick={() => update({ id: item.id, status: 'updated' })}>
                    Update
                  </button>
                  <button onClick={() => remove({ id: item.id })}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No {selectedResource} data found</p>
        )}
      </div>

      {/* Business Logic Information */}
      <div>
        <h3>Business Logic Information</h3>
        <p>Can Create {selectedResource}: {businessLogic.isOperationAllowed(`create${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, {}) ? 'Yes' : 'No'}</p>
        <p>Can Update {selectedResource}: {businessLogic.isOperationAllowed(`update${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, {}) ? 'Yes' : 'No'}</p>
        <p>Can Delete {selectedResource}: {businessLogic.isOperationAllowed(`delete${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, {}) ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default IntegrationExample;
```

## Cross-Feature Communication

### Evenimente între Features

```javascript
// În TimelineComponent
useEffect(() => {
  const unsubscribe = subscribe('invoice:paid', (data) => {
    // Actualizează timeline-ul când o factură este plătită
    if (data.timelineId) {
      update({ id: data.timelineId, status: 'completed' });
    }
  });

  return unsubscribe;
}, [subscribe]);

// În InvoiceComponent
const handlePayment = async (invoiceId) => {
  await updateInvoice(invoiceId, { status: 'paid' });
  
  // Emite eveniment pentru alte componente
  emit('invoice:paid', {
    invoiceId,
    timelineId: invoice.timelineId,
    amount: invoice.amount
  });
};
```

## Gestionarea Stării Offline

### Comportament Offline

```javascript
const { isOnline, data, loading } = useDataSync('timeline');

return (
  <div>
    {!isOnline && (
      <div className="offline-banner">
        🚫 Working offline - Changes will sync when connection is restored
      </div>
    )}
    
    {data && data.map(item => (
      <div key={item.id}>
        {item.title}
        {!isOnline && item._pendingSync && (
          <span className="sync-indicator">⏳ Pending sync</span>
        )}
      </div>
    ))}
  </div>
);
```

## WebSocket Integration

### Actualizări Live

```javascript
// În DataSyncManager
setupWebSocket(url) {
  this.socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.event === 'timeline:updated') {
      // Actualizează IndexedDB
      this.storeData('timeline', message.data);
      
      // Emite eveniment pentru componente
      eventBus.emit('timeline:socket-update', {
        data: message.data,
        source: 'websocket',
        timestamp: new Date().toISOString()
      });
    }
  };
}

// În componenta React
useEffect(() => {
  const unsubscribe = subscribe('timeline:socket-update', (data) => {
    setTimelineData(data.data);
    setLastUpdated(data.timestamp);
  });

  return unsubscribe;
}, [subscribe]);
```

## Error Handling și Retry Logic

### Gestionarea Erorilor

```javascript
const { error, refresh } = useDataSync('timeline', {
  onError: (error) => {
    if (error.code === 'NETWORK_ERROR') {
      // Retry automat după 5 secunde
      setTimeout(() => refresh(), 5000);
    } else if (error.code === 'AUTH_ERROR') {
      // Redirect la login
      window.location.href = '/login';
    }
  }
});

if (error) {
  return (
    <div className="error-container">
      <h3>Error loading timeline</h3>
      <p>{error.message}</p>
      <button onClick={refresh}>Retry</button>
    </div>
  );
}
```

## Performance și Optimizări

### Lazy Loading și Caching

```javascript
// Configurare pentru resurse mari
const { data: historyData } = useDataSync('history', {
  autoRefresh: false, // Nu auto-refresh pentru date mari
  useCache: true,
  maxAge: 24 * 60 * 60 * 1000, // Cache 24 ore
  onDataUpdate: (data) => {
    // Procesare incrementală
    processHistoryDataIncrementally(data);
  }
});

// Debouncing pentru actualizări frecvente
const debouncedUpdate = useCallback(
  debounce((updates) => {
    handleUpdateTimeline(timelineId, updates);
  }, 500),
  [timelineId]
);
```

## Testing

### Testarea Integrării

```javascript
// Test pentru useDataSync
import { renderHook, act } from '@testing-library/react';
import { useDataSync } from '@/design-patterns/hooks';

test('useDataSync integrates with API services', async () => {
  const { result } = renderHook(() => 
    useDataSync('timeline', { useCache: false, businessType: 'dental' })
  );

  expect(result.current.loading).toBe(true);

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.data).toBeDefined();
});

// Test pentru business logic integration
test('business logic processes data correctly', () => {
  const { result } = renderHook(() => 
    useBusinessLogic('dental')
  );

  const rawData = [{ id: 1, title: 'Test Timeline' }];
  const processedData = result.current.processData(rawData, 'timeline');

  expect(processedData[0].type).toBe('timeline');
  expect(processedData[0].businessType).toBe('dental');
});
```

## Best Practices

### 1. **Data Flow**
- Toate datele trec prin DataSyncManager
- Nu faceți cereri API direct din componente
- Folosiți hook-urile pentru data access

### 2. **Caching**
- Configurați cache-ul pentru fiecare resursă
- Setări TTL potrivite pentru fiecare tip de date
- Invalidați cache-ul când este necesar

### 3. **Error Handling**
- Gestionați erorile la nivel de DataSyncManager
- Fallback la cache când API eșuează
- Notificați utilizatorul despre starea offline

### 4. **Performance**
- Lazy loading pentru resurse mari
- Debouncing pentru actualizări frecvente
- Optimistic updates pentru UX

### 5. **Testing**
- Testați fiecare pattern individual
- Mock API și WebSocket pentru teste
- Testați scenarii offline

## Concluzie

Integrarea între API services și design patterns oferă:

1. **Separarea responsabilităților** - API se ocupă doar de HTTP requests, design patterns gestionează business logic
2. **Flexibilitate** - Ușor de schimbat strategiile business fără a afecta API-ul
3. **Performance** - Caching inteligent și optimistic updates
4. **Offline support** - Funcționalitate completă offline
5. **Real-time updates** - WebSocket integration pentru actualizări live
6. **Error handling** - Gestionarea robustă a erorilor și retry logic
7. **Cross-feature communication** - Evenimente pentru comunicarea între features
8. **Business type support** - Suport complet pentru resurse business-specific
9. **Comprehensive resource management** - Suport pentru toate resursele API din requests.md

Integrarea respectă principiile SOLID și oferă o experiență de dezvoltare consistentă și predictibilă. 