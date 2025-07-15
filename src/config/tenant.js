/**
 * Tenant Configuration
 * 
 * Manages tenant-specific configuration and environment variables
 */

import { getDemoBusinessInfo, getDemoUserData } from '../mockData/index.js';

// Environment variables
export const ENV_CONFIG = {
  VITE_TENANT_ID: import.meta.env.VITE_TENANT_ID || 'T0001',
  VITE_BUSINESS_TYPE: import.meta.env.VITE_BUSINESS_TYPE || 'dental',
  VITE_TEST_MODE: import.meta.env.VITE_TEST_MODE === 'true'
};

/**
 * Tenant utilities
 */
export const tenantUtils = {
  /**
   * Get current tenant ID from environment
   */
  getCurrentTenantId() {
    return ENV_CONFIG.VITE_TENANT_ID;
  },

  /**
   * Get current business type from environment
   */
  getCurrentBusinessType() {
    return ENV_CONFIG.VITE_BUSINESS_TYPE;
  },

  /**
   * Check if we're in test mode
   */
  isTestMode() {
    return ENV_CONFIG.VITE_TEST_MODE;
  },

  /**
   * Get demo business info for test mode
   * @param {string} businessType - Business type (dental, gym, hotel)
   * @returns {Object} Demo business info
   */
  getDemoBusinessInfo(businessType = null) {
    const currentBusinessType = businessType || this.getCurrentBusinessType();
    return getDemoBusinessInfo(currentBusinessType);
  },

  /**
   * Get demo user data for test mode
   * @param {string} businessType - Business type (dental, gym, hotel)
   * @returns {Object} Demo user data
   */
  getDemoUserData(businessType = null) {
    const currentBusinessType = businessType || this.getCurrentBusinessType();
    return getDemoUserData(currentBusinessType);
  },

  /**
   * Get tenant configuration by ID (derived from demo data)
   */
  getTenantConfig(tenantId = null) {
    const currentTenantId = tenantId || this.getCurrentTenantId();
    const businessType = this.getBusinessTypeByTenant(currentTenantId);
    const demoInfo = this.getDemoBusinessInfo(businessType);
    
    return {
      id: currentTenantId,
      businessType: businessType,
      name: demoInfo.business.name,
      tenantId: currentTenantId,
      description: demoInfo.business.description,
      features: Object.keys(demoInfo.features).filter(key => demoInfo.features[key]),
      defaultLocation: demoInfo.location.id
    };
  },

  /**
   * Get business type by tenant ID
   */
  getBusinessTypeByTenant(tenantId) {
    const tenantMap = {
      'T0001': 'dental',
      'T0002': 'gym', 
      'T0003': 'hotel'
    };
    return tenantMap[tenantId] || 'dental';
  },

  /**
   * Get tenant ID by business type
   */
  getTenantIdByBusinessType(businessType) {
    const businessTypeMap = {
      'dental': 'T0001',
      'gym': 'T0002',
      'hotel': 'T0003'
    };
    return businessTypeMap[businessType] || 'T0001';
  },

  /**
   * Validate tenant ID
   */
  isValidTenantId(tenantId) {
    const validTenants = ['T0001', 'T0002', 'T0003'];
    return validTenants.includes(tenantId);
  },

  /**
   * Get default location for tenant
   */
  getDefaultLocation(tenantId = null) {
    const config = this.getTenantConfig(tenantId);
    return config.defaultLocation;
  },

  /**
   * Get all available tenants
   */
  getAllTenants() {
    return [
      { id: 'T0001', businessType: 'dental', name: 'Demo Dental Clinic' },
      { id: 'T0002', businessType: 'gym', name: 'Demo Fitness Center' },
      { id: 'T0003', businessType: 'hotel', name: 'Demo Hotel' }
    ];
  },

  /**
   * Get all business types
   */
  getAllBusinessTypes() {
    return ['dental', 'gym', 'hotel'];
  },

  /**
   * Check if feature is enabled for current tenant
   */
  isFeatureEnabled(feature, tenantId = null) {
    const businessType = this.getBusinessTypeByTenant(tenantId);
    const demoInfo = this.getDemoBusinessInfo(businessType);
    return demoInfo.features[feature] || false;
  },

  /**
   * Get all features for current tenant
   */
  getTenantFeatures(tenantId = null) {
    const businessType = this.getBusinessTypeByTenant(tenantId);
    const demoInfo = this.getDemoBusinessInfo(businessType);
    return Object.keys(demoInfo.features).filter(key => demoInfo.features[key]);
  }
};

