const API_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

/**
 * Send a message to the AI assistant
 * @param {import('./aiAssistantTypes').MessageRequest} message
 * @returns {Promise<import('./aiAssistantTypes').Message>}
 */
export async function sendMessage(message) {
  try {
    const response = await fetch(`${API_URL}/api/messages`, {
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
    if (responseData.status === 'success') {
      return {
        content: responseData.message.payload.content,
        timestamp: responseData.message.timestamp,
        messageId: responseData.message.messageId
      };
    }
    return responseData;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Edit an existing message
 * @param {string} messageId
 * @param {import('./aiAssistantTypes').MessageRequest} message
 * @returns {Promise<import('./aiAssistantTypes').Message>}
 */
export async function editMessage(messageId, message) {
  try {
    const response = await fetch(`${API_URL}/api/messages/${messageId}`, {
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

/**
 * Execute an action on a message
 * @param {string} messageId
 * @param {import('./aiAssistantTypes').MessageRequest} message
 * @returns {Promise<import('./aiAssistantTypes').Message>}
 */
export async function executeAction(messageId, message) {
  try {
    const response = await fetch(`${API_URL}/api/messages/${messageId}/action`, {
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

/**
 * Handle a notification action
 * @param {string} notificationId
 * @param {import('./aiAssistantTypes').MessageRequest} message
 * @returns {Promise<import('./aiAssistantTypes').Message>}
 */
export async function handleNotificationAction(notificationId, message) {
  try {
    const response = await fetch(`${API_URL}/api/notifications/${notificationId}/action`, {
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