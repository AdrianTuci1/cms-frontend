# Migrare API - De la Complex la Simplu

Acest document explică cum să migrezi de la vechiul API complex la noul API simplificat care folosește endpoint-urile documentate în `requests.md`.

## Probleme cu Vechiul API

### 1. Endpoint-uri Complexe
```javascript
// Vechiul mod - Endpoint-uri complexe
/api/v1/dental/appointments
/api/v1/dental/patients
/api/v1/dental/treatments
/api/v1/timeline/appointments/2024-01-01
```

### 2. Strategii Complexe
```javascript
// Vechiul mod - Strategii complexe
import { DentalStrategy } from '@/api';
const dental = new DentalStrategy();
const appointments = await dental.getAppointments();
```

### 3. Multiple Servicii Duplicate
```javascript
// Vechiul mod - Servicii duplicate
import TimelineService from '@/api/services/TimelineService';
import CalendarService from '@/api/services/CalendarService';
import ClientsService from '@/api/services/ClientsService';
```

### 4. Cereri API Excesive
- Fiecare serviciu făcea cereri separate
- Strategiile creeau endpoint-uri nested
- Nu exista optimizare pentru cereri multiple

## Noul API Simplificat

### 1. Endpoint-uri Simple
```javascript
// Noul mod - Endpoint-uri simple din requests.md
/api/dental/timeline
/api/dental/clients
/api/dental/packages
/api/dental/members
/api/invoices
/api/stocks
/api/sales
```

### 2. Servicii Unificate
```javascript
// Noul mod - Servicii simple
import { TimelineService, SecureService, GeneralService } from '@/api';

// Pentru toate tipurile de business
const timeline = await TimelineService.getTimeline('dental');
const clients = await TimelineService.getClients('gym');
const packages = await TimelineService.getPackages('hotel');
```

### 3. Fără Strategii Complexe
- Nu mai sunt necesare strategiile
- Același serviciu pentru toate tipurile de business
- Cod mai simplu și mai ușor de menținut

## Ghid de Migrare

### Pasul 1: Înlocuiește Importurile

#### Vechiul mod:
```javascript
import { DentalStrategy } from '@/api';
import TimelineService from '@/api/services/TimelineService';
import CalendarService from '@/api/services/CalendarService';
```

#### Noul mod:
```javascript
import { TimelineService, SecureService, GeneralService } from '@/api';
```

### Pasul 2: Înlocuiește Apelurile API

#### Pentru Programări (Appointments):

**Vechiul mod:**
```javascript
// Folosind strategia
const dental = new DentalStrategy();
const appointments = await dental.getAppointments();

// Sau folosind TimelineService
const appointments = await TimelineService.getAppointments('2024-01-01');
```

**Noul mod:**
```javascript
// Folosind TimelineService cu business type
const timeline = await TimelineService.getTimeline('dental');
// Timeline-ul conține programările pentru business-ul specific
```

#### Pentru Clienți (Clients):

**Vechiul mod:**
```javascript
const clients = await ClientsService.getClients();
const clientsWithAppointments = await ClientsService.getClientsWithUpcomingAppointments();
```

**Noul mod:**
```javascript
const clients = await TimelineService.getClients('dental');
// Pentru filtrare, folosește parametri
const clientsWithAppointments = await TimelineService.getClients('dental', { 
  hasUpcomingAppointments: true 
});
```

#### Pentru Facturi (Invoices):

**Vechiul mod:**
```javascript
import InvoicesService from '@/api/services/InvoicesService';
const invoices = await InvoicesService.getInvoices();
```

**Noul mod:**
```javascript
import { SecureService } from '@/api';
const invoices = await SecureService.getInvoices();
```

### Pasul 3: Actualizează Hook-urile

#### Vechiul mod:
```javascript
const { data: appointments, loading, error } = useApiCall(
  () => TimelineService.getAppointments()
);
```

#### Noul mod:
```javascript
const { data: timeline, loading, error } = useApiCall(
  () => TimelineService.getTimeline('dental')
);
```

### Pasul 4: Actualizează Store-urile

#### Vechiul mod:
```javascript
// În appointmentsStore.js
fetchAppointmentsForWeek: async (startDate, endDate) => {
  const appointments = await dataSyncManager.getAppointments(dateRange);
  set({ appointments, isLoading: false });
}
```

