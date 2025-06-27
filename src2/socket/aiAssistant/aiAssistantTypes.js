/**
 * @typedef {Object} Message
 * @property {string} content - Message content
 * @property {string} timestamp - When the message was sent
 * @property {string} messageId - Unique identifier for the message
 * @property {string} type - Message type (e.g., 'agent.response')
 * @property {string} role - Message role (e.g., 'agent', 'user')
 * @property {boolean} isAI - Whether the message is from the AI
 * @property {Object} [metadata] - Additional message metadata
 */

/**
 * @typedef {Object} MessageContext
 * @property {string} [lastAgentMessage] - Last message from the agent
 * @property {Object} [metadata] - Additional context metadata
 */

/**
 * @typedef {Object} MessagePayload
 * @property {string} content - Message content
 * @property {Object} context - Message context
 * @property {string} [action] - Action type (e.g., 'edit')
 * @property {string} [messageId] - Message ID for actions
 */

/**
 * @typedef {Object} MessageRequest
 * @property {string} tenant_id - Tenant ID
 * @property {string} userId - User ID
 * @property {string} sessionId - Session ID
 * @property {MessagePayload} payload - Message payload
 */

/**
 * @typedef {Object} SocketMessage
 * @property {string} event - Event type (e.g., 'new_message')
 * @property {string} type - Message type
 * @property {Object} payload - Message payload
 */

/**
 * @typedef {Object} WorkerMessage
 * @property {string} type - Message type
 * @property {Object} [message] - Message data
 * @property {string} [error] - Error message
 */

export {}; 