# API Integration Updates - Server-First Approach

## Overview

Am actualizat sistemul de integrare API pentru a implementa o abordare "server-first" simplificată unde toate resursele sunt cerute de la server de fiecare dată când sunt accesate, cu actualizarea automată a bazei de date indexate.

## Modificări Principale

### 1. Server-First Data Fetching (Simplificat)

Toate resursele sunt configurate cu `forceServerFetch: true`, ceea ce înseamnă că:
- Datele sunt **întotdeauna cerute de la server** când sunt accesate
- **Nu există cache** - fiecare acces cauzează o cerere nouă către API
- Baza de date indexată este actualizată automat cu noile date
- **Eliminat auto-refresh** - datele se actualizează doar la accesare

```javascript
// Exemplu de configurație simplificată
const timelineSync = useDataSync('timeline', {
  businessType: 'dental',
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

### 2. Parametri de Date pentru Timeline

Resursa `timeline` acceptă acum parametrii `startDate` și `endDate`:

```javascript
const timelineSync = useDataSync('timeline', {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  businessType: 'dental'
});
```

**Configurație automată:**
- Dacă nu sunt specificate date, se folosește intervalul săptămânal curent
- Parametrii sunt adăugați automat la cererea API
- Interfața oferă controale pentru selectarea intervalului de date

### 3. Paginare pentru Clients și Members

Resursele `clients` și `members` suportă paginare:

```javascript
const clientsSync = useDataSync('clients', {
  page: 1,
  limit: 20,
  businessType: 'dental'
});
```

**Caracteristici:**
- Paginare automată cu parametrii `page` și `limit`
- Interfață pentru navigarea între pagini
- Actualizare automată când se schimbă parametrii de paginare

### 4. Filtrare pentru Ziua Curentă

Resursele `invoices`, `stocks`, `sales`, și `history` sunt filtrate automat pentru ziua curentă:

```javascript
const invoicesSync = useDataSync('invoices', {
  // Filtrare automată pentru ziua curentă
});
```

**Implementare:**
- Filtrare automată în `DataProcessor`
- Verificare pe multiple câmpuri de dată (`createdAt`, `date`, `timestamp`, etc.)
- Suport pentru diferite formate de dată (ISO string, Date object, YYYY-MM-DD)

## Configurații de Resurse (Simplificate)

### Timeline
```javascript
{
  forceServerFetch: true,
  requiresDateRange: true,
  apiEndpoints: {
    get: '/{businessType}/timeline'
  }
}
```

### Clients/Members
```javascript
{
  forceServerFetch: true,
  supportsPagination: true,
  apiEndpoints: {
    get: '/{businessType}/clients'
  }
}
```

### Invoices/Stocks/Sales/History
```javascript
{
  forceServerFetch: true,
  currentDayOnly: true,
  apiEndpoints: {
    get: '/invoices'
  }
}
```

## Hook-uri Actualizate (Simplificate)

### useDataSync

Hook-ul `useDataSync` a fost simplificat - **eliminat auto-refresh și cache**:

```javascript
const dataSync = useDataSync('timeline', {
  // Parametri de dată
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  
  // Parametri de paginare
  page: 1,
  limit: 20,
  
  // Parametri generali
  params: { customParam: 'value' },
  
  // Configurații
  businessType: 'dental'
});
```

### Parametri Eliminați

- ❌ `autoRefresh` - Nu mai există refresh automat
- ❌ `refreshInterval` - Nu mai există intervale de refresh
- ❌ `useCache` - Nu mai există cache
- ❌ `maxAge` - Nu mai există validare de vârstă a datelor
- ❌ `forceRefresh` - Nu mai există forțare de refresh

### Parametri Noi

- ✅ `startDate` / `endDate` - Pentru timeline
- ✅ `page` / `limit` - Pentru paginare
- ✅ `params` - Parametri personalizați

## Procesare de Date

### DataProcessor

`DataProcessor` a fost extins cu:

1. **Filtrare pentru ziua curentă:**
```javascript
filterForCurrentDay(data, resource) {
  const today = new Date().toISOString().split('T')[0];
  // Filtrare pe multiple câmpuri de dată
}
```

2. **Suport pentru configurații:**
```javascript
processResponse(resource, response, config) {
  // Procesare cu configurații specifice
  if (config.currentDayOnly) {
    return this.filterForCurrentDay(processedData, resource);
  }
}
```

## API Sync Manager

`ApiSyncManager` gestionează automat:

1. **Parametri de dată pentru timeline:**
```javascript
if (config.requiresDateRange) {
  const { startDate, endDate } = this.getDefaultDateRange();
  params.startDate = params.startDate || startDate;
  params.endDate = params.endDate || endDate;
}
```

2. **Parametri de paginare:**
```javascript
if (config.supportsPagination) {
  params.page = params.page || 1;
  params.limit = params.limit || 20;
}
```

3. **Filtrare pentru ziua curentă:**
```javascript
if (config.currentDayOnly) {
  const today = new Date().toISOString().split('T')[0];
  params.date = params.date || today;
}
```

## Exemplu de Utilizare (Simplificat)

```javascript
import { useDataSync } from '../hooks';

