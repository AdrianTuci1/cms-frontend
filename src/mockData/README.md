# Mock Data Guide

Ghid complet pentru crearea și gestionarea datelor de demo în aplicație.

## Structura

```
src/mockData/
├── businessInfo.js    # Date de business și locații
├── userData.js        # Date despre utilizatori
├── index.js          # Exporturi principale
└── README.md         # Acest ghid
```

## Tipuri de Date Disponibile

### 1. Business Info (`businessInfo.js`)

Date despre business-ul demo, locații, features și setări.

```javascript
{
  business: {
    id: 'T0001',
    name: 'Demo Dental Clinic',
    businessType: 'dental',
    email: 'contact@demodental.ro',
    // ... alte date
  },
  locations: [
    {
      id: 'T0001-01',
      name: 'Demo Dental Clinic - Main Office',
      address: 'Strada Demo 123, București',
      // ... alte date
    }
  ],
  features: {
    appointments: true,
    treatments: true,
    // ... feature flags
  }
}
```

### 2. User Data (`userData.js`)

Date despre utilizatorii demo, permisiuni și preferințe.

```javascript
{
  id: 'user-001',
  name: 'Dr. Elena Popescu',
  email: 'elena.popescu@demodental.ro',
  role: 'doctor',
  permissions: ['read:all', 'write:appointments'],
  preferences: {
    theme: 'light',
    language: 'ro'
  }
}
```

## Cum să Adaugi Noi Tipuri de Mock Data

### Pasul 1: Creează Fișierul de Date

Creează un nou fișier în `src/mockData/` pentru tipul tău de date:

```javascript
// src/mockData/clients.js

/**
 * Clients Mock Data
 * 
 * Date de demo pentru clienți/pacienți/membri
 */

export const DEMO_CLIENTS = {
  dental: [
    {
      id: 'T0001-01-CLIENT-001',
      name: 'Ion Popescu',
      email: 'ion.popescu@example.com',
      phone: '+40 123 456 789',
      businessType: 'dental',
      tenantId: 'T0001',
      locationId: 'T0001-01',
      // Date specifice pentru dental
      patientInfo: {
        insuranceProvider: 'Regina Maria',
        allergies: ['Penicillin'],
        medicalHistory: ['Diabetes']
      },
      // Date comune
      profile: {
        dateOfBirth: '1980-05-15',
        address: 'Strada Exemplu 456, București',
        emergencyContact: {
          name: 'Maria Popescu',
          phone: '+40 123 456 790'
        }
      },
      // Metadate
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      status: 'active'
    }
    // ... mai mulți clienți
  ],
  
  gym: [
    {
      id: 'T0002-01-CLIENT-001',
      name: 'Alex Ionescu',
      email: 'alex.ionescu@example.com',
      businessType: 'gym',
      // Date specifice pentru gym
      membershipInfo: {
        type: 'premium',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        personalTrainer: 'Mihai Georgescu'
      },
      fitnessGoals: ['weight_loss', 'muscle_gain'],
      // ... alte date
    }
    // ... mai mulți membri
  ],
  
  hotel: [
    {
      id: 'T0003-01-CLIENT-001',
      name: 'Elena Dumitrescu',
      email: 'elena.dumitrescu@example.com',
      businessType: 'hotel',
      // Date specifice pentru hotel
      guestProfile: {
        loyaltyTier: 'gold',
        totalStays: 15,
        preferredRoomType: 'suite',
        specialRequests: ['late_checkout', 'extra_pillows']
      },
      // ... alte date
    }
    // ... mai mulți oaspeți
  ]
};

/**
 * Obține clienții pentru un tip de business
 * @param {string} businessType - Tipul de business
 * @returns {Array} Lista de clienți
 */
export function getDemoClients(businessType = 'dental') {
  return DEMO_CLIENTS[businessType] || DEMO_CLIENTS.dental;
}

/**
 * Obține un client după ID
 * @param {string} clientId - ID-ul clientului
 * @param {string} businessType - Tipul de business
 * @returns {Object|null} Clientul găsit
 */
export function getDemoClientById(clientId, businessType = 'dental') {
  const clients = getDemoClients(businessType);
  return clients.find(client => client.id === clientId) || null;
}

/**
 * Filtrează clienții după criterii
 * @param {Object} filters - Criteriile de filtrare
 * @param {string} businessType - Tipul de business
 * @returns {Array} Clienții filtrați
 */
export function filterDemoClients(filters = {}, businessType = 'dental') {
  let clients = getDemoClients(businessType);
  
  if (filters.status) {
    clients = clients.filter(client => client.status === filters.status);
  }
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    clients = clients.filter(client => 
      client.name.toLowerCase().includes(search) ||
      client.email.toLowerCase().includes(search)
    );
  }
  
  return clients;
}
```

