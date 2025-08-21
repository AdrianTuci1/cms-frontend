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
    
    // Initialize API Manager with unified structure
    this.apiManager = createApiManager({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
      debug: false,
      timeout: 30000
    });
  }

  /**
   * Get business ID from localStorage (same as LocationsPage)
   * @returns {string|null} Business ID
   */
  getBusinessId() {
    return localStorage.getItem('businessId');
  }

  /**
   * Get location ID from localStorage (same as LocationsPage)
   * @returns {string|null} Location ID
   */
  getLocationId() {
    return localStorage.getItem('locationId');
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
        if (resource === 'businessInfo' && url.includes(':businessId')) {
          const businessId = this.getBusinessId();
          if (businessId) {
            url = url.replace(':businessId', businessId);
          }
        }
      }

      // Determine which API service to use based on server connectivity
      let response;
      
      if (config.requiresAuth === false) {
        // Resources that don't require JWT (auth, businessInfo, timeline)
        // Skip connectivity check for timeline as it should work with curl
        if (resource !== 'timeline' && !this.connectivityManager?.isAuthResourcesServerOnline()) {
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
        // Use single endpoint pattern - get businessId and locationId from localStorage
        const businessId = this.getBusinessId();
        const locationId = this.getLocationId();
        
        if (resource === 'timeline') {
          console.log('🔍 Timeline: localStorage values:', {
            businessId: businessId,
            locationId: locationId,
            businessIdLength: businessId ? businessId.length : 0,
            locationIdLength: locationId ? locationId.length : 0
          });
        }
        
        console.log('🔍 ApiSyncManager: localStorage values:', {
          businessId: businessId,
          locationId: locationId,
          businessIdType: typeof businessId,
          locationIdType: typeof locationId
        });
        
        if (!businessId || !locationId) {
          throw new Error('Business ID and Location ID must be set before using single endpoint. Please select a location first.');
        }
        
        const baseUrl = `/api/resources/${businessId}-${locationId}`;
        endpoint = baseUrl;
        
        console.log('🔍 ApiSyncManager: Built URL:', {
          businessId: businessId,
          locationId: locationId,
          baseUrl: baseUrl,
          endpoint: endpoint
        });
        
        // Adaugă /date-range/ pentru timeline
        if (config.resourceType === 'timeline') {
          endpoint += '/date-range/';
        }
        
        // Nu mai adăugăm resourceType ca parametru - serverul îl recunoaște din header
      } else {
        // Use traditional endpoint (for auth and businessInfo)
        if (!config || !config.apiEndpoints.get) {
          throw new Error(`No API endpoint configured for ${resource}`);
        }
        
        endpoint = config.apiEndpoints.get;
        
        // Replace business ID placeholder for businessInfo
        if (resource === 'businessInfo' && endpoint.includes(':businessId')) {
          const businessId = this.getBusinessId();
          if (businessId) {
            endpoint = endpoint.replace(':businessId', businessId);
          }
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

      // Debug logging for timeline requests
      if (resource === 'timeline') {
        console.log('🔍 Timeline API Request:', {
          method: 'GET',
          url: endpoint,
          params: { ...params },
          headers: config.useSingleEndpoint ? { 'X-Resource-Type': config.resourceType } : {},
          fullUrl: endpoint + (Object.keys(params).length > 0 ? `?${new URLSearchParams(params).toString()}` : '')
        });
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

      // Prepare headers for single endpoint resources
      const headers = {};
      if (config.useSingleEndpoint && config.resourceType) {
        headers['X-Resource-Type'] = config.resourceType;
      }

      // Determine which API service to use based on server connectivity
      let response;
      
      if (config.requiresAuth === false) {
        // Resources that don't require JWT (auth, businessInfo, timeline)
        // Skip connectivity check for timeline as it should work with curl
        if (resource !== 'timeline' && !this.connectivityManager?.isAuthResourcesServerOnline()) {
          throw new Error('Backend indisponibil - folosind datele din IndexedDB');
        }
        
        // Final logging before making request
        if (resource === 'timeline') {
          console.log('📡 Making generalRequest (no auth):', {
            method: 'GET',
            endpoint,
            headers,
            requestType: 'generalRequest'
          });
        }
        
        response = await this.apiManager.generalRequest('GET', endpoint, null, { 
          noRetry: true,
          headers
        });
      } else {
        // Resources that require JWT
        if (!this.connectivityManager?.isAuthResourcesServerOnline()) {
          throw new Error('Backend indisponibil - folosind datele din IndexedDB');
        }
        
        // Final logging before making request
        if (resource === 'timeline') {
          console.log('📡 Making secureRequest:', {
            method: 'GET',
            endpoint,
            headers,
            requestType: 'secureRequest'
          });
        }
        
        response = await this.apiManager.secureRequest('GET', endpoint, null, { 
          noRetry: true,
          headers
        });
      }

      eventBus.emit('datasync:api-fetched', { resource, data: response });
      
      // Log the response structure for debugging
      if (resource === 'timeline') {
        console.log('📦 ApiSyncManager: Timeline API response structure:', {
          hasResponse: !!response,
          responseType: typeof response,
          hasData: !!(response && response.data),
          dataType: response && response.data ? typeof response.data : 'no data',
          isDataArray: response && response.data ? Array.isArray(response.data) : 'no data',
          dataKeys: response && response.data ? Object.keys(response.data) : 'no data',
          fullResponseKeys: response ? Object.keys(response) : 'no response'
        });
      }
      
      return response;
    } catch (error) {
      // Timeline specific error logging
      if (resource === 'timeline') {
        console.log('❌ Timeline API Error:', {
          message: error.message,
          type: error.name,
          code: error.code
        });
      }
      
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
   * Update location ID in ApiClient
   */
  updateLocationId(locationId) {
    if (this.apiManager && this.apiManager.getApiClient) {
      const apiClient = this.apiManager.getApiClient();
      if (apiClient) {
        apiClient.setLocationId(locationId);
        console.log('ApiSyncManager: Updated location ID in ApiClient:', locationId);
      }
    }
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