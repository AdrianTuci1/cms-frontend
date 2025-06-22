// Core API Components
export { httpClient } from './core/HttpClient.js';
export { offlineQueue } from './core/OfflineQueue.js';
export { networkMonitor } from './core/NetworkMonitor.js';

// API Factory
export { apiClientFactory } from './factories/ApiClientFactory.js';

// Business Strategies
export { 
  DentalClinicStrategy, 
  GymStrategy, 
  HotelStrategy 
} from './strategies/BusinessStrategy.js';

// API Services
export { default as CalendarService } from './services/CalendarService.js';
export { default as ClientsService } from './services/ClientsService.js';
export { default as ServicesService } from './services/ServicesService.js';
export { default as HistoryService } from './services/HistoryService.js';
export { default as StocksService } from './services/StocksService.js';
export { default as EmployeesService } from './services/EmployeesService.js';
export { default as InvoicesService } from './services/InvoicesService.js';

// Base Service
export { default as BaseApiService } from './services/BaseApiService.js';

// Types and Constants
export * from './types.js';

/**
 * Main API Manager Class
 * Provides a unified interface for all API operations
 */
class ApiManager {
  constructor() {
    if (ApiManager.instance) {
      return ApiManager.instance;
    }
    
    this.services = new Map();
    this.currentTenantId = null;
    this.currentLocationId = null;
    this.currentBusinessType = null;
    this.apiClient = null;
    this.authManager = null;
    
    ApiManager.instance = this;
  }

  /**
   * Set AuthManager reference for getting tenant/location IDs
   * @param {Object} authManager - AuthManager instance
   */
  setAuthManager(authManager) {
    this.authManager = authManager;
  }

  /**
   * Get tenant and location IDs from AuthService
   * @returns {Object} Object with tenantId and locationId
   */
  getAuthIds() {
    if (!this.authManager) {
      throw new Error('AuthManager not set. Call setAuthManager() first.');
    }

    // Get tenantId from environment variable via AuthService
    const tenantId = this.authManager.getTenantId();
    
    // Get current locationId from AuthService
    const locationId = this.authManager.getCurrentLocationId();
    
    if (!locationId) {
      throw new Error('No location selected. Please select a location first.');
    }

    // Get user for businessType
    const user = this.authManager.getUser();
    if (!user) {
      throw new Error('User not authenticated. Please login first.');
    }

    return {
      tenantId,
      locationId,
      businessType: user.businessType
    };
  }

  /**
   * Initialize API Manager with authentication data
   * @param {Object} config - Configuration options
   * @returns {Promise<Object>} Initialization result
   */
  async initializeWithAuth(config = {}) {
    try {
      const { tenantId, locationId, businessType } = this.getAuthIds();
      return this.initialize(tenantId, locationId, businessType, config);
    } catch (error) {
      throw new Error(`Failed to initialize API Manager with auth: ${error.message}`);
    }
  }

  /**
   * Initialize API Manager
   * @param {number} tenantId - Tenant ID
   * @param {number} locationId - Location ID
   * @param {string} businessType - Business type
   * @param {Object} config - Configuration
   */
  initialize(tenantId, locationId, businessType = null, config = {}) {
    this.currentTenantId = tenantId;
    this.currentLocationId = locationId;
    this.currentBusinessType = businessType;
    
    // Create API client
    this.apiClient = apiClientFactory.createApiClient(businessType, config);
    
    // Initialize services
    this.initializeServices();
    
    // Start network monitoring
    networkMonitor.subscribe(this.handleNetworkChange.bind(this));
  }

  /**
   * Initialize all API services
   */
  initializeServices() {
    // Calendar Service
    this.services.set('calendar', new CalendarService(this.apiClient, this.currentTenantId, this.currentLocationId
    ));
    
    // Clients Service
    this.services.set('clients', new ClientsService(this.apiClient, this.currentTenantId, this.currentLocationId
    ));

    // Services Service
    this.services.set('services', new ServicesService(this.apiClient, this.currentTenantId, this.currentLocationId
    ));

    // History Service
    this.services.set('history', new HistoryService(this.apiClient, this.currentTenantId, this.currentLocationId
    ));

    // Stocks Service
    this.services.set('stocks', new StocksService(this.apiClient, this.currentTenantId, this.currentLocationId
    ));

    // Employees Service
    this.services.set('employees', new EmployeesService(this.apiClient, this.currentTenantId, this.currentLocationId
    ));

    // Invoices Service
    this.services.set('invoices', new InvoicesService(this.apiClient, this.currentTenantId, this.currentLocationId
    ));
  }

