/**
 * Type definitions for AIAssistant components
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Unique message identifier
 * @property {string} content - Message content
 * @property {boolean} isAI - Whether the message is from AI
 * @property {string} timestamp - ISO timestamp
 * @property {Object} metadata - Additional message metadata
 * @property {string} [actionStatus] - Status of any action (pending, completed, error)
 * @property {string} [actionError] - Error message if action failed
 * @property {string} [actionResult] - Result of the action
 * @property {string} [parentId] - ID of parent message for replies
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique notification identifier
 * @property {string} type - Notification type (warning, error, info)
 * @property {string} title - Notification title
 * @property {string} description - Notification description
 * @property {Array<NotificationAction>} actions - Available actions
 */

/**
 * @typedef {Object} NotificationAction
 * @property {string} id - Action identifier
 * @property {string} label - Action label
 * @property {Function} handler - Action handler function
 */

/**
 * @typedef {Object} ChatProps
 * @property {Array<Message>} messages - Array of messages
 * @property {boolean} isLoading - Loading state
 * @property {Function} onSendMessage - Function to send a message
 */

/**
 * @typedef {Object} MessageProps
 * @property {Message} message - Message object
 * @property {Function} onReply - Function to handle replies
 * @property {Function} onEdit - Function to handle edits
 * @property {boolean} isLoading - Loading state
 */

export const MESSAGE_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  ERROR: 'error'
};

export const NOTIFICATION_TYPES = {
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info'
}; 