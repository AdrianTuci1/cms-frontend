/**
 * Tenant Configuration
 * 
 * Manages tenant-specific configuration and environment variables
 */

// Environment variables
export const ENV_CONFIG = {
  VITE_TENANT_ID: import.meta.env.VITE_TENANT_ID || 'T0001',
  VITE_BUSINESS_TYPE: import.meta.env.VITE_BUSINESS_TYPE || 'dental'
};

// Tenant configuration mapping
export const TENANT_CONFIG = {
  'T0001': {
    id: 'T0001',
    businessType: 'dental',
    name: 'Dental Clinic Mock',
    tenantId: 'T0001',
    description: 'Mock dental clinic for development and testing',
    features: ['appointments', 'treatments', 'consultations', 'invoices'],
    defaultLocation: 'T0001-01'
  },
  'T0002': {
    id: 'T0002', 
    businessType: 'gym',
    name: 'Fitness Center Mock',
    tenantId: 'T0002',
    description: 'Mock fitness center for development and testing',
    features: ['memberships', 'classes', 'personal_training', 'invoices'],
    defaultLocation: 'T0002-01'
  },
  'T0003': {
    id: 'T0003',
    businessType: 'hotel', 
    name: 'Hotel Mock',
    tenantId: 'T0003',
    description: 'Mock hotel for development and testing',
    features: ['reservations', 'rooms', 'conference', 'spa'],
    defaultLocation: 'T0003-01'
  }
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
   * Get tenant configuration by ID
   */
  getTenantConfig(tenantId = null) {
    const currentTenantId = tenantId || this.getCurrentTenantId();
    return TENANT_CONFIG[currentTenantId] || TENANT_CONFIG['T0001'];
  },

  /**
   * Get business type by tenant ID
   */
  getBusinessTypeByTenant(tenantId = null) {
    const config = this.getTenantConfig(tenantId);
    return config.businessType;
  },

  /**
   * Get tenant ID by business type
   */
  getTenantIdByBusinessType(businessType) {
    const tenant = Object.values(TENANT_CONFIG).find(config => 
      config.businessType === businessType
    );
    return tenant ? tenant.tenantId : 'T0001';
  },

  /**
   * Validate tenant ID
   */
  isValidTenantId(tenantId) {
    return Object.keys(TENANT_CONFIG).includes(tenantId);
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
    return Object.values(TENANT_CONFIG);
  },

  /**
   * Get all business types
   */
  getAllBusinessTypes() {
    return Object.values(TENANT_CONFIG).map(config => config.businessType);
  },

  /**
   * Check if feature is enabled for current tenant
   */
  isFeatureEnabled(feature, tenantId = null) {
    const config = this.getTenantConfig(tenantId);
    return config.features.includes(feature);
  },

  /**
   * Get all features for current tenant
   */
  getTenantFeatures(tenantId = null) {
    const config = this.getTenantConfig(tenantId);
    return config.features;
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
  TENANT_CONFIG,
  tenantUtils,
  locationUtils,
  resourceUtils
}; 