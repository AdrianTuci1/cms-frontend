/**
 * Resource Registry - Manages resource configurations and registrations
 * Updated to use single endpoint pattern: /api/resources/{businessId-locationId}
 */

import eventBus from '../observer/base/EventBus';

class ResourceRegistry {
  constructor() {
    this.resources = new Map();
    this.businessInfo = null;
    this.businessId = null;
    this.locationId = null;
  }

  /**
   * Initialize all API resources using the new single endpoint structure
   */
  initializeGeneralResources() {
    // All resources now use the single endpoint pattern: /api/resources/{businessId-locationId}
    // The resourceType will be specified in the request body or query parameters
    
    // General resources (with JWT) - using single endpoint
    this.registerResource('invoices', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      currentDayOnly: true,
      resourceType: 'invoices',
      useSingleEndpoint: true,
      supportedQueryParams: ['date', 'startDate', 'endDate', 'status', 'clientId', 'amountMin', 'amountMax', 'paymentMethod'],
      searchableFields: ['clientName', 'invoiceNumber'],
      filterableFields: ['status', 'paymentMethod', 'date'],
      sortableFields: ['date', 'amount', 'clientName', 'invoiceNumber']
    });

    this.registerResource('stocks', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      currentDayOnly: true,
      resourceType: 'stocks',
      useSingleEndpoint: true,
      supportedQueryParams: ['search', 'name', 'category', 'lowStock', 'status', 'sortBy', 'sortOrder'],
      searchableFields: ['name', 'description', 'sku'],
      filterableFields: ['category', 'status', 'lowStock'],
      sortableFields: ['name', 'quantity', 'price', 'lastUpdated']
    });

    this.registerResource('sales', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      currentDayOnly: true,
      resourceType: 'sales',
      useSingleEndpoint: true,
      supportedQueryParams: ['date', 'startDate', 'endDate', 'clientId', 'productId', 'amountMin', 'amountMax', 'paymentMethod'],
      searchableFields: ['clientName', 'productName'],
      filterableFields: ['paymentMethod', 'date', 'productCategory'],
      sortableFields: ['date', 'amount', 'clientName', 'productName']
    });

    this.registerResource('agent', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      resourceType: 'agent',
      useSingleEndpoint: true,
      supportedQueryParams: ['search', 'conversationId', 'topic', 'startDate', 'endDate', 'status'],
      searchableFields: ['message', 'topic'],
      filterableFields: ['status', 'topic', 'date'],
      sortableFields: ['timestamp', 'topic', 'status']
    });

    this.registerResource('history', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      currentDayOnly: true,
      resourceType: 'history',
      useSingleEndpoint: true,
      supportedQueryParams: ['date', 'startDate', 'endDate', 'action', 'entityType', 'entityId', 'userId'],
      searchableFields: ['description', 'entityName'],
      filterableFields: ['action', 'entityType', 'userId', 'date'],
      sortableFields: ['timestamp', 'action', 'entityType', 'userId']
    });

    this.registerResource('workflows', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      resourceType: 'workflows',
      useSingleEndpoint: true
    });

    this.registerResource('reports', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      resourceType: 'reports',
      useSingleEndpoint: true
    });

    this.registerResource('roles', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      resourceType: 'roles',
      useSingleEndpoint: true
    });

    this.registerResource('permissions', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      resourceType: 'permissions',
      useSingleEndpoint: true
    });

    this.registerResource('userData', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      resourceType: 'userData',
      useSingleEndpoint: true
    });

    // Timeline, clients, packages, members also use single endpoint (will be added when business info is set)
    this.registerResource('timeline', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      requiresDateRange: true,
      resourceType: 'timeline',
      useSingleEndpoint: true,
      supportedQueryParams: ['startDate', 'endDate', 'status', 'clientId', 'serviceId', 'medicId'],
      searchableFields: ['clientName', 'displayTreatment', 'medicName'],
      filterableFields: ['status', 'clientId', 'serviceId', 'medicId', 'date'],
      sortableFields: ['date', 'clientName', 'displayTreatment']
    });

    this.registerResource('clients', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      supportsPagination: true,
      resourceType: 'clients',
      useSingleEndpoint: true,
      supportedQueryParams: ['search', 'name', 'email', 'phone', 'status', 'businessType', 'page', 'limit', 'sortBy', 'sortOrder'],
      searchableFields: ['name', 'email', 'phone', 'address'],
      filterableFields: ['status', 'businessType', 'gender', 'ageGroup'],
      sortableFields: ['name', 'email', 'createdAt', 'lastVisit']
    });

    this.registerResource('packages', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      resourceType: 'packages',
      useSingleEndpoint: true,
      supportedQueryParams: ['search', 'name', 'category', 'status', 'minPrice', 'maxPrice', 'sortBy', 'sortOrder'],
      searchableFields: ['name', 'description'],
      filterableFields: ['category', 'status', 'businessType'],
      sortableFields: ['name', 'price', 'duration', 'createdAt']
    });

    this.registerResource('members', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true,
      supportsPagination: true,
      resourceType: 'members',
      useSingleEndpoint: true,
      supportedQueryParams: ['search', 'name', 'email', 'phone', 'membershipType', 'status', 'page', 'limit', 'sortBy', 'sortOrder'],
      searchableFields: ['name', 'email', 'phone'],
      filterableFields: ['membershipType', 'status', 'gender'],
      sortableFields: ['name', 'email', 'joinedAt', 'expiresAt']
    });

    // Business info - read-only endpoint /api/businessInfo/{businessId}
    this.registerResource('businessInfo', {
      enableOffline: true,
      requiresAuth: false,
      forceServerFetch: true,
      useSingleEndpoint: false,
      readOnly: true,
      apiEndpoints: {
        get: '/api/businessInfo/:businessId'
      }
    });

    // Auth - separate endpoint /api/auth
    this.registerResource('auth', {
      enableOffline: false,
      requiresAuth: false,
      forceServerFetch: true,
      useSingleEndpoint: false,
      apiEndpoints: {
        post: '/api/auth'
      }
    });
  }

  /**
   * Set business info and configure endpoint identifiers
   * @param {Object} businessInfo - Business information including businessId and locationId
   */
  setBusinessInfo(businessInfo) {
    this.businessInfo = businessInfo;
    
    // Extract business and location IDs for the single endpoint pattern
    if (businessInfo && businessInfo.business) {
      this.businessId = businessInfo.business.id || businessInfo.business.businessId;
    }
    
    if (businessInfo && businessInfo.location) {
      this.locationId = businessInfo.location.id || businessInfo.location.locationId;
    }

    console.log(`Business info set - Business ID: ${this.businessId}, Location ID: ${this.locationId}`);
    eventBus.emit('datasync:business-info-set', { 
      businessInfo, 
      businessId: this.businessId, 
      locationId: this.locationId 
    });
  }

  /**
   * Get the single endpoint URL pattern
   * @returns {string} The endpoint URL pattern for resources
   */
  getSingleEndpointUrl() {
    if (!this.businessId || !this.locationId) {
      throw new Error('Business ID and Location ID must be set before accessing resources');
    }
    return `/api/resources/${this.businessId}-${this.locationId}`;
  }

  /**
   * Check if single endpoint is ready (business and location IDs are set)
   * @returns {boolean} True if single endpoint can be used
   */
  isSingleEndpointReady() {
    return !!(this.businessId && this.locationId);
  }

  /**
   * Register a resource with its sync configuration
   * @param {string} resourceName - Resource name
   * @param {Object} config - Sync configuration
   */
  registerResource(resourceName, config) {
    const defaultConfig = {
      enableOffline: true,
      maxOfflineAge: 24 * 60 * 60 * 1000, // 24 hours
      priority: 'normal', // 'high', 'normal', 'low'
      socketEvents: [],
      forceServerFetch: false,
      requiresDateRange: false,
      supportsPagination: false,
      currentDayOnly: false,
      useSingleEndpoint: false, // New flag to indicate if resource uses single endpoint
      resourceType: null, // Type identifier for single endpoint requests
      // Query parameter configuration
      supportedQueryParams: [], // List of supported query parameters
      searchableFields: [], // Fields that can be searched (name, email, phone, etc.)
      filterableFields: [], // Fields that can be filtered by value
      sortableFields: [], // Fields that can be sorted by
      apiEndpoints: {
        get: null,
        post: null,
        put: null,
        delete: null
      }
    };

    this.resources.set(resourceName, { ...defaultConfig, ...config });
  }

  /**
   * Get resource configuration
   * @param {string} resourceName - Resource name
   */
  getResource(resourceName) {
    return this.resources.get(resourceName);
  }

  /**
   * Get all registered resources
   */
  getAllResources() {
    return Array.from(this.resources.keys());
  }

  /**
   * Check if resource exists
   * @param {string} resourceName - Resource name
   */
  hasResource(resourceName) {
    return this.resources.has(resourceName);
  }

  /**
   * Get business ID
   * @returns {string|null} Business ID
   */
  getBusinessId() {
    return this.businessId;
  }

  /**
   * Get location ID
   * @returns {string|null} Location ID
   */
  getLocationId() {
    return this.locationId;
  }

  /**
   * Get business info
   * @returns {Object|null} Business information object
   */
  getBusinessInfo() {
    return this.businessInfo;
  }

  /**
   * Get business type from business info (for backward compatibility)
   * @returns {string|null} Business type key (dental, gym, hotel)
   */
  getBusinessType() {
    if (!this.businessInfo || !this.businessInfo.business) {
      return null;
    }
    
    // Extract business type from business info
    const businessTypeName = this.businessInfo.business.type || this.businessInfo.business.businessType;
    
    // Map business type names to keys (for compatibility with existing code)
    const typeMap = {
      'Dental Clinic': 'dental',
      'Gym': 'gym',
      'Hotel': 'hotel'
    };
    
    return typeMap[businessTypeName] || businessTypeName?.toLowerCase() || null;
  }

  /**
   * Validate and filter query parameters for a resource
   * @param {string} resourceName - Resource name
   * @param {Object} queryParams - Query parameters to validate
   * @returns {Object} Filtered and validated query parameters
   */
  validateQueryParams(resourceName, queryParams = {}) {
    const resource = this.getResource(resourceName);
    if (!resource) {
      console.warn(`Resource ${resourceName} not found`);
      return {};
    }

    const validParams = {};
    const { supportedQueryParams = [] } = resource;

    // Always allow basic pagination and date range parameters
    const alwaysAllowed = ['page', 'limit', 'sortBy', 'sortOrder', 'startDate', 'endDate'];
    const allowedParams = [...supportedQueryParams, ...alwaysAllowed];

    // Filter only supported parameters
    Object.keys(queryParams).forEach(key => {
      if (allowedParams.includes(key) && queryParams[key] !== undefined && queryParams[key] !== null && queryParams[key] !== '') {
        validParams[key] = queryParams[key];
      }
    });

    return validParams;
  }

  /**
   * Build search query parameters for a resource
   * @param {string} resourceName - Resource name
   * @param {string} searchTerm - Search term
   * @returns {Object} Search query parameters
   */
  buildSearchQuery(resourceName, searchTerm) {
    const resource = this.getResource(resourceName);
    if (!resource || !searchTerm) {
      return {};
    }

    const { searchableFields = [] } = resource;
    
    if (searchableFields.length === 0) {
      // If no specific searchable fields, use generic search parameter
      return { search: searchTerm };
    }

    // For resources with specific searchable fields, we can build field-specific queries
    // This depends on how the backend handles search - this is a flexible approach
    return { 
      search: searchTerm,
      searchFields: searchableFields.join(',')
    };
  }

  /**
   * Get supported query parameters for a resource
   * @param {string} resourceName - Resource name
   * @returns {Object} Object containing supported parameters by category
   */
  getSupportedQueryParams(resourceName) {
    const resource = this.getResource(resourceName);
    if (!resource) {
      return {
        supported: [],
        searchable: [],
        filterable: [],
        sortable: []
      };
    }

    return {
      supported: resource.supportedQueryParams || [],
      searchable: resource.searchableFields || [],
      filterable: resource.filterableFields || [],
      sortable: resource.sortableFields || []
    };
  }
}

export function createResourceRegistry() {
  return new ResourceRegistry();
} 