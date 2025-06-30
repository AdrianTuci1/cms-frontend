# Arhitectura CMS Frontend

Această documentație explică arhitectura aplicației CMS Frontend cu separarea clară a responsabilităților între diferitele module.

## Principiile Arhitecturii

### 1. **Separarea Responsabilităților**
Fiecare director are o responsabilitate specifică și bine definită:

- **`@/api`** - Doar preluarea datelor din API-uri externe
- **`@/design-patterns`** - Gestionarea datelor, caching, state management și comunicarea cu componentele
- **`@/socket`** - Comunicarea real-time prin WebSocket

### 2. **Fluxul de Date Unidirecțional**
```
Componente React
    ↓ (cereri de date)
Design Patterns (DataSyncManager)
    ↓ (decide sursa datelor)
├── IndexedDB (cache local)
├── API Services (HTTP requests)
└── WebSocket (real-time updates)
    ↓ (returnează date procesate)
Componente React (state updates)
```

### 3. **Single Source of Truth**
Design Patterns este singura sursă de adevăr pentru toate datele din aplicație.

## Responsabilitățile Modulelor

## 📡 **@/api - Preluarea Datelor**

### Responsabilități
✅ **DOAR preluarea datelor** - HTTP requests către API-uri externe
✅ **Parsing răspunsuri** - Transformarea răspunsurilor în format standard
✅ **Gestionarea erorilor API** - Network errors, HTTP status codes
✅ **Autentificare** - Token management, refresh tokens
✅ **Multi-tenant support** - Tenant ID și Location ID în headers

### ❌ NU se ocupă de:
- Caching local (IndexedDB)
- State management
- Comunicarea cu componentele
- Decizia de a prelua din cache sau API
- Actualizări live (WebSocket)

### Structura
```
api/
├── core/                    # Componente de bază API
│   ├── ApiClient.js        # Client HTTP principal
│   ├── ApiError.js         # Gestionarea erorilor HTTP
│   └── ApiConfig.js        # Configurații API
├── services/               # Servicii API per resource
│   ├── AuthService.js      # Autentificare cu Amazon Cognito
│   ├── TimelineService.js  # Timeline API endpoints
│   ├── AIService.js        # AI Assistant API endpoints
│   └── ...                 # Alte servicii
├── strategies/             # Strategii per tip de business
│   ├── DentalStrategy.js   # Endpoint-uri specifice dental
│   ├── GymStrategy.js      # Endpoint-uri specifice gym
│   └── HotelStrategy.js    # Endpoint-uri specifice hotel
└── hooks/                  # React hooks pentru API calls
    ├── useApiCall.js       # Hook generic pentru API calls
    └── useAuth.js          # Hook pentru autentificare
```

### Exemplu de Utilizare
```javascript
import timelineService from '@/api/services/TimelineService';

// API-ul doar prelucrează datele
const appointments = await timelineService.getAppointments();
console.log(appointments); // Date brute de la API
```

## 🧩 **@/design-patterns - Gestionarea Datelor**

### Responsabilități
✅ **Gestionarea datelor** - Decizia de a prelua din IndexedDB sau API
✅ **Caching local** - IndexedDB pentru date offline
✅ **State management** - Gestionarea stării componentelor
✅ **Comunicarea cu componentele** - Event handling și updates
✅ **Actualizări live** - Integrarea cu WebSocket pentru real-time
✅ **Business logic** - Strategii și algoritmi business-specific
✅ **Cross-feature communication** - Comunicarea între features

### ❌ NU se ocupă de:
- HTTP requests directe (API se ocupă de asta)
- Parsing răspunsuri HTTP
- Gestionarea erorilor de rețea

### Structura
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
└── examples/          # Exemple de utilizare
```

### Exemplu de Utilizare
```javascript
import { DataSyncManager } from '@/design-patterns/data-sync/DataSyncManager';
import eventBus from '@/design-patterns/observer/base/EventBus';

// Design patterns decide sursa datelor
const data = await DataSyncManager.getDataWithFallback('timeline', {
  forceRefresh: false,
  useCache: true,
  maxAge: 5 * 60 * 1000
});

// Emite evenimente pentru componente
eventBus.emit('timeline:updated', { data, timestamp: Date.now() });
```

## 🔌 **@/socket - Comunicarea Real-time**

### Responsabilități
✅ **WebSocket management** - Conexiunea și gestionarea WebSocket
✅ **Message handling** - Procesarea mesajelor primite
✅ **Connection state** - Gestionarea stării conexiunii
✅ **Message queuing** - Queue pentru mesaje când nu suntem conectați

### ❌ NU se ocupă de:
- Business logic
- Data processing
- State management
- Comunicarea directă cu componentele

### Structura
```
socket/
├── socketManager.js   # Manager principal WebSocket
├── aiAssistant/       # Handler-uri specifice AI Assistant
└── workers/           # Web Workers pentru WebSocket
    └── socketWorker.js
```

### Exemplu de Utilizare
```javascript
import socketManager from '@/socket/socketManager';

