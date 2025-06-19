/**
 * AIAssistant Module
 * Complete AI Assistant chat functionality
 * 
 * This module provides a modern, organized structure for the AI Assistant
 * with proper separation of concerns, reusable hooks, and utility functions.
 */

// Main components
export { AIAssistantChat } from './components';
export { Chat, ChatInput, Message } from './components';

// Custom hooks
export { useClickOutside, useAutoScroll } from './hooks';

// Utility functions
export { formatTimestamp, createMessage, validateMessage, getMessageStatus } from './utils';

// Types and constants
export { MESSAGE_STATUS, NOTIFICATION_TYPES } from './types';

// Default export for the main component
export { default } from './components/AIAssistantChat'; 