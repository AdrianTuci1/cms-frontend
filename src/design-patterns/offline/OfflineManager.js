/**
 * Offline Manager for handling offline capabilities and feature availability
 * Manages which features are available offline and provides offline indicators
 */
import eventBus from '../observer/base/EventBus';

class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.featureAvailability = new Map();
    this.offlineIndicators = new Map();
    this.offlineData = new Map();
    
    this.setupNetworkListeners();
    this.initializeFeatureAvailability();
  }

  /**
   * Setup network status listeners
   */
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateFeatureAvailability();
      eventBus.emit('offline:online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateFeatureAvailability();
      eventBus.emit('offline:offline');
    });
  }

  /**
   * Initialize feature availability configuration
   */
  initializeFeatureAvailability() {
    // Define which features are available offline
    this.featureAvailability.set('timelines', {
      online: true,
      offline: true,
      offlineData: true, // Can access cached timeline data
      syncOnReconnect: true
    });

    this.featureAvailability.set('aiAssistant', {
      online: true,
      offline: false, // AI Assistant disabled offline
      offlineData: false,
      syncOnReconnect: false
    });

    this.featureAvailability.set('history', {
      online: true,
      offline: true,
      offlineData: true,
      syncOnReconnect: true
    });

    this.featureAvailability.set('stocks', {
      online: true,
      offline: true,
      offlineData: true,
      syncOnReconnect: true
    });

    this.featureAvailability.set('invoices', {
      online: true,
      offline: true,
      offlineData: true,
      syncOnReconnect: true
    });

    this.featureAvailability.set('automations', {
      online: true,
      offline: false,
      offlineData: false,
      syncOnReconnect: false
    });

    this.featureAvailability.set('admin', {
      online: true,
      offline: false,
      offlineData: false,
      syncOnReconnect: false
    });

    this.updateFeatureAvailability();
  }

  /**
   * Update feature availability based on network status
   */
  updateFeatureAvailability() {
    for (const [feature, config] of this.featureAvailability) {
      const isAvailable = this.isOnline ? config.online : config.offline;
      const hasOfflineData = config.offlineData;
      
      this.featureAvailability.set(feature, {
        ...config,
        isAvailable,
        hasOfflineData,
        lastUpdated: new Date().toISOString()
      });

      // Emit availability change event
      eventBus.emit('offline:feature-availability-changed', {
        feature,
        isAvailable,
        hasOfflineData,
        isOnline: this.isOnline
      });
    }
  }

  /**
   * Check if a feature is available
   * @param {string} feature - Feature name
   * @returns {boolean} True if feature is available
   */
  isFeatureAvailable(feature) {
    const config = this.featureAvailability.get(feature);
    return config ? config.isAvailable : false;
  }

  /**
   * Check if a feature has offline data
   * @param {string} feature - Feature name
   * @returns {boolean} True if feature has offline data
   */
  hasOfflineData(feature) {
    const config = this.featureAvailability.get(feature);
    return config ? config.hasOfflineData : false;
  }

  /**
   * Get all available features
   * @returns {Array} Array of available feature names
   */
  getAvailableFeatures() {
    return Array.from(this.featureAvailability.entries())
      .filter(([_, config]) => config.isAvailable)
      .map(([feature, _]) => feature);
  }

  /**
   * Get all unavailable features
   * @returns {Array} Array of unavailable feature names
   */
  getUnavailableFeatures() {
    return Array.from(this.featureAvailability.entries())
      .filter(([_, config]) => !config.isAvailable)
      .map(([feature, _]) => feature);
  }

  /**
   * Register an offline indicator for a feature
   * @param {string} feature - Feature name
   * @param {Function} indicator - Indicator function
   */
  registerOfflineIndicator(feature, indicator) {
    this.offlineIndicators.set(feature, indicator);
  }

  /**
   * Show offline indicator for a feature
   * @param {string} feature - Feature name
   * @param {Object} options - Indicator options
   */
  showOfflineIndicator(feature, options = {}) {
    const indicator = this.offlineIndicators.get(feature);
    if (indicator) {
      indicator({
        feature,
        isOnline: this.isOnline,
        hasOfflineData: this.hasOfflineData(feature),
        ...options
      });
    }
  }

  /**
   * Hide offline indicator for a feature
   * @param {string} feature - Feature name
   */
  hideOfflineIndicator(feature) {
    const indicator = this.offlineIndicators.get(feature);
    if (indicator) {
      indicator({ feature, hide: true });
    }
  }

  /**
   * Store offline data for a feature
   * @param {string} feature - Feature name
   * @param {Object} data - Data to store
   */
  storeOfflineData(feature, data) {
    const config = this.featureAvailability.get(feature);
    if (!config || !config.offlineData) return;

    this.offlineData.set(feature, {
      data,
      timestamp: new Date().toISOString(),
      version: (this.offlineData.get(feature)?.version || 0) + 1
    });

    eventBus.emit('offline:data-stored', { feature, data });
  }

  /**
   * Get offline data for a feature
   * @param {string} feature - Feature name
   * @returns {Object|null} Offline data or null
   */
  getOfflineData(feature) {
    const config = this.featureAvailability.get(feature);
    if (!config || !config.offlineData) return null;

    const offlineData = this.offlineData.get(feature);
    return offlineData ? offlineData.data : null;
  }

  /**
   * Clear offline data for a feature
   * @param {string} feature - Feature name
   */
  clearOfflineData(feature) {
    this.offlineData.delete(feature);
    eventBus.emit('offline:data-cleared', { feature });
  }

  /**
   * Get offline status summary
   * @returns {Object} Offline status information
   */
  getOfflineStatus() {
    return {
      isOnline: this.isOnline,
      availableFeatures: this.getAvailableFeatures(),
      unavailableFeatures: this.getUnavailableFeatures(),
      featuresWithOfflineData: Array.from(this.offlineData.keys()),
      totalFeatures: this.featureAvailability.size
    };
  }

  /**
   * Handle feature access attempt
   * @param {string} feature - Feature name
   * @param {Object} options - Access options
   */
  handleFeatureAccess(feature, options = {}) {
    const isAvailable = this.isFeatureAvailable(feature);
    
    if (!isAvailable) {
      this.showOfflineIndicator(feature, {
        message: options.message || `${feature} is not available offline`,
        type: 'error'
      });

      eventBus.emit('offline:feature-access-denied', {
        feature,
        reason: 'offline-unavailable'
      });

      return false;
    }

    // If offline and feature has offline data, show offline indicator
    if (!this.isOnline && this.hasOfflineData(feature)) {
      this.showOfflineIndicator(feature, {
        message: `Using offline data for ${feature}`,
        type: 'warning'
      });
    }

    eventBus.emit('offline:feature-access-granted', {
      feature,
      hasOfflineData: this.hasOfflineData(feature)
    });

    return true;
  }

  /**
   * Setup automatic offline data management
   */
  setupAutomaticManagement() {
    // Listen for data changes and store offline data
    eventBus.on('timeline:updated', (data) => {
      this.storeOfflineData('timelines', data);
    });

    eventBus.on('history:updated', (data) => {
      this.storeOfflineData('history', data);
    });

    eventBus.on('stocks:updated', (data) => {
      this.storeOfflineData('stocks', data);
    });

    eventBus.on('invoices:updated', (data) => {
      this.storeOfflineData('invoices', data);
    });

    // Listen for sync completion and clear offline indicators
    eventBus.on('datasync:synced', ({ resource }) => {
      this.hideOfflineIndicator(resource);
    });

    // Listen for network changes and update indicators
    eventBus.on('offline:online', () => {
      // Hide all offline indicators when coming back online
      for (const feature of this.featureAvailability.keys()) {
        this.hideOfflineIndicator(feature);
      }
    });

    eventBus.on('offline:offline', () => {
      // Show offline indicators for unavailable features
      for (const feature of this.getUnavailableFeatures()) {
        this.showOfflineIndicator(feature, {
          message: `${feature} is not available offline`,
          type: 'error'
        });
      }
    });
  }

  /**
   * Get feature configuration
   * @param {string} feature - Feature name
   * @returns {Object|null} Feature configuration
   */
  getFeatureConfig(feature) {
    return this.featureAvailability.get(feature) || null;
  }

  /**
   * Update feature configuration
   * @param {string} feature - Feature name
   * @param {Object} config - New configuration
   */
  updateFeatureConfig(feature, config) {
    const currentConfig = this.featureAvailability.get(feature);
    if (currentConfig) {
      this.featureAvailability.set(feature, { ...currentConfig, ...config });
      this.updateFeatureAvailability();
    }
  }

  /**
   * Register a new feature
   * @param {string} feature - Feature name
   * @param {Object} config - Feature configuration
   */
  registerFeature(feature, config) {
    this.featureAvailability.set(feature, {
      online: true,
      offline: false,
      offlineData: false,
      syncOnReconnect: false,
      ...config
    });
    this.updateFeatureAvailability();
  }
}

// Create singleton instance
const offlineManager = new OfflineManager();

// Setup automatic management
offlineManager.setupAutomaticManagement();

export default offlineManager; 