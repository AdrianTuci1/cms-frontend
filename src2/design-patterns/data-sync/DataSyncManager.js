/**
 * Data Sync Manager - Main orchestrator for data synchronization
 * Uses modular architecture with separate managers for different concerns
 */

import eventBus from '../observer/base/EventBus';

class DataSyncManager {
  constructor(components = {}) {
    // Initialize modular components
    this.resourceRegistry = components.resourceRegistry;
    this.databaseManager = components.databaseManager;
    this.apiSyncManager = components.apiSyncManager;
    this.webSocketManager = components.webSocketManager;
    this.dataProcessor = components.dataProcessor;

    // State management
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;

    // Initialize the system
    this.initialize();
  }

  /**
   * Initialize the data sync system
   */
  async initialize() {
    try {
      // Initialize database
      await this.databaseManager.initializeDatabase();

      // Initialize general resources
      this.resourceRegistry.initializeGeneralResources();

      // Setup network listeners
      this.setupNetworkListeners();

      // Setup event listeners
      this.setupEventListeners();

      console.log('DataSyncManager initialized successfully');
      eventBus.emit('datasync:initialized');
    } catch (error) {
      console.error('Failed to initialize DataSyncManager:', error);
      eventBus.emit('datasync:init-error', error);
    }
  }

  /**
   * Setup network status listeners
   */
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      eventBus.emit('datasync:online');
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      eventBus.emit('datasync:offline');
    });
  }

  /**
   * Setup event listeners for data changes
   */
  setupEventListeners() {
    // Listen for data changes from features
    eventBus.on('timeline:updated', (data) => this.handleDataChange('timeline', data));
    eventBus.on('aiAssistant:updated', (data) => this.handleDataChange('aiAssistant', data));
    eventBus.on('history:updated', (data) => this.handleDataChange('history', data));
  }

  /**
   * Set business type and register business-specific resources
   * @param {string} businessType - Business type (dental, gym, hotel, etc.)
   */
  setBusinessType(businessType) {
    this.resourceRegistry.setBusinessType(businessType);
    this.dataProcessor.setBusinessType(businessType);
  }

  /**
   * Handle data changes from features
   * @param {string} resource - Resource name
   * @param {Object} data - Data to sync
   */
  async handleDataChange(resource, data) {
    try {
      // Add metadata to data
      const processedData = this.dataProcessor.addMetadata(data, resource);

      // Store in IndexedDB
      await this.databaseManager.storeData(resource, processedData);

      // Add to sync queue if offline
      if (!this.isOnline) {
        await this.databaseManager.addToSyncQueue(resource, processedData);
        return;
      }

      // Sync immediately if online
      await this.syncData(resource, processedData);
    } catch (error) {
      console.error(`Error handling data change for ${resource}:`, error);
      eventBus.emit('datasync:error', { resource, error });
    }
  }

  /**
   * Process sync queue when coming back online
   */
  async processSyncQueue() {
    if (this.syncInProgress) return;

    this.syncInProgress = true;
    eventBus.emit('datasync:queue-processing');

    try {
      const queue = await this.databaseManager.getSyncQueue();
      
      for (const item of queue) {
        try {
          await this.syncData(item.resource, item.data);
          await this.databaseManager.removeFromSyncQueue(item.id);
        } catch (error) {
          console.error(`Failed to sync queued item:`, error);
          item.retryCount++;
          
          if (item.retryCount >= item.maxRetries) {
            await this.databaseManager.removeFromSyncQueue(item.id);
            eventBus.emit('datasync:queue-failed', { item, error });
          } else {
            await this.databaseManager.updateSyncQueueItem(item);
          }
        }
      }
    } catch (error) {
      console.error('Error processing sync queue:', error);
    } finally {
      this.syncInProgress = false;
      eventBus.emit('datasync:queue-processed');
    }
  }

  /**
   * Sync data with API/WebSocket
   * @param {string} resource - Resource name
   * @param {Object} data - Data to sync
   */
  async syncData(resource, data) {
    const config = this.resourceRegistry.getResource(resource);
    if (!config) return;

    try {
      // Sync via API
      if (config.apiEndpoints.post) {
        await this.apiSyncManager.syncViaAPI(
          resource, 
          data, 
          config, 
          this.resourceRegistry.getBusinessType()
        );
      }

      // Sync via WebSocket
      if (this.webSocketManager.isConnected() && config.socketEvents.length > 0) {
        await this.webSocketManager.syncViaSocket(resource, data, config);
      }

      eventBus.emit('datasync:synced', { resource, data });
    } catch (error) {
      console.error(`Error syncing ${resource}:`, error);
      eventBus.emit('datasync:sync-failed', { resource, data, error });
      throw error;
    }
  }

  /**
   * Get data with fallback to API
   * @param {string} resource - Resource name
   * @param {Object} options - Query options
   */
  async getDataWithFallback(resource, options = {}) {
    try {
      // Try to get from IndexedDB first
      let data = await this.databaseManager.getData(resource, options);

      // If no data or data is stale, try API
      const config = this.resourceRegistry.getResource(resource);
      if (!data || data.length === 0 || this.dataProcessor.isDataStale(data, config)) {
        if (this.isOnline) {
          const apiData = await this.apiSyncManager.fetchFromAPI(
            resource, 
            options, 
            config, 
            this.resourceRegistry.getBusinessType()
          );
          
          if (apiData) {
            const processedData = this.dataProcessor.processResponse(resource, apiData);
            await this.databaseManager.storeData(resource, processedData);
            data = processedData;
          }
        }
      }

      return data;
    } catch (error) {
      console.error(`Error getting data for ${resource}:`, error);
      eventBus.emit('datasync:get-failed', { resource, error });
      throw error;
    }
  }

  /**
   * Setup WebSocket connection
   * @param {string} url - WebSocket URL
   */
  setupWebSocket(url) {
    this.webSocketManager.setupWebSocket(url);
  }

  /**
   * Clear old data
   * @param {string} resource - Resource name
   * @param {number} maxAge - Maximum age in milliseconds
   */
  async clearOldData(resource, maxAge) {
    await this.databaseManager.clearOldData(resource, maxAge);
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      resources: this.resourceRegistry.getAllResources(),
      queueSize: this.syncQueue.length,
      databaseInitialized: this.databaseManager.isInitialized(),
      apiManagerInitialized: this.apiSyncManager.isInitialized(),
      webSocketConnected: this.webSocketManager.isConnected(),
      businessType: this.resourceRegistry.getBusinessType()
    };
  }

  /**
   * Get resource configuration
   * @param {string} resourceName - Resource name
   */
  getResourceConfig(resourceName) {
    return this.resourceRegistry.getResource(resourceName);
  }

  /**
   * Register a new resource
   * @param {string} resourceName - Resource name
   * @param {Object} config - Resource configuration
   */
  registerResource(resourceName, config) {
    this.resourceRegistry.registerResource(resourceName, config);
  }

  /**
   * Get database manager
   */
  getDatabaseManager() {
    return this.databaseManager;
  }

  /**
   * Get API sync manager
   */
  getApiSyncManager() {
    return this.apiSyncManager;
  }

  /**
   * Get WebSocket manager
   */
  getWebSocketManager() {
    return this.webSocketManager;
  }

  /**
   * Get data processor
   */
  getDataProcessor() {
    return this.dataProcessor;
  }

  /**
   * Get resource registry
   */
  getResourceRegistry() {
    return this.resourceRegistry;
  }
}

export default DataSyncManager; 