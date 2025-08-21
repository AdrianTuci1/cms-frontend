/**
 * Database Manager - Handles IndexedDB operations and database initialization
 */

import { openDB } from 'idb';
import eventBus from '../observer/base/EventBus';

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize IndexedDB with all resource stores
   */
  async initializeDatabase() {
    try {
      this.db = await openDB('cms-frontend', 3, {
        upgrade: (db, oldVersion, newVersion) => {
          this.createStores(db);
        }
      });

      console.log('IndexedDB initialized successfully');
      eventBus.emit('datasync:db-ready');
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      eventBus.emit('datasync:db-error', error);
    }
  }

  /**
   * Create all necessary stores in IndexedDB
   * @param {IDBDatabase} db - Database instance
   */
  createStores(db) {
    // General resources
    const generalResources = [
      'invoices', 'stocks', 'sales', 'agent', 'history', 
      'workflows', 'reports', 'roles', 'permissions', 'userData'
    ];

    // Business-specific resources
    const businessResources = ['timeline', 'clients', 'packages', 'members', 'services'];

    // Create stores for all resources
    [...generalResources, ...businessResources].forEach(resource => {
      if (!db.objectStoreNames.contains(resource)) {
        const store = db.createObjectStore(resource, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('businessType', 'businessType', { unique: false });
        store.createIndex('_syncTimestamp', '_syncTimestamp', { unique: false });
      }
    });

    // Special stores
    if (!db.objectStoreNames.contains('businessInfo')) {
      const businessInfoStore = db.createObjectStore('businessInfo', { keyPath: 'id' });
      businessInfoStore.createIndex('timestamp', 'timestamp', { unique: false });
    }

    if (!db.objectStoreNames.contains('syncQueue')) {
      const queueStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      queueStore.createIndex('resource', 'resource', { unique: false });
      queueStore.createIndex('timestamp', 'timestamp', { unique: false });
      queueStore.createIndex('retryCount', 'retryCount', { unique: false });
    }

    if (!db.objectStoreNames.contains('offlineData')) {
      const offlineStore = db.createObjectStore('offlineData', { keyPath: 'id' });
      offlineStore.createIndex('resource', 'resource', { unique: false });
      offlineStore.createIndex('timestamp', 'timestamp', { unique: false });
    }
  }

  /**
   * Optimize timeline data storage by using resourceId as primary key
   * @param {Array} timelineData - Raw timeline data array
   * @returns {Array} Optimized timeline data array
   */
  optimizeTimelineData(timelineData) {
    if (!Array.isArray(timelineData)) {
      return timelineData;
    }

    return timelineData.map(item => {
      // Use resourceId as the primary key, keep query fields in exterior
      const optimizedItem = {
        id: item.resourceId, // Use resourceId as primary key
        lastUpdated: item.lastUpdated,
        data: {} // Will contain the data field content
      };

      // Extract startDate and endDate for efficient querying
      if (item.data && typeof item.data === 'object') {
        if (item.data.data && typeof item.data.data === 'object') {
          // Extract startDate and endDate from data.data
          const { startDate, endDate, ...restData } = item.data.data;
          optimizedItem.startDate = startDate;
          optimizedItem.endDate = endDate;
          optimizedItem.data = restData;
        } else {
          // Extract startDate and endDate from data
          const { startDate, endDate, ...restData } = item.data;
          optimizedItem.startDate = startDate;
          optimizedItem.endDate = endDate;
          optimizedItem.data = restData;
        }
      }

      // Preserve existing metadata if present
      if (item._syncTimestamp) optimizedItem._syncTimestamp = item._syncTimestamp;
      if (item._lastModified) optimizedItem._lastModified = item._lastModified;
      if (item._version) optimizedItem._version = item._version;
      if (item._resource) optimizedItem._resource = item._resource;
      if (item._source) optimizedItem._source = item._source;

      return optimizedItem;
    });
  }

  /**
   * Store data in IndexedDB with optimization for timeline resources
   * @param {string} resource - Resource name
   * @param {*} data - Data to store
   */
  async storeData(resource, data) {
    if (!this.db) {
      throw new Error(`Database not initialized. Please wait for DataSyncManager initialization to complete before storing data for resource: ${resource}`);
    }

    const timestamp = new Date().toISOString();

    const normalizeItem = (item, resource) => {
      const itemCopy = { ...item };

      // Add metadata if not already present
      if (!itemCopy._syncTimestamp) {
        itemCopy._syncTimestamp = timestamp;
        itemCopy._lastModified = timestamp;
        itemCopy._version = (itemCopy._version || 0) + 1;
        itemCopy._resource = resource;
      }

      // Ensure ID exists
      if (!itemCopy.id) {
        itemCopy.id = `${resource}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      return itemCopy;
    };

    try {
      // Handle different data structures
      let records = [];

      if (Array.isArray(data)) {
        // If data is already an array, use it directly
        // This handles both raw arrays and arrays with metadata from addMetadata()
        records = data;
      } else if (data && typeof data === 'object') {
        // Timeline data should already be standardized as an array
        if (resource === 'timeline' && Array.isArray(data)) {
          // Timeline data is already an array from DataSyncManager.standardizeTimelineData
          records = data;
        } else if (data.reservations && Array.isArray(data.reservations)) {
          // Handle { reservations: [...] } structure for non-timeline resources
          records = data.reservations;
        } else if (data.data && Array.isArray(data.data)) {
          // Handle { data: [...] } structure
          records = data.data;
        } else if (data.items && Array.isArray(data.items)) {
          // Handle { items: [...] } structure
          records = data.items;
        } else if (data.stocks && Array.isArray(data.stocks)) {
          // Handle { stocks: [...] } structure
          records = data.stocks;
        } else if (resource === 'stocks' && data.items && Array.isArray(data.items)) {
          // Handle { items: [...] } structure for stocks resource
          records = data.items;
        } else if (resource === 'members' && data.items && Array.isArray(data.items)) {
          // Handle { items: [...] } structure for members resource
          records = data.items;
        } else if (data.clients && Array.isArray(data.clients)) {
          // Handle { clients: [...] } structure
          records = data.clients;
        } else if (data.packages && Array.isArray(data.packages)) {
          // Handle { packages: [...] } structure
          records = data.packages;
        } else if (resource !== 'timeline' && data.timeline && Array.isArray(data.timeline)) {
          // Handle { timeline: [...] } structure (only for non-timeline resources)
          records = data.timeline;
        } else if (resource !== 'timeline' && data.reservations && Array.isArray(data.reservations)) {
          // Handle { reservations: [...] } structure (only for non-timeline resources)
          records = data.reservations;
        } else if (data.members && Array.isArray(data.members)) {
          // Handle { members: [...] } structure
          records = data.members;
        } else if (data.invoices && Array.isArray(data.invoices)) {
          // Handle { invoices: [...] } structure for invoices resource
          if (resource === 'invoices') {
            // For invoices resource, store the entire object to preserve structure
            records = [data];
          } else {
            records = data.invoices;
          }
        } else if (data.suggestions && Array.isArray(data.suggestions)) {
          // Handle { suggestions: [...] } structure
          records = data.suggestions;
        } else {
          // If no array found, treat as single record
          records = [data];
        }
      } else {
        // If data is not an object or array, treat as single record
        records = [data];
      }

      // First normalize all records to ensure they have proper metadata
      records = records.map(item => normalizeItem(item, resource));

      // Then optimize timeline data after normalization
      if (resource === 'timeline' && Array.isArray(records)) {
        records = this.optimizeTimelineData(records);
        console.log(`DatabaseManager: Optimized ${records.length} timeline records for storage`);
      }

      console.log(`DatabaseManager: Storing ${records.length} records for resource: ${resource}`);
      console.log(`DatabaseManager: First record preview:`, records[0] ? JSON.stringify(records[0]).substring(0, 200) + '...' : 'no records');
      console.log(`DatabaseManager: Records structure:`, {
        isArray: Array.isArray(records),
        length: records.length,
        firstRecordType: records[0] ? typeof records[0] : 'no records',
        firstRecordKeys: records[0] ? Object.keys(records[0]) : 'no records'
      });

      // Process each record individually
      for (const rawItem of records) {
        if (!rawItem || typeof rawItem !== 'object') {
          console.warn(`Skipping invalid item in ${resource}:`, rawItem);
          continue;
        }

        console.log(`DatabaseManager: Storing item for ${resource}:`, {
          hasId: !!rawItem.id,
          id: rawItem.id,
          keys: Object.keys(rawItem),
          hasData: !!(rawItem.data || rawItem.reservations || rawItem.items)
        });

        // Check for an existing record to prevent true duplications
        const existing = rawItem.id ? await this.db.get(resource, rawItem.id) : null;

        if (existing) {
          // Merge changes but preserve older metadata if needed
          // Currently we choose to update the record with the latest version & timestamps
          await this.db.put(resource, { ...existing, ...rawItem });
        } else {
          await this.db.put(resource, rawItem);
        }
      }

      eventBus.emit('datasync:stored', { resource, count: records.length });
    } catch (error) {
      console.error(`Failed to store data in IndexedDB for ${resource}:`, error);
      console.error('Data that failed to store:', data);
      throw error;
    }
  }

  /**
   * Reconstruct timeline data from optimized storage format
   * @param {Array} optimizedData - Optimized timeline data from database
   * @returns {Array} Reconstructed timeline data
   */
  reconstructTimelineData(optimizedData) {
    if (!Array.isArray(optimizedData)) {
      return optimizedData;
    }

    return optimizedData.map(item => {
      // Reconstruct the original structure with query fields in exterior
      const reconstructedItem = {
        id: item.id, // This is now resourceId
        resourceId: item.id, // resourceId is the same as id
        lastUpdated: item.lastUpdated,
        data: {
          startDate: item.startDate,
          endDate: item.endDate,
          ...item.data // Rest of the data content
        }
      };

      // Preserve metadata
      if (item._syncTimestamp) reconstructedItem._syncTimestamp = item._syncTimestamp;
      if (item._lastModified) reconstructedItem._lastModified = item._lastModified;
      if (item._version) reconstructedItem._version = item._version;
      if (item._resource) reconstructedItem._resource = item._resource;
      if (item._source) reconstructedItem._source = item._source;

      return reconstructedItem;
    });
  }

  /**
   * Get data from IndexedDB
   * @param {string} resource - Resource name
   * @param {Object} options - Query options
   */
  async getData(resource, options = {}) {
    if (!this.db) {
      throw new Error(`Database not initialized. Please wait for DataSyncManager initialization to complete before retrieving data for resource: ${resource}`);
    }

    const { id, index, query, limit } = options;

    try {
      if (id) {
        return await this.db.get(resource, id);
      }

      if (index && query) {
        const store = this.db.transaction(resource, 'readonly').objectStore(resource);
        const indexStore = store.index(index);
        return await indexStore.getAll(query, limit);
      }

      // Get all data for the resource
      const allData = await this.db.getAll(resource, limit);
      
      // Filter out metadata records (records that are not actual data items)
      const filteredData = allData.filter(item => {
        // Skip records that are just metadata or have only system fields
        const systemFields = ['_syncTimestamp', '_lastModified', '_version', '_resource', '_source'];
        const hasDataFields = Object.keys(item).some(key => !systemFields.includes(key));
        return hasDataFields;
      });

      console.log(`DatabaseManager: Retrieved ${filteredData.length} records for resource: ${resource}`);
      
      // Reconstruct timeline data from optimized format
      if (resource === 'timeline' && Array.isArray(filteredData)) {
        const reconstructedData = this.reconstructTimelineData(filteredData);
        console.log(`DatabaseManager: Reconstructed ${reconstructedData.length} timeline records from optimized storage`);
        return reconstructedData;
      }
      
      // Special handling for invoices resource to preserve structure
      if (resource === 'invoices' && filteredData.length > 0) {
        // Find the main invoices object (should be the first one with invoices array)
        const invoicesObject = filteredData.find(item => item.invoices && Array.isArray(item.invoices));
        if (invoicesObject) {
          return invoicesObject;
        }
      }
      
      // Special handling for stocks resource to preserve structure
      if (resource === 'stocks' && filteredData.length > 0) {
        // Return stocks data with items array structure
        return {
          id: 'stocks-001',
          items: filteredData
        };
      }
      
      // Special handling for members resource to preserve structure
      if (resource === 'members' && filteredData.length > 0) {
        // Return members data with items array structure
        return {
          id: 'members-001',
          items: filteredData
        };
      }
      
      return filteredData;
    } catch (error) {
      console.error(`Failed to get data from IndexedDB for ${resource}:`, error);
      throw error;
    }
  }

  /**
   * Add data to sync queue
   * @param {string} resource - Resource name
   * @param {Object} data - Data to queue
   */
  async addToSyncQueue(resource, data) {
    if (!this.db) return;

    const queueItem = {
      resource,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 3
    };

    await this.db.add('syncQueue', queueItem);
    eventBus.emit('datasync:queued', { resource, data });
  }

  /**
   * Get all items from sync queue
   */
  async getSyncQueue() {
    if (!this.db) return [];
    return await this.db.getAll('syncQueue');
  }

  /**
   * Remove item from sync queue
   * @param {number} id - Queue item ID
   */
  async removeFromSyncQueue(id) {
    if (!this.db) return;
    await this.db.delete('syncQueue', id);
  }

  /**
   * Update sync queue item
   * @param {Object} item - Queue item to update
   */
  async updateSyncQueueItem(item) {
    if (!this.db) return;
    await this.db.put('syncQueue', item);
  }

  /**
   * Clear old data
   * @param {string} resource - Resource name
   * @param {number} maxAge - Maximum age in milliseconds
   */
  async clearOldData(resource, maxAge) {
    if (!this.db) return;

    const store = this.db.transaction(resource, 'readwrite').objectStore(resource);
    const index = store.index('timestamp');
    const cutoff = new Date(Date.now() - maxAge).toISOString();

    const oldData = await index.getAllKeys(IDBKeyRange.upperBound(cutoff));
    
    for (const key of oldData) {
      await store.delete(key);
    }

    eventBus.emit('datasync:cleared', { resource, count: oldData.length });
  }

  /**
   * Check if database is initialized
   */
  isInitialized() {
    return this.db !== null;
  }

  /**
   * Get database instance
   */
  getDatabase() {
    return this.db;
  }

  /**
   * Clear duplicate data from a resource store
   * @param {string} resource - Resource name
   */
  async clearDuplicates(resource) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const allData = await this.db.getAll(resource);
      
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
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      // Get count before clearing
      const allData = await this.getData(resource);
      const count = allData.length;

      // Clear all data from the resource store
      const store = this.db.transaction(resource, 'readwrite').objectStore(resource);
      await store.clear();

      console.log(`Cleared ${count} records from ${resource}`);
      eventBus.emit('datasync:resource-cleared', { resource, count });
      
      return count;
    } catch (error) {
      console.error(`Failed to clear data for ${resource}:`, error);
      throw error;
    }
  }

  /**
   * Clear all data from all resources
   */
  async clearAllData() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const results = {};
      const storeNames = this.db.objectStoreNames;

      for (const storeName of storeNames) {
        const store = this.db.transaction(storeName, 'readwrite').objectStore(storeName);
        await store.clear();
        results[storeName] = 'cleared';
      }

      console.log('Cleared all data from all stores');
      eventBus.emit('datasync:all-data-cleared', { results });
      
      return results;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }

  /**
   * Clear and re-optimize timeline data
   * This method helps transition existing timeline data to the optimized format
   */
  async reoptimizeTimelineData() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      console.log('DatabaseManager: Starting timeline data re-optimization...');
      
      // Get all existing timeline data
      const allTimelineData = await this.db.getAll('timeline');
      console.log(`DatabaseManager: Found ${allTimelineData.length} existing timeline records`);
      
      if (allTimelineData.length === 0) {
        console.log('DatabaseManager: No timeline data to re-optimize');
        return 0;
      }

      // Clear all existing timeline data
      await this.db.clear('timeline');
      console.log('DatabaseManager: Cleared existing timeline data');
      
      // Re-optimize and store the data
      const optimizedData = this.optimizeTimelineData(allTimelineData);
      
      // Store the optimized data
      for (const item of optimizedData) {
        await this.db.put('timeline', item);
      }
      
      console.log(`DatabaseManager: Re-optimized and stored ${optimizedData.length} timeline records`);
      
      return optimizedData.length;
    } catch (error) {
      console.error('DatabaseManager: Error re-optimizing timeline data:', error);
      throw error;
    }
  }

  /**
   * Clear nested data structures (data with {data: {...}} wrapper)
   */
  async clearNestedData(resource) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const allData = await this.db.getAll(resource);
      let clearedCount = 0;

      for (const item of allData) {
        // Check if item has nested data structure
        if (item.data && typeof item.data === 'object' && item.source) {
          await this.db.delete(resource, item.id);
          clearedCount++;
        }
      }

      console.log(`Cleared ${clearedCount} nested data records from ${resource}`);
      
      // Also clear any items with _source === 'mock' to prevent recreation
      if (clearedCount > 0) {
        const remainingData = await this.db.getAll(resource);
        let mockClearedCount = 0;
        
        for (const item of remainingData) {
          if (item._source === 'mock') {
            await this.db.delete(resource, item.id);
            mockClearedCount++;
          }
        }
        
        if (mockClearedCount > 0) {
          console.log(`Also cleared ${mockClearedCount} mock data records to prevent recreation`);
          clearedCount += mockClearedCount;
        }
      }
      
      return clearedCount;
    } catch (error) {
      console.error(`Error clearing nested data from ${resource}:`, error);
      throw error;
    }
  }
}

export function createDatabaseManager() {
  return new DatabaseManager();
} 