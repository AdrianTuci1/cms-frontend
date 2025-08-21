# API Test Configuration

## Pentru a testa API-ul real (fără test mode)

### 1. Dezactivează Test Mode

Adaugă în fișierul `.env` sau `.env.local`:

```bash
VITE_TEST_MODE=false
```

### 2. Configurare pentru Timeline API

```bash
VITE_API_URL=http://localhost:3000
VITE_BUSINESS_ID=b1
VITE_TENANT_ID=TN25-100000
VITE_BUSINESS_TYPE=DENTAL
VITE_TEST_MODE=false
```

### 3. URL-ul pentru Timeline

Cu configurația de mai sus, API-ul va face cereri către:

```
GET http://localhost:3000/api/resources/b1-loc1/date-range/?startDate=2025-08-18&endDate=2025-08-26
```

### 4. Headers pentru Timeline

```
X-Resource-Type: timeline
Authorization: Bearer <token>
Content-Type: application/json
```

### 5. Testare

1. Setează `VITE_TEST_MODE=false` în `.env`
2. Repornește aplicația: `npm run dev`
3. Navighează la pagina cu timeline
4. Verifică Network tab în Developer Tools pentru a vedea cererile API

### 6. Debugging

Pentru debugging, verifică:

1. **Console logs** - pentru a vedea URL-urile construite
2. **Network tab** - pentru a vedea cererile HTTP
3. **Response headers** - pentru a verifica dacă `X-Resource-Type` este trimis corect

### 7. Probleme comune

#### Eroarea "Business ID and Location ID must be set"
- Verifică dacă `VITE_BUSINESS_ID` este setat corect
- Verifică dacă location ID este selectat în aplicație

#### Eroarea "Backend indisponibil"
- Verifică dacă serverul rulează pe `http://localhost:3000`
- Verifică dacă `VITE_TEST_MODE=false`

#### Eroarea "No data available"
- Verifică dacă API-ul returnează date pentru timeline
- Verifică dacă datele sunt în formatul corect

### 8. Revenire la Test Mode

Pentru a reveni la test mode (folosind date mock):

```bash
VITE_TEST_MODE=true
```
