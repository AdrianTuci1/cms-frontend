/**
 * SocketSync - Gestionează sincronizarea în timp real prin WebSocket
 * Implementează Observer Pattern pentru evenimente WebSocket
 */
class SocketSync {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // 1 second
    this.eventListeners = new Map();
    this.url = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.socket = new WebSocket(this.url);
      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Setup WebSocket event handlers
   */
  setupEventHandlers() {
    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isConnected = false;
      this.emit('disconnected', { code: event.code, reason: event.reason });
      
      if (!event.wasClean) {
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  /**
   * Handle incoming WebSocket messages
   * @param {Object} data - Message data
   */
  handleMessage(data) {
    const { type, payload } = data;

    switch (type) {
      case 'appointment_created':
        this.emit('appointment_created', payload);
        break;
      case 'appointment_updated':
        this.emit('appointment_updated', payload);
        break;
      case 'appointment_deleted':
        this.emit('appointment_deleted', payload);
        break;
      case 'history_item_created':
        this.emit('history_item_created', payload);
        break;
      case 'history_item_updated':
        this.emit('history_item_updated', payload);
        break;
      case 'client_updated':
        this.emit('client_updated', payload);
        break;
      case 'sync_request':
        this.emit('sync_request', payload);
        break;
      default:
        console.warn('Unknown WebSocket message type:', type);
    }
  }

  /**
   * Send message to WebSocket server
   * @param {string} type - Message type
   * @param {Object} payload - Message payload
   */
  send(type, payload = {}) {
    if (!this.isConnected) {
      console.warn('WebSocket not connected, cannot send message');
      return;
    }

    try {
      const message = JSON.stringify({ type, payload });
      this.socket.send(message);
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
    }
  }

  /**
   * Subscribe to WebSocket events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    
    this.eventListeners.get(event).add(callback);
    
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Unsubscribe from WebSocket events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  /**
   * Emit event to all listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Schedule reconnection attempt
   */
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
      this.socket = null;
    }
    this.isConnected = false;
  }

  /**
   * Check if connected
   * @returns {boolean} True if connected
   */
  isConnected() {
    return this.isConnected;
  }

  /**
   * Get connection status
   * @returns {Object} Connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      url: this.url
    };
  }

  /**
   * Send authentication message
   * @param {Object} authData - Authentication data
   */
  authenticate(authData) {
    this.send('authenticate', authData);
  }

  /**
   * Subscribe to specific data channels
   * @param {Array} channels - Channels to subscribe to
   */
  subscribe(channels) {
    this.send('subscribe', { channels });
  }

  /**
   * Unsubscribe from specific data channels
   * @param {Array} channels - Channels to unsubscribe from
   */
  unsubscribe(channels) {
    this.send('unsubscribe', { channels });
  }
}

export default SocketSync; 