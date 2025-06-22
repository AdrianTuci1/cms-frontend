import LocalDatabase from './LocalDatabase.js';
import SyncQueue from './SyncQueue.js';
import CacheManager from './CacheManager.js';
import SocketSync from './SocketSync.js';
import ConflictResolver from './ConflictResolver.js';

/**
 * DataSyncManager - Manager principal pentru sincronizarea datelor
 * Implementează Observer Pattern pentru a notifica store-urile despre schimbări
 */
class DataSyncManager {
  constructor() {
    this.localDB = new LocalDatabase();
    this.syncQueue = new SyncQueue();
    this.cacheManager = new CacheManager();
    this.socketSync = new SocketSync();
    this.conflictResolver = new ConflictResolver();
    
    // Observer pattern implementation
    this.observers = new Map(); // Map<eventType, Set<callback>>
    this.storeSubscriptions = new Map(); // Map<storeName, Set<eventTypes>>
    
    // Initialize socket listeners
    this.initializeSocketListeners();
  }

  /**
   * Subscribe to data changes
   * @param {string} eventType - Type of event to listen for
   * @param {Function} callback - Callback function
   * @param {string} storeName - Name of the store subscribing
   * @returns {Function} Unsubscribe function
   */
  subscribe(eventType, callback, storeName = 'unknown') {
    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, new Set());
    }
    
    this.observers.get(eventType).add(callback);
    
    // Track store subscriptions
    if (!this.storeSubscriptions.has(storeName)) {
      this.storeSubscriptions.set(storeName, new Set());
    }
    this.storeSubscriptions.get(storeName).add(eventType);
    
    // Return unsubscribe function
    return () => {
      this.unsubscribe(eventType, callback, storeName);
    };
  }

  /**
   * Unsubscribe from data changes
   * @param {string} eventType - Type of event
   * @param {Function} callback - Callback function
   * @param {string} storeName - Name of the store
   */
  unsubscribe(eventType, callback, storeName) {
    const callbacks = this.observers.get(eventType);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.observers.delete(eventType);
      }
    }
    
    // Clean up store subscriptions
    const storeEvents = this.storeSubscriptions.get(storeName);
    if (storeEvents) {
      storeEvents.delete(eventType);
      if (storeEvents.size === 0) {
        this.storeSubscriptions.delete(storeName);
      }
    }
  }

  /**
   * Notify all observers of an event
   * @param {string} eventType - Type of event
   * @param {Object} data - Event data
   */
  notify(eventType, data) {
    const callbacks = this.observers.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in observer callback for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Initialize socket listeners for real-time updates
   */
  initializeSocketListeners() {
    this.socketSync.on('appointment_created', (data) => {
      this.handleAppointmentCreated(data);
    });

    this.socketSync.on('appointment_updated', (data) => {
      this.handleAppointmentUpdated(data);
    });

    this.socketSync.on('appointment_deleted', (data) => {
      this.handleAppointmentDeleted(data);
    });

    this.socketSync.on('history_item_created', (data) => {
      this.handleHistoryItemCreated(data);
    });

    this.socketSync.on('history_item_updated', (data) => {
      this.handleHistoryItemUpdated(data);
    });
  }

  /**
   * Handle appointment created event
   * @param {Object} data - Appointment data
   */
  async handleAppointmentCreated(data) {
    try {
      // Save to local database
      await this.localDB.saveAppointment(data);
      
      // Update cache
      this.cacheManager.invalidateAppointments();
      
      // Notify observers
      this.notify('APPOINTMENT_CREATED', data);
      this.notify('DATA_CHANGED', { type: 'appointments', action: 'created', data });
      
    } catch (error) {
      console.error('Error handling appointment created:', error);
    }
  }

  /**
   * Handle appointment updated event
   * @param {Object} data - Appointment data
   */
  async handleAppointmentUpdated(data) {
    try {
      // Update local database
      await this.localDB.updateAppointment(data);
      
      // Update cache
      this.cacheManager.invalidateAppointments();
      
      // Notify observers
      this.notify('APPOINTMENT_UPDATED', data);
      this.notify('DATA_CHANGED', { type: 'appointments', action: 'updated', data });
      
    } catch (error) {
      console.error('Error handling appointment updated:', error);
    }
  }

  /**
   * Handle appointment deleted event
   * @param {Object} data - Appointment data
   */
  async handleAppointmentDeleted(data) {
    try {
      // Remove from local database
      await this.localDB.deleteAppointment(data.id);
      
      // Update cache
      this.cacheManager.invalidateAppointments();
      
      // Notify observers
      this.notify('APPOINTMENT_DELETED', data);
      this.notify('DATA_CHANGED', { type: 'appointments', action: 'deleted', data });
      
    } catch (error) {
      console.error('Error handling appointment deleted:', error);
    }
  }

  /**
   * Handle history item created event
   * @param {Object} data - History item data
   */
  async handleHistoryItemCreated(data) {
    try {
      // Save to local database
      await this.localDB.saveHistoryItem(data);
      
      // Update cache
      this.cacheManager.invalidateHistory();
      
      // Notify observers
      this.notify('HISTORY_ITEM_CREATED', data);
      this.notify('DATA_CHANGED', { type: 'history', action: 'created', data });
      
    } catch (error) {
      console.error('Error handling history item created:', error);
    }
  }

  /**
   * Handle history item updated event
   * @param {Object} data - History item data
   */
  async handleHistoryItemUpdated(data) {
    try {
      // Update local database
      await this.localDB.updateHistoryItem(data);
      
      // Update cache
      this.cacheManager.invalidateHistory();
      
      // Notify observers
      this.notify('HISTORY_ITEM_UPDATED', data);
      this.notify('DATA_CHANGED', { type: 'history', action: 'updated', data });
      
    } catch (error) {
      console.error('Error handling history item updated:', error);
    }
  }

  /**
   * Get appointments with caching and sync
   * @param {Object} dateRange - Date range for appointments
   * @returns {Promise<Array>} Appointments
   */
  async getAppointments(dateRange) {
    try {
      // Check cache first
      const cachedData = this.cacheManager.getAppointments(dateRange);
      if (cachedData) {
        return cachedData;
      }

      // Check local database
      const localData = await this.localDB.getAppointments(dateRange);
      if (localData && localData.length > 0) {
        // Cache the data
        this.cacheManager.setAppointments(dateRange, localData);
        return localData;
      }

      // If no local data, this would be an API call in real implementation
      // For now, return empty array
      return [];

    } catch (error) {
      console.error('Error getting appointments:', error);
      return [];
    }
  }

  /**
   * Create appointment with sync
   * @param {Object} appointment - Appointment data
   * @returns {Promise<Object>} Created appointment
   */
  async createAppointment(appointment) {
    try {
      // Generate local ID
      const localId = `local_${Date.now()}_${Math.random()}`;
      const appointmentWithId = { ...appointment, id: localId, _local: true };

      // Save to local database
      await this.localDB.saveAppointment(appointmentWithId);

      // Add to sync queue
      this.syncQueue.add({
        type: 'CREATE_APPOINTMENT',
        data: appointmentWithId,
        timestamp: Date.now()
      });

      // Update cache
      this.cacheManager.invalidateAppointments();

      // Notify observers immediately (optimistic update)
      this.notify('APPOINTMENT_CREATED', appointmentWithId);
      this.notify('DATA_CHANGED', { type: 'appointments', action: 'created', data: appointmentWithId });

      return appointmentWithId;

    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Get history items with caching and sync
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} History items
   */
  async getHistoryItems(filters = {}) {
    try {
      // Check cache first
      const cachedData = this.cacheManager.getHistoryItems(filters);
      if (cachedData) {
        return cachedData;
      }

      // Check local database
      const localData = await this.localDB.getHistoryItems(filters);
      if (localData && localData.length > 0) {
        // Cache the data
        this.cacheManager.setHistoryItems(filters, localData);
        return localData;
      }

      return [];

    } catch (error) {
      console.error('Error getting history items:', error);
      return [];
    }
  }

  /**
   * Create history item with sync
   * @param {Object} historyItem - History item data
   * @returns {Promise<Object>} Created history item
   */
  async createHistoryItem(historyItem) {
    try {
      // Generate local ID
      const localId = `local_${Date.now()}_${Math.random()}`;
      const itemWithId = { ...historyItem, id: localId, _local: true };

      // Save to local database
      await this.localDB.saveHistoryItem(itemWithId);

      // Add to sync queue
      this.syncQueue.add({
        type: 'CREATE_HISTORY_ITEM',
        data: itemWithId,
        timestamp: Date.now()
      });

      // Update cache
      this.cacheManager.invalidateHistory();

      // Notify observers immediately (optimistic update)
      this.notify('HISTORY_ITEM_CREATED', itemWithId);
      this.notify('DATA_CHANGED', { type: 'history', action: 'created', data: itemWithId });

      return itemWithId;

    } catch (error) {
      console.error('Error creating history item:', error);
      throw error;
    }
  }

  /**
   * Sync all pending operations
   * @returns {Promise<Object>} Sync result
   */
  async sync() {
    try {
      const pendingOperations = this.syncQueue.getPending();
      const results = [];

      for (const operation of pendingOperations) {
        try {
          // This would be the actual API call in real implementation
          // For now, just mark as synced
          operation.synced = true;
          operation.syncedAt = Date.now();
          
          results.push({ success: true, operation });
        } catch (error) {
          results.push({ success: false, operation, error: error.message });
        }
      }

      // Update sync queue
      this.syncQueue.updateResults(results);

      return { success: true, results };

    } catch (error) {
      console.error('Error during sync:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get sync status
   * @returns {Object} Sync status
   */
  getSyncStatus() {
    return {
      pendingOperations: this.syncQueue.getPending().length,
      lastSync: this.syncQueue.getLastSyncTime(),
      isOnline: this.socketSync.isConnected(),
      cacheStats: this.cacheManager.getStats()
    };
  }

  /**
   * Clear all data (for testing/debugging)
   */
  async clearAllData() {
    await this.localDB.clear();
    this.cacheManager.clear();
    this.syncQueue.clear();
    this.observers.clear();
    this.storeSubscriptions.clear();
  }
}

// Export singleton instance
export const dataSyncManager = new DataSyncManager();
export default dataSyncManager; 