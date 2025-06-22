import { BUSINESS_TYPES } from '../types.js';
import { DentalClinicStrategy, GymStrategy, HotelStrategy } from '../strategies/BusinessStrategy.js';
import { getBusinessType } from '../../../config/businessTypes.js';

/**
 * API Client Factory using Factory Pattern
 * Creates appropriate API clients based on business type
 */
class ApiClientFactory {
  constructor() {
    if (ApiClientFactory.instance) {
      return ApiClientFactory.instance;
    }
    
    this.strategies = new Map([
      [BUSINESS_TYPES.DENTAL_CLINIC, DentalClinicStrategy],
      [BUSINESS_TYPES.GYM, GymStrategy],
      [BUSINESS_TYPES.HOTEL, HotelStrategy]
    ]);
    
    ApiClientFactory.instance = this;
  }

  /**
   * Create business strategy instance
   * @param {string} businessType - Business type
   * @returns {BusinessStrategy} Strategy instance
   */
  createStrategy(businessType) {
    const StrategyClass = this.strategies.get(businessType);
    
    if (!StrategyClass) {
      throw new Error(`Unsupported business type: ${businessType}`);
    }
    
    return new StrategyClass();
  }

  /**
   * Create API client with appropriate strategy
   * @param {string} businessType - Business type
   * @param {Object} config - Client configuration
   * @returns {ApiClient} API client instance
   */
  createApiClient(businessType = null, config = {}) {
    const type = businessType || this.getCurrentBusinessType();
    const strategy = this.createStrategy(type);
    
    return new ApiClient(strategy, config);
  }

  /**
   * Get current business type from environment
   * @returns {string} Business type
   */
  getCurrentBusinessType() {
    const businessConfig = getBusinessType();
    
    // Map business config to API business types
    const typeMap = {
      'DENTAL_CLINIC': BUSINESS_TYPES.DENTAL_CLINIC,
      'GYM': BUSINESS_TYPES.GYM,
      'HOTEL': BUSINESS_TYPES.HOTEL
    };
    
    // Find the key that matches the business config name
    for (const [key, value] of Object.entries(typeMap)) {
      if (businessConfig.name === BUSINESS_TYPES[key]?.name) {
        return value;
      }
    }
    
    // Default to dental clinic
    return BUSINESS_TYPES.DENTAL_CLINIC;
  }

  /**
   * Get available business types
   * @returns {Array} Array of available business types
   */
  getAvailableBusinessTypes() {
    return Array.from(this.strategies.keys());
  }

  /**
   * Check if business type is supported
   * @param {string} businessType - Business type to check
   * @returns {boolean} True if supported
   */
  isBusinessTypeSupported(businessType) {
    return this.strategies.has(businessType);
  }
}

/**
 * API Client that uses business strategy
 */
class ApiClient {
  constructor(strategy, config = {}) {
    this.strategy = strategy;
    this.config = {
      enableOfflineMode: true,
      enableDemoMode: false,
      ...config
    };
    
    this.endpoints = strategy.getEndpoints();
    this.dataStructure = strategy.getDataStructure();
    this.validationRules = strategy.getValidationRules();
    this.defaultValues = strategy.getDefaultValues();
  }

  /**
   * Get endpoint URL
   * @param {string} endpointKey - Endpoint key
   * @param {number} tenantId - Tenant ID
   * @param {number} locationId - Location ID
   * @returns {string} Full endpoint URL
   */
  getEndpointUrl(endpointKey, tenantId, locationId) {
    const baseEndpoint = this.endpoints[endpointKey];
    
    if (!baseEndpoint) {
      throw new Error(`Unknown endpoint: ${endpointKey}`);
    }
    
    return `/${tenantId}/${locationId}${baseEndpoint}`;
  }

  /**
   * Transform response using business strategy
   * @param {*} data - Raw response data
   * @returns {*} Transformed data
   */
  transformResponse(data) {
    return this.strategy.transformResponse(data);
  }

  /**
   * Transform request using business strategy
   * @param {*} data - Request data
   * @returns {*} Transformed request data
   */
  transformRequest(data) {
    return this.strategy.transformRequest(data);
  }

  /**
   * Get validation rules for entity type
   * @param {string} entityType - Entity type
   * @returns {Object} Validation rules
   */
  getValidationRules(entityType) {
    return this.validationRules[entityType] || {};
  }

  /**
   * Get default values for entity type
   * @param {string} entityType - Entity type
   * @returns {Object} Default values
   */
  getDefaultValues(entityType) {
    return this.defaultValues[entityType] || {};
  }

  /**
   * Get data structure for entity type
   * @param {string} entityType - Entity type
   * @returns {Object} Data structure
   */
  getDataStructure(entityType) {
    return this.dataStructure[entityType] || {};
  }

  /**
   * Get business type
   * @returns {string} Business type
   */
  getBusinessType() {
    return this.strategy.constructor.name.replace('Strategy', '').toLowerCase();
  }

  /**
   * Get strategy instance
   * @returns {BusinessStrategy} Strategy instance
   */
  getStrategy() {
    return this.strategy;
  }
}

// Export singleton instance
export const apiClientFactory = new ApiClientFactory();
export default apiClientFactory; 