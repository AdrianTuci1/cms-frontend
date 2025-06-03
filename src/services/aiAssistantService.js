const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_URL_SESSIONS = import.meta.env.VITE_API_URL_SESSIONS || 'http://localhost:3001/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

class AIAssistantService {
  constructor() {
    this.worker = null;
    this.messageHandlers = new Set();
    this.errorHandlers = new Set();
    this.messageQueue = [];
    this.isConnected = false;
    this.tenantId = import.meta.env.VITE_TENANT_ID || 'test-00001';
    this.userId = import.meta.env.VITE_USER_ID || 'user123';
    this.sessionId = null;
    this.lastAgentMessage = null;
    this.initWorker();
    this.initializeSession();
  }

  generateSessionId() {
    return 'session' + Date.now().toString(36);
  }

  async initializeSession() {
    try {
      // First try to get active sessions
      const sessions = await this.loadSessions(1);
      const activeSession = sessions.find(session => session.isActive);

      if (activeSession) {
        this.sessionId = activeSession.id;
        console.log('Using existing session:', this.sessionId);
      } else {
        // Create a new session if no active session exists
        const response = await fetch(`${API_URL}/conversations/${this.tenantId}/sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tenant_id: this.tenantId,
            userId: this.userId,
            sessionId: this.generateSessionId()
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create new session');
        }

        const data = await response.json();
        this.sessionId = data.sessionId;
        console.log('Created new session:', this.sessionId);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      // Fallback to generated session ID if API fails
      this.sessionId = this.generateSessionId();
      console.log('Using fallback session:', this.sessionId);
    }
  }

  initWorker() {
    this.worker = new Worker(new URL('../workers/socketWorker.js', import.meta.url), { type: 'module' });

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
          console.log('Received socket message:', message);
          if (message.type === 'agent.response') {
            this.lastAgentMessage = message.payload.content;
            // Extract display information for agent messages
            const displayMessage = {
              content: message.payload.content,
              metadata: message.payload.context?.metadata,
              timestamp: message.timestamp,
              messageId: message.messageId
            };
            console.log('Processing agent message:', displayMessage);
            this.messageHandlers.forEach(handler => handler(displayMessage));
          } else if (message.type === 'user.message') {
            // Extract display information for user messages
            const displayMessage = {
              content: message.payload.content,
              timestamp: message.timestamp,
              messageId: message.messageId
            };
            console.log('Processing user message:', displayMessage);
            this.messageHandlers.forEach(handler => handler(displayMessage));
          }
          break;
      }
    };

    this.connect();
  }

  connect() {
    this.worker.postMessage({
      type: 'CONNECT',
      data: { 
        url: `ws://${SOCKET_URL}/socket/websocket`,
        tenantId: this.tenantId
      }
    });
  }

  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler);
  }

  addErrorHandler(handler) {
    this.errorHandlers.add(handler);
  }

  removeErrorHandler(handler) {
    this.errorHandlers.delete(handler);
  }

  async sendMessage(content, context = {}) {
    // Ensure we have a valid session
    if (!this.sessionId) {
      await this.initializeSession();
    }

    const message = {
      tenant_id: this.tenantId,
      userId: this.userId,
      sessionId: this.sessionId,
      payload: {
        content,
        context: {
          lastAgentMessage: this.lastAgentMessage,
          ...context
        }
      }
    };

    console.log('Preparing to send message:', message);

    if (!this.isConnected) {
      console.log('Socket not connected, queueing message');
      this.messageQueue.push(message);
      return;
    }

    try {
      console.log('Sending message to API:', message);
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send message');
      }

      const responseData = await response.json();
      console.log('API response:', responseData);
      
      // Handle the wrapped response format
      if (responseData.status === 'success') {
        const result = {
          content: responseData.message.payload.content,
          timestamp: responseData.message.timestamp,
          messageId: responseData.message.messageId
        };
        console.log('Message sent successfully:', result);
        return result;
      }
      return responseData;
    } catch (error) {
      console.error('Error sending message:', error);
      this.messageQueue.push(message);
      throw error;
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message.payload.content, message.payload.context);
    }
  }

  async editMessage(messageId, newContent) {
    const message = {
      tenant_id: this.tenantId,
      userId: this.userId,
      sessionId: this.sessionId,
      payload: {
        content: newContent,
        action: 'edit',
        messageId,
        context: {
          lastAgentMessage: this.lastAgentMessage
        }
      }
    };

    try {
      const response = await fetch(`${API_URL}/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to edit message');
      }

      const responseData = await response.json();
      if (responseData.status === 'success') {
        return {
          content: responseData.message.payload.content,
          timestamp: responseData.message.timestamp,
          messageId: responseData.message.messageId
        };
      }
      return responseData;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  async executeAction(messageId, action) {
    const message = {
      tenant_id: this.tenantId,
      userId: this.userId,
      sessionId: this.sessionId,
      payload: {
        action,
        messageId,
        context: {
          lastAgentMessage: this.lastAgentMessage
        }
      }
    };

    try {
      const response = await fetch(`${API_URL}/messages/${messageId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to execute action');
      }

      const responseData = await response.json();
      if (responseData.status === 'success') {
        return {
          content: responseData.message.payload.content,
          timestamp: responseData.message.timestamp,
          messageId: responseData.message.messageId
        };
      }
      return responseData;
    } catch (error) {
      console.error('Error executing action:', error);
      throw error;
    }
  }

  async clearMessages() {
    try {
      // First try to close the current session
      if (this.sessionId) {
        await fetch(`${API_URL}/conversations/${this.tenantId}/sessions/${this.sessionId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tenant_id: this.tenantId,
            userId: this.userId
          })
        });
      }

      // Create a new session
      await this.initializeSession();

      return { status: 'success' };
    } catch (error) {
      console.error('Error clearing messages:', error);
      throw error;
    }
  }

  async handleNotificationAction(notificationId, actionId) {
    const message = {
      tenant_id: this.tenantId,
      userId: this.userId,
      sessionId: this.sessionId,
      payload: {
        notificationId,
        actionId,
        context: {
          lastAgentMessage: this.lastAgentMessage
        }
      }
    };

    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to handle notification action');
      }

      const responseData = await response.json();
      if (responseData.status === 'success') {
        return {
          content: responseData.message.payload.content,
          timestamp: responseData.message.timestamp,
          messageId: responseData.message.messageId
        };
      }
      return responseData;
    } catch (error) {
      console.error('Error handling notification action:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.worker) {
      this.worker.postMessage({ type: 'DISCONNECT' });
      this.isConnected = false;
    }
  }

  async loadMessageHistory(limit = 20, before = null) {
    try {
      const url = new URL(`${API_URL_SESSIONS}/conversations/${this.tenantId}/sessions/${this.sessionId}/messages`);
      url.searchParams.append('limit', limit.toString());
      if (before) {
        url.searchParams.append('before', before);
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load message history');
      }

      const data = await response.json();
      return data.messages.map(message => ({
        id: message.messageId,
        content: message.payload.content,
        isAI: message.type === 'agent.response',
        timestamp: message.timestamp,
        metadata: message.payload.context?.metadata
      }));
    } catch (error) {
      console.error('Error loading message history:', error);
      throw error;
    }
  }

  async loadSessions(limit = 10) {
    try {
      const url = new URL(`${API_URL_SESSIONS}/conversations/sessions`);
      url.searchParams.append('tenantId', this.tenantId);
      url.searchParams.append('userId', this.userId);
      url.searchParams.append('limit', limit.toString());

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load sessions');
      }

      return response.json();
    } catch (error) {
      console.error('Error loading sessions:', error);
      throw error;
    }
  }

  async loadSession(sessionId) {
    try {
      const response = await fetch(`${API_URL_SESSIONS}/conversations/${this.tenantId}/sessions/${sessionId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load session');
      }

      return response.json();
    } catch (error) {
      console.error('Error loading session:', error);
      throw error;
    }
  }
}

export default new AIAssistantService(); 