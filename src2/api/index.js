/**
 * API Module - Simplificat pentru integrarea cu DataSyncManager
 * Exportă doar componentele esențiale pentru API
 */

// Core exports
export * from './core/index.js';
export { ApiCore, createApiCore } from './core/index.js';

// Services exports
export * from './services/index.js';
export { 
  GeneralService, 
  SecureService, 
  TimelineService 
} from './services/index.js';

// Utils exports
export * from './utils/index.js';
export { 
  requestBuilder, 
  validateParams, 
  buildUrl 
} from './utils/index.js';

// Hooks exports (simplificat)
export * from './hooks/index.js';
export { useApiCall } from './hooks/index.js';

/**
 * API Manager - Manager principal pentru integrarea cu DataSyncManager
 */
export class ApiManager {
  constructor() {
    this.core = null;
    this.generalService = null;
    this.secureService = null;
    this.timelineService = null;
  }

  /**
   * Inițializează API Manager cu o configurație
   */
  initialize(config) {
    // Inițializează core-ul
    this.core = createApiCore(config);
    
    // Inițializează serviciile
    this.generalService = new GeneralService(config);
    this.secureService = new SecureService(config);
    this.timelineService = new TimelineService(config);
    
    return this;
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
   * Face o cerere prin serviciul general
   */
  async generalRequest(method, endpoint, data = null, options = {}) {
    const service = this.getGeneralService();
    return service.request(method, endpoint, data, options);
  }

  /**
   * Face o cerere prin serviciul securizat
   */
  async secureRequest(method, endpoint, data = null, options = {}) {
    const service = this.getSecureService();
    return service.request(method, endpoint, data, options);
  }

  /**
   * Face o cerere prin serviciul de timeline
   */
  async timelineRequest(method, endpoint, data = null, options = {}) {
    const service = this.getTimelineService();
    return service.request(method, endpoint, data, options);
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