import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import assistantData from '../data/conversations.json';
import aiResponses from '../data/aiResponses.json';
import aiAssistantService from '../services/aiAssistantService';

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
    const timestamp = new Date().toISOString();
    const messageId = Date.now();
    
    // Add user message
    set(state => ({
      messages: [...state.messages, {
        id: messageId,
        content,
        isAI: false,
        timestamp,
        parentId,
        replies: []
      }]
    }));

    set({ isLoading: true });
    try {
      const data = await aiAssistantService.sendMessage(content, parentId);
      
      // Add AI response
      set(state => ({
        messages: [...state.messages, {
          id: data.id,
          content: data.content,
          isAI: true,
          timestamp: data.timestamp,
          parentId,
          replies: []
        }]
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      set(state => ({
        messages: [...state.messages, {
          id: Date.now(),
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
      const data = await aiAssistantService.editMessage(messageId, newContent);
      
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
      const data = await aiAssistantService.executeAction(messageId, action);
      
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
      await aiAssistantService.clearMessages();
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

      const data = await aiAssistantService.handleNotificationAction(notificationId, actionId);

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

export default useAIAssistantStore; 