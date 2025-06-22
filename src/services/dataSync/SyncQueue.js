/**
 * SyncQueue - Gestionează coada de operații pentru sincronizare
 * Implementează Command Pattern pentru operații
 */
class SyncQueue {
  constructor() {
    this.queue = [];
    this.lastSyncTime = null;
  }

  /**
   * Add operation to sync queue
   * @param {Object} operation - Operation to add
   */
  add(operation) {
    const queueItem = {
      id: `sync_${Date.now()}_${Math.random()}`,
      ...operation,
      synced: false,
      syncedAt: null,
      retryCount: 0,
      maxRetries: 3,
      createdAt: Date.now()
    };

    this.queue.push(queueItem);
    this.saveToStorage();
  }

  /**
   * Get pending operations
   * @returns {Array} Pending operations
   */
  getPending() {
    return this.queue.filter(item => !item.synced);
  }

  /**
   * Get failed operations
   * @returns {Array} Failed operations
   */
  getFailed() {
    return this.queue.filter(item => 
      item.synced === false && item.retryCount >= item.maxRetries
    );
  }

  /**
   * Update operation results
   * @param {Array} results - Sync results
   */
  updateResults(results) {
    results.forEach(result => {
      const operation = this.queue.find(item => item.id === result.operation.id);
      if (operation) {
        if (result.success) {
          operation.synced = true;
          operation.syncedAt = Date.now();
        } else {
          operation.retryCount++;
          operation.lastError = result.error;
        }
      }
    });

    this.lastSyncTime = Date.now();
    this.saveToStorage();
  }

  /**
   * Retry failed operations
   */
  retryFailed() {
    const failed = this.getFailed();
    failed.forEach(operation => {
      operation.retryCount = 0;
      operation.lastError = null;
    });
  }

  /**
   * Get last sync time
   * @returns {number|null} Last sync timestamp
   */
  getLastSyncTime() {
    return this.lastSyncTime;
  }

  /**
   * Get queue statistics
   * @returns {Object} Queue statistics
   */
  getStats() {
    const pending = this.getPending();
    const failed = this.getFailed();
    const synced = this.queue.filter(item => item.synced);

    return {
      total: this.queue.length,
      pending: pending.length,
      failed: failed.length,
      synced: synced.length,
      lastSync: this.lastSyncTime
    };
  }

  /**
   * Clear queue
   */
  clear() {
    this.queue = [];
    this.lastSyncTime = null;
    this.saveToStorage();
  }

  /**
   * Save queue to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('syncQueue', JSON.stringify({
        queue: this.queue,
        lastSyncTime: this.lastSyncTime
      }));
    } catch (error) {
      console.error('Failed to save sync queue to storage:', error);
    }
  }

  /**
   * Load queue from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('syncQueue');
      if (stored) {
        const data = JSON.parse(stored);
        this.queue = data.queue || [];
        this.lastSyncTime = data.lastSyncTime || null;
      }
    } catch (error) {
      console.error('Failed to load sync queue from storage:', error);
    }
  }
}

export default SyncQueue; 