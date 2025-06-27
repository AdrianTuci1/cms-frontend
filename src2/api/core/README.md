# Core API Module

Sistem modular și extensibil pentru gestionarea API-urilor, folosind inheritance și composition pentru o arhitectură curată și menținibilă.

## Arhitectura

```
core/
├── client/           # Sistem modular de client HTTP
│   ├── BaseClient.js
│   ├── AuthManager.js
│   ├── RequestManager.js
│   ├── ApiClient.js
│   └── index.js
├── errors/           # Sistem complet de gestionare a erorilor
│   ├── BaseError.js
│   ├── NetworkError.js
│   ├── AuthError.js
│   ├── ValidationError.js
│   ├── ServerError.js
│   ├── ResourceError.js
│   ├── ErrorFactory.js
│   ├── ErrorCodes.js
│   └── index.js
├── config/           # Sistem modular de configurații
│   ├── BaseConfig.js
│   ├── BusinessConfig.js
│   ├── EndpointsConfig.js
│   ├── EnvironmentConfig.js
│   ├── ApiConfigFactory.js
│   └── index.js
├── index.js          # Export principal
└── README.md
```

## Sistemul de Configurații (Config)

### Arhitectura Modulară

Sistemul de configurații folosește inheritance și composition pentru o arhitectură flexibilă:

```javascript
BaseConfig (clasa de bază)
├── BusinessConfig (inheritance)
├── EndpointsConfig (inheritance)
├── EnvironmentConfig (inheritance)
└── ApiConfigFactory (composition)
```

### Componente

#### 1. BaseConfig
Clasa de bază pentru toate configurațiile, oferă funcționalități comune:

```javascript
import { BaseConfig } from './config/index.js';

const config = new BaseConfig({
  baseURL: 'https://api.example.com',
  timeout: 30000
});

// Metode disponibile
config.get('baseURL');           // Obține o valoare
config.set('timeout', 60000);    // Setează o valoare
config.has('debug');             // Verifică existența
config.validateAll();            // Validează configurația
config.addObserver('*', callback); // Adaugă observer
```

#### 2. BusinessConfig
Configurații specifice pentru tipuri de business:

```javascript
import { BusinessConfig } from './config/index.js';

const dentalConfig = new BusinessConfig('dental', {
  customSetting: 'value'
});

// Funcționalități specifice business
dentalConfig.getEndpoints();           // Endpoint-uri pentru dental
dentalConfig.isFeatureEnabled('appointmentScheduling');
dentalConfig.buildEndpointUrl('appointments', { date: '2024-01-01' });
dentalConfig.getTimeSlots();           // Time slots pentru programări
```

#### 3. EndpointsConfig
Gestionarea endpoint-urilor API:

```javascript
import { EndpointsConfig } from './config/index.js';

const endpoints = new EndpointsConfig();

// Gestionarea endpoint-urilor
endpoints.addEndpoint('auth', 'login', '/auth/login');
endpoints.buildUrl('auth', 'login', { redirect: '/dashboard' });
endpoints.getCategoryEndpoints('auth');
endpoints.searchEndpoints('user');     // Caută endpoint-uri
```

#### 4. EnvironmentConfig
Configurații per environment:

```javascript
import { EnvironmentConfig } from './config/index.js';

const devConfig = new EnvironmentConfig('development');
const prodConfig = new EnvironmentConfig('production');

// Verificări environment
devConfig.isDevelopment();             // true
prodConfig.isProduction();             // true
devConfig.isFeatureEnabled('hotReload'); // true
prodConfig.getSecurityConfig();        // Configurații de securitate
```

#### 5. ApiConfigFactory
Factory pentru crearea configurațiilor complete:

```javascript
import { ApiConfigFactory } from './config/index.js';

const factory = new ApiConfigFactory();

// Creează configurații individuale
const baseConfig = factory.createBaseConfig();
const businessConfig = factory.createBusinessConfig('dental');
const endpointsConfig = factory.createEndpointsConfig();
const envConfig = factory.createEnvironmentConfig('development');

// Creează configurație completă
const apiConfig = factory.createApiConfig('dental', 'development', {
  customSetting: 'value'
});
```

### Utilizare Avansată

#### Configurație Completă pentru Business

```javascript
import { createBusinessSystem } from './index.js';

// Creează sistem complet pentru dental
const dentalSystem = createBusinessSystem('dental', 'development', {
  customTimeout: 45000
});

// Utilizare
const appointments = await dentalSystem.businessRequest('appointments', 'GET');
const authUrl = dentalSystem.commonRequest('auth', 'login', 'POST', credentials);
const isFeatureEnabled = dentalSystem.isFeatureEnabled('treatmentPlans');
```

#### Configurație Modulară

```javascript
import { 
  BaseConfig, 
  BusinessConfig, 
  EndpointsConfig, 
  EnvironmentConfig 
} from './config/index.js';

// Creează configurații individuale
const base = new BaseConfig({ baseURL: 'https://api.example.com' });
const business = new BusinessConfig('gym', { customSetting: 'value' });
const endpoints = new EndpointsConfig();
const environment = new EnvironmentConfig('production');

// Combină configurațiile
const combinedConfig = {
  ...base.getAll(),
  ...business.getAll(),
  ...endpoints.getAll(),
  ...environment.getAll()
};
```

#### Validare și Observatori

