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
      this.db = await openDB('cms-frontend', 2, {
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
    const businessResources = ['timeline', 'clients', 'packages', 'members'];

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
   * Store data in IndexedDB
   * @param {string} resource - Resource name
   * @param {Object} data - Data to store
   */
  async storeData(resource, data) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const timestamp = new Date().toISOString();
    
    // Ensure data has a valid id
    let dataWithId = data;
    if (!data.id) {
      // Generate a unique id if none exists
      dataWithId = {
        ...data,
        id: `${resource}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
    }

    const dataWithMeta = {
      ...dataWithId,
      _syncTimestamp: timestamp,
      _lastModified: timestamp,
      _version: (data._version || 0) + 1,
      _resource: resource
    };

    try {
      // Verifică dacă datele există deja pentru a evita duplicarea
      if (Array.isArray(dataWithMeta)) {
        // Pentru array-uri, verifică fiecare element
        for (const item of dataWithMeta) {
          if (item.id) {
            const existingItem = await this.db.get(resource, item.id);
            if (!existingItem) {
              await this.db.put(resource, item);
            }
          } else {
            await this.db.put(resource, item);
          }
        }
      } else {
        // Pentru obiecte singulare
        if (dataWithMeta.id) {
          const existingItem = await this.db.get(resource, dataWithMeta.id);
          if (!existingItem) {
            await this.db.put(resource, dataWithMeta);
          }
        } else {
          await this.db.put(resource, dataWithMeta);
        }
      }
      
      eventBus.emit('datasync:stored', { resource, data: dataWithMeta });
    } catch (error) {
      console.error(`Failed to store data in IndexedDB for ${resource}:`, error);
      console.error('Data that failed to store:', dataWithMeta);
      throw error;
    }
  }

  /**
   * Get data from IndexedDB
   * @param {string} resource - Resource name
   * @param {Object} options - Query options
   */
  async getData(resource, options = {}) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const { id, index, query, limit } = options;

    if (id) {
      return await this.db.get(resource, id);
    }

    if (index && query) {
      const store = this.db.transaction(resource, 'readonly').objectStore(resource);
      const indexStore = store.index(index);
      return await indexStore.getAll(query, limit);
    }

    return await this.db.getAll(resource, limit);
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
}

export function createDatabaseManager() {
  return new DatabaseManager();
} 