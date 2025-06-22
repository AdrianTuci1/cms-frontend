# External OAuth Authentication System

Sistem de autentificare OAuth extern care gestionează token-uri primite de la un host de autentificare extern, cu suport special pentru validarea cu gateway-ul.

## Arhitectură

Sistemul este compus din următoarele componente:

- **AuthService**: Gestionează token-urile OAuth și starea de autentificare
- **CallbackHandler**: Procesează callback-urile OAuth și validarea cu gateway-ul
- **AuthManager**: Singleton care oferă o interfață unificată
- **Types**: Definirea tipurilor și configurațiilor

## Flux de Autentificare cu Gateway

### 1. Inițializare
```javascript
import authManager from './services/auth/index.js';

// Inițializare cu configurație
await authManager.initialize({
  externalAuthHost: 'https://auth.example.com',
  apiServer: 'http://localhost:3001',
  redirectUri: 'http://localhost:5173/auth/callback',
  enableLogging: true
});
```

### 2. Redirect către External Auth
```javascript
// Redirect către sistemul extern de autentificare
authManager.redirectToAuth({
  clientId: 'your-client-id',
  scope: 'read write offline_access',
  state: 'random-state-string'
});
```

### 3. Procesare Callback de la Gateway

Gateway-ul trimite un callback cu următoarea structură:
```
/callback?auth_status=success&auth_token=eyJ1c2VySWQiOiJ1c2VyXzEyMyIsInRpbWVzdGFtcCI6MTcwMzEyMzQ1Njc4OX0=&state=abc123
```

Sistemul acceptă următoarele rute de callback:
- `/callback` (rută simplă)
- `/auth/callback` (rută cu prefix)

Sistemul:
1. Decodifică token-ul base64
2. Extrage `userId` și `code`
3. Validează cu gateway-ul prin API

### 4. Validare cu Gateway

```javascript
// Validare automată în CallbackHandler
const validationRequest = {
  userId: "user_123",
  code: "abc123def456ghi789jkl012mno345pqr678stu901"
};

// Request către gateway
POST /gateway/validate-client/{tenantId}
{
  "userId": "user_123", 
  "code": "abc123def456ghi789jkl012mno345pqr678stu901"
}
```

### 5. Răspuns de la Gateway

```javascript
{
  "success": true,
  "user": {
    "userId": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "tenantId": "tenant1",
    "locationId": "location1",
    "businessType": "gym",
    "roles": ["admin"],
    "permissions": ["read", "write"]
  },
  "tokens": {
    "accessToken": "jwt_token_here",
    "expiresAt": 1703123456789,
    "refreshToken": "refresh_token_here"
  }
}
```

## Utilizare

### Inițializare și Configurare

```javascript
import authManager from './services/auth/index.js';

// Configurație de bază
const config = {
  externalAuthHost: import.meta.env.VITE_EXTERNAL_AUTH_HOST,
  apiServer: import.meta.env.VITE_API_SERVER,
  redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI,
  tokenStorage: 'localStorage',
  autoRefresh: true,
  refreshThreshold: 5 * 60 * 1000, // 5 minute
  validateState: true,
  enableLogging: true
};

// Inițializare
const result = await authManager.initialize(config);
```

### Gestionarea Callback-urilor

```javascript
// În componenta principală sau router
if (authManager.isCallbackUrl()) {
  try {
    const result = await authManager.handleCallback();
    if (result.success) {
      // Autentificare reușită
      console.log('User authenticated:', result.user);
    }
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}
```

### Verificarea Stării de Autentificare

```javascript
// Verificare dacă utilizatorul este autentificat
if (authManager.isAuthenticated()) {
  const user = authManager.getUser();
  const tokens = authManager.getTokens();
  console.log('Authenticated user:', user);
}

// Obținerea stării complete
const authState = authManager.getAuthState();
console.log('Auth state:', authState);
```

### Utilizarea Token-urilor pentru API

```javascript
// Obținerea token-ului pentru request-uri API
const token = authManager.getAccessToken();
if (token) {
  const response = await fetch('/api/data', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

// Sau direct header-ul de autorizare
const authHeader = authManager.getAuthorizationHeader();
if (authHeader) {
  const response = await fetch('/api/data', {
    headers: {
      'Authorization': authHeader
    }
  });
}
```

### Refresh Automat de Token-uri

```javascript
// Verificare dacă token-ul trebuie reîmprospătat
if (authManager.needsRefresh()) {
  const result = await authManager.refreshToken();
  if (result.success) {
    console.log('Token refreshed successfully');
  }
}

// Refresh manual
const result = await authManager.refreshToken();
```

### Logout

```javascript
// Logout cu opțiuni
await authManager.logout({
  revokeToken: true,    // Revocă token-ul pe server
  clearStorage: true,   // Șterge datele din storage
  redirectTo: '/login'  // Redirect după logout
});
```

### Event Listeners

