/**
 * API Sync Manager - Handles API synchronization using the new simplified structure
 */

import { createApiManager } from '../../api/index.js';
import eventBus from '../observer/base/EventBus';

class ApiSyncManager {
  constructor() {
    // Initialize API Manager with simplified structure
    this.apiManager = createApiManager({
      baseURL: 'http://localhost:3001/api',
      debug: false,
      timeout: 30000
    });
  }

  /**
   * Sync data via API using the new API structure from requests.md
   * @param {string} resource - Resource name
   * @param {Object} data - Data to sync
   * @param {Object} config - Resource configuration
   * @param {string} businessType - Business type for dynamic endpoints
   */
  async syncViaAPI(resource, data, config, businessType = null) {
    try {
      const operation = data._operation || 'update';
      const endpoint = config.apiEndpoints[operation.toLowerCase()];
      
      if (!endpoint) {
        throw new Error(`No API endpoint configured for ${operation} on ${resource}`);
      }

      let url = endpoint;
      
      // Handle business-specific endpoints
      if (businessType && url.includes('{businessType}')) {
        url = url.replace('{businessType}', businessType);
      }

      // Replace ID placeholder
      if (data.id && url.includes(':id')) {
        url = url.replace(':id', data.id);
      }

      // Determine which API service to use
      let response;
      
      if (config.requiresAuth === false) {
        // Resources that don't require JWT
        response = await this.apiManager.generalRequest(operation.toUpperCase(), url, data);
      } else {
        // Resources that require JWT
        response = await this.apiManager.secureRequest(operation.toUpperCase(), url, data);
      }

      eventBus.emit('datasync:api-synced', { resource, operation, data: response });
      return response;
    } catch (error) {
      console.error(`API sync failed for ${resource}:`, error);
      eventBus.emit('datasync:sync-failed', { resource, data, error });
      throw error;
    }
  }

  /**
   * Fetch data from API using the new API structure from requests.md
   * @param {string} resource - Resource name
   * @param {Object} options - Query options
   * @param {Object} config - Resource configuration
   * @param {string} businessType - Business type for dynamic endpoints
   */
  async fetchFromAPI(resource, options = {}, config, businessType = null) {
    try {
      if (!config || !config.apiEndpoints.get) {
        throw new Error(`No API endpoint configured for ${resource}`);
      }

      let endpoint = config.apiEndpoints.get;
      const params = options.params || {};

      // Handle business-specific endpoints
      if (businessType && endpoint.includes('{businessType}')) {
        endpoint = endpoint.replace('{businessType}', businessType);
      }

      // Add query parameters
      if (Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        endpoint += `?${queryString}`;
      }

      // Determine which API service to use based on resource
      let response;
      
      if (config.requiresAuth === false) {
        // Resources that don't require JWT
        response = await this.apiManager.generalRequest('GET', endpoint);
      } else {
        // Resources that require JWT
        response = await this.apiManager.secureRequest('GET', endpoint);
      }

      eventBus.emit('datasync:api-fetched', { resource, data: response });
      return response;
    } catch (error) {
      console.error(`Error fetching ${resource} from API:`, error);
      eventBus.emit('datasync:api-error', { resource, error });
      throw error;
    }
  }

  /**
   * Check if API manager is initialized
   */
  isInitialized() {
    return this.apiManager !== null;
  }

  /**
   * Get API manager instance
   */
  getApiManager() {
    return this.apiManager;
  }
}

export function createApiSyncManager() {
  return new ApiSyncManager();
} 