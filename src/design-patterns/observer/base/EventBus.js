/**
 * Global Event Bus for cross-feature communication
 * Implements the Observer pattern for loose coupling between features
 */
class EventBus {
  constructor() {
    this.events = new Map();
    this.middleware = [];
    this.recentEvents = new Map(); // Track recent events for deduplication
    this.deduplicationWindow = 100; // 100ms window for deduplication
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Event name
   * @param {Function} callback - Event handler
   * @param {Object} options - Subscription options
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback, options = {}) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const subscription = {
      callback,
      options,
      id: this.generateId()
    };

    this.events.get(eventName).push(subscription);

    // Return unsubscribe function
    return () => this.off(eventName, subscription.id);
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Event name
   * @param {string|Function} identifier - Subscription ID or callback function
   */
  off(eventName, identifier) {
    if (!this.events.has(eventName)) return;

    const subscriptions = this.events.get(eventName);
    
    if (typeof identifier === 'function') {
      // Remove by callback function
      const index = subscriptions.findIndex(sub => sub.callback === identifier);
      if (index !== -1) {
        subscriptions.splice(index, 1);
      }
    } else {
      // Remove by subscription ID
      const index = subscriptions.findIndex(sub => sub.id === identifier);
      if (index !== -1) {
        subscriptions.splice(index, 1);
      }
    }

    // Clean up empty event arrays
    if (subscriptions.length === 0) {
      this.events.delete(eventName);
    }
  }

  /**
   * Check if an event was recently emitted to prevent duplicates
   * @param {string} eventName - Event name
   * @param {*} data - Event data
   * @returns {boolean} True if event was recently emitted
   */
  wasRecentlyEmitted(eventName, data) {
    const now = Date.now();
    const eventKey = `${eventName}:${JSON.stringify(data)}`;
    const recentEvent = this.recentEvents.get(eventKey);
    
    if (recentEvent && (now - recentEvent.timestamp) < this.deduplicationWindow) {
      return true;
    }
    
    // Store this event
    this.recentEvents.set(eventKey, { timestamp: now });
    
    // Clean up old events
    for (const [key, event] of this.recentEvents.entries()) {
      if (now - event.timestamp > this.deduplicationWindow) {
        this.recentEvents.delete(key);
      }
    }
    
    return false;
  }

  /**
   * Emit an event
   * @param {string} eventName - Event name
   * @param {*} data - Event data
   * @param {Object} context - Event context
   */
  emit(eventName, data = null, context = {}) {
    if (!this.events.has(eventName)) return;

    // Check for duplicate events
    if (this.wasRecentlyEmitted(eventName, data)) {
      console.log(`[EventBus] Skipping duplicate event: ${eventName}`);
      return;
    }

    const event = {
      name: eventName,
      data,
      context,
      timestamp: new Date().toISOString(),
      id: this.generateId()
    };

    // Apply middleware
    const processedEvent = this.applyMiddleware(event);
    if (!processedEvent) return; // Middleware blocked the event

    const subscriptions = this.events.get(eventName);
    
    // Execute callbacks
    subscriptions.forEach(subscription => {
      try {
        subscription.callback(processedEvent.data, processedEvent);
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error);
        
        // Emit error event
        this.emit('eventbus:error', {
          eventName,
          error: error.message,
          subscriptionId: subscription.id
        });
      }
    });
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first execution)
   * @param {string} eventName - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  once(eventName, callback) {
    const wrappedCallback = (data, event) => {
      callback(data, event);
      this.off(eventName, wrappedCallback);
    };

    return this.on(eventName, wrappedCallback);
  }

  /**
   * Add middleware to process events
   * @param {Function} middleware - Middleware function
   */
  use(middleware) {
    this.middleware.push(middleware);
  }

  /**
   * Apply middleware to an event
   * @param {Object} event - Event object
   * @returns {Object|null} Processed event or null if blocked
   */
  applyMiddleware(event) {
    let processedEvent = event;
    
    for (const middleware of this.middleware) {
      try {
        processedEvent = middleware(processedEvent);
        if (!processedEvent) return null; // Middleware blocked the event
      } catch (error) {
        console.error('Middleware error:', error);
        return null;
      }
    }
    
    return processedEvent;
  }

  /**
   * Get all registered event names
   * @returns {Array} Array of event names
   */
  getEventNames() {
    return Array.from(this.events.keys());
  }

  /**
   * Get subscription count for an event
   * @param {string} eventName - Event name
   * @returns {number} Number of subscriptions
   */
  getSubscriptionCount(eventName) {
    return this.events.has(eventName) ? this.events.get(eventName).length : 0;
  }

  /**
   * Clear all subscriptions for an event
   * @param {string} eventName - Event name
   */
  clear(eventName) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }

  /**
   * Clear deduplication cache
   */
  clearDeduplicationCache() {
    this.recentEvents.clear();
  }

  /**
   * Set deduplication window
   * @param {number} windowMs - Deduplication window in milliseconds
   */
  setDeduplicationWindow(windowMs) {
    this.deduplicationWindow = windowMs;
  }

  /**
   * Generate unique subscription ID
   * @returns {string} Unique ID
   */
  generateId() {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get event bus statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    const stats = {
      totalEvents: this.events.size,
      totalSubscriptions: 0,
      events: {},
      deduplication: {
        cacheSize: this.recentEvents.size,
        windowMs: this.deduplicationWindow
      }
    };

    for (const [eventName, subscriptions] of this.events) {
      stats.events[eventName] = subscriptions.length;
      stats.totalSubscriptions += subscriptions.length;
    }

    return stats;
  }
}

// Create singleton instance
const eventBus = new EventBus();

// Add default middleware for logging in development
if (import.meta.env.DEV) {
  eventBus.use((event) => {
    return event;
  });
}

export default eventBus; 