  /**
   * Get service by name
   * @param {string} serviceName - Service name
   * @returns {BaseApiService} Service instance
   */
  getService(serviceName) {
    const service = this.services.get(serviceName);
    
    if (!service) {
      throw new Error(`Service not found: ${serviceName}`);
    }
    
    return service;
  }

  /**
   * Get calendar service
   * @returns {CalendarService} Calendar service
   */
  get calendar() {
    return this.getService('calendar');
  }

  /**
   * Get clients service
   * @returns {ClientsService} Clients service
   */
  get clients() {
    return this.getService('clients');
  }

  /**
   * Get services service
   * @returns {ServicesService} Services service
   */
  get services() {
    return this.getService('services');
  }

  /**
   * Get history service
   * @returns {HistoryService} History service
   */
  get history() {
    return this.getService('history');
  }

  /**
   * Get stocks service
   * @returns {StocksService} Stocks service
   */
  get stocks() {
    return this.getService('stocks');
  }

  /**
   * Get employees service
   * @returns {EmployeesService} Employees service
   */
  get employees() {
    return this.getService('employees');
  }

  /**
   * Get invoices service
   * @returns {InvoicesService} Invoices service
   */
  get invoices() {
    return this.getService('invoices');
  }

  /**
   * Get business-specific data types
   * @returns {Object} Data types for current business
   */
  getDataTypes() {
    if (!this.apiClient) {
      throw new Error('API Manager not initialized');
    }

    const strategy = this.apiClient.getStrategy();
    return {
      calendar: strategy.getCalendarDataType(),
      clients: strategy.getClientsDataType(),
      services: strategy.getServicesDataType()
    };
  }

  /**
   * Get business type
   * @returns {string} Business type
   */
  getBusinessType() {
    return this.currentBusinessType;
  }

  /**
   * Get business strategy
   * @returns {BusinessStrategy} Business strategy
   */
  getBusinessStrategy() {
    return this.apiClient?.getStrategy();
  }

  /**
   * Handle network status changes
   * @param {Object} status - Network status
   */
  handleNetworkChange(status) {
    if (status.isOnline && offlineQueue.hasPendingItems()) {
      this.processOfflineQueue();
    }
  }

  /**
   * Process offline queue when connection is restored
   */
  async processOfflineQueue() {
    try {
      const results = await offlineQueue.processQueue(async (item) => {
        const response = await httpClient.request(
          item.method,
          item.endpoint,
          { body: item.payload }
        );
        return response;
      });
      
      console.log('Offline queue processed:', results);
    } catch (error) {
      console.error('Error processing offline queue:', error);
    }
  }

  /**
   * Get current configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return {
      tenantId: this.currentTenantId,
      locationId: this.currentLocationId,
      businessType: this.currentBusinessType,
      apiClient: this.apiClient?.getBusinessType(),
      dataTypes: this.getDataTypes(),
      networkStatus: networkMonitor.getStatus(),
      offlineQueueStats: offlineQueue.getStats()
    };
  }

  /**
   * Update configuration
   * @param {Object} config - New configuration
   */
  updateConfig(config) {
    if (config.tenantId) this.currentTenantId = config.tenantId;
    if (config.locationId) this.currentLocationId = config.locationId;
    if (config.businessType) this.currentBusinessType = config.businessType;
    
    // Reinitialize if tenant or location changed
    if (config.tenantId || config.locationId) {
      this.initializeServices();
    }
  }

  /**
   * Enable demo mode
   */
  enableDemoMode() {
    if (this.apiClient) {
      this.apiClient.config.enableDemoMode = true;
    }
  }

  /**
   * Disable demo mode
   */
  disableDemoMode() {
    if (this.apiClient) {
      this.apiClient.config.enableDemoMode = false;
    }
  }

  /**
   * Enable offline mode
   */
  enableOfflineMode() {
    if (this.apiClient) {
      this.apiClient.config.enableOfflineMode = true;
    }
  }

  /**
   * Disable offline mode
   */
  disableOfflineMode() {
    if (this.apiClient) {
      this.apiClient.config.enableOfflineMode = false;
    }
  }

  /**
   * Get network status
   * @returns {Object} Network status
   */
  getNetworkStatus() {
    return networkMonitor.getStatus();
  }

  /**
   * Get offline queue statistics
   * @returns {Object} Queue statistics
   */
  getOfflineQueueStats() {
    return offlineQueue.getStats();
  }

  /**
   * Clear offline queue
   */
  clearOfflineQueue() {
    offlineQueue.clearQueue();
  }

  /**
   * Cleanup resources
   */
  destroy() {
    networkMonitor.destroy();
    this.services.clear();
    this.currentTenantId = null;
    this.currentLocationId = null;
    this.currentBusinessType = null;
    this.apiClient = null;
  }
}

// Export singleton instance
export const apiManager = new ApiManager();
export default apiManager; 