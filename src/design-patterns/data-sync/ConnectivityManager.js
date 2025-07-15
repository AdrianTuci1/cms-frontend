/**
 * Connectivity Manager - Handles server connectivity and offline mode
 * Manages connectivity for both auth/resources server and business info server
 */

import eventBus from '../observer/base/EventBus';

class ConnectivityManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.authResourcesServerOnline = false;
    this.businessInfoServerOnline = false;
    this.offlineMode = false;
    this.pingInProgress = false;
    this.lastPingTime = null;
    this.pingInterval = 30000; // 30 seconds
    this.pingTimeoutMs = 5000; // 5 seconds timeout for ping
    
    // Get server URLs from environment
    this.authResourcesServerUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    this.businessInfoServerUrl = import.meta.env.VITE_BUSINESS_INFO_URL || this.authResourcesServerUrl;
    
    this.setupNetworkListeners();
    
    // Initial connectivity check on startup
    this.checkConnectivity();
  }

  /**
   * Setup network event listeners
   */
  setupNetworkListeners() {
    const handleOnline = () => {
      this.isOnline = true;
      console.log('ConnectivityManager: Browser detected online');
      this.checkConnectivity();
    };

    const handleOffline = () => {
      this.isOnline = false;
      this.setOfflineMode(true);
      console.log('ConnectivityManager: Browser detected offline');
      eventBus.emit('connectivity:offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }

  /**
   * Check connectivity to both servers
   */
  async checkConnectivity() {
    if (this.pingInProgress) {
      return;
    }

    this.pingInProgress = true;
    this.lastPingTime = Date.now();

    try {
      // Check auth/resources server
      const authResourcesOnline = await this.pingServer(this.authResourcesServerUrl);
      
      // Check business info server (if different)
      let businessInfoOnline = authResourcesOnline;
      if (this.businessInfoServerUrl !== this.authResourcesServerUrl) {
        businessInfoOnline = await this.pingServer(this.businessInfoServerUrl);
      }

      this.authResourcesServerOnline = authResourcesOnline;
      this.businessInfoServerOnline = businessInfoOnline;

      // Determine overall connectivity status
      const wasOffline = this.offlineMode;
      const shouldBeOffline = !authResourcesOnline && !businessInfoOnline;
      
      this.setOfflineMode(shouldBeOffline);

      // Emit specific server status events
      if (authResourcesOnline !== this.authResourcesServerOnline) {
        eventBus.emit('connectivity:auth-resources-server', { 
          online: authResourcesOnline,
          url: this.authResourcesServerUrl 
        });
      }

      if (businessInfoOnline !== this.businessInfoServerOnline) {
        eventBus.emit('connectivity:business-info-server', { 
          online: businessInfoOnline,
          url: this.businessInfoServerUrl 
        });
      }

      // Emit connectivity change events
      if (wasOffline && !this.offlineMode) {
        console.log('ConnectivityManager: Coming back online');
        eventBus.emit('connectivity:online');
      } else if (!wasOffline && this.offlineMode) {
        console.log('ConnectivityManager: Going offline');
        eventBus.emit('connectivity:offline');
      }

      console.log(`ConnectivityManager: Auth/Resources server: ${authResourcesOnline ? 'online' : 'offline'}`);
      console.log(`ConnectivityManager: Business info server: ${businessInfoOnline ? 'online' : 'offline'}`);
      console.log(`ConnectivityManager: Overall status: ${this.offlineMode ? 'offline' : 'online'}`);

    } catch (error) {
      console.error('ConnectivityManager: Error checking connectivity:', error);
      this.setOfflineMode(true);
      eventBus.emit('connectivity:offline');
    } finally {
      this.pingInProgress = false;
    }
  }

  /**
   * Ping a specific server to check if it's responding
   * @param {string} serverUrl - Server URL to ping
   * @returns {boolean} True if server is responsive
   */
  async pingServer(serverUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.pingTimeoutMs);

      const response = await fetch(`${serverUrl}/api/health`, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-cache',
        mode: 'cors'
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      // Any error (network, timeout, etc.) means server is not reachable
      return false;
    }
  }

  /**
   * Set offline mode and emit events
   * @param {boolean} offline - Whether to set offline mode
   */
  setOfflineMode(offline) {
    if (this.offlineMode !== offline) {
      this.offlineMode = offline;
      
      if (offline) {
        console.log('ConnectivityManager: Entering offline mode');
        eventBus.emit('connectivity:mode-changed', { offline: true });
      } else {
        console.log('ConnectivityManager: Entering online mode');
        eventBus.emit('connectivity:mode-changed', { offline: false });
      }
    }
  }

  /**
   * Check if we're in offline mode
   * @returns {boolean} True if in offline mode
   */
  isOffline() {
    return this.offlineMode;
  }

  /**
   * Check if auth/resources server is online
   * @returns {boolean} True if auth/resources server is online
   */
  isAuthResourcesServerOnline() {
    return this.authResourcesServerOnline && !this.offlineMode;
  }

  /**
   * Check if business info server is online
   * @returns {boolean} True if business info server is online
   */
  isBusinessInfoServerOnline() {
    return this.businessInfoServerOnline && !this.offlineMode;
  }

  /**
   * Force offline mode (useful for testing or manual override)
   */
  forceOfflineMode() {
    console.log('ConnectivityManager: Forced offline mode');
    this.setOfflineMode(true);
    this.authResourcesServerOnline = false;
    this.businessInfoServerOnline = false;
  }

  /**
   * Force online mode (triggers connectivity check)
   */
  forceOnlineMode() {
    console.log('ConnectivityManager: Forced online mode - checking connectivity');
    this.checkConnectivity();
  }

  /**
   * Get connectivity status summary
   * @returns {Object} Connectivity status object
   */
  getStatus() {
    return {
      isOnline: this.isOnline,
      offlineMode: this.offlineMode,
      authResourcesServerOnline: this.authResourcesServerOnline,
      businessInfoServerOnline: this.businessInfoServerOnline,
      lastPingTime: this.lastPingTime,
      authResourcesServerUrl: this.authResourcesServerUrl,
      businessInfoServerUrl: this.businessInfoServerUrl
    };
  }

  /**
   * Start periodic connectivity checks
   */
  startPeriodicChecks() {
    if (this.pingIntervalId) {
      return; // Already started
    }

    this.pingIntervalId = setInterval(() => {
      if (!this.offlineMode && this.isOnline) {
        this.checkConnectivity();
      }
    }, this.pingInterval);

    console.log(`ConnectivityManager: Started periodic checks every ${this.pingInterval}ms`);
  }

  /**
   * Stop periodic connectivity checks
   */
  stopPeriodicChecks() {
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
      console.log('ConnectivityManager: Stopped periodic checks');
    }
  }

  /**
   * Dispose of the connectivity manager
   */
  dispose() {
    this.stopPeriodicChecks();
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }
}

export function createConnectivityManager() {
  return new ConnectivityManager();
}

export default ConnectivityManager; 