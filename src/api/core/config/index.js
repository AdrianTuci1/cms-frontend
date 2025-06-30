/**
 * Config Module - Simplificat pentru integrarea cu DataSyncManager
 * Exportă doar componentele esențiale pentru API
 */

// Configurație simplă pentru API
export class ApiConfig {
  constructor(config = {}) {
    this.config = {
      baseURL: config.baseURL || 'http://localhost:3001/api/v1',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      debug: config.debug || false,
      logRequests: config.logRequests || false,
      logResponses: config.logResponses || false,
      logErrors: config.logErrors || true,
      ...config
    };
  }

  getConfig() {
    return this.config;
  }

  get(key, defaultValue = null) {
    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  set(key, value) {
    this.config[key] = value;
    return this;
  }

  buildUrl(endpoint, params = {}) {
    let url = `${this.config.baseURL}${endpoint}`;
    
    if (Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }
    
    return url;
  }

  validate() {
    const errors = [];
    
    if (!this.config.baseURL) {
      errors.push('Base URL is required');
    }
    
    if (this.config.timeout <= 0) {
      errors.push('Timeout must be greater than 0');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return { ...this.config };
  }

  clone() {
    return new ApiConfig({ ...this.config });
  }
}

// Funcții utilitare pentru crearea rapidă de configurații
export const createApiConfig = (config = {}) => {
  return new ApiConfig(config);
};

export const createDevelopmentConfig = () => {
  return new ApiConfig({
    debug: true,
    logRequests: true,
    logResponses: true,
    logErrors: true,
    baseURL: 'http://localhost:3001/api/v1'
  });
};

export const createProductionConfig = () => {
  return new ApiConfig({
    debug: false,
    logRequests: false,
    logResponses: false,
    logErrors: true,
    baseURL: 'https://api.example.com/v1'
  });
};

// Configurații predefinite
export const getDefaultConfigs = () => {
  return {
    development: {
      debug: true,
      logRequests: true,
      logResponses: true,
      logErrors: true,
      baseURL: 'http://localhost:3001/api/v1',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000
    },
    
    production: {
      debug: false,
      logRequests: false,
      logResponses: false,
      logErrors: true,
      baseURL: 'https://api.example.com/v1',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000
    }
  };
};

// Export default pentru compatibilitate
export default ApiConfig; 