/**
 * API Sync Manager - Handles API synchronization using single endpoint pattern
 * Updated to work with ConnectivityManager and new endpoint structure
 */

import { createApiManager } from '../../api/index.js';
import eventBus from '../observer/base/EventBus';

class ApiSyncManager {
  constructor(connectivityManager = null) {
    // Check if we're in test mode
    this.testMode = import.meta.env.VITE_TEST_MODE === 'true';
    
    if (this.testMode) {
      console.log('API Sync Manager: Running in TEST MODE - API calls disabled');
    }
    
    // Store connectivity manager reference
    this.connectivityManager = connectivityManager;
    
    // Initialize API Manager with simplified structure
    this.apiManager = createApiManager({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
      businessInfoURL: import.meta.env.VITE_BUSINESS_INFO_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001',
      debug: false,
      timeout: 30000
    });
  }

  /**
   * Sync data via API using the new single endpoint pattern
   * @param {string} resource - Resource name
   * @param {Object} data - Data to sync
   * @param {Object} config - Resource configuration
   * @param {Object} resourceRegistry - Resource registry for endpoint generation
   */
  async syncViaAPI(resource, data, config, resourceRegistry) {
    // In test mode, simulate successful sync without making API calls
    if (this.testMode) {
      console.log(`TEST MODE: Simulating API sync for ${resource}`, data);
      eventBus.emit('datasync:api-synced', { resource, operation: data._operation || 'update', data });
      return { success: true, message: 'Test mode - sync simulated' };
    }

    // Check connectivity first
    if (this.connectivityManager && this.connectivityManager.isOffline()) {
      throw new Error('Backend indisponibil - folosind datele din IndexedDB');
    }

    try {
      const operation = data._operation || 'update';
      let url;
      let requestData = { ...data };

      if (config.useSingleEndpoint) {
        // Use single endpoint pattern
        if (!resourceRegistry.isSingleEndpointReady()) {
          throw new Error('Business ID and Location ID must be set before using single endpoint');
        }
        
        url = resourceRegistry.getSingleEndpointUrl();
        
        // Add resource type to request data
        requestData.resourceType = config.resourceType;
        requestData.operation = operation;
        
        // Add ID to URL for update/delete operations
        if ((operation === 'update' || operation === 'delete') && data.id) {
          url += `/${data.id}`;
        }
      } else {
        // Use traditional endpoint (for auth and businessInfo)
        const endpoint = config.apiEndpoints[operation.toLowerCase()];
        
        if (!endpoint) {
          throw new Error(`No API endpoint configured for ${operation} on ${resource}`);
        }
        
        url = endpoint;
        
        // Replace ID placeholder
        if (data.id && url.includes(':id')) {
          url = url.replace(':id', data.id);
        }
        
        // Replace business ID placeholder for businessInfo
        if (resource === 'businessInfo' && url.includes(':businessId') && data.businessId) {
          url = url.replace(':businessId', data.businessId);
        }
      }

      // Determine which API service to use based on server connectivity
      let response;
      
      if (config.requiresAuth === false) {
        // Resources that don't require JWT (auth, businessInfo)
        const serverOnline = resource === 'businessInfo' 
          ? this.connectivityManager?.isBusinessInfoServerOnline() ?? true
          : this.connectivityManager?.isAuthResourcesServerOnline() ?? true;
          
        if (!serverOnline) {
          throw new Error('Backend indisponibil - folosind datele din IndexedDB');
        }
        
        response = await this.apiManager.generalRequest(operation.toUpperCase(), url, requestData, { noRetry: true });
      } else {
        // Resources that require JWT
        if (!this.connectivityManager?.isAuthResourcesServerOnline()) {
          throw new Error('Backend indisponibil - folosind datele din IndexedDB');
        }
        
        response = await this.apiManager.secureRequest(operation.toUpperCase(), url, requestData, { noRetry: true });
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
   * Fetch data from API using the new single endpoint pattern
   * @param {string} resource - Resource name
   * @param {Object} options - Query options
   * @param {Object} config - Resource configuration
   * @param {Object} resourceRegistry - Resource registry for endpoint generation
   */
  async fetchFromAPI(resource, options = {}, config, resourceRegistry) {
    // In test mode, throw a connectivity error to force fallback to IndexedDB/mock data
    if (this.testMode) {
      console.log(`TEST MODE: Simulating API fetch for ${resource} - forcing fallback to local data`);
      const testError = new Error('Backend indisponibil - folosind datele din IndexedDB');
      testError.code = 'NETWORK_ERROR';
      throw testError;
    }

    // Check connectivity first
    if (this.connectivityManager && this.connectivityManager.isOffline()) {
      throw new Error('Backend indisponibil - folosind datele din IndexedDB');
    }

    try {
      let endpoint;
      let params = { ...options.params };

      if (config.useSingleEndpoint) {
        // Use single endpoint pattern
        if (!resourceRegistry.isSingleEndpointReady()) {
          throw new Error('Business ID and Location ID must be set before using single endpoint');
        }
        
        endpoint = resourceRegistry.getSingleEndpointUrl();
        
        // Add resource type as parameter
        params.resourceType = config.resourceType;
      } else {
        // Use traditional endpoint (for auth and businessInfo)
        if (!config || !config.apiEndpoints.get) {
          throw new Error(`No API endpoint configured for ${resource}`);
        }
        
        endpoint = config.apiEndpoints.get;
        
        // Replace business ID placeholder for businessInfo
        if (resource === 'businessInfo' && endpoint.includes(':businessId') && resourceRegistry.getBusinessId()) {
          endpoint = endpoint.replace(':businessId', resourceRegistry.getBusinessId());
        }
      }

      // Validate and filter query parameters using ResourceRegistry
      params = resourceRegistry.validateQueryParams(resource, params);

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
      if (config.currentDayOnly && !params.date && !params.startDate) {
        const today = new Date().toISOString().split('T')[0];
        params.date = today;
      }

      // Final validation of parameters
      const validatedParams = resourceRegistry.validateQueryParams(resource, params);

      // Add query parameters
      if (Object.keys(validatedParams).length > 0) {
        const queryString = new URLSearchParams(validatedParams).toString();
        endpoint += `?${queryString}`;
      }

      // Determine which API service to use based on server connectivity
      let response;
      
      if (config.requiresAuth === false) {
        // Resources that don't require JWT (auth, businessInfo)
        const serverOnline = resource === 'businessInfo' 
          ? this.connectivityManager?.isBusinessInfoServerOnline() ?? true
          : this.connectivityManager?.isAuthResourcesServerOnline() ?? true;
          
        if (!serverOnline) {
          throw new Error('Backend indisponibil - folosind datele din IndexedDB');
        }
        
        response = await this.apiManager.generalRequest('GET', endpoint, null, { noRetry: true });
      } else {
        // Resources that require JWT
        if (!this.connectivityManager?.isAuthResourcesServerOnline()) {
          throw new Error('Backend indisponibil - folosind datele din IndexedDB');
        }
        
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
   * Get default date range for timeline resources
   * @returns {Object} Object with startDate and endDate
   */
  getDefaultDateRange() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7); // 7 days ago
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7); // 7 days from now
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
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

export function createApiSyncManager(connectivityManager = null) {
  return new ApiSyncManager(connectivityManager);
} 