import { httpClient } from '../core/HttpClient.js';
import { offlineQueue } from '../core/OfflineQueue.js';
import { networkMonitor } from '../core/NetworkMonitor.js';
import { OfflineError, NetworkError } from '../types.js';

/**
 * Base API Service using Template Method Pattern
 * Provides common functionality for all API services
 */
class BaseApiService {
  constructor(apiClient, tenantId, locationId) {
    this.apiClient = apiClient;
    this.tenantId = tenantId;
    this.locationId = locationId;
    this.config = apiClient.config;
  }

  /**
   * Template method for making API requests
   * @param {string} endpointKey - Endpoint key
   * @param {string} method - HTTP method
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async makeRequest(endpointKey, method, options = {}) {
    const endpoint = this.apiClient.getEndpointUrl(endpointKey, this.tenantId, this.locationId);
    
    // Check if we should use demo mode
    if (this.config.enableDemoMode) {
      return this.handleDemoRequest(endpointKey, method, options);
    }
    
    // Check if we should use offline mode
    if (this.config.enableOfflineMode && !networkMonitor.isCurrentlyOnline()) {
      return this.handleOfflineRequest(endpointKey, method, options);
    }
    
    // Make online request
    return this.handleOnlineRequest(endpoint, method, options);
  }

  /**
   * Handle online request
   * @param {string} endpoint - Full endpoint URL
   * @param {string} method - HTTP method
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async handleOnlineRequest(endpoint, method, options) {
    try {
      const response = await httpClient[method.toLowerCase()](endpoint, options);
      return this.apiClient.transformResponse(response);
    } catch (error) {
      // If network error and offline mode is enabled, queue the request
      if (error instanceof NetworkError && this.config.enableOfflineMode) {
        return this.handleOfflineRequest(endpoint, method, options);
      }
      throw error;
    }
  }

  /**
   * Handle offline request
   * @param {string} endpointKey - Endpoint key
   * @param {string} method - HTTP method
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async handleOfflineRequest(endpointKey, method, options) {
    // Only queue non-GET requests
    if (method.toUpperCase() === 'GET') {
      throw new OfflineError('Cannot fetch data while offline');
    }
    
    const queueId = offlineQueue.addToQueue({
      endpoint: this.apiClient.getEndpointUrl(endpointKey, this.tenantId, this.locationId),
      method: method.toUpperCase(),
      payload: options.body || {},
      tenantId: this.tenantId,
      locationId: this.locationId
    });
    
    // Return optimistic response
    return {
      success: true,
      queued: true,
      queueId,
      message: 'Request queued for processing when online'
    };
  }

  /**
   * Handle demo request
   * @param {string} endpointKey - Endpoint key
   * @param {string} method - HTTP method
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async handleDemoRequest(endpointKey, method, options) {
    // In demo mode, simulate API responses
    const demoData = this.getDemoData(endpointKey);
    
    if (method.toUpperCase() === 'GET') {
      return this.apiClient.transformResponse(demoData);
    }
    
    // For mutations, simulate success response
    return {
      success: true,
      demo: true,
      message: 'Demo mode: operation simulated successfully'
    };
  }

  /**
   * Get demo data for endpoint
   * @param {string} endpointKey - Endpoint key
   * @returns {*} Demo data
   */
  getDemoData(endpointKey) {
    // This should be overridden by subclasses
    return {};
  }

