# API Endpoints Structure

Această documentație descrie structura endpoint-urilor API și integrarea lor cu design patterns.

## General

### Fără trimis JWT
- `/api/auth` - Autentificare
- `/api/business-info` - Informații despre business (toate locațiile și numele tenant-ului)

### Cu trimis JWT
- `/api/invoices` - Gestionarea facturilor
- `/api/stocks` - Gestionarea stocurilor
- `/api/sales` - Gestionarea vânzărilor
- `/api/agent` - Gestionarea agenților
- `/api/history` - Istoricul activităților
- `/api/workflows` - Gestionarea workflow-urilor
- `/api/reports` - Generarea rapoartelor
- `/api/roles` - Gestionarea rolurilor
- `/api/permissions` - Gestionarea permisiunilor
- `/api/userData` - Datele utilizatorului

## Business Type

### Resurse Business-Specific (cu JWT)
- `/api/{businessType}/timeline` - Timeline-ul pentru tipul de business
- `/api/{businessType}/clients` - Clienții pentru tipul de business
- `/api/{businessType}/packages` - Pachetele pentru tipul de business
- `/api/{businessType}/members` - Membrii pentru tipul de business

Unde `{businessType}` poate fi:
- `dental` - Cabinet stomatologic
- `gym` - Sală de fitness
- `hotel` - Hotel
- `spa` - Spa
- `beauty` - Salon de înfrumusețare
- etc.

## Integrarea cu Design Patterns

### DataSyncManager
Toate aceste endpoint-uri sunt gestionate automat de `DataSyncManager` care:

1. **Inițializează resursele** - Toate resursele sunt înregistrate automat la pornirea aplicației
2. **Gestionează business type** - Resursele business-specific sunt configurate dinamic
3. **Procesează răspunsurile** - Fiecare resursă are propria metodă de procesare
4. **Cache-ază datele** - Toate datele sunt stocate în IndexedDB pentru funcționare offline
5. **Sincronizează** - Gestionarea sincronizării între API și cache local

### Hook-uri React
Toate resursele sunt accesibile prin hook-ul `useDataSync`:

```javascript
// Resurse generale
const { data: invoices } = useDataSync('invoices');
const { data: stocks } = useDataSync('stocks');
const { data: sales } = useDataSync('sales');

// Resurse business-specific
const { data: timeline } = useDataSync('timeline', { businessType: 'dental' });
const { data: clients } = useDataSync('clients', { businessType: 'dental' });
```

### Business Logic
Fiecare resursă este procesată conform strategiei business:

```javascript
const businessLogic = useBusinessLogic('dental');

// Procesare date
const processedTimeline = businessLogic.processData(timelineData, 'timeline');
const processedClients = businessLogic.processData(clientsData, 'clients');

// Validare
const validation = businessLogic.validateData(formData, 'timeline');

// Verificare permisiuni
const canCreate = businessLogic.isOperationAllowed('createTimeline', formData);
```

### Event System
Toate operațiunile CRUD emit evenimente pentru cross-feature communication:

```javascript
// Listen pentru evenimente
subscribe('timeline:created', (data) => {
  console.log('Timeline created:', data);
});

subscribe('clients:updated', (data) => {
  console.log('Client updated:', data);
});

// Emitere evenimente
emit('timeline:created', { timeline: newTimeline });
emit('clients:updated', { client: updatedClient });
```

## Operații CRUD

Toate resursele suportă operațiile CRUD standard:

### GET - Preluare date
```javascript
// Preluare toate
const { data } = useDataSync('timeline');

// Preluare cu parametri
const { data } = useDataSync('timeline', {
  params: { date: '2024-01-01', status: 'active' }
});
```

### POST - Creare
```javascript
const { create } = useDataSync('timeline');
await create(newTimelineData);
```

### PUT - Actualizare
```javascript
const { update } = useDataSync('timeline');
await update({ id: timelineId, ...updates });
```

### DELETE - Ștergere
```javascript
const { remove } = useDataSync('timeline');
await remove({ id: timelineId });
```

## Configurare și Inițializare

### Inițializarea aplicației
```javascript
import dataSyncInitializer from '@/design-patterns/initialization/DataSyncInitializer';

await dataSyncInitializer.initialize({
  businessType: 'dental',
  websocketUrl: 'ws://localhost:3001'
});
```

### Configurarea business type
```javascript
import dataSyncManager from '@/design-patterns/data-sync/DataSyncManager';

dataSyncManager.setBusinessType('dental');
```

## Offline Support

Toate resursele suportă funcționarea offline:

1. **Cache local** - Datele sunt stocate în IndexedDB
2. **Sync queue** - Operațiile offline sunt puse în coadă
3. **Auto-sync** - Sincronizare automată când conexiunea revine
4. **Optimistic updates** - Actualizări optimiste pentru UX

## Error Handling

Gestionarea erorilor este centralizată:

```javascript
const { error, refresh } = useDataSync('timeline', {
  onError: (error) => {
    if (error.code === 'NETWORK_ERROR') {
      // Retry automat
      setTimeout(() => refresh(), 5000);
    } else if (error.code === 'AUTH_ERROR') {
      // Redirect la login
      window.location.href = '/login';
    }
  }
});
```