### Pasul 2: Adaugă Exporturile în `index.js`

```javascript
// src/mockData/index.js

// ... exporturi existente

// Clients Data
export {
  DEMO_CLIENTS,
  getDemoClients,
  getDemoClientById,
  filterDemoClients
} from './clients.js';

// Actualizează funcția getDemoData
export function getDemoData(type, businessType = 'dental') {
  switch (type) {
    case 'businessInfo':
    case 'business-info':
      return getDemoBusinessInfo(businessType);
    
    case 'userData':
    case 'user-data':
      return getCurrentDemoUser(businessType);
    
    case 'clients':
      return getDemoClients(businessType);
    
    // ... alte tipuri
    
    default:
      console.warn(`Unknown demo data type: ${type}`);
      return null;
  }
}
```

### Pasul 3: Folosește Datele în Aplicație

```javascript
// În componentele tale
import { getDemoData, isDemoMode } from '../mockData';

const MyComponent = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (isDemoMode()) {
      // Folosește datele de demo
      const demoClients = getDemoData('clients', 'dental');
      setClients(demoClients);
    } else {
      // Folosește API-ul real
      fetchClientsFromAPI().then(setClients);
    }
  }, []);

  return (
    <div>
      {clients.map(client => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
};
```

## Convenții și Best Practices

### 1. Structura ID-urilor

Folosește formatul standardizat pentru ID-uri:

```javascript
// Pentru documente/resurse
id: 'T0001-01-RESOURCE-001'
//   ^     ^    ^        ^
//   |     |    |        └── Numărul resursei (001, 002, etc.)
//   |     |    └─────────── Tipul resursei (CLIENT, SERVICE, etc.)
//   |     └──────────────── Location ID (01, 02, etc.)
//   └────────────────────── Tenant ID (T0001, T0002, etc.)

// Pentru utilizatori
id: 'user-001'
//   ^    ^
//   |    └── Numărul utilizatorului
//   └─────── Prefix pentru utilizatori
```

### 2. Date Comune vs. Specifice

Organizează datele în secțiuni comune și specifice:

```javascript
{
  // Date comune pentru toate tipurile de business
  id: 'T0001-01-CLIENT-001',
  name: 'Ion Popescu',
  email: 'ion.popescu@example.com',
  phone: '+40 123 456 789',
  businessType: 'dental',
  tenantId: 'T0001',
  locationId: 'T0001-01',
  
  // Date specifice pentru tipul de business
  patientInfo: {
    // Date specifice pentru dental
  },
  
  // Date de profil generale
  profile: {
    dateOfBirth: '1980-05-15',
    address: 'Strada Exemplu 456, București'
  },
  
  // Metadate sistem
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
  status: 'active'
}
```

### 3. Funcții Utilitare

Creează întotdeauna funcții utilitare pentru accesarea datelor:

```javascript
// ✅ Bun - cu funcții utilitare
export function getDemoClients(businessType = 'dental') {
  return DEMO_CLIENTS[businessType] || DEMO_CLIENTS.dental;
}

export function getDemoClientById(clientId, businessType = 'dental') {
  const clients = getDemoClients(businessType);
  return clients.find(client => client.id === clientId) || null;
}

// ❌ Rău - acces direct la date
import { DEMO_CLIENTS } from './clients.js';
const clients = DEMO_CLIENTS.dental; // Nu face așa
```

