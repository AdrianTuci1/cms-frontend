/**
 * WebSocket Manager - Handles WebSocket connections and message processing
 */

import eventBus from '../observer/base/EventBus';

class WebSocketManager {
  constructor() {
    this.socket = null;
  }

  /**
   * Setup WebSocket connection
   * @param {string} url - WebSocket URL
   */
  setupWebSocket(url) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      eventBus.emit('datasync:socket-connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleSocketMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      eventBus.emit('datasync:socket-disconnected');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      eventBus.emit('datasync:socket-error', error);
    };
  }

  /**
   * Handle incoming WebSocket messages
   * @param {Object} message - WebSocket message
   */
  async handleSocketMessage(message) {
    const { type, resource, data } = message;

    try {
      // Emit event for features to react
      eventBus.emit(`${resource}:socket-update`, data);
      eventBus.emit('datasync:socket-message', { type, resource, data });
    } catch (error) {
      console.error('Error handling socket message:', error);
    }
  }

  /**
   * Sync data via WebSocket
   * @param {string} resource - Resource name
   * @param {Object} data - Data to sync
   * @param {Object} config - Resource config
   */
  async syncViaSocket(resource, data, config) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    const event = config.socketEvents[0]; // Use first event type
    const message = {
      type: event,
      resource,
      data,
      timestamp: new Date().toISOString()
    };

    this.socket.send(JSON.stringify(message));
  }

  /**
   * Send message via WebSocket
   * @param {Object} message - Message to send
   */
  sendMessage(message) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    this.socket.send(JSON.stringify(message));
  }

  /**
   * Close WebSocket connection
   */
  closeConnection() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Get WebSocket instance
   */
  getSocket() {
    return this.socket;
  }

  /**
   * Get WebSocket ready state
   */
  getReadyState() {
    return this.socket ? this.socket.readyState : WebSocket.CLOSED;
  }
}

export function createWebSocketManager() {
  return new WebSocketManager();
} 