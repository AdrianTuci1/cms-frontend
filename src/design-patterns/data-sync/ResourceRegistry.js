/**
 * Resource Registry - Manages resource configurations and registrations
 */

import eventBus from '../observer/base/EventBus';

class ResourceRegistry {
  constructor() {
    this.resources = new Map();
    this.businessType = null;
    this.businessInfo = null;
  }

  /**
   * Initialize all API resources based on requests.md structure
   */
  initializeGeneralResources() {
    // General resources (with JWT) - filtered for current day only
    this.registerResource('invoices', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      currentDayOnly: true, // Filter for current day only
      apiEndpoints: {
        get: '/invoices',
        post: '/invoices',
        put: '/invoices/:id',
        delete: '/invoices/:id'
      }
    });

    this.registerResource('stocks', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      currentDayOnly: true, // Filter for current day only
      apiEndpoints: {
        get: '/stocks',
        post: '/stocks',
        put: '/stocks/:id',
        delete: '/stocks/:id'
      }
    });

    this.registerResource('sales', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      currentDayOnly: true, // Filter for current day only
      apiEndpoints: {
        get: '/sales',
        post: '/sales',
        put: '/sales/:id',
        delete: '/sales/:id'
      }
    });

    this.registerResource('agent', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      apiEndpoints: {
        get: '/agent',
        post: '/agent',
        put: '/agent/:id',
        delete: '/agent/:id'
      }
    });

    this.registerResource('history', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      currentDayOnly: true, // Filter for current day only
      apiEndpoints: {
        get: '/history',
        post: '/history',
        put: '/history/:id',
        delete: '/history/:id'
      }
    });

    this.registerResource('workflows', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      apiEndpoints: {
        get: '/workflows',
        post: '/workflows',
        put: '/workflows/:id',
        delete: '/workflows/:id'
      }
    });

    this.registerResource('reports', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      apiEndpoints: {
        get: '/reports',
        post: '/reports',
        put: '/reports/:id',
        delete: '/reports/:id'
      }
    });

    this.registerResource('roles', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      apiEndpoints: {
        get: '/roles',
        post: '/roles',
        put: '/roles/:id',
        delete: '/roles/:id'
      }
    });

    this.registerResource('permissions', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      apiEndpoints: {
        get: '/permissions',
        post: '/permissions',
        put: '/permissions/:id',
        delete: '/permissions/:id'
      }
    });

    this.registerResource('userData', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      apiEndpoints: {
        get: '/userData',
        post: '/userData',
        put: '/userData/:id',
        delete: '/userData/:id'
      }
    });

    // Business info (without JWT)
    this.registerResource('businessInfo', {
      enableOffline: true,
      requiresAuth: false,
      forceServerFetch: true, // Always fetch from server
      apiEndpoints: {
        get: '/business-info'
      }
    });

    // Auth (without JWT)
    this.registerResource('auth', {
      enableOffline: false,
      requiresAuth: false,
      forceServerFetch: true, // Always fetch from server
      apiEndpoints: {
        post: '/auth'
      }
    });
  }

  /**
   * Set business type and register business-specific resources
   * @param {string} businessType - Business type (dental, gym, hotel, etc.)
   */
  setBusinessType(businessType) {
    this.businessType = businessType;
    
    // Register business-specific resources
    this.registerResource('timeline', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      requiresDateRange: true, // Requires startDate and endDate parameters
      apiEndpoints: {
        get: `/${businessType}/timeline`,
        post: `/${businessType}/timeline`,
        put: `/${businessType}/timeline/:id`,
        delete: `/${businessType}/timeline/:id`
      }
    });

    this.registerResource('clients', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      supportsPagination: true, // Supports pagination
      apiEndpoints: {
        get: `/${businessType}/clients`,
        post: `/${businessType}/clients`,
        put: `/${businessType}/clients/:id`,
        delete: `/${businessType}/clients/:id`
      }
    });

    this.registerResource('packages', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      apiEndpoints: {
        get: `/${businessType}/packages`,
        post: `/${businessType}/packages`,
        put: `/${businessType}/packages/:id`,
        delete: `/${businessType}/packages/:id`
      }
    });

    this.registerResource('members', {
      enableOffline: true,
      requiresAuth: true,
      forceServerFetch: true, // Always fetch from server
      supportsPagination: true, // Supports pagination
      apiEndpoints: {
        get: `/${businessType}/members`,
        post: `/${businessType}/members`,
        put: `/${businessType}/members/:id`,
        delete: `/${businessType}/members/:id`
      }
    });

    console.log(`Business type set to: ${businessType}`);
    eventBus.emit('datasync:business-type-set', { businessType });
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
      forceServerFetch: false, // Default to false, will be overridden for specific resources
      requiresDateRange: false, // Default to false, will be overridden for timeline
      supportsPagination: false, // Default to false, will be overridden for clients/members
      currentDayOnly: false, // Default to false, will be overridden for invoices, stocks, sales, history
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
   * Get business type
   */
  getBusinessType() {
    return this.businessType;
  }

  /**
   * Set business info
   * @param {Object} businessInfo - Business information
   */
  setBusinessInfo(businessInfo) {
    this.businessInfo = businessInfo;
  }

  /**
   * Get business info
   */
  getBusinessInfo() {
    return this.businessInfo;
  }
}

export function createResourceRegistry() {
  return new ResourceRegistry();
} 