#### Noul mod:
```javascript
// În appointmentsStore.js
fetchAppointmentsForWeek: async (startDate, endDate) => {
  const timeline = await TimelineService.getTimeline('dental', {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  });
  set({ appointments: timeline.appointments, isLoading: false });
}
```

## Exemple Complete de Migrare

### Exemplu 1: Componenta Timeline

#### Vechiul mod:
```javascript
import React, { useEffect } from 'react';
import { useApiCall } from '@/api/hooks/useApiCall';
import TimelineService from '@/api/services/TimelineService';

const DentalTimeline = () => {
  const { data: appointments, loading, error } = useApiCall(
    () => TimelineService.getAppointments()
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {appointments?.map(appointment => (
        <div key={appointment.id}>{appointment.title}</div>
      ))}
    </div>
  );
};
```

#### Noul mod:
```javascript
import React, { useEffect } from 'react';
import { useApiCall } from '@/api/hooks/useApiCall';
import { TimelineService } from '@/api';

const DentalTimeline = () => {
  const { data: timeline, loading, error } = useApiCall(
    () => TimelineService.getTimeline('dental')
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {timeline?.appointments?.map(appointment => (
        <div key={appointment.id}>{appointment.title}</div>
      ))}
    </div>
  );
};
```

### Exemplu 2: Dashboard cu Multiple Date

#### Vechiul mod:
```javascript
import React from 'react';
import { useApiCall } from '@/api/hooks/useApiCall';
import TimelineService from '@/api/services/TimelineService';
import InvoicesService from '@/api/services/InvoicesService';
import StocksService from '@/api/services/StocksService';

const Dashboard = () => {
  const { data: appointments } = useApiCall(
    () => TimelineService.getAppointments()
  );
  const { data: invoices } = useApiCall(
    () => InvoicesService.getInvoices()
  );
  const { data: stocks } = useApiCall(
    () => StocksService.getStocks()
  );

  return (
    <div>
      <div>Appointments: {appointments?.length}</div>
      <div>Invoices: {invoices?.length}</div>
      <div>Stocks: {stocks?.length}</div>
    </div>
  );
};
```

#### Noul mod:
```javascript
import React from 'react';
import { useApiCall } from '@/api/hooks/useApiCall';
import { TimelineService, SecureService } from '@/api';

const Dashboard = () => {
  const { data: timeline } = useApiCall(
    () => TimelineService.getTimeline('dental')
  );
  const { data: invoices } = useApiCall(
    () => SecureService.getInvoices()
  );
  const { data: stocks } = useApiCall(
    () => SecureService.getStocks()
  );

  return (
    <div>
      <div>Appointments: {timeline?.appointments?.length}</div>
      <div>Invoices: {invoices?.length}</div>
      <div>Stocks: {stocks?.length}</div>
    </div>
  );
};
```

## Beneficii ale Migrării

### 1. Performanță Îmbunătățită
- **Mai puține cereri API** - Un endpoint în loc de multiple
- **Endpoint-uri optimizate** - Conform documentației
- **Fără overhead** - Nu mai există strategii complexe

### 2. Cod Mai Simplu
- **Mai puține fișiere** - 3 servicii în loc de 10+
- **Fără strategii** - Nu mai sunt necesare
- **Reutilizare** - Același serviciu pentru toate business-urile

### 3. Mentenanță Ușoară
- **Endpoint-uri documentate** - Conform requests.md
- **Cod clar** - Ușor de înțeles și modificat
- **Testare simplă** - Mai puține componente de testat

### 4. Scalabilitate
- **Business types noi** - Doar parametru nou
- **Endpoint-uri noi** - Adăugare simplă în servicii
- **Fără complexitate** - Nu crește cu business-urile

## Checklist de Migrare

- [ ] Înlocuiește importurile de strategii cu servicii simple
- [ ] Actualizează apelurile API pentru a folosi endpoint-urile corecte
- [ ] Modifică hook-urile pentru a folosi serviciile noi
- [ ] Actualizează store-urile pentru a folosi API-ul simplificat
- [ ] Testează funcționalitatea după migrare
- [ ] Elimină fișierele vechi (strategii, servicii duplicate)
- [ ] Actualizează documentația

## Suport

Pentru întrebări sau probleme în timpul migrării, consultă:
- `requests.md` - Documentația endpoint-urilor
- `README.md` - Documentația API-ului
- `examples/SimpleApiExample.jsx` - Exemple de utilizare 