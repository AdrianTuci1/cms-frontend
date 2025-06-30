/**
 * Utility functions for message handling
 */

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const createMessage = (content, isAI = false, metadata = {}) => {
  return {
    id: Date.now(),
    content,
    isAI,
    timestamp: new Date().toISOString(),
    metadata
  };
};

export const validateMessage = (message) => {
  return message && 
         typeof message.content === 'string' && 
         message.content.trim().length > 0;
};

export const getMessageStatus = (message) => {
  if (!message.actionStatus) return null;
  
  const statusMap = {
    pending: 'Processing...',
    completed: 'Completed',
    error: `Error: ${message.actionError || 'Unknown error'}`
  };
  
  return statusMap[message.actionStatus] || null;
}; 