  /**
   * GET request
   * @param {string} endpointKey - Endpoint key
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async get(endpointKey, options = {}) {
    return this.makeRequest(endpointKey, 'GET', options);
  }

  /**
   * POST request
   * @param {string} endpointKey - Endpoint key
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async post(endpointKey, options = {}) {
    return this.makeRequest(endpointKey, 'POST', options);
  }

  /**
   * PUT request
   * @param {string} endpointKey - Endpoint key
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async put(endpointKey, options = {}) {
    return this.makeRequest(endpointKey, 'PUT', options);
  }

  /**
   * DELETE request
   * @param {string} endpointKey - Endpoint key
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async delete(endpointKey, options = {}) {
    return this.makeRequest(endpointKey, 'DELETE', options);
  }

  /**
   * PATCH request
   * @param {string} endpointKey - Endpoint key
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async patch(endpointKey, options = {}) {
    return this.makeRequest(endpointKey, 'PATCH', options);
  }

  /**
   * Get paginated data
   * @param {string} endpointKey - Endpoint key
   * @param {Object} pagination - Pagination parameters
   * @param {Object} options - Additional options
   * @returns {Promise<*>} Paginated response
   */
  async getPaginated(endpointKey, pagination = {}, options = {}) {
    const params = {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      ...pagination,
      ...options.params
    };
    
    return this.get(endpointKey, { ...options, params });
  }

  /**
   * Get data with date range
   * @param {string} endpointKey - Endpoint key
   * @param {Object} dateRange - Date range parameters
   * @param {Object} options - Additional options
   * @returns {Promise<*>} Response data
   */
  async getWithDateRange(endpointKey, dateRange, options = {}) {
    const params = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      ...options.params
    };
    
    return this.get(endpointKey, { ...options, params });
  }

  /**
   * Create entity
   * @param {string} endpointKey - Endpoint key
   * @param {Object} data - Entity data
   * @param {Object} options - Request options
   * @returns {Promise<*>} Created entity
   */
  async create(endpointKey, data, options = {}) {
    const transformedData = this.apiClient.transformRequest(data);
    return this.post(endpointKey, { ...options, body: transformedData });
  }

  /**
   * Update entity
   * @param {string} endpointKey - Endpoint key
   * @param {number} id - Entity ID
   * @param {Object} data - Update data
   * @param {Object} options - Request options
   * @returns {Promise<*>} Updated entity
   */
  async update(endpointKey, id, data, options = {}) {
    const transformedData = this.apiClient.transformRequest(data);
    const endpoint = `${endpointKey}/${id}`;
    return this.put(endpoint, { ...options, body: transformedData });
  }

  /**
   * Delete entity
   * @param {string} endpointKey - Endpoint key
   * @param {number} id - Entity ID
   * @param {Object} options - Request options
   * @returns {Promise<*>} Deletion result
   */
  async remove(endpointKey, id, options = {}) {
    const endpoint = `${endpointKey}/${id}`;
    return this.delete(endpoint, options);
  }

  /**
   * Get entity by ID
   * @param {string} endpointKey - Endpoint key
   * @param {number} id - Entity ID
   * @param {Object} options - Request options
   * @returns {Promise<*>} Entity data
   */
  async getById(endpointKey, id, options = {}) {
    const endpoint = `${endpointKey}/${id}`;
    return this.get(endpoint, options);
  }

  /**
   * Search entities
   * @param {string} endpointKey - Endpoint key
   * @param {string} searchTerm - Search term
   * @param {Object} options - Request options
   * @returns {Promise<*>} Search results
   */
  async search(endpointKey, searchTerm, options = {}) {
    const params = {
      search: searchTerm,
      ...options.params
    };
    
    return this.get(endpointKey, { ...options, params });
  }

  /**
   * Get validation rules for entity type
   * @param {string} entityType - Entity type
   * @returns {Object} Validation rules
   */
  getValidationRules(entityType) {
    return this.apiClient.getValidationRules(entityType);
  }

  /**
   * Get default values for entity type
   * @param {string} entityType - Entity type
   * @returns {Object} Default values
   */
  getDefaultValues(entityType) {
    return this.apiClient.getDefaultValues(entityType);
  }

  /**
   * Get data structure for entity type
   * @param {string} entityType - Entity type
   * @returns {Object} Data structure
   */
  getDataStructure(entityType) {
    return this.apiClient.getDataStructure(entityType);
  }
}

export default BaseApiService; 