/**
 * Location utilities
 */
export const locationUtils = {
  /**
   * Generate location ID for tenant
   */
  generateLocationId(tenantId, locationNumber = 1) {
    return `${tenantId}-${String(locationNumber).padStart(2, '0')}`;
  },

  /**
   * Parse location ID to get tenant and location number
   */
  parseLocationId(locationId) {
    const parts = locationId.split('-');
    if (parts.length >= 2) {
      return {
        tenantId: parts[0],
        locationNumber: parseInt(parts[1]),
        fullLocationId: locationId
      };
    }
    return null;
  },

  /**
   * Validate location ID format
   */
  isValidLocationId(locationId) {
    const parsed = this.parseLocationId(locationId);
    return parsed !== null && tenantUtils.isValidTenantId(parsed.tenantId);
  },

  /**
   * Get all location IDs for tenant
   */
  getLocationIdsForTenant(tenantId) {
    const config = tenantUtils.getTenantConfig(tenantId);
    // For now, return default location. This can be expanded based on business info
    return [config.defaultLocation];
  }
};

/**
 * Resource ID utilities
 */
export const resourceUtils = {
  /**
   * Generate resource document ID with tenant and location
   * Composed key format: {tenantId}-{locationId}
   */
  generateDocumentId(tenantId, locationId, resourceType) {
    return `${locationId}`;
  },

  /**
   * Generate resource ID with tenant and location
   * Resource item format: {locationId}-{resourceType}-{resourceNumber}
   */
  generateResourceId(tenantId, locationId, resourceType, resourceNumber = 1) {
    return `${locationId}-${resourceType.toUpperCase()}-${String(resourceNumber).padStart(3, '0')}`;
  },

  /**
   * Parse resource document ID to get components
   * Document ID format: {tenantId}-{locationNumber}
   */
  parseDocumentId(documentId) {
    const parts = documentId.split('-');
    if (parts.length >= 2) {
      return {
        tenantId: parts[0],
        locationNumber: parseInt(parts[1]),
        locationId: documentId,
        fullDocumentId: documentId
      };
    }
    return null;
  },

  /**
   * Parse resource ID to get components
   */
  parseResourceId(resourceId) {
    const parts = resourceId.split('-');
    if (parts.length >= 4) {
      return {
        tenantId: parts[0],
        locationNumber: parseInt(parts[1]),
        locationId: `${parts[0]}-${parts[1]}`,
        resourceType: parts[2],
        resourceNumber: parseInt(parts[3]),
        fullResourceId: resourceId
      };
    }
    return null;
  },

  /**
   * Validate resource document ID format
   */
  isValidDocumentId(documentId) {
    const parsed = this.parseDocumentId(documentId);
    return parsed !== null && tenantUtils.isValidTenantId(parsed.tenantId);
  },

  /**
   * Validate resource ID format
   */
  isValidResourceId(resourceId) {
    const parsed = this.parseResourceId(resourceId);
    return parsed !== null && tenantUtils.isValidTenantId(parsed.tenantId);
  },

  /**
   * Generate sharded document structure
   */
  generateShardedDocument(tenantId, locationId, resourceType, data, dateRange = null) {
    const documentId = this.generateDocumentId(tenantId, locationId, resourceType);
    const timestamp = new Date().toISOString();
    
    return {
      id: documentId,
      tenantId,
      locationId,
      resourceType: resourceType.toUpperCase(),
      dateRange: dateRange || {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      },
      data,
      _syncTimestamp: timestamp,
      _lastModified: timestamp,
      _version: 1
    };
  },

  /**
   * Extract data from sharded document
   */
  extractDataFromDocument(document) {
    if (!document || !document.data) {
      return null;
    }
    return document.data;
  },

  /**
   * Check if document is a sharded document
   */
  isShardedDocument(document) {
    return document && 
           document.id && 
           document.tenantId && 
           document.locationId && 
           document.resourceType && 
           document.data !== undefined;
  }
};

export default {
  ENV_CONFIG,
  tenantUtils,
  locationUtils,
  resourceUtils
}; 