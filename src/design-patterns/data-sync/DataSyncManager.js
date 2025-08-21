/**
 * Data Sync Manager - Main orchestrator for data synchronization
 * Uses modular architecture with separate managers for different concerns
 * Updated to use ConnectivityManager and new endpoint structure
 */

import eventBus from '../observer/base/EventBus';
import { createConnectivityManager } from './ConnectivityManager.js';
import { createApiSyncManager } from './ApiSyncManager.js';
import { createDatabaseManager } from './DatabaseManager.js';
import { createWebSocketManager } from './WebSocketManager.js';
import { createDataProcessor } from './DataProcessor.js';
import { createResourceRegistry } from './ResourceRegistry.js';

class DataSyncManager {
  constructor(components = {}) {
    // Check if we're in test mode
    this.testMode = import.meta.env.VITE_TEST_MODE === 'true';
    
    if (this.testMode) {
      console.log('DataSyncManager: Running in TEST MODE - API calls disabled');
    }
    
    // Initialize components
    this.connectivityManager = components.connectivityManager || createConnectivityManager();
    this.apiSyncManager = components.apiSyncManager || createApiSyncManager(this.connectivityManager);
    this.databaseManager = components.databaseManager || createDatabaseManager();
    this.webSocketManager = components.webSocketManager || createWebSocketManager();
    this.dataProcessor = components.dataProcessor || createDataProcessor();
    this.resourceRegistry = components.resourceRegistry || createResourceRegistry();
    
    // State
    this.syncInProgress = false;
    this.syncQueue = [];
    this.isInitialized = false;
    this.initializationPromise = null;
    this.initializationInProgress = false;
    
    // Setup listeners
    this.setupEventListeners();

    // Initialize the system (but don't wait for it in constructor)
    this.initializationPromise = this.initialize();
  }

  /**
   * Initialize the data sync system
   */
  async initialize() {
    if (this.isInitialized || this.initializationInProgress) {
      return;
    }

    this.initializationInProgress = true;

    try {
      console.log('DataSyncManager: Starting initialization...');
      
      // Initialize database
      console.log('DataSyncManager: Initializing database...');
      await this.databaseManager.initializeDatabase();
      console.log('DataSyncManager: Database initialized successfully');

      // Initialize general resources
      console.log('DataSyncManager: Initializing general resources...');
      this.resourceRegistry.initializeGeneralResources();
      console.log('DataSyncManager: General resources initialized');

      // Setup event listeners
      console.log('DataSyncManager: Setting up event listeners...');
      this.setupEventListeners();
      console.log('DataSyncManager: Event listeners setup complete');

      // Start connectivity manager periodic checks
      console.log('DataSyncManager: Starting connectivity monitoring...');
      this.connectivityManager.startPeriodicChecks();
      console.log('DataSyncManager: Connectivity monitoring started');

      this.isInitialized = true;
      console.log('DataSyncManager: Initialization completed successfully');
      eventBus.emit('datasync:initialized');
    } catch (error) {
      console.error('DataSyncManager: Initialization failed:', error);
      eventBus.emit('datasync:init-error', error);
      throw error;
    } finally {
      this.initializationInProgress = false;
    }
  }

  /**
   * Wait for initialization to complete
   */
  async waitForInitialization() {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }
    return this.isInitialized;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Connectivity change listener
    eventBus.on('connectivity:status-changed', this.onConnectivityChange.bind(this));
    
    // Data update listeners
    eventBus.on('datasync:data-updated', this.onDataUpdated.bind(this));
    
    // Error listeners
    eventBus.on('datasync:error', this.onDataSyncError.bind(this));
  }

  /**
   * Handle connectivity changes
   */
  onConnectivityChange(status) {
    console.log('DataSyncManager: Connectivity changed to:', status.type);
    
    if (status.type === 'online') {
      // Trigger sync when coming back online
      this.syncPendingData();
    }
  }

  /**
   * Handle data updates
   */
  onDataUpdated(event) {
    console.log('DataSyncManager: Data updated for resource:', event.resource);
  }

  /**
   * Handle data sync errors
   */
  onDataSyncError(error) {
    console.error('DataSyncManager: Data sync error:', error);
  }

  /**
   * Get data for a specific resource with comprehensive fallback
   * @param {string} resource - Resource name
   * @param {Object} options - Options for data fetching
   * @returns {Promise<Object>} Resource data
   */
  async getData(resource, options = {}) {
    try {
      const { forceRefresh = false, useCache = true, params = {} } = options;

      // Attempt to get fresh data from API first if not forced to use cache
      if (!forceRefresh || this.connectivityManager.isOnline) {
        try {
          const config = this.resourceRegistry.getResource(resource);
          
          // Debug logging for timeline requests
          if (resource === 'timeline') {
            console.log('🚀 DataSyncManager.getData sending to API:', {
              resource,
              params,
              config: {
                requiresDateRange: config.requiresDateRange,
                useSingleEndpoint: config.useSingleEndpoint,
                resourceType: config.resourceType
              }
            });
          }
          
          const apiResponse = await this.apiSyncManager.fetchFromAPI(resource, { params }, config, this.resourceRegistry);
          
          if (apiResponse) {
            // Extract only the data from the axios response to avoid AbortSignal cloning issues
            const apiData = apiResponse.data || apiResponse;
            
            console.log(`📥 DataSyncManager: Received API response for ${resource}:`, {
              hasData: !!apiData,
              dataType: typeof apiData,
              isArray: Array.isArray(apiData),
              keys: apiData ? Object.keys(apiData) : 'no data',
              dataPreview: apiData ? JSON.stringify(apiData).substring(0, 200) + '...' : 'no data'
            });
            
            if (resource === 'timeline') {
              console.log(`📥 DataSyncManager: Full apiData for timeline:`, apiData);
            }
            
            // Extract the actual data for timeline
            let dataToProcess = apiData;
            if (resource === 'timeline' && apiData && apiData.data) {
              if (Array.isArray(apiData.data)) {
                // Direct array structure: { data: [reservations] }
                console.log(`📥 DataSyncManager: Extracting timeline data from apiData.data (direct array) - found ${apiData.data.length} reservations`);
                console.log(`📥 DataSyncManager: apiData.data content:`, apiData.data);
                dataToProcess = apiData.data;
              } else if (typeof apiData.data === 'object' && apiData.data.data && Array.isArray(apiData.data.data)) {
                // Nested structure: { data: { data: [reservations] } }
                console.log(`📥 DataSyncManager: Extracting timeline data from apiData.data.data (nested) - found ${apiData.data.data.length} reservations`);
                dataToProcess = apiData.data.data;
              } else {
                console.log(`📥 DataSyncManager: Debug - apiData.data structure:`, {
                  keys: Object.keys(apiData.data),
                  hasData: !!(apiData.data && apiData.data.data),
                  dataType: apiData.data.data ? typeof apiData.data.data : 'no data',
                  isDataArray: apiData.data.data ? Array.isArray(apiData.data.data) : 'no data',
                  dataLength: apiData.data.data && Array.isArray(apiData.data.data) ? apiData.data.data.length : 'not array'
                });
              }
            }
            
            // Process and store data
            const processedData = this.dataProcessor.addMetadata(dataToProcess, resource, 'api');
            
            console.log(`🔄 DataSyncManager: Processed data for ${resource}:`, {
              hasProcessedData: !!processedData,
              processedDataType: typeof processedData,
              isArray: Array.isArray(processedData),
              keys: processedData ? Object.keys(processedData) : 'no processed data',
              processedDataLength: processedData && Array.isArray(processedData) ? processedData.length : 'not array',
              firstProcessedItem: processedData && Array.isArray(processedData) && processedData.length > 0 ? Object.keys(processedData[0]) : 'no items'
            });
            
            await this.databaseManager.storeData(resource, processedData);
            console.log(`💾 DataSyncManager: Successfully stored data for ${resource} in IndexedDB`);
            
            // Emit update event with the original apiData structure
            this.emitResourceUpdate(resource, apiData, 'api');
            
            return apiData;
          }
        } catch (apiError) {
          console.warn(`API fetch failed for ${resource}:`, apiError.message);
          // Continue to cache fallback
        }
      }

      // Fallback to cached data if available
      if (useCache) {
        try {
          const cachedData = await this.databaseManager.getData(resource);
          const hasCachedData = Array.isArray(cachedData) 
            ? cachedData.length > 0
            : cachedData && Object.keys(cachedData).length > 0;

          if (hasCachedData) {
            // Emite eveniment pentru date din cache
            this.emitResourceUpdate(resource, cachedData, 'indexeddb');
            
            return cachedData;
          }
        } catch (dbError) {
          console.warn(`Cache fetch failed for ${resource}:`, dbError.message);
        }
      }

      // No data available from any source - return empty data instead of throwing
      console.warn(`No data available for resource '${resource}'. API is unavailable and no cached data found. Returning empty data.`);
      
      // Return appropriate empty data structure based on resource type
      let emptyData;
      if (resource === 'timeline') {
        emptyData = { reservations: [] };
      } else {
        emptyData = [];
      }
      
      // Emit event with empty data for consistency
      this.emitResourceUpdate(resource, emptyData, 'empty');
      
      return emptyData;

    } catch (error) {
      // Only log non-data-availability errors
      if (!error.message.includes('No data available')) {
        console.error(`Failed to get data for ${resource}:`, error);
        throw error;
      }
      
      // For data availability errors, return empty data instead of throwing
      console.warn(`Data availability issue for ${resource}: ${error.message}. Returning empty data.`);
      
      if (resource === 'timeline') {
        return { reservations: [] };
      }
      
      return [];
    }
  }

  /**
   * Enhanced data fetching with comprehensive fallback strategy
   * @param {string} resource - Resource name
   * @param {Object} options - Options including forceRefresh, useCache, and params
   * @returns {Promise<Object>} Resource data
   */
  async getDataWithFallback(resource, options = {}) {
    try {
      const { forceRefresh = false, useCache = true, params = {} } = options;

      // In test mode, skip API calls and go directly to IndexedDB/cache data
      if (this.testMode) {
        console.log(`DataSyncManager: Test mode - skipping API for ${resource}`);
        const cachedData = await this.databaseManager.getData(resource);
        if (cachedData) {
          return cachedData;
        }
        throw new Error(`No cached data available for resource '${resource}' in test mode.`);
      }

      // Try to get data from API first
      if (!forceRefresh || this.connectivityManager.isOnline) {
        try {
          const config = this.resourceRegistry.getResource(resource);
          
          // Debug logging for timeline requests
          if (resource === 'timeline') {
            console.log('🚀 DataSyncManager.getDataWithFallback sending to API:', {
              resource,
              params,
              config: {
                requiresDateRange: config.requiresDateRange,
                useSingleEndpoint: config.useSingleEndpoint,
                resourceType: config.resourceType
              }
            });
          }
          
          const apiResponse = await this.apiSyncManager.fetchFromAPI(resource, { params }, config, this.resourceRegistry);
          
          if (apiResponse) {
            // Extract only the data from the axios response to avoid AbortSignal cloning issues
            const apiData = apiResponse.data || apiResponse;
            
            if (resource === 'timeline') {
              console.log(`📥 DataSyncManager: Full apiData for timeline:`, apiData);
            }
            
            // Extract the actual data for timeline
            let dataToProcess = apiData;
            if (resource === 'timeline' && apiData && apiData.data) {
              if (Array.isArray(apiData.data)) {
                // Direct array structure: { data: [reservations] }
                console.log(`📥 DataSyncManager: Extracting timeline data from apiData.data (direct array) - found ${apiData.data.length} reservations`);
                console.log(`📥 DataSyncManager: apiData.data content:`, apiData.data);
                dataToProcess = apiData.data;
              } else if (typeof apiData.data === 'object' && apiData.data.data && Array.isArray(apiData.data.data)) {
                // Nested structure: { data: { data: [reservations] } }
                console.log(`📥 DataSyncManager: Extracting timeline data from apiData.data.data (nested) - found ${apiData.data.data.length} reservations`);
                dataToProcess = apiData.data.data;
              } else {
                console.log(`📥 DataSyncManager: Debug - apiData.data structure:`, {
                  keys: Object.keys(apiData.data),
                  hasData: !!(apiData.data && apiData.data.data),
                  dataType: apiData.data.data ? typeof apiData.data.data : 'no data',
                  isDataArray: apiData.data.data ? Array.isArray(apiData.data.data) : 'no data',
                  dataLength: apiData.data.data && Array.isArray(apiData.data.data) ? apiData.data.data.length : 'not array'
                });
              }
            }
            
            // Process and store data
            const processedData = this.dataProcessor.addMetadata(dataToProcess, resource, 'api');
            await this.databaseManager.storeData(resource, processedData);
            
            // Emit update event with the original apiData structure
            this.emitResourceUpdate(resource, apiData, 'api');
            
            return apiData;
          }
        } catch (apiError) {
          console.warn(`API request failed for ${resource}:`, apiError.message);
          // Continue to fallback options
        }
      }

      // Fallback to cached data
      try {
        const cachedData = await this.databaseManager.getData(resource);
        const hasCachedData = Array.isArray(cachedData) 
          ? cachedData.length > 0
          : cachedData && Object.keys(cachedData).length > 0;

        if (hasCachedData) {
          // Emite eveniment pentru date din cache
          this.emitResourceUpdate(resource, cachedData, 'indexeddb');
          
          return cachedData;
        }
      } catch (dbError) {
        console.warn(`Cache access failed for ${resource}:`, dbError.message);
      }

      // No data available from any source - return empty data instead of throwing
      console.warn(`No data available for resource '${resource}'. API is unavailable and no cached data found. Returning empty data.`);
      
      // Return appropriate empty data structure based on resource type
      let emptyData;
      if (resource === 'timeline') {
        emptyData = { reservations: [] };
      } else {
        emptyData = [];
      }
      
      // Emit event with empty data for consistency
      this.emitResourceUpdate(resource, emptyData, 'empty');
      
      return emptyData;
    } catch (error) {
      // Only log non-data-availability errors
      if (!error.message.includes('No data available')) {
        console.error(`Failed to get data with fallback for ${resource}:`, error);
        throw error;
      }
      
      // For data availability errors, return empty data instead of throwing
      console.warn(`Data availability issue for ${resource}: ${error.message}. Returning empty data.`);
      
      if (resource === 'timeline') {
        return { reservations: [] };
      }
      
      return [];
    }
  }

  /**
   * Emit resource update event with deduplication
   * @param {string} resource - Resource name
   * @param {Object} data - Data to emit
   * @param {string} source - Data source (api, indexeddb, mock, etc.)
   */
  emitResourceUpdate(resource, data, source = 'unknown') {
    const eventData = {
      data,
      source,
      timestamp: new Date().toISOString()
    };

    // Use EventBus's built-in deduplication
    eventBus.emit(`${resource}:updated`, eventData);
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
      if ((config.useSingleEndpoint || config.apiEndpoints?.post) && !this.testMode) {
        await this.apiSyncManager.syncViaAPI(
          resource, 
          data, 
          config, 
          this.resourceRegistry
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
   * Set business info and configure endpoints
   * @param {Object} businessInfo - Business information object
   */
  setBusinessInfo(businessInfo) {
    this.resourceRegistry.setBusinessInfo(businessInfo);
    
    // Extract business type for backward compatibility with data processor
    const businessType = this.resourceRegistry.getBusinessType();
    if (businessType) {
      this.dataProcessor.setBusinessType(businessType);
    }

    // Update location ID in ApiSyncManager if available
    if (businessInfo && businessInfo.location && businessInfo.location.id) {
      this.apiSyncManager.updateLocationId(businessInfo.location.id);
    }
  }

  /**
   * Set business type (for backward compatibility)
   * @param {string} businessType - Business type (dental, gym, hotel, etc.)
   */
  setBusinessType(businessType) {
    // For backward compatibility, we can still support this method
    // But in the new system, business type should come from business info
    console.warn('setBusinessType is deprecated. Use setBusinessInfo instead.');
    this.dataProcessor.setBusinessType(businessType);
  }

  /**
   * Handle data changes from features
   * @param {string} resource - Resource name
   * @param {Object} data - Data to sync
   */
  async handleDataChange(resource, data) {
    try {
      // Wait for initialization to complete
      await this.waitForInitialization();

      // Add metadata to data
      const processedData = this.dataProcessor.addMetadata(data, resource, 'feature');

      // Store in IndexedDB
      await this.databaseManager.storeData(resource, processedData);

      // Add to sync queue if offline
      if (!this.connectivityManager.isOnline) {
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
   * Sync pending data when coming back online
   */
  async syncPendingData() {
    if (this.syncInProgress) return;

    this.syncInProgress = true;
    console.log('DataSyncManager: Starting sync of pending data...');

    try {
      const queue = await this.databaseManager.getSyncQueue();
      
      for (const item of queue) {
        try {
          await this.syncData(item.resource, item.data);
          await this.databaseManager.removeFromSyncQueue(item.id);
          console.log(`Synced pending data for ${item.resource}`);
        } catch (error) {
          console.error(`Failed to sync pending data for ${item.resource}:`, error);
        }
      }
    } catch (error) {
      console.error('Error syncing pending data:', error);
    } finally {
      this.syncInProgress = false;
      console.log('DataSyncManager: Sync of pending data completed');
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
   * Clear duplicates from a resource store
   * @param {string} resource - Resource name
   */
  async clearDuplicates(resource) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const allData = await this.databaseManager.getData(resource);
      
      // Group by a unique identifier to find duplicates
      const grouped = {};
      const duplicates = [];

      allData.forEach(item => {
        // Use a combination of fields to identify duplicates
        const key = item._resource || resource;
        
        if (!grouped[key]) {
          grouped[key] = [];
        }
        
        // Check if this is a duplicate based on content
        const isDuplicate = grouped[key].some(existing => {
          // Compare relevant fields to determine if it's a duplicate
          return existing._source === item._source && 
                 existing._resource === item._resource &&
                 Math.abs(new Date(existing._syncTimestamp) - new Date(item._syncTimestamp)) < 1000; // Within 1 second
        });
        
        if (isDuplicate) {
          duplicates.push(item.id);
        } else {
          grouped[key].push(item);
        }
      });

      // Remove duplicates
      for (const duplicateId of duplicates) {
        await this.db.delete(resource, duplicateId);
      }

      if (duplicates.length > 0) {
        console.log(`Cleared ${duplicates.length} duplicate records from ${resource}`);
        eventBus.emit('datasync:duplicates-cleared', { resource, count: duplicates.length });
      }

      return duplicates.length;
    } catch (error) {
      console.error(`Failed to clear duplicates for ${resource}:`, error);
      throw error;
    }
  }

  /**
   * Clear all data from a specific resource
   * @param {string} resource - Resource name
   */
  async clearResourceData(resource) {
    return await this.databaseManager.clearResourceData(resource);
  }

  /**
   * Clear timeline data specifically
   */
  async clearTimelineData() {
    return await this.clearResourceData('timeline');
  }

  /**
   * Clear nested data structures from a resource
   */
  async clearNestedData(resource) {
    try {
      const count = await this.databaseManager.clearNestedData(resource);
      console.log(`Cleared ${count} nested data records from ${resource}`);
      return count;
    } catch (error) {
      console.error(`Error clearing nested data from ${resource}:`, error);
      throw error;
    }
  }

  /**
   * Re-optimize timeline data storage
   * This method helps transition existing timeline data to the optimized format
   */
  async reoptimizeTimelineData() {
    try {
      console.log('DataSyncManager: Starting timeline data re-optimization...');
      
      // Wait for database to be initialized
      await this.waitForInitialization();
      
      // Trigger re-optimization in database manager
      const optimizedCount = await this.databaseManager.reoptimizeTimelineData();
      
      console.log(`DataSyncManager: Timeline data re-optimization completed. Optimized ${optimizedCount} records.`);
      
      // Emit event to notify other components
      eventBus.emit('datasync:timeline-reoptimized', { count: optimizedCount });
      
      return optimizedCount;
    } catch (error) {
      console.error('DataSyncManager: Error re-optimizing timeline data:', error);
      throw error;
    }
  }

  /**
   * Check if resource has complete data (no need to add more)
   */
  async hasCompleteData(resource) {
    try {
      const data = await this.databaseManager.getData(resource);
      
      if (!Array.isArray(data) || data.length === 0) {
        return false;
      }

      // For timeline, check if we have the expected number of items (23 for dental)
      if (resource === 'timeline') {
        const businessType = this.resourceRegistry.getBusinessType();
        const expectedCount = businessType === 'dental' ? 23 : 10; // Default fallback
        return data.length >= expectedCount;
      }

      // For other resources, consider complete if we have any data
      return data.length > 0;
    } catch (error) {
      console.error(`Error checking complete data for ${resource}:`, error);
      return false;
    }
  }

  /**
   * Clear all data from all resources
   */
  async clearAllData() {
    return await this.databaseManager.clearAllData();
  }

  /**
   * Clear duplicates from all resources
   */
  async clearAllDuplicates() {
    const resources = this.resourceRegistry.getAllResources();
    const results = {};

    for (const resource of resources) {
      try {
        const count = await this.clearDuplicates(resource);
        results[resource] = count;
      } catch (error) {
        console.error(`Failed to clear duplicates for ${resource}:`, error);
        results[resource] = { error: error.message };
      }
    }

    return results;
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      isOnline: this.connectivityManager.isOnline,
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

  /**
   * Check if we're in test mode
   */
  isTestMode() {
    return this.testMode;
  }

  /**
   * Cleanup resources to prevent memory leaks
   */
  cleanup() {
    try {
      // Clear sync queue
      this.syncQueue = [];
      
      // Clear event listeners
      eventBus.off('timeline:updated');
      eventBus.off('aiAssistant:updated');
      eventBus.off('history:updated');
      
      // Reset state
      this.isInitialized = false;
      this.initializationPromise = null;
      this.initializationInProgress = false;
      
      console.log('DataSyncManager: Cleanup completed');
    } catch (error) {
      console.error('DataSyncManager: Cleanup failed:', error);
    }
  }
}

export default DataSyncManager; 