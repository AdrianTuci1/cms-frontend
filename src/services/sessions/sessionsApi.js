const API_URL_SESSIONS = import.meta.env.VITE_API_URL_SESSIONS || 'http://localhost:3001/api';

/**
 * Load sessions for a user
 * @param {import('./sessionsTypes').SessionOptions} options
 * @returns {Promise<import('./sessionsTypes').Session[]>}
 */
export async function loadSessions({ tenantId, userId, limit = 10, before = null }) {
  try {
    const url = new URL(`${API_URL_SESSIONS}/conversations/sessions`);
    url.searchParams.append('tenantId', tenantId);
    url.searchParams.append('userId', userId);
    url.searchParams.append('limit', limit.toString());
    if (before) {
      url.searchParams.append('before', before);
    }

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

/**
 * Load a specific session
 * @param {string} tenantId
 * @param {string} sessionId
 * @returns {Promise<import('./sessionsTypes').Session>}
 */
export async function loadSession(tenantId, sessionId) {
  try {
    const response = await fetch(`${API_URL_SESSIONS}/conversations/${tenantId}/sessions/${sessionId}`);
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

/**
 * Load messages for a session
 * @param {import('./sessionsTypes').MessageOptions} options
 * @returns {Promise<import('./sessionsTypes').Message[]>}
 */
export async function loadMessages({ sessionId, limit = 20, before = null }) {
  try {
    const url = new URL(`${API_URL_SESSIONS}/conversations/${sessionId}/messages`);
    url.searchParams.append('limit', limit.toString());
    if (before) {
      url.searchParams.append('before', before);
    }

    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to load messages');
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
    console.error('Error loading messages:', error);
    throw error;
  }
}

/**
 * Create a new session
 * @param {string} tenantId
 * @param {string} userId
 * @param {string} sessionId
 * @returns {Promise<import('./sessionsTypes').Session>}
 */
export async function createSession(tenantId, userId, sessionId) {
  try {
    const response = await fetch(`${API_URL_SESSIONS}/conversations/${tenantId}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenant_id: tenantId,
        userId,
        sessionId
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create session');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Close a session
 * @param {string} tenantId
 * @param {string} sessionId
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function closeSession(tenantId, sessionId, userId) {
  try {
    const response = await fetch(`${API_URL_SESSIONS}/conversations/${tenantId}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenant_id: tenantId,
        userId
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to close session');
    }
  } catch (error) {
    console.error('Error closing session:', error);
    throw error;
  }
} 