import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import assistantData from '../data/conversations.json';

const useAIAssistantStore = create(
  persist(
    (set, get) => ({
      // State
      messages: [],
      notifications: assistantData.assistant.notifications,
      dismissedNotifications: [],
      isLoading: false,

      // Actions
      sendMessage: async (content) => {
        // Add user message
        set(state => ({
          messages: [...state.messages, {
            id: Date.now(),
            content,
            isAI: false,
            timestamp: new Date().toISOString()
          }]
        }));

        // Simulate AI response
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          set(state => ({
            messages: [...state.messages, {
              id: Date.now() + 1,
              content: `I'll help you with "${content}"`,
              isAI: true,
              timestamp: new Date().toISOString()
            }]
          }));
        } catch (error) {
          console.error('Error sending message:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      handleNotificationAction: async (notificationId, actionId) => {
        const notification = get().notifications.find(n => n.id === notificationId);
        const action = notification?.actions.find(a => a.id === actionId);

        if (!notification || !action) return;

        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Add action message
          set(state => ({
            messages: [...state.messages, {
              id: Date.now(),
              content: `Processing: ${action.label} for ${notification.title}`,
              isAI: true,
              timestamp: new Date().toISOString()
            }]
          }));

          // If action is dismiss, add to dismissed notifications
          if (action.action === 'dismiss_notification') {
            set(state => ({
              dismissedNotifications: [...state.dismissedNotifications, notificationId]
            }));
          }
        } catch (error) {
          console.error('Error handling notification action:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      handleQuickAction: async (actionId) => {
        const action = assistantData.assistant.quickActions.find(a => a.id === actionId);
        if (!action) return;

        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));

          set(state => ({
            messages: [...state.messages, {
              id: Date.now(),
              content: `Starting action: ${action.title}`,
              isAI: true,
              timestamp: new Date().toISOString()
            }]
          }));
        } catch (error) {
          console.error('Error handling quick action:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearMessages: () => {
        set({ messages: [] });
      }
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