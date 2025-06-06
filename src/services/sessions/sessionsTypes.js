/**
 * @typedef {Object} Session
 * @property {string} id - Unique identifier for the session
 * @property {string} tenantId - ID of the tenant
 * @property {string} userId - ID of the user
 * @property {boolean} isActive - Whether the session is currently active
 * @property {Object} metadata - Additional session metadata
 * @property {Date} createdAt - When the session was created
 * @property {Date} updatedAt - When the session was last updated
 * @property {Message[]} messages - Array of messages in the session
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Unique identifier for the message
 * @property {string} messageId - Original message ID
 * @property {string} content - Message content
 * @property {string} sessionId - ID of the session this message belongs to
 * @property {Date} createdAt - When the message was created
 * @property {boolean} isAI - Whether the message is from the AI
 * @property {Object} [metadata] - Additional message metadata
 */

/**
 * @typedef {Object} SessionOptions
 * @property {string} tenantId - ID of the tenant
 * @property {string} userId - ID of the user
 * @property {number} [limit=10] - Number of sessions to return
 * @property {string} [before] - ID of session for pagination
 */

/**
 * @typedef {Object} MessageOptions
 * @property {string} sessionId - ID of the session
 * @property {number} [limit=20] - Number of messages to return
 * @property {string} [before] - ID of message for pagination
 */

export {}; 