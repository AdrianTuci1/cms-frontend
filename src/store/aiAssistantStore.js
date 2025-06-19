import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import assistantData from '../data/conversations.json';
import aiResponses from '../data/aiResponses.json';
import { AIAssistantService } from '../services/aiAssistant';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Initial state
const initialState = {
  messages: [],
  notifications: assistantData.assistant.notifications,
  dismissedNotifications: [],
  isLoading: false
};

// Actions
const createActions = (set, get) => ({
  // Message actions
  sendMessage: async (content, parentId = null) => {
    console.log('AI Assistant store - sendMessage called:', { content, parentId });
    const timestamp = new Date().toISOString();
    const userMessageId = `user_${Date.now()}`;  // Prefix user messages
    
    // Add user message
    set(state => {
      console.log('AI Assistant store - adding user message to state');
      return {
        messages: [...state.messages, {
          id: userMessageId,
          content,
          isAI: false,
          timestamp,
          parentId,
          replies: []
        }]
      };
    });

    set({ isLoading: true });
    try {
      await AIAssistantService.sendMessage(content, parentId);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessageId = `error_${Date.now()}`;  // Prefix error messages
      set(state => ({
        messages: [...state.messages, {
          id: errorMessageId,
          content: aiResponses.assistant.errorMessages.general,
          isAI: true,
          timestamp: new Date().toISOString(),
          parentId,
          replies: []
        }]
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  // Add message handler
  addMessage: (message) => {
    console.log('AI Assistant store - addMessage called:', message);
    console.log('Raw message received in store:', message);
    console.log('Message type:', message.type);
    console.log('Message role:', message.role);
    
    // Check both type and role to determine if it's an AI message
    const isAIMessage = message.type === 'agent.response' || message.role === 'agent';
    console.log('Is AI message?', isAIMessage);
    
    // Ensure unique ID by prefixing based on type/role
    const messageId = `${isAIMessage ? 'ai_' : 'user_'}${message.messageId}`;
    
    const formattedMessage = {
      id: messageId,
      content: message.content,
      isAI: isAIMessage,
      timestamp: message.timestamp,
      parentId: null,
      replies: [],
      metadata: message.metadata
    };
    
    console.log('Formatted message for store:', formattedMessage);
    console.log('Final isAI value:', formattedMessage.isAI);
    
    set(state => {
      console.log('AI Assistant store - adding formatted message to state');
      return {
        messages: [...state.messages, formattedMessage]
      };
    });
  },

  editMessage: async (messageId, newContent) => {
    set(state => ({
      messages: state.messages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            content: newContent,
            actionStatus: 'pending',
            actionResult: null,
            actionError: null
          };
        }
        return msg;
      })
    }));

    try {
      const data = await AIAssistantService.editMessage(messageId, newContent);
      
      set(state => ({
        messages: state.messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              actionStatus: 'completed',
              actionResult: data.result
            };
          }
          return msg;
        })
      }));
    } catch (error) {
      console.error('Error editing message:', error);
      set(state => ({
        messages: state.messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              actionStatus: 'error',
              actionError: error.message
            };
          }
          return msg;
        })
      }));
    }
  },

  executeAction: async (messageId, action) => {
    set(state => ({
      messages: state.messages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            actionStatus: 'pending'
          };
        }
        return msg;
      })
    }));

    try {
      const data = await AIAssistantService.executeAction(messageId, action);
      
      set(state => ({
        messages: state.messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              actionStatus: 'completed',
              actionResult: data.result
            };
          }
          return msg;
        })
      }));
    } catch (error) {
      console.error('Error executing action:', error);
      set(state => ({
        messages: state.messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              actionStatus: 'error',
              actionError: error.message
            };
          }
          return msg;
        })
      }));
    }
  },

  clearMessages: async () => {
    try {
      await AIAssistantService.clearMessages();
    } catch (error) {
      console.error('Error clearing messages:', error);
    } finally {
      // Always clear local state
      set({ messages: [] });
    }
  },

  // Notification actions
  handleNotificationAction: async (notificationId, actionId) => {
    const notification = get().notifications.find(n => n.id === notificationId);
    const action = notification?.actions.find(a => a.id === actionId);

    if (!notification || !action) return;

    set({ isLoading: true });
    try {
      // Add action message
      const messageId = Date.now();
      set(state => ({
        messages: [...state.messages, {
          id: messageId,
          content: `Processing: ${action.label} for ${notification.title}`,
          isAI: true,
          timestamp: new Date().toISOString(),
          parentId: null,
          replies: [],
          actionStatus: 'pending'
        }]
      }));

      const data = await AIAssistantService.handleNotificationAction(notificationId, actionId);

      set(state => ({
        messages: state.messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              actionStatus: 'completed',
              actionResult: data.result
            };
          }
          return msg;
        })
      }));

      // Handle dismiss action
      if (action.action === 'dismiss_notification') {
        set(state => ({
          dismissedNotifications: [...state.dismissedNotifications, notificationId]
        }));
      }
    } catch (error) {
      console.error('Error handling notification action:', error);
      set(state => ({
        messages: state.messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              actionStatus: 'error',
              actionError: error.message
            };
          }
          return msg;
        })
      }));
    } finally {
      set({ isLoading: false });
    }
  }
});

// Create store with persistence
const useAIAssistantStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      ...createActions(set, get),
    }),
    {
      name: 'ai-assistant-storage',
      partialize: (state) => ({
        messages: state.messages,
        dismissedNotifications: state.dismissedNotifications
      })
    }
  )
);

// Subscribe to socket messages
AIAssistantService.addMessageHandler((message) => {
  useAIAssistantStore.getState().addMessage(message);
});

export default useAIAssistantStore; 