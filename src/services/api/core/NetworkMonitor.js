/**
 * Network Monitor using Observer Pattern
 * Monitors network connectivity and notifies subscribers of changes
 */
class NetworkMonitor {
  constructor() {
    if (NetworkMonitor.instance) {
      return NetworkMonitor.instance;
    }
    
    this.isOnline = navigator.onLine;
    this.subscribers = new Set();
    this.connectionQuality = 'unknown';
    this.lastCheck = Date.now();
    this.checkInterval = null;
    
    this.initialize();
    NetworkMonitor.instance = this;
  }

  /**
   * Initialize network monitoring
   */
  initialize() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Start periodic connection quality checks
    this.startPeriodicCheck();
  }

  /**
   * Subscribe to network status changes
   * @param {Function} callback - Callback function to execute on status change
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    
    // Immediately call with current status
    callback({
      isOnline: this.isOnline,
      connectionQuality: this.connectionQuality,
      lastCheck: this.lastCheck
    });
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notify all subscribers of status change
   * @param {Object} status - Current network status
   */
  notifySubscribers(status) {
    this.subscribers.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in network status callback:', error);
      }
    });
  }

  /**
   * Handle online event
   */
  handleOnline() {
    this.isOnline = true;
    this.checkConnectionQuality();
    this.notifySubscribers({
      isOnline: this.isOnline,
      connectionQuality: this.connectionQuality,
      lastCheck: this.lastCheck
    });
  }

  /**
   * Handle offline event
   */
  handleOffline() {
    this.isOnline = false;
    this.connectionQuality = 'offline';
    this.lastCheck = Date.now();
    
    this.notifySubscribers({
      isOnline: this.isOnline,
      connectionQuality: this.connectionQuality,
      lastCheck: this.lastCheck
    });
  }

  /**
   * Check connection quality by making a test request
   */
  async checkConnectionQuality() {
    if (!this.isOnline) {
      this.connectionQuality = 'offline';
      return;
    }

    const startTime = Date.now();
    
    try {
      // Make a lightweight request to check connection
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Determine connection quality based on response time
      if (responseTime < 200) {
        this.connectionQuality = 'excellent';
      } else if (responseTime < 500) {
        this.connectionQuality = 'good';
      } else if (responseTime < 1000) {
        this.connectionQuality = 'fair';
      } else {
        this.connectionQuality = 'poor';
      }
      
    } catch (error) {
      // If health check fails, try a more basic connectivity test
      try {
        await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(3000)
        });
        this.connectionQuality = 'poor';
      } catch (fallbackError) {
        this.connectionQuality = 'offline';
        this.isOnline = false;
      }
    }
    
    this.lastCheck = Date.now();
  }

  /**
   * Start periodic connection quality checks
   */
  startPeriodicCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    
    this.checkInterval = setInterval(() => {
      this.checkConnectionQuality();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Stop periodic connection quality checks
   */
  stopPeriodicCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Get current network status
   * @returns {Object} Current network status
   */
  getStatus() {
    return {
      isOnline: this.isOnline,
      connectionQuality: this.connectionQuality,
      lastCheck: this.lastCheck
    };
  }

  /**
   * Check if currently online
   * @returns {boolean} True if online
   */
  isCurrentlyOnline() {
    return this.isOnline;
  }

  /**
   * Get connection quality
   * @returns {string} Connection quality
   */
  getConnectionQuality() {
    return this.connectionQuality;
  }

  /**
   * Force a connection quality check
   */
  async forceCheck() {
    await this.checkConnectionQuality();
    this.notifySubscribers({
      isOnline: this.isOnline,
      connectionQuality: this.connectionQuality,
      lastCheck: this.lastCheck
    });
  }

  /**
   * Cleanup resources
   */
  destroy() {
    this.stopPeriodicCheck();
    this.subscribers.clear();
    window.removeEventListener('online', () => this.handleOnline());
    window.removeEventListener('offline', () => this.handleOffline());
  }
}

// Export singleton instance
export const networkMonitor = new NetworkMonitor();
export default networkMonitor; 