const MyComponent = () => {
  // Timeline cu interval de date
  const timeline = useDataSync('timeline', {
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    businessType: 'dental'
  });

  // Clients cu paginare
  const clients = useDataSync('clients', {
    page: 1,
    limit: 20,
    businessType: 'dental'
  });

  // Invoices pentru ziua curentă
  const invoices = useDataSync('invoices', {
    // Filtrare automată pentru ziua curentă
  });

  return (
    <div>
      <h3>Timeline: {timeline.data?.length || 0} items</h3>
      <h3>Clients: {clients.data?.length || 0} items</h3>
      <h3>Invoices: {invoices.data?.length || 0} items (today only)</h3>
      
      {/* Refresh manual dacă este necesar */}
      <button onClick={() => timeline.refresh()}>Refresh Timeline</button>
    </div>
  );
};
```

## Flux de Date Simplificat

```
1. Componenta accesează resursa
   ↓
2. Cerere automată către API
   ↓
3. Datele sunt procesate și filtrate
   ↓
4. Stocare în IndexedDB
   ↓
5. Returnare date către componentă
```

## Beneficii ale Simplificării

1. **Simplitate** - Mai puține opțiuni de configurare
2. **Predictibilitate** - Datele sunt întotdeauna actualizate
3. **Performanță** - Fără overhead de cache și auto-refresh
4. **Debugging ușor** - Fiecare acces cauzează o cerere nouă
5. **Consistență** - Toate resursele folosesc aceeași abordare

## Migrare

Pentru a migra codul existent:

1. **Elimină parametrii redundanți:**
   ```javascript
   // ÎNAINTE
   const data = useDataSync('resource', {
     autoRefresh: true,
     refreshInterval: 30000,
     useCache: true,
     maxAge: 5 * 60 * 1000
   });

   // DUPĂ
   const data = useDataSync('resource', {
     // Fără parametri de sincronizare
   });
   ```

2. **Adaugă parametrii noi dacă este necesar:**
   ```javascript
   // Pentru timeline
   const timeline = useDataSync('timeline', {
     startDate: '2024-01-01',
     endDate: '2024-01-31'
   });

   // Pentru paginare
   const clients = useDataSync('clients', {
     page: 1,
     limit: 20
   });
   ```

3. **Folosește refresh manual dacă este necesar:**
   ```javascript
   <button onClick={() => data.refresh()}>Refresh</button>
   ```

## Debugging

Pentru debugging, verificați:

1. **Network tab** - Fiecare acces cauzează o cerere nouă
2. **Console logs** - Mesajele de la DataSyncManager
3. **IndexedDB** - Datele stocate local
4. **Event bus** - Evenimentele de sincronizare

## Concluzie

Abordarea server-first simplificată oferă:
- **Simplitate maximă** în configurare
- **Date întotdeauna actualizate** la fiecare acces
- **Performanță optimă** fără overhead de cache
- **Debugging ușor** cu cereri predictibile
- **Consistență** în toate resursele 