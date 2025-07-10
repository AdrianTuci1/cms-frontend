import { create } from 'zustand';

// Mock data for assistants - in a real app this would come from an API
const mockAssistants = {
  'reservation': {
    id: 'reservation',
    name: 'Booking.com',
    description: 'Automated booking management and reservations',
    isActive: true,
    config: {
      apiKey: '',
      responseTime: 'immediate',
      language: 'ro',
      capabilities: ['booking', 'reservations', 'notifications']
    },
    stats: {
      bookingsProcessed: 1247,
      automationsTriggered: 89,
      accuracy: 94.2
    }
  },
  'whatsapp': {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Automated WhatsApp messaging and responses',
    isActive: false,
    config: {
      apiKey: '',
      responseTime: '5min',
      language: 'ro',
      capabilities: ['messaging', 'notifications', 'chat']
    },
    stats: {
      messagesSent: 456,
      automationsTriggered: 23,
      accuracy: 98.1
    }
  },
  'reporting': {
    id: 'reporting',
    name: 'Raportare',
    description: 'Automated reporting and business intelligence',
    isActive: true,
    config: {
      apiKey: '',
      responseTime: '1hour',
      language: 'ro',
      capabilities: ['analysis', 'reporting', 'insights']
    },
    stats: {
      reportsGenerated: 67,
      automationsTriggered: 34,
      accuracy: 96.8
    }
  }
};

// Mock system health data
const mockSystemHealth = {
  overall: 'healthy',
  uptime: 99.8,
  responseTime: 245,
  activeAssistants: 2,
  totalAssistants: 3,
  lastUpdated: new Date().toISOString()
};

// Mock recent activities
const mockRecentActivities = [
  {
    id: 1,
    type: 'automation',
    title: 'Email sent to client',
    description: 'Automated welcome email sent to new client',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 2,
    type: 'analysis',
    title: 'Monthly report generated',
    description: 'Business performance report for October',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 3,
    type: 'chat',
    title: 'Customer inquiry handled',
    description: 'AI assistant responded to pricing question',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'completed'
  }
];

export const useWorkflowsStore = create((set, get) => ({
  // State
  assistants: mockAssistants,
  systemHealth: mockSystemHealth,
  recentActivities: mockRecentActivities,
  isLoading: false,
  error: null,

  // Actions
  toggleAssistant: (assistantId) => {
    set((state) => ({
      assistants: {
        ...state.assistants,
        [assistantId]: {
          ...state.assistants[assistantId],
          isActive: !state.assistants[assistantId].isActive
        }
      }
    }));

    // Update system health after toggle
    const updatedState = get();
    const activeAssistants = Object.values(updatedState.assistants).filter(a => a.isActive).length;
    
    set((state) => ({
      systemHealth: {
        ...state.systemHealth,
        activeAssistants,
        lastUpdated: new Date().toISOString()
      }
    }));
  },

  updateAssistantConfig: (assistantId, config) => {
    set((state) => ({
      assistants: {
        ...state.assistants,
        [assistantId]: {
          ...state.assistants[assistantId],
          config: {
            ...state.assistants[assistantId].config,
            ...config
          }
        }
      }
    }));
  },

  addAssistant: (assistant) => {
    set((state) => ({
      assistants: {
        ...state.assistants,
        [assistant.id]: assistant
      },
      systemHealth: {
        ...state.systemHealth,
        totalAssistants: state.systemHealth.totalAssistants + 1,
        lastUpdated: new Date().toISOString()
      }
    }));
  },

  removeAssistant: (assistantId) => {
    set((state) => {
      const { [assistantId]: removed, ...remainingAssistants } = state.assistants;
      const activeAssistants = Object.values(remainingAssistants).filter(a => a.isActive).length;
      
      return {
        assistants: remainingAssistants,
        systemHealth: {
          ...state.systemHealth,
          activeAssistants,
          totalAssistants: state.systemHealth.totalAssistants - 1,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  },

  updateSystemHealth: (healthData) => {
    set((state) => ({
      systemHealth: {
        ...state.systemHealth,
        ...healthData,
        lastUpdated: new Date().toISOString()
      }
    }));
  },

  addActivity: (activity) => {
    set((state) => ({
      recentActivities: [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...activity
        },
        ...state.recentActivities.slice(0, 9) // Keep only 10 most recent
      ]
    }));
  },

  clearActivities: () => {
    set({ recentActivities: [] });
  },

  // Async actions
  fetchSystemHealth: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be an API call
      const healthData = {
        overall: 'healthy',
        uptime: 99.8,
        responseTime: Math.floor(Math.random() * 100) + 200,
        activeAssistants: Object.values(get().assistants).filter(a => a.isActive).length,
        totalAssistants: Object.keys(get().assistants).length,
        lastUpdated: new Date().toISOString()
      };
      
      set((state) => ({
        systemHealth: healthData,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchRecentActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app, this would be an API call
      const activities = [
        {
          id: Date.now(),
          type: 'automation',
          title: 'New automation triggered',
          description: 'Automated process completed successfully',
          timestamp: new Date().toISOString(),
          status: 'completed'
        },
        ...get().recentActivities.slice(0, 9)
      ];
      
      set({ recentActivities: activities, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Computed values
  getActiveAssistants: () => {
    return Object.values(get().assistants).filter(assistant => assistant.isActive);
  },

  getAssistantStats: () => {
    const assistants = Object.values(get().assistants);
    return {
      total: assistants.length,
      active: assistants.filter(a => a.isActive).length,
      totalMessages: assistants.reduce((sum, a) => sum + (a.stats?.messagesProcessed || 0), 0),
      totalAutomations: assistants.reduce((sum, a) => sum + (a.stats?.automationsTriggered || 0), 0),
      averageAccuracy: assistants.reduce((sum, a) => sum + (a.stats?.accuracy || 0), 0) / assistants.length
    };
  }
}));
