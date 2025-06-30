/**
 * API Module - Simplificat pentru integrarea cu DataSyncManager
 * Exportă doar componentele esențiale pentru API
 */

// Core exports
import { ApiCore, createApiCore, ApiClient } from './core/index.js';
export * from './core/index.js';

// Services exports
import { GeneralService, SecureService, TimelineService } from './services/index.js';
export * from './services/index.js';

// Utils exports
import { requestBuilder, validateParams, buildUrl } from './utils/index.js';
export * from './utils/index.js';

// Hooks exports (simplificat)
import { useApiCall } from './hooks/index.js';
export * from './hooks/index.js';

/**
 * API Manager - Manager principal pentru integrarea cu DataSyncManager
 */
export class ApiManager {
  constructor() {
    // Check if we're in test mode
    this.testMode = import.meta.env.VITE_TEST_MODE === 'true';
    
    if (this.testMode) {
      console.log('API Manager: Running in TEST MODE - API calls disabled');
    }
    
    this.core = null;
    this.apiClient = null;
    this.generalService = null;
    this.secureService = null;
    this.timelineService = null;
    this.isOnline = navigator.onLine;
  }

  /**
   * Inițializează API Manager cu o configurație
   */
  initialize(config) {
    // Inițializează core-ul
    this.core = createApiCore(config);
    
    // Inițializează ApiClient cu configurația
    this.apiClient = new ApiClient(config);
    
    // Inițializează serviciile cu ApiClient-ul configurat
    this.generalService = new GeneralService(this.apiClient);
    this.secureService = new SecureService(this.apiClient);
    this.timelineService = new TimelineService(this.apiClient);
    
    // Setup online/offline listeners
    this.setupConnectivityListeners();
    
    return this;
  }

  /**
   * Setup listeners pentru conectivitate
   */
  setupConnectivityListeners() {
    const updateOnlineStatus = () => {
      this.isOnline = navigator.onLine;
      console.log(`API Manager: ${this.isOnline ? 'Online' : 'Offline'}`);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  /**
   * Verifică dacă suntem online
   */
  isConnected() {
    return this.isOnline;
  }

  /**
   * Obține serviciul general
   */
  getGeneralService() {
    if (!this.generalService) {
      throw new Error('API Manager not initialized. Call initialize() first.');
    }
    return this.generalService;
  }

  /**
   * Obține serviciul securizat
   */
  getSecureService() {
    if (!this.secureService) {
      throw new Error('API Manager not initialized. Call initialize() first.');
    }
    return this.secureService;
  }

  /**
   * Obține serviciul de timeline
   */
  getTimelineService() {
    if (!this.timelineService) {
      throw new Error('API Manager not initialized. Call initialize() first.');
    }
    return this.timelineService;
  }

  /**
   * Obține core-ul API
   */
  getCore() {
    if (!this.core) {
      throw new Error('API Manager not initialized. Call initialize() first.');
    }
    return this.core;
  }

  /**
   * Obține ApiClient-ul
   */
  getApiClient() {
    if (!this.apiClient) {
      throw new Error('API Manager not initialized. Call initialize() first.');
    }
    return this.apiClient;
  }

  /**
   * Verifică dacă suntem în test mode
   */
  isTestMode() {
    return this.testMode;
  }

  /**
   * Face o cerere prin serviciul general cu gestionarea offline
   */
  async generalRequest(method, endpoint, data = null, options = {}) {
    // In test mode, throw a connectivity error to force fallback
    if (this.testMode) {
      console.log(`TEST MODE: Simulating general request ${method} ${endpoint} - forcing fallback`);
      const testError = new Error('Backend indisponibil - folosind datele din IndexedDB');
      testError.code = 'NETWORK_ERROR';
      throw testError;
    }

    if (!this.isConnected()) {
      throw new Error('Backend indisponibil - folosind datele din IndexedDB');
    }

    try {
      const service = this.getGeneralService();
      return await service.request(method, endpoint, data, options);
    } catch (error) {
      // Dacă eroarea este de conectivitate, aruncă eroarea specifică
      if (error.code === 'NETWORK_ERROR' || error.message.includes('fetch')) {
        throw new Error('Backend indisponibil - folosind datele din IndexedDB');
      }
      throw error;
    }
  }

  /**
   * Face o cerere prin serviciul securizat cu gestionarea offline
   */
  async secureRequest(method, endpoint, data = null, options = {}) {
    // In test mode, throw a connectivity error to force fallback
    if (this.testMode) {
      console.log(`TEST MODE: Simulating secure request ${method} ${endpoint} - forcing fallback`);
      const testError = new Error('Backend indisponibil - folosind datele din IndexedDB');
      testError.code = 'NETWORK_ERROR';
      throw testError;
    }

    if (!this.isConnected()) {
      throw new Error('Backend indisponibil - folosind datele din IndexedDB');
    }

    try {
      const service = this.getSecureService();
      return await service.request(method, endpoint, data, options);
    } catch (error) {
      // Dacă eroarea este de conectivitate, aruncă eroarea specifică
      if (error.code === 'NETWORK_ERROR' || error.message.includes('fetch')) {
        throw new Error('Backend indisponibil - folosind datele din IndexedDB');
      }
      throw error;
    }
  }

  /**
   * Face o cerere prin serviciul de timeline cu gestionarea offline
   */
  async timelineRequest(method, endpoint, data = null, options = {}) {
    // In test mode, throw a connectivity error to force fallback
    if (this.testMode) {
      console.log(`TEST MODE: Simulating timeline request ${method} ${endpoint} - forcing fallback`);
      const testError = new Error('Backend indisponibil - folosind datele din IndexedDB');
      testError.code = 'NETWORK_ERROR';
      throw testError;
    }

    if (!this.isConnected()) {
      throw new Error('Backend indisponibil - folosind datele din IndexedDB');
    }

    try {
      const service = this.getTimelineService();
      return await service.request(method, endpoint, data, options);
    } catch (error) {
      // Dacă eroarea este de conectivitate, aruncă eroarea specifică
      if (error.code === 'NETWORK_ERROR' || error.message.includes('fetch')) {
        throw new Error('Backend indisponibil - folosind datele din IndexedDB');
      }
      throw error;
    }
  }
}

/**
 * Funcție utilitară pentru crearea unui API Manager
 */
export const createApiManager = (config) => {
  return new ApiManager().initialize(config);
};

// Export default pentru compatibilitate
export default {
  // Core
  ApiCore,
  createApiCore,
  
  // Services
  GeneralService,
  SecureService,
  TimelineService,
  
  // Utils
  requestBuilder,
  validateParams,
  buildUrl,
  
  // Hooks
  useApiCall,
  
  // Manager
  ApiManager,
  createApiManager
}; 