### 4. Validarea Datelor

Adaugă validări pentru datele de intrare:

```javascript
export function getDemoClients(businessType = 'dental') {
  if (!businessType || typeof businessType !== 'string') {
    console.warn('Invalid businessType provided, using default: dental');
    businessType = 'dental';
  }
  
  if (!DEMO_CLIENTS[businessType]) {
    console.warn(`No demo data found for business type: ${businessType}`);
    return DEMO_CLIENTS.dental;
  }
  
  return DEMO_CLIENTS[businessType];
}
```

### 5. Documentarea Datelor

Documentează structura datelor:

```javascript
/**
 * Client Demo Data Structure
 * 
 * @typedef {Object} DemoClient
 * @property {string} id - ID unic format: T0001-01-CLIENT-001
 * @property {string} name - Numele complet al clientului
 * @property {string} email - Adresa de email
 * @property {string} phone - Numărul de telefon (+40 format)
 * @property {string} businessType - Tipul de business (dental|gym|hotel)
 * @property {string} tenantId - ID-ul tenant-ului
 * @property {string} locationId - ID-ul locației
 * @property {Object} profile - Informații generale de profil
 * @property {Object} [patientInfo] - Info specific dental (opțional)
 * @property {Object} [membershipInfo] - Info specific gym (opțional)
 * @property {Object} [guestProfile] - Info specific hotel (opțional)
 * @property {string} createdAt - Data creării (ISO string)
 * @property {string} updatedAt - Data ultimei modificări (ISO string)
 * @property {string} status - Statusul (active|inactive|suspended)
 */
```

## Exemple pentru Fiecare Tip de Business

### Dental

```javascript
{
  id: 'T0001-01-CLIENT-001',
  name: 'Ion Popescu',
  businessType: 'dental',
  patientInfo: {
    insuranceProvider: 'Regina Maria',
    allergies: ['Penicillin'],
    medicalHistory: ['Diabetes'],
    lastVisit: '2024-01-15',
    nextAppointment: '2024-02-15',
    treatments: ['cleaning', 'filling']
  }
}
```

### Gym

```javascript
{
  id: 'T0002-01-CLIENT-001',
  name: 'Alex Ionescu',
  businessType: 'gym',
  membershipInfo: {
    type: 'premium',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    personalTrainer: 'Mihai Georgescu'
  },
  fitnessProfile: {
    goals: ['weight_loss', 'muscle_gain'],
    currentWeight: 80,
    targetWeight: 75,
    height: 180
  }
}
```

### Hotel

```javascript
{
  id: 'T0003-01-CLIENT-001',
  name: 'Elena Dumitrescu',
  businessType: 'hotel',
  guestProfile: {
    loyaltyTier: 'gold',
    totalStays: 15,
    preferredRoomType: 'suite',
    specialRequests: ['late_checkout', 'extra_pillows'],
    dietaryRestrictions: ['vegetarian']
  }
}
```

## Testare

Pentru a testa datele de demo:

```bash
# Activează test mode
VITE_TEST_MODE=true npm run dev

# Sau creează .env cu:
echo "VITE_TEST_MODE=true" > .env
```

În aplicație:

```javascript
import { isDemoMode, getDemoData } from '../mockData';

// Verifică dacă suntem în demo mode
if (isDemoMode()) {
  console.log('Demo mode activ');
  
  // Testează datele
  const businessInfo = getDemoData('businessInfo', 'dental');
  const userData = getDemoData('userData', 'dental');
  const clients = getDemoData('clients', 'dental');
  
  console.log({ businessInfo, userData, clients });
}
```

## Extinderi Viitoare

Pentru a adăuga noi tipuri de resurse:

1. **Services/Packages** - Date despre servicii/pachete
2. **Timeline** - Date pentru calendar/timeline
3. **Invoices** - Date pentru facturi
4. **Reports** - Date pentru rapoarte
5. **Settings** - Configurări pentru aplicație

Urmează aceeași structură și convenții prezentate în acest ghid. 