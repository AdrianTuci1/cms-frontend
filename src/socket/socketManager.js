const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

class SocketManager {
  constructor() {
    this.worker = null;
    this.messageHandlers = new Set();
    this.errorHandlers = new Set();
    this.isConnected = false;
    this.messageQueue = [];
  }

  /**
   * Initialize the WebSocket worker
   * @param {string} tenantId - Tenant ID
   */
  initWorker(tenantId) {
    this.worker = new Worker(new URL('../../workers/socketWorker.js', import.meta.url), { type: 'module' });

    this.worker.onmessage = (event) => {
      const { type, message, error } = event.data;
      console.log('Received worker message:', { type, message, error });

      switch (type) {
        case 'SOCKET_CONNECTED':
          console.log('Socket connected');
          this.isConnected = true;
          this.processMessageQueue();
          break;
        case 'SOCKET_DISCONNECTED':
          console.log('Socket disconnected');
          this.isConnected = false;
          break;
        case 'SOCKET_ERROR':
          console.error('Socket error:', error);
          this.errorHandlers.forEach(handler => handler(new Error(error)));
          break;
        case 'SOCKET_MESSAGE':
          this.handleSocketMessage(message);
          break;
      }
    };

    this.connect(tenantId);
  }

  /**
   * Handle incoming socket messages
   * @param {import('./aiAssistantTypes').SocketMessage} message
   */
  handleSocketMessage(message) {
    console.log('Received socket message:', message);
    if (message.event === 'new_message') {
      const payload = message.payload;
      console.log('Processing socket payload:', payload);
      console.log('Message type from socket:', message.type);
      
      // Handle both user messages and agent responses
      const isAIMessage = message.type === 'agent.response' || payload.role === 'agent';
      console.log('Is AI message?', isAIMessage);
      
      const displayMessage = {
        content: payload.content,
        timestamp: payload.timestamp,
        messageId: payload.message_id,
        type: message.type,
        role: payload.role,
        isAI: isAIMessage,
        metadata: payload.context?.metadata
      };
      
      console.log('Sending to message handlers:', displayMessage);
      this.messageHandlers.forEach(handler => handler(displayMessage));
    }
  }

  /**
   * Connect to the WebSocket server
   * @param {string} tenantId - Tenant ID
   */
  connect(tenantId) {
    this.worker.postMessage({
      type: 'CONNECT',
      data: { 
        url: `ws://${SOCKET_URL}/socket/websocket`,
        tenantId
      }
    });
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.worker) {
      this.worker.postMessage({ type: 'DISCONNECT' });
      this.isConnected = false;
    }
  }

  /**
   * Add a message handler
   * @param {Function} handler - Message handler function
   */
  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
  }

  /**
   * Remove a message handler
   * @param {Function} handler - Message handler function
   */
  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler);
  }

  /**
   * Add an error handler
   * @param {Function} handler - Error handler function
   */
  addErrorHandler(handler) {
    this.errorHandlers.add(handler);
  }

  /**
   * Remove an error handler
   * @param {Function} handler - Error handler function
   */
  removeErrorHandler(handler) {
    this.errorHandlers.delete(handler);
  }

  /**
   * Queue a message for sending
   * @param {import('./aiAssistantTypes').MessageRequest} message
   */
  queueMessage(message) {
    this.messageQueue.push(message);
  }

  /**
   * Process the message queue
   */
  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      // The actual sending will be handled by the AIAssistantService
      this.messageHandlers.forEach(handler => handler({ type: 'QUEUED_MESSAGE', message }));
    }
  }

  /**
   * Check if the socket is connected
   * @returns {boolean}
   */
  isSocketConnected() {
    return this.isConnected;
  }
}

export default new SocketManager(); 