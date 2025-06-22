import { OfflineError } from '../types.js';

/**
 * Offline Queue using Command Pattern
 * Manages offline actions and their execution when connection is restored
 */
class OfflineQueue {
  constructor() {
    if (OfflineQueue.instance) {
      return OfflineQueue.instance;
    }
    
    this.queue = new Map();
    this.isProcessing = false;
    this.maxRetries = 3;
    this.storageKey = 'offline_queue';
    
    // Load existing queue from storage
    this.loadFromStorage();
    
    OfflineQueue.instance = this;
  }

  /**
   * Generate unique ID for queue item
   * @returns {string} Unique ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add action to offline queue
   * @param {Object} action - Action to queue
   * @param {string} action.endpoint - API endpoint
   * @param {string} action.method - HTTP method
   * @param {*} action.payload - Request payload
   * @param {number} action.tenantId - Tenant ID
   * @param {number} action.locationId - Location ID
   * @returns {string} Queue item ID
   */
  addToQueue(action) {
    const id = this.generateId();
    const queueItem = {
      id,
      tenantId: action.tenantId,
      locationId: action.locationId,
      endpoint: action.endpoint,
      method: action.method,
      payload: action.payload,
      status: 'pending',
      retryCount: 0,
      maxRetries: this.maxRetries,
      createdAt: new Date().toISOString(),
    };

    this.queue.set(id, queueItem);
    this.saveToStorage();
    
    return id;
  }

  /**
   * Get queue item by ID
   * @param {string} id - Queue item ID
   * @returns {Object|null} Queue item or null
   */
  getQueueItem(id) {
    return this.queue.get(id) || null;
  }

  /**
   * Get all pending queue items
   * @returns {Array} Array of pending queue items
   */
  getPendingItems() {
    return Array.from(this.queue.values()).filter(item => item.status === 'pending');
  }

  /**
   * Update queue item status
   * @param {string} id - Queue item ID
   * @param {string} status - New status
   * @param {string} [error] - Error message if failed
   */
  updateItemStatus(id, status, error = null) {
    const item = this.queue.get(id);
    if (item) {
      item.status = status;
      item.processedAt = new Date().toISOString();
      
      if (error) {
        item.error = error;
      }
      
      this.saveToStorage();
    }
  }

  /**
   * Increment retry count for queue item
   * @param {string} id - Queue item ID
   */
  incrementRetryCount(id) {
    const item = this.queue.get(id);
    if (item) {
      item.retryCount++;
      this.saveToStorage();
    }
  }

  /**
   * Remove completed items from queue
   * @param {number} maxAge - Maximum age in hours for completed items
   */
  cleanupCompletedItems(maxAge = 24) {
    const cutoffTime = new Date(Date.now() - maxAge * 60 * 60 * 1000);
    
    for (const [id, item] of this.queue.entries()) {
      if (
        (item.status === 'completed' || item.status === 'failed') &&
        new Date(item.processedAt) < cutoffTime
      ) {
        this.queue.delete(id);
      }
    }
    
    this.saveToStorage();
  }

  /**
   * Process all pending queue items
   * @param {Function} executeAction - Function to execute the action
   * @returns {Promise<Array>} Array of processing results
   */
  async processQueue(executeAction) {
    if (this.isProcessing) {
      throw new OfflineError('Queue is already being processed');
    }

    this.isProcessing = true;
    const results = [];

    try {
      const pendingItems = this.getPendingItems();
      
      for (const item of pendingItems) {
        try {
          this.updateItemStatus(item.id, 'processing');
          
          await executeAction(item);
          
          this.updateItemStatus(item.id, 'completed');
          results.push({ id: item.id, status: 'success' });
          
        } catch (error) {
          this.incrementRetryCount(item.id);
          
          if (item.retryCount >= item.maxRetries) {
            this.updateItemStatus(item.id, 'failed', error.message);
            results.push({ id: item.id, status: 'failed', error: error.message });
          } else {
            this.updateItemStatus(item.id, 'pending');
            results.push({ id: item.id, status: 'retry', error: error.message });
          }
        }
      }
    } finally {
      this.isProcessing = false;
    }

    return results;
  }

  /**
   * Save queue to localStorage
   */
  saveToStorage() {
    try {
      const queueData = Array.from(this.queue.values());
      localStorage.setItem(this.storageKey, JSON.stringify(queueData));
    } catch (error) {
      console.error('Failed to save offline queue to storage:', error);
    }
  }

  /**
   * Load queue from localStorage
   */
  loadFromStorage() {
    try {
      const queueData = localStorage.getItem(this.storageKey);
      if (queueData) {
        const items = JSON.parse(queueData);
        this.queue = new Map(items.map(item => [item.id, item]));
      }
    } catch (error) {
      console.error('Failed to load offline queue from storage:', error);
      this.queue = new Map();
    }
  }

  /**
   * Clear entire queue
   */
  clearQueue() {
    this.queue.clear();
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Get queue statistics
   * @returns {Object} Queue statistics
   */
  getStats() {
    const items = Array.from(this.queue.values());
    
    return {
      total: items.length,
      pending: items.filter(item => item.status === 'pending').length,
      processing: items.filter(item => item.status === 'processing').length,
      completed: items.filter(item => item.status === 'completed').length,
      failed: items.filter(item => item.status === 'failed').length,
    };
  }

  /**
   * Check if queue has pending items
   * @returns {boolean} True if queue has pending items
   */
  hasPendingItems() {
    return this.getPendingItems().length > 0;
  }

  /**
   * Get queue size
   * @returns {number} Number of items in queue
   */
  getSize() {
    return this.queue.size;
  }
}

// Export singleton instance
export const offlineQueue = new OfflineQueue();
export default offlineQueue; 