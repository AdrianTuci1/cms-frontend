# Test Mode Configuration

## Overview

Aplicația suportă un mod de test care oprește toate cererile API și forțează folosirea datelor locale (IndexedDB și mock data). Acest mod este util pentru:

- Dezvoltare fără backend
- Testare offline
- Demo-uri și prezentări
- Debugging fără dependențe externe

## Configurare

### Variabila de Mediu

Adaugă următoarea variabilă de mediu în fișierul `.env`:

```bash
VITE_TEST_MODE=true
```

### Pentru Dezvoltare

Creează un fișier `.env.development`:

```bash
VITE_TEST_MODE=true
```

### Pentru Testare

Creează un fișier `.env.test`:

```bash
VITE_TEST_MODE=true
```

## Comportament în Test Mode

### API Calls
- Toate cererile API sunt simulate și returnează erori de conectivitate
- Aplicația folosește automat datele din IndexedDB sau mock data
- Nu se fac cereri reale către backend

### Logging
- Se afișează mesaje în consolă pentru a indica că suntem în test mode
- Se loghează simulările de cereri API
- Se reduc mesajele de eroare pentru conectivitate

### Data Sources
1. **IndexedDB** - Datele salvate local
2. **Demo Data** - Date de demo predefinite pentru business info (în test mode)
3. **Fallback** - Configuratie tenant ca ultimă soluție

### Demo Business Info

În test mode (`VITE_TEST_MODE=true`), aplicația va folosi date de demo pentru business info în loc să facă apeluri API:

```javascript
// Date de demo pentru clinică dentară
{
  business: {
    name: 'Demo Dental Clinic',
    businessType: 'dental',
    email: 'contact@demodental.ro'
  },
  locations: [
    {
      name: 'Demo Dental Clinic - Main Office',
      address: 'Strada Demo 123, București'
    },
    {
      name: 'Demo Dental Clinic - Sector 2', 
      address: 'Bulevardul Demo 456, București'
    }
  ]
}
```

Sunt disponibile date de demo pentru toate tipurile de business:
- **dental** - Demo Dental Clinic
- **gym** - Demo Fitness Center  
- **hotel** - Demo Hotel

## Verificare Test Mode

### În Cod

```javascript
// Verifică dacă suntem în test mode
const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';

// În DataSyncManager
const dataSyncManager = new DataSyncManager();
if (dataSyncManager.isTestMode()) {
  console.log('Running in test mode');
}

// În ApiManager
const apiManager = new ApiManager();
if (apiManager.isTestMode()) {
  console.log('API calls disabled');
}
```

### În Consolă

Când aplicația pornește în test mode, vei vedea:

```
API Manager: Running in TEST MODE - API calls disabled
DataSyncManager: Running in TEST MODE - API calls disabled
API Sync Manager: Running in TEST MODE - API calls disabled
```

## Avantaje

1. **Dezvoltare Rapidă** - Nu ai nevoie de backend pentru a testa funcționalitățile
2. **Testare Offline** - Poți testa comportamentul offline
3. **Demo-uri** - Perfect pentru prezentări fără dependențe
4. **Debugging** - Elimină variabila backend din debugging
5. **CI/CD** - Poți rula teste fără backend

## Dezavantaje

1. **Date Statice** - Nu ai date reale din backend
2. **Funcționalități Limită** - Unele funcționalități pot fi limitate
3. **Sincronizare** - Nu se sincronizează cu backend-ul

## Exemple de Utilizare

### Dezvoltare Locală

```bash
# Setează test mode
echo "VITE_TEST_MODE=true" > .env.development

# Pornește aplicația
npm run dev
```

### Testare

```bash
# Setează test mode pentru teste
echo "VITE_TEST_MODE=true" > .env.test

# Rulează teste
npm run test
```

### Demo

```bash
# Setează test mode pentru demo
echo "VITE_TEST_MODE=true" > .env

# Build pentru producție
npm run build
```

## Resetează Test Mode

Pentru a dezactiva test mode, șterge variabila de mediu sau setează-o la `false`:

```bash
VITE_TEST_MODE=false
```

sau

```bash
# Șterge fișierul .env
rm .env
``` 