import { create } from 'zustand';
// import DataSyncManager from '../../../design-patterns/data-sync/DataSyncManager.js';

const useHistoryStore = create((set, get) => ({
  // State
  historyItems: [],
  isLoading: false,
  error: null,
  
  // UI State (moved from component)
  search: '',
  selectedDate: '2025-03-19',
  selectedTypes: [],
  timeRange: 'all',
  customRange: null,
  
  filters: {
    dateFrom: null,
    dateTo: null,
    type: null,
    status: null,
    initiatedBy: null
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0
  },

  // Mock data (moved from component)
  mockHistoryData: [
    {
      id: 1,
      timestamp: '2025-03-19 10:30',
      title: 'Check-out camera 101',
      type: 'checkout',
      details: 'Camera 101 mutată în status murdar',
      user: {
        name: 'Ana Popescu',
        role: 'Receptioner',
        avatar: 'AP',
        isAI: false
      }
    },
    {
      id: 2,
      timestamp: '2025-03-19 11:15',
      title: 'Problemă raportată camera 202',
      type: 'problem',
      details: 'Aer condiționat defect',
      user: {
        name: 'AI Assistant',
        role: 'AI',
        avatar: '🤖',
        isAI: true
      }
    },
    {
      id: 3,
      timestamp: '2025-03-19 12:00',
      title: 'Curățenie camera 303',
      type: 'cleaning',
      details: 'Curățenie finalizată în 15 min',
      user: {
        name: 'Elena Popa',
        role: 'Cameristă',
        avatar: 'EP',
        isAI: false
      }
    },
    {
      id: 4,
      timestamp: '2025-03-19 13:30',
      title: 'Sugestie optimizare program',
      type: 'suggestion',
      details: 'Programul de curățenie poate fi optimizat pentru etajul 2',
      user: {
        name: 'AI Assistant',
        role: 'AI',
        avatar: '🤖',
        isAI: true
      }
    },
    {
      id: 5,
      timestamp: '2025-03-19 14:45',
      title: 'Check-in camera 205',
      type: 'checkout',
      details: 'Clientul a sosit cu 2 ore înainte de check-in. Camera era disponibilă și a fost alocată imediat.',
      user: {
        name: 'Maria Ionescu',
        role: 'Receptioner',
        avatar: 'MI',
        isAI: false
      }
    },
    {
      id: 6,
      timestamp: '2025-03-19 15:20',
      title: 'Solicitare servicii camera 402',
      type: 'service',
      details: 'Clientul a solicitat servicii de room service: 2 cafele și desert',
      user: {
        name: 'AI Assistant',
        role: 'AI',
        avatar: '🤖',
        isAI: true
      }
    },
    {
      id: 7,
      timestamp: '2025-03-19 16:00',
      title: 'Mentenanță camera 202',
      type: 'maintenance',
      details: 'Aer condiționat reparat și testat. Funcționează normal.',
      user: {
        name: 'Ion Popa',
        role: 'Tehnician',
        avatar: 'IP',
        isAI: false
      }
    },
    {
      id: 8,
      timestamp: '2025-03-19 16:30',
      title: 'Curățenie camera 101',
      type: 'cleaning',
      details: 'Curățenie completă finalizată. Toate lenjerii schimbate.',
      user: {
        name: 'Sofia Dumitrescu',
        role: 'Cameristă',
        avatar: 'SD',
        isAI: false
      }
    },
    {
      id: 9,
      timestamp: '2025-03-19 17:15',
      title: 'Raport inventar',
      type: 'report',
      details: 'Inventarul zilnic finalizat. Toate articolele prezente și în stare bună.',
      user: {
        name: 'Alexandru Marin',
        role: 'Manager',
        avatar: 'AM',
        isAI: false
      }
    },
    {
      id: 10,
      timestamp: '2025-03-19 18:00',
      title: 'Sugestie optimizare energie',
      type: 'suggestion',
      details: 'Consumul de energie poate fi redus cu 15% prin ajustarea programului de aer condiționat',
      user: {
        name: 'AI Assistant',
        role: 'AI',
        avatar: '🤖',
        isAI: true
      }
    },
    {
      id: 11,
      timestamp: '2025-03-19 19:30',
      title: 'Check-in camera 505',
      type: 'checkout',
      details: 'Check-in finalizat. Documentele verificate și copiate.',
      user: {
        name: 'Ana Popescu',
        role: 'Receptioner',
        avatar: 'AP',
        isAI: false
      }
    },
    {
      id: 12,
      timestamp: '2025-03-19 20:15',
      title: 'Solicitare asistență',
      type: 'service',
      details: 'Clientul din camera 303 a solicitat asistență pentru conectarea la WiFi',
      user: {
        name: 'AI Assistant',
        role: 'AI',
        avatar: '🤖',
        isAI: true
      }
    }
  ],

  // UI Actions (moved from component)
  setSearch: (search) => set({ search }),
  
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  
  setTimeRange: (timeRange) => set({ timeRange }),
  
  setCustomRange: (customRange) => set({ customRange }),
  
  toggleType: (type) => {
    set(state => ({
      selectedTypes: state.selectedTypes.includes(type)
        ? state.selectedTypes.filter(t => t !== type)
        : [...state.selectedTypes, type]
    }));
  },

  // Actions
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().loadHistoryItems();
  },

  setPagination: (pagination) => {
    set({ pagination: { ...get().pagination, ...pagination } });
    get().loadHistoryItems();
  },

  // Data loading
  loadHistoryItems: async () => {
    set({ isLoading: true, error: null });

    try {
      const { filters, pagination } = get();
      // const historyItems = await DataSyncManager.getHistoryItems({
      //   ...filters,
      //   page: pagination.page,
      //   limit: pagination.limit
      // });
      
      // For now, use mock data
      const historyItems = get().mockHistoryData;
      
      set({ 
        historyItems,
        isLoading: false,
        pagination: { ...pagination, total: historyItems.length }
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Create history item
  createHistoryItem: async (historyItem) => {
    try {
      // const newItem = await DataSyncManager.createHistoryItem(historyItem);
      
      // For now, just add to mock data
      const newItem = {
        id: Date.now(),
        ...historyItem,
        timestamp: new Date().toISOString()
      };
      
      set(state => ({
        historyItems: [newItem, ...state.historyItems]
      }));
      
      return newItem;
    } catch (error) {
      console.error('Error creating history item:', error);
      throw error;
    }
  },

  // Update history item
  updateHistoryItem: async (id, updates) => {
    try {
      // This would be implemented in DataSyncManager
      // For now, just update locally
      set(state => ({
        historyItems: state.historyItems.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      }));
    } catch (error) {
      console.error('Error updating history item:', error);
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Initialize store and subscribe to DataSyncManager
  initialize: () => {
    // Load initial data
    get().loadHistoryItems();

    // Subscribe to DataSyncManager events
    // const unsubscribeHistoryCreated = DataSyncManager.subscribe(
    //   'HISTORY_ITEM_CREATED',
    //   (data) => {
    //     console.log('HistoryStore: Received HISTORY_ITEM_CREATED event', data);
    //     set(state => ({
    //       historyItems: [data, ...state.historyItems]
    //     }));
    //   },
    //   'HistoryStore'
    // );

    // const unsubscribeHistoryUpdated = DataSyncManager.subscribe(
    //   'HISTORY_ITEM_UPDATED',
    //   (data) => {
    //     console.log('HistoryStore: Received HISTORY_ITEM_UPDATED event', data);
    //     set(state => ({
    //       historyItems: state.historyItems.map(item =>
    //         item.id === data.id ? { ...item, ...data } : item
    //       )
    //     }));
    //   },
    //   'HistoryStore'
    // );

    // const unsubscribeDataChanged = DataSyncManager.subscribe(
    //   'DATA_CHANGED',
    //   (data) => {
    //     console.log('HistoryStore: Received DATA_CHANGED event', data);
    //     
    //     // Handle general data changes
    //     if (data.type === 'history') {
    //       switch (data.action) {
    //         case 'created':
    //           set(state => ({
    //             historyItems: [data.data, ...state.historyItems]
    //           }));
    //           break;
    //         case 'updated':
    //           set(state => ({
    //             historyItems: state.historyItems.map(item =>
    //               item.id === data.data.id ? { ...item, ...data.data } : item
    //             )
    //           }));
    //           break;
    //         case 'deleted':
    //           set(state => ({
    //             historyItems: state.historyItems.filter(item => item.id !== data.data.id)
    //           }));
    //           break;
    //       }
    //     }
    //   },
    //   'HistoryStore'
    // );

    // // Store unsubscribe functions for cleanup
    // set({ 
    //   _unsubscribeFunctions: [
    //     unsubscribeHistoryCreated,
    //     unsubscribeHistoryUpdated,
    //     unsubscribeDataChanged
    //   ]
    // });
  },

  // Cleanup subscriptions
  cleanup: () => {
    // const { _unsubscribeFunctions } = get();
    // if (_unsubscribeFunctions) {
    //   _unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    // }
    // set({ _unsubscribeFunctions: [] });
  },

  // Computed values
  getFilteredHistoryItems: () => {
    const { historyItems, filters } = get();
    
    return historyItems.filter(item => {
      // Date range filter
      if (filters.dateFrom && new Date(item.date) < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && new Date(item.date) > new Date(filters.dateTo)) {
        return false;
      }

      // Type filter
      if (filters.type && item.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status && item.status !== filters.status) {
        return false;
      }

      // Initiated by filter
      if (filters.initiatedBy && item.initiatedBy?.id !== filters.initiatedBy) {
        return false;
      }

      return true;
    });
  },

  getHistoryStats: () => {
    const items = get().getFilteredHistoryItems();
    
    return {
      total: items.length,
      byType: items.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {}),
      byStatus: items.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {}),
      byDate: items.reduce((acc, item) => {
        const date = item.date.split('T')[0]; // YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {})
    };
  },

  // Get current history data (combines real data with mock data for now)
  getCurrentHistoryData: () => {
    const { historyItems, mockHistoryData } = get();
    // For now, return mock data. In production, this would return historyItems
    return mockHistoryData;
  }
}));

export default useHistoryStore; 