/**
 * API Sync Manager - Handles API synchronization using the new simplified structure
 */

import { createApiManager } from '../../api/index.js';
import eventBus from '../observer/base/EventBus';

class ApiSyncManager {
  constructor() {
    // Check if we're in test mode
    this.testMode = import.meta.env.VITE_TEST_MODE === 'true';
    
    if (this.testMode) {
      console.log('API Sync Manager: Running in TEST MODE - API calls disabled');
    }
    
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
    // In test mode, simulate successful sync without making API calls
    if (this.testMode) {
      console.log(`TEST MODE: Simulating API sync for ${resource}`, data);
      eventBus.emit('datasync:api-synced', { resource, operation: data._operation || 'update', data });
      return { success: true, message: 'Test mode - sync simulated' };
    }

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
        response = await this.apiManager.generalRequest(operation.toUpperCase(), url, data, { noRetry: true });
      } else {
        // Resources that require JWT
        response = await this.apiManager.secureRequest(operation.toUpperCase(), url, data, { noRetry: true });
      }

      eventBus.emit('datasync:api-synced', { resource, operation, data: response });
      return response;
    } catch (error) {
      // Check if it's a connectivity error
      const isConnectivityError = error.message.includes('Backend indisponibil') || 
                                 error.message.includes('fetch') ||
                                 error.code === 'NETWORK_ERROR' ||
                                 error.name === 'TypeError';
      
      // Don't log connectivity errors as they're expected in offline mode
      if (!isConnectivityError) {
        console.error(`API sync failed for ${resource}:`, error.message);
        eventBus.emit('datasync:sync-failed', { resource, data, error });
      }
      
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
    // In test mode, throw a connectivity error to force fallback to IndexedDB/mock data
    if (this.testMode) {
      console.log(`TEST MODE: Simulating API fetch for ${resource} - forcing fallback to local data`);
      const testError = new Error('Backend indisponibil - folosind datele din IndexedDB');
      testError.code = 'NETWORK_ERROR';
      throw testError;
    }

    try {
      if (!config || !config.apiEndpoints.get) {
        throw new Error(`No API endpoint configured for ${resource}`);
      }

      let endpoint = config.apiEndpoints.get;
      const params = { ...options.params };

      // Handle business-specific endpoints
      if (businessType && endpoint.includes('{businessType}')) {
        endpoint = endpoint.replace('{businessType}', businessType);
      }

      // Add date range parameters for timeline
      if (config.requiresDateRange) {
        const { startDate, endDate } = this.getDefaultDateRange();
        params.startDate = params.startDate || startDate;
        params.endDate = params.endDate || endDate;
      }

      // Add pagination parameters for resources that support it
      if (config.supportsPagination) {
        params.page = params.page || 1;
        params.limit = params.limit || 20;
      }

      // Add current day filter for resources that need it
      if (config.currentDayOnly) {
        const today = new Date().toISOString().split('T')[0];
        params.date = params.date || today;
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
        response = await this.apiManager.generalRequest('GET', endpoint, null, { noRetry: true });
      } else {
        // Resources that require JWT
        response = await this.apiManager.secureRequest('GET', endpoint, null, { noRetry: true });
      }

      eventBus.emit('datasync:api-fetched', { resource, data: response });
      return response;
    } catch (error) {
      // Check if it's a connectivity error
      const isConnectivityError = error.message.includes('Backend indisponibil') || 
                                 error.message.includes('fetch') ||
                                 error.code === 'NETWORK_ERROR' ||
                                 error.name === 'TypeError';
      
      // Don't log connectivity errors as they're expected in offline mode
      if (!isConnectivityError) {
        console.error(`Error fetching ${resource} from API:`, error.message);
        eventBus.emit('datasync:api-error', { resource, error });
      }
      
      throw error;
    }
  }

  /**
   * Get default date range for timeline (current week)
   * @returns {Object} Object with startDate and endDate
   */
  getDefaultDateRange() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay())); // End of current week (Saturday)

    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0]
    };
  }

  /**
   * Check if API manager is initialized
   */
  isInitialized() {
    return this.apiManager !== null;
  }

  /**
   * Check if we're in test mode
   */
  isTestMode() {
    return this.testMode;
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