// Socket manager doar gestionează conexiunea
socketManager.addMessageHandler((message) => {
  console.log('Message received:', message);
  // Design patterns va procesa mesajul
});
```

## 🔄 **Fluxul Complet de Date**

### 1. Componenta cere date
```javascript
const TimelineComponent = () => {
  const { data, loading } = useDataSync('timeline');
  return <Timeline data={data} />;
};
```

### 2. Design Patterns decide sursa
```javascript
// În useDataSync
const data = await DataSyncManager.getDataWithFallback('timeline', {
  useCache: true,
  forceRefresh: false
});
```

### 3. Preluare din cache sau API
```javascript
// DataSyncManager.getDataWithFallback
if (cachedData && !isStale(cachedData)) {
  return cachedData; // Din IndexedDB
} else {
  const apiData = await fetchFromAPI('timeline'); // Din API
  await storeInIndexedDB('timeline', apiData);
  return apiData;
}
```

### 4. Actualizare componentă
```javascript
// useDataSync actualizează state-ul
setData(apiData);
setLoading(false);
```

### 5. WebSocket updates
```javascript
// Când vine update de la WebSocket
socketManager.on('timeline:updated', (data) => {
  DataSyncManager.handleSocketMessage('timeline', data);
  // Componenta se actualizează automat prin observer
});
```

## 🏗️ **Integrarea între Module**

### API ↔ Design Patterns
```javascript
// Design patterns folosesc API-ul pentru a prelua datele
import timelineService from '@/api/services/TimelineService';

class DataSyncManager {
  async fetchFromAPI(resource, options = {}) {
    switch (resource) {
      case 'timeline':
        return await timelineService.getAppointments();
      case 'aiAssistant':
        return await aiService.getMessages();
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  }
}
```

### Socket ↔ Design Patterns
```javascript
// Design patterns gestionează mesajele WebSocket
import socketManager from '@/socket/socketManager';

class DataSyncManager {
  setupWebSocket() {
    socketManager.addMessageHandler((message) => {
      if (message.event === 'timeline:updated') {
        this.handleSocketMessage('timeline', message.data);
      }
    });
  }

  handleSocketMessage(resource, data) {
    // Actualizează IndexedDB
    this.storeData(resource, data);
    
    // Emite eveniment pentru componente
    eventBus.emit(`${resource}:updated`, {
      data,
      source: 'websocket',
      timestamp: Date.now()
    });
  }
}
```

### Design Patterns ↔ Componente
```javascript
// Componentele folosesc design patterns pentru date
import { useDataSync } from '@/design-patterns/hooks/useDataSync';
import eventBus from '@/design-patterns/observer/base/EventBus';

const MyComponent = () => {
  const { data, loading } = useDataSync('timeline');

  useEffect(() => {
    const unsubscribe = eventBus.on('timeline:updated', (data) => {
      setTimelineData(data.data);
    });

    return unsubscribe;
  }, []);

  return <div>...</div>;
};
```

## 🎯 **Beneficii ale Arhitecturii**

### 1. **Modularitate**
- Fiecare modul are o responsabilitate clară
- Ușor de testat individual
- Posibilitatea de a schimba implementarea fără a afecta alte module

### 2. **Maintainability**
- Cod organizat pe responsabilități
- Separarea clară a preocupărilor
- Documentație clară pentru fiecare modul

### 3. **Scalability**
- Ușor de adăugat noi funcționalități
- Posibilitatea de a scala modulele independent
- Arhitectură extensibilă

### 4. **Performance**
- Caching optimizat
- Lazy loading pentru resurse mari
- Sincronizare eficientă

### 5. **Offline Support**
- Funcționalitate completă offline
- Sincronizare automată când revenim online
- Fallback la cache când API eșuează

## 🧪 **Testing Strategy**

### API Testing
```javascript
// Testează doar cererile HTTP
describe('TimelineService', () => {
  it('should fetch appointments from API', async () => {
    const appointments = await timelineService.getAppointments();
    expect(appointments).toBeInstanceOf(Array);
  });
});
```

### Design Patterns Testing
```javascript
// Testează logica de business și caching
describe('DataSyncManager', () => {
  it('should use cache when data is fresh', async () => {
    const data = await DataSyncManager.getDataWithFallback('timeline');
    expect(data.source).toBe('cache');
  });
});
```

### Integration Testing
```javascript
// Testează integrarea între module
describe('Data Flow Integration', () => {
  it('should handle WebSocket updates correctly', async () => {
    // Test complete flow
  });
});
```

## 📋 **Best Practices**

### 1. **API Layer**
- Fă doar cereri HTTP
- Nu gestiona state sau caching
- Returnează date brute

### 2. **Design Patterns Layer**
- Gestionează toată logica de business
- Decide sursa datelor (cache vs API)
- Coordonează comunicarea între componente

### 3. **Socket Layer**
- Gestionează doar conexiunea WebSocket
- Nu procesa business logic
- Propagă mesajele către design patterns

### 4. **Component Layer**
- Folosește hook-urile din design patterns
- Nu face cereri API directe
- Ascultă evenimente pentru updates

## 🚀 **Concluzie**

Această arhitectură oferă o separare clară a responsabilităților, facilitând dezvoltarea, testarea și mentenanța aplicației. Fiecare modul are o responsabilitate specifică și bine definită, iar integrarea între module se face prin interfețe clare și documentate. 