```javascript
import { ApiConfig } from './config/index.js';

const config = new ApiConfig('hotel', 'staging');

// Adaugă validatori
config.getConfig().getBaseConfig().addValidator('timeout', (value) => {
  return value > 0 ? true : 'Timeout must be positive';
});

// Adaugă observatori
config.getConfig().getBaseConfig().addObserver('baseURL', (key, oldValue, newValue) => {
  console.log(`Base URL changed from ${oldValue} to ${newValue}`);
});

// Validează configurația
const validation = config.validate();
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors);
}
```

## Sistemul de Client (Client)

### Arhitectura Modulară

```javascript
BaseClient (clasa de bază)
├── AuthManager (composition)
├── RequestManager (composition)
└── ApiClient (composition)
```

### Utilizare

```javascript
import { ApiClient } from './client/index.js';

const client = new ApiClient({
  baseURL: 'https://api.example.com',
  timeout: 30000
});

// Cereri HTTP
const response = await client.get('/users');
const user = await client.post('/users', { name: 'John' });
const updated = await client.put('/users/1', { name: 'Jane' });
const deleted = await client.delete('/users/1');
```

## Sistemul de Erori (Errors)

### Arhitectura Modulară

```javascript
BaseError (clasa de bază)
├── NetworkError (inheritance)
├── AuthError (inheritance)
│   ├── AuthenticationError
│   └── AuthorizationError
├── ValidationError (inheritance)
├── ServerError (inheritance)
│   ├── RateLimitError
│   └── TimeoutError
└── ResourceError (inheritance)
    ├── NotFoundError
    └── ConflictError
```

### Utilizare

```javascript
import { 
  ErrorFactory, 
  NetworkError, 
  ValidationError 
} from './errors/index.js';

// Creează erori
const networkError = new NetworkError('Connection failed');
const validationError = new ValidationError('Invalid email format');

// Folosește factory
const error = ErrorFactory.create('NETWORK_ERROR', 'Connection timeout');
const authError = ErrorFactory.createAuthError('Invalid credentials');
```

## Clase Utilitare

### ApiCore
Inițializează și gestionează sistemul API:

```javascript
import { ApiCore } from './index.js';

const core = new ApiCore();
core.initialize(config);

// Cereri HTTP
const response = await core.get('/users');
const user = await core.post('/users', { name: 'John' });
```

### BusinessSystem
Sistem complet pentru un tip de business:

```javascript
import { BusinessSystem } from './index.js';

const dentalSystem = new BusinessSystem('dental', 'development');

// Cereri pentru business
const appointments = await dentalSystem.businessRequest('appointments');
const auth = await dentalSystem.commonRequest('auth', 'login', 'POST', credentials);
```

### ApiTester
Testare pentru API:

```javascript
import { ApiTester } from './index.js';

const tester = new ApiTester(config);

// Teste
const connectivity = await tester.testConnectivity();
const auth = await tester.testAuthentication(credentials);
const allTests = await tester.runAllTests(credentials);
```

### SystemInfo
Informații despre sistem:

```javascript
import { SystemInfo } from './index.js';

const systemInfo = new SystemInfo();
const info = systemInfo.getInfo();
const userAgent = systemInfo.get('userAgent');
```

## Funcții Utilitare

```javascript
import { 
  createApiCore,
  createBusinessSystem,
  createApiTester,
  createSystemInfo
} from './index.js';

// Creează sisteme rapid
const core = createApiCore(config);
const business = createBusinessSystem('gym', 'production');
const tester = createApiTester(config);
const systemInfo = createSystemInfo();
```

## Exemple de Utilizare

### Sistem Complet pentru Dental

```javascript
import { createBusinessSystem } from './index.js';

// Inițializează sistemul
const dentalSystem = createBusinessSystem('dental', 'development', {
  customTimeout: 45000,
  enableDebug: true
});

// Validează configurația
const validation = dentalSystem.validate();
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors);
}

// Face cereri
const appointments = await dentalSystem.businessRequest('appointments', 'GET');
const newAppointment = await dentalSystem.businessRequest('appointments', 'POST', {
  patientId: 1,
  date: '2024-01-15',
  time: '10:00'
});

// Verifică funcționalități
if (dentalSystem.isFeatureEnabled('treatmentPlans')) {
  const treatments = await dentalSystem.businessRequest('treatments', 'GET');
}
```

### Sistem de Testare

```javascript
import { createApiTester } from './index.js';

const config = new ApiConfig('gym', 'test');
const tester = createApiTester(config);

// Rulează teste
const results = await tester.runAllTests({
  username: 'test@example.com',
  password: 'password123'
});

console.log('Test results:', results);
```

## Caracteristici

- **Arhitectură Modulară**: Fiecare componentă este independentă și reutilizabilă
- **Inheritance**: Reutilizarea codului prin moștenire
- **Composition**: Flexibilitate prin compunerea componentelor
- **Factory Pattern**: Crearea ușoară a obiectelor complexe
- **Observer Pattern**: Reactivitate la schimbări
- **Validation**: Validare completă a configurațiilor
- **Error Handling**: Gestionarea comprehensivă a erorilor
- **Multi-tenant**: Suport pentru multiple tipuri de business
- **Environment-aware**: Configurații per environment
- **Type-safe**: Interfețe clare și consistente

## Compatibilitate

- **Browser**: Modern browsers cu suport ES6+
- **Node.js**: Versiunea 14+
- **Module System**: ES Modules
- **Bundlers**: Webpack, Vite, Rollup
- **Frameworks**: React, Vue, Angular, Svelte 