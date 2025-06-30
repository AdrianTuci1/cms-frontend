/**
 * Core API Module - Simplificat pentru integrarea cu DataSyncManager
 * Exportă doar componentele esențiale pentru API
 */

import { ApiClient } from './client/ApiClient.js';
import { default as ApiError } from './errors/index.js';
import { default as ApiConfig } from './config/index.js';

// Exportă sistemul de configurații simplu
export * from './config/index.js';
export { default as ApiConfig } from './config/index.js';

// Exportă sistemul de erori simplu
export * from './errors/index.js';
export { default as ApiError } from './errors/index.js';

// Exportă sistemul de client simplu
export * from './client/index.js';
export { ApiClient } from './client/ApiClient.js';

/**
 * Clasa principală pentru API - simplificată pentru DataSyncManager
 */
export class ApiCore {
  constructor() {
    this.config = null;
    this.client = null;
    this.errorHandler = null;
  }

  /**
   * Inițializează sistemul API cu o configurație
   */
  initialize(config) {
    this.config = config;
    this.client = new ApiClient(config);
    this.errorHandler = ApiError;
    return this;
  }

  /**
   * Obține clientul API
   */
  getClient() {
    if (!this.client) {
      throw new Error('API Core not initialized. Call initialize() first.');
    }
    return this.client;
  }

  /**
   * Obține configurația
   */
  getConfig() {
    if (!this.config) {
      throw new Error('API Core not initialized. Call initialize() first.');
    }
    return this.config;
  }

  /**
   * Obține handler-ul de erori
   */
  getErrorHandler() {
    if (!this.errorHandler) {
      throw new Error('API Core not initialized. Call initialize() first.');
    }
    return this.errorHandler;
  }

  /**
   * Face o cerere HTTP
   */
  async request(method, url, data = null, options = {}) {
    const client = this.getClient();
    return client.request(method, url, data, options);
  }

  /**
   * Face o cerere GET
   */
  async get(url, options = {}) {
    return this.request('GET', url, null, options);
  }

  /**
   * Face o cerere POST
   */
  async post(url, data = null, options = {}) {
    return this.request('POST', url, data, options);
  }

  /**
   * Face o cerere PUT
   */
  async put(url, data = null, options = {}) {
    return this.request('PUT', url, data, options);
  }

  /**
   * Face o cerere DELETE
   */
  async delete(url, options = {}) {
    return this.request('DELETE', url, null, options);
  }

  /**
   * Face o cerere PATCH
   */
  async patch(url, data = null, options = {}) {
    return this.request('PATCH', url, data, options);
  }
}

/**
 * Funcție utilitară pentru crearea unui API Core
 */
export const createApiCore = (config) => {
  return new ApiCore().initialize(config);
};

// Export default pentru compatibilitate
export default {
  ApiCore,
  ApiClient,
  ApiError,
  ApiConfig,
  createApiCore
}; 