/**
 * Data Sync Manager - Main orchestrator for data synchronization
 * Uses modular architecture with separate managers for different concerns
 */

import eventBus from '../observer/base/EventBus';
import { getMockData } from '../../api/mockData/index.js';

class DataSyncManager {
  constructor(components = {}) {
    // Check if we're in test mode
    this.testMode = import.meta.env.VITE_TEST_MODE === 'true';
    
    if (this.testMode) {
      console.log('DataSyncManager: Running in TEST MODE - API calls disabled');
    }
    
    // Initialize components
    this.apiSyncManager = components.apiSyncManager || createApiSyncManager();
    this.databaseManager = components.databaseManager || createDatabaseManager();
    this.webSocketManager = components.webSocketManager || createWebSocketManager();
    this.dataProcessor = components.dataProcessor || createDataProcessor();
    this.resourceRegistry = components.resourceRegistry || createResourceRegistry();
    
    // State
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.syncQueue = [];
    this.isInitialized = false;
    this.initializationPromise = null;
    this.initializationInProgress = false;
    
    // Setup listeners
    this.setupNetworkListeners();
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

      // Setup network listeners
      console.log('DataSyncManager: Setting up network listeners...');
      this.setupNetworkListeners();
      console.log('DataSyncManager: Network listeners setup complete');

      // Setup event listeners
      console.log('DataSyncManager: Setting up event listeners...');
      this.setupEventListeners();
      console.log('DataSyncManager: Event listeners setup complete');

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
   * Check if the system is initialized
   */
  isSystemInitialized() {
    return this.isInitialized && this.databaseManager.isInitialized();
  }

  /**
   * Get detailed initialization status
   */
  getInitializationStatus() {
    return {
      dataSyncManager: this.isInitialized,
      database: this.databaseManager.isInitialized(),
      resourceRegistry: this.resourceRegistry !== null,
      apiSyncManager: this.apiSyncManager.isInitialized(),
      webSocketManager: this.webSocketManager !== null,
      dataProcessor: this.dataProcessor !== null
    };
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
      // Wait for initialization to complete
      await this.waitForInitialization();

      // Add metadata to data
      const processedData = this.dataProcessor.addMetadata(data, resource, 'feature');

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
      if (config.apiEndpoints.post && !this.testMode) {
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
   * Obține datele cu fallback la IndexedDB
   */
  async getDataWithFallback(resource, options = {}) {
    // Wait for initialization to complete
    await this.waitForInitialization();

    const {
      forceRefresh = false,
      useCache = true,
      params = {}
    } = options;

    // In test mode, skip API calls and go directly to IndexedDB/mock data
    if (this.testMode) {
      console.log(`TEST MODE: Skipping API call for ${resource} - using local data`);
      
      try {
        const cachedData = await this.databaseManager.getData(resource);
        
        const hasCachedData = Array.isArray(cachedData)
          ? cachedData.length > 0
          : cachedData && Object.keys(cachedData).length > 0;

        if (hasCachedData) {
          // Emite eveniment pentru date din cache
          this.emitResourceUpdate(resource, cachedData, 'indexeddb');
          
          return cachedData;
        } else {
          // Dacă nu există date în IndexedDB, folosește date mock
          const mockData = this.getMockData(resource);
          
          // Check if mock data already exists by looking for a specific marker
          const existingData = await this.databaseManager.getData(resource);
          const hasMockData = Array.isArray(existingData) 
            ? existingData.some(item => item._source === 'mock' || item._resource === resource)
            : existingData && (existingData._source === 'mock' || existingData._resource === resource);
          
          if (!hasMockData) {
            // Special handling for timeline resource to prevent nesting
            if (resource === 'timeline' && mockData.reservations && Array.isArray(mockData.reservations)) {
              // For timeline, add metadata to individual reservations, not the wrapper object
              const processedReservations = this.dataProcessor.addMetadata(mockData.reservations, resource, 'mock');
              await this.databaseManager.storeData(resource, processedReservations);
            } else {
              // For other resources, add metadata normally
              const processedMockData = this.dataProcessor.addMetadata(mockData, resource, 'mock');
              await this.databaseManager.storeData(resource, processedMockData);
            }
          }
          
          // Emite eveniment pentru date mock
          this.emitResourceUpdate(resource, mockData, 'mock');
          
          return mockData;
        }
      } catch (dbError) {
        // Ultimul fallback - date mock
        const mockData = this.getMockData(resource);
        
        // Emite eveniment pentru date mock
        this.emitResourceUpdate(resource, mockData, 'mock-fallback');
        
        return mockData;
      }
    }

    try {
      // Încearcă să obțină datele de la API
      const apiData = await this.apiSyncManager.fetchFromAPI(
        resource, 
        { params }, 
        this.getResourceConfig(resource),
        this.resourceRegistry.getBusinessType()
      );

      // Add metadata and save in IndexedDB
      const processedApiData = this.dataProcessor.addMetadata(apiData, resource, 'api');
      await this.databaseManager.storeData(resource, processedApiData);
      
      // Emite eveniment pentru actualizare
      this.emitResourceUpdate(resource, apiData, 'api');

      return apiData;
    } catch (error) {
      // Verifică dacă eroarea este de conectivitate
      const isConnectivityError = error.message.includes('Backend indisponibil') || 
                                 error.message.includes('fetch') ||
                                 error.code === 'NETWORK_ERROR' ||
                                 error.name === 'TypeError';
      
      if (isConnectivityError) {
        // Emite o singură eroare pentru conectivitate (fără logging excesiv)
        eventBus.emit('datasync:connectivity-error', {
          resource,
          message: 'Backend indisponibil - folosind datele din IndexedDB',
          timestamp: new Date().toISOString()
        });
      } else {
        // Log doar erorile care nu sunt de conectivitate
        console.error(`Error fetching ${resource} from API:`, error);
        eventBus.emit('datasync:api-error', { resource, error });
      }

      // Încearcă să obțină datele din IndexedDB
      try {
        const cachedData = await this.databaseManager.getData(resource);
        
        const hasCachedData = Array.isArray(cachedData)
          ? cachedData.length > 0
          : cachedData && Object.keys(cachedData).length > 0;

        if (hasCachedData) {
          // Emite eveniment pentru date din cache
          this.emitResourceUpdate(resource, cachedData, 'indexeddb');
          
          return cachedData;
        } else {
          // Dacă nu există date în IndexedDB, folosește date mock
          const mockData = this.getMockData(resource);
          
          // Check if mock data already exists by looking for a specific marker
          const existingData = await this.databaseManager.getData(resource);
          const hasMockData = Array.isArray(existingData) 
            ? existingData.some(item => item._source === 'mock' || item._resource === resource)
            : existingData && (existingData._source === 'mock' || existingData._resource === resource);
          
          if (!hasMockData) {
            // Special handling for timeline resource to prevent nesting
            if (resource === 'timeline' && mockData.reservations && Array.isArray(mockData.reservations)) {
              // For timeline, add metadata to individual reservations, not the wrapper object
              const processedReservations = this.dataProcessor.addMetadata(mockData.reservations, resource, 'mock');
              await this.databaseManager.storeData(resource, processedReservations);
            } else {
              // For other resources, add metadata normally
              const processedMockData = this.dataProcessor.addMetadata(mockData, resource, 'mock');
              await this.databaseManager.storeData(resource, processedMockData);
            }
          }
          
          // Emite eveniment pentru date mock
          this.emitResourceUpdate(resource, mockData, 'mock');
          
          return mockData;
        }
      } catch (dbError) {
        // Ultimul fallback - date mock
        const mockData = this.getMockData(resource);
        
        // Emite eveniment pentru date mock
        this.emitResourceUpdate(resource, mockData, 'mock-fallback');
        
        return mockData;
      }
    }
  }

  /**
   * Returnează date mock pentru development
   */
  getMockData(resource) {
    const mockData = getMockData(resource, this.resourceRegistry?.getBusinessType());
    
    // Standardize timeline data structure to prevent nesting
    if (resource === 'timeline') {
      return this.standardizeTimelineData(mockData);
    }
    
    return mockData;
  }

  /**
   * Standardize timeline data structure to prevent nesting
   * @param {Object} mockData - Raw mock data
   * @returns {Array} Standardized timeline data array
   */
  standardizeTimelineData(mockData) {
    if (!mockData) return [];
    
    const businessType = this.resourceRegistry?.getBusinessType();
    
    // Handle different business types
    switch (businessType) {
      case 'dental':
        // If mockData is { reservations: [...] }
        if (Array.isArray(mockData.reservations)) {
          return mockData.reservations;
        }
        // If mockData is already an array
        if (Array.isArray(mockData)) {
          return mockData;
        }
        return [];
        
      case 'hotel':
        // Hotel data has reservations array and occupancy
        const hotelData = [];
        
        // Add reservations (already have type and timelineType)
        if (mockData.reservations && Array.isArray(mockData.reservations)) {
          hotelData.push(...mockData.reservations);
        }
        
        // Add occupancy (already have type and timelineType)
        if (mockData.occupancy && typeof mockData.occupancy === 'object') {
          hotelData.push(mockData.occupancy);
        }
        
        return hotelData;
        
      case 'gym':
        // Gym data has different structure - combine members, classes, occupancy
        const gymData = [];
        
        // Add members as timeline items (already have type and timelineType)
        if (mockData.members && Array.isArray(mockData.members)) {
          gymData.push(...mockData.members);
        }
        
        // Add classes as timeline items (already have type and timelineType)
        if (mockData.classes && Array.isArray(mockData.classes)) {
          gymData.push(...mockData.classes);
        }
        
        // Add occupancy as timeline items (already have type and timelineType)
        if (mockData.occupancy && typeof mockData.occupancy === 'object') {
          gymData.push(mockData.occupancy);
        }
        
        return gymData;
        
      default:
        // For unknown business types, try to extract any array
        if (mockData.reservations && Array.isArray(mockData.reservations)) {
          return mockData.reservations;
        }
        if (mockData.data && Array.isArray(mockData.data)) {
          return mockData.data;
        }
        if (Array.isArray(mockData)) {
          return mockData;
        }
        return [];
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