```javascript
// Ascultarea evenimentelor de autentificare
authManager.on('auth_state_changed', (state) => {
  console.log('Auth state changed:', state);
});

authManager.on('login_success', (result) => {
  console.log('Login successful:', result);
});

authManager.on('gateway_validation_success', (result) => {
  console.log('Gateway validation successful:', result);
});

authManager.on('token_refreshed', (tokens) => {
  console.log('Tokens refreshed:', tokens);
});

authManager.on('logout_success', () => {
  console.log('Logout successful');
});
```

## Integrare cu API System

Sistemul de autentificare se integrează cu sistemul API existent:

```javascript
import { ApiManager } from '../api/index.js';
import authManager from './auth/index.js';

// Configurare API cu autentificare
const apiManager = ApiManager.getInstance();
apiManager.setAuthProvider(() => authManager.getAuthorizationHeader());

// Request-uri API vor include automat token-ul de autentificare
const data = await apiManager.get('/api/clients');
```

## Configurare Environment Variables

```bash
# .env
VITE_EXTERNAL_AUTH_HOST=https://auth.example.com
VITE_API_SERVER=http://localhost:3001
VITE_AUTH_REDIRECT_URI=http://localhost:5173/callback
```

**Note**: Sistemul acceptă următoarele rute de callback:
- `/callback` (rută simplă - recomandată)
- `/auth/callback` (rută cu prefix)

## Gestionarea Erorilor

```javascript
// Gestionarea erorilor de autentificare
authManager.on('login_error', (error) => {
  console.error('Login error:', error);
  // Afișare mesaj utilizator
});

authManager.on('gateway_validation_error', (error) => {
  console.error('Gateway validation error:', error);
  // Reîncercare sau redirect la login
});

authManager.on('token_expired', () => {
  console.log('Token expired, redirecting to login');
  authManager.redirectToAuth();
});
```

## Validarea Token-urilor

```javascript
// Validare token cu server-ul
const validation = await authManager.validateToken();
if (!validation.isValid) {
  if (validation.isExpired) {
    // Token expirat, redirect la login
    authManager.redirectToAuth();
  } else {
    // Altă eroare
    console.error('Token validation failed:', validation.error);
  }
}
```

## Securitate

### Validarea State Parameter
```javascript
// State parameter este generat automat și validat
const state = authManager.callbackHandler.generateState();
// State-ul este salvat și validat la callback
```

### Token Storage Secur
```javascript
// Token-urile sunt stocate în localStorage/sessionStorage
// Pentru securitate suplimentară, considerați:
// - Criptarea token-urilor în storage
// - Folosirea sessionStorage pentru sesiuni temporare
// - Implementarea auto-logout la închiderea browser-ului
```

### Validarea cu Gateway
```javascript
// Fiecare token este validat cu gateway-ul
// Gateway-ul verifică:
// - Validitatea userId-ului
// - Validitatea codului de securitate
// - Permisiunile utilizatorului
```

## Testing

### Testare Callback Handler
```javascript
// Simulare callback de la gateway
const mockCallback = '/callback?auth_status=success&auth_token=eyJ1c2VySWQiOiJ0ZXN0IiwidGltZXN0YW1wIjoxNzAzMTIzNDU2Nzg5fQ==&state=test123';

const result = await authManager.callbackHandler.handleCallback(mockCallback);
```

### Testare Validare Gateway
```javascript
// Mock pentru validarea cu gateway
const mockGatewayResponse = {
  success: true,
  user: {
    userId: 'test_user',
    email: 'test@example.com',
    name: 'Test User'
  }
};

// Testare procesare răspuns gateway
await authManager.handleGatewayValidation(mockGatewayResponse);
```

## Debugging

### Activarea Logging-ului
```javascript
// În configurație
const config = {
  enableLogging: true,
  logLevel: 'debug' // 'debug' | 'info' | 'warn' | 'error'
};
```

### Logs Disponibile
- Callback parameters
- Gateway validation requests/responses
- Token refresh attempts
- Authentication state changes
- Error details

## Considerații pentru External System

Sistemul extern de autentificare trebuie să:

1. **Genereze token-uri base64** cu structura:
   ```json
   {
     "userId": "user_123",
     "timestamp": 1703123456789,
     "code": "security_code_here"
   }
   ```

2. **Redirecteze către callback URL** cu parametrii:
   ```
   /callback?auth_status=success&auth_token=<base64_token>&state=<state>
   ```

3. **Implementeze endpoint-ul de validare**:
   ```
   POST /gateway/validate-client/{tenantId}
   {
     "userId": "user_123",
     "code": "security_code"
   }
   ```

4. **Returneze răspunsul de validare**:
   ```json
   {
     "success": true,
     "user": { /* user data */ },
     "tokens": { /* token data */ }
   }
   ```

## Future Enhancements

- [ ] Suport pentru PKCE (Proof Key for Code Exchange)
- [ ] Integrare cu multiple OAuth providers
- [ ] Suport pentru refresh tokens
- [ ] Implementare silent refresh
- [ ] Suport pentru multi-tenant
- [ ] Criptarea token-urilor în storage
- [ ] Auto-logout la inactivitate
- [ ] Suport pentru SSO (Single Sign-On)
- [ ] Integrare cu sistemul de notificări
- [ ] Suport pentru audit logging 