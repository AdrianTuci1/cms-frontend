import { SessionsService } from '../sessions';
import * as aiAssistantApi from './aiAssistantApi';
import socketManager from './socketManager';

class AIAssistantService {
  constructor() {
    this.tenantId = import.meta.env.VITE_TENANT_ID || 'test-00001';
    this.userId = import.meta.env.VITE_USER_ID || 'user123';
    this.lastAgentMessage = null;
    this.init();
  }

  /**
   * Initialize the service
   */
  async init() {
    socketManager.initWorker(this.tenantId);
    await this.initializeSession();
  }

  /**
   * Initialize a new session
   */
  async initializeSession() {
    try {
      await SessionsService.initializeSession();
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  }

  /**
   * Send a message to the AI assistant
   * @param {string} content - Message content
   * @param {import('./aiAssistantTypes').MessageContext} [context={}] - Message context
   * @returns {Promise<import('./aiAssistantTypes').Message>}
   */
  async sendMessage(content, context = {}) {
    const sessionId = SessionsService.getCurrentSessionId();
    if (!sessionId) {
      await this.initializeSession();
    }

    const message = {
      tenant_id: this.tenantId,
      userId: this.userId,
      sessionId: SessionsService.getCurrentSessionId(),
      payload: {
        content,
        context: {
          lastAgentMessage: this.lastAgentMessage,
          ...context
        }
      }
    };

    console.log('Preparing to send message:', message);

    if (!socketManager.isSocketConnected()) {
      console.log('Socket not connected, queueing message');
      socketManager.queueMessage(message);
      return;
    }

    try {
      return await aiAssistantApi.sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      socketManager.queueMessage(message);
      throw error;
    }
  }

  /**
   * Edit an existing message
   * @param {string} messageId - ID of the message to edit
   * @param {string} newContent - New message content
   * @returns {Promise<import('./aiAssistantTypes').Message>}
   */
  async editMessage(messageId, newContent) {
    const message = {
      tenant_id: this.tenantId,
      userId: this.userId,
      sessionId: SessionsService.getCurrentSessionId(),
      payload: {
        content: newContent,
        action: 'edit',
        messageId,
        context: {
          lastAgentMessage: this.lastAgentMessage
        }
      }
    };

    return aiAssistantApi.editMessage(messageId, message);
  }

  /**
   * Execute an action on a message
   * @param {string} messageId - ID of the message
   * @param {string} action - Action to execute
   * @returns {Promise<import('./aiAssistantTypes').Message>}
   */
  async executeAction(messageId, action) {
    const message = {
      tenant_id: this.tenantId,
      userId: this.userId,
      sessionId: SessionsService.getCurrentSessionId(),
      payload: {
        action,
        messageId,
        context: {
          lastAgentMessage: this.lastAgentMessage
        }
      }
    };

    return aiAssistantApi.executeAction(messageId, message);
  }

  /**
   * Handle a notification action
   * @param {string} notificationId - ID of the notification
   * @param {string} actionId - ID of the action
   * @returns {Promise<import('./aiAssistantTypes').Message>}
   */
  async handleNotificationAction(notificationId, actionId) {
    const message = {
      tenant_id: this.tenantId,
      userId: this.userId,
      sessionId: SessionsService.getCurrentSessionId(),
      payload: {
        notificationId,
        actionId,
        context: {
          lastAgentMessage: this.lastAgentMessage
        }
      }
    };

    return aiAssistantApi.handleNotificationAction(notificationId, message);
  }

  /**
   * Clear all messages and start a new session
   * @returns {Promise<{status: string}>}
   */
  async clearMessages() {
    try {
      await SessionsService.closeSession();
      await this.initializeSession();
      return { status: 'success' };
    } catch (error) {
      console.error('Error clearing messages:', error);
      throw error;
    }
  }

  /**
   * Add a message handler
   * @param {Function} handler - Message handler function
   */
  addMessageHandler(handler) {
    socketManager.addMessageHandler(handler);
  }

  /**
   * Remove a message handler
   * @param {Function} handler - Message handler function
   */
  removeMessageHandler(handler) {
    socketManager.removeMessageHandler(handler);
  }

  /**
   * Add an error handler
   * @param {Function} handler - Error handler function
   */
  addErrorHandler(handler) {
    socketManager.addErrorHandler(handler);
  }

  /**
   * Remove an error handler
   * @param {Function} handler - Error handler function
   */
  removeErrorHandler(handler) {
    socketManager.removeErrorHandler(handler);
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    socketManager.disconnect();
  }

  /**
   * Load message history
   * @param {number} [limit=20] - Number of messages to return
   * @param {string} [before] - ID of message for pagination
   * @returns {Promise<import('./aiAssistantTypes').Message[]>}
   */
  async loadMessageHistory(limit = 20, before = null) {
    return SessionsService.loadMessages(limit, before);
  }

  /**
   * Load sessions
   * @param {number} [limit=10] - Number of sessions to return
   * @returns {Promise<import('../sessions/sessionsTypes').Session[]>}
   */
  async loadSessions(limit = 10) {
    return SessionsService.loadSessions(limit);
  }

  /**
   * Load a specific session
   * @param {string} sessionId - ID of the session
   * @returns {Promise<import('../sessions/sessionsTypes').Session>}
   */
  async loadSession(sessionId) {
    return SessionsService.loadSession(sessionId);
  }
}

export default new AIAssistantService(); 