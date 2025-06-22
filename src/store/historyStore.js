import { create } from 'zustand';
import { dataSyncManager } from '../services/dataSync/DataSyncManager.js';

const useHistoryStore = create((set, get) => ({
  // State
  historyItems: [],
  isLoading: false,
  error: null,
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
      const historyItems = await dataSyncManager.getHistoryItems({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });

      set({ 
        historyItems,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error loading history items:', error);
      set({ 
        error: error.message || 'Failed to load history items',
        isLoading: false 
      });
    }
  },

  // Create history item
  createHistoryItem: async (historyItem) => {
    try {
      const newItem = await dataSyncManager.createHistoryItem(historyItem);
      
      // The store will be updated automatically via observer
      // But we can also update optimistically here
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
    const unsubscribeHistoryCreated = dataSyncManager.subscribe(
      'HISTORY_ITEM_CREATED',
      (data) => {
        console.log('HistoryStore: Received HISTORY_ITEM_CREATED event', data);
        set(state => ({
          historyItems: [data, ...state.historyItems]
        }));
      },
      'HistoryStore'
    );

    const unsubscribeHistoryUpdated = dataSyncManager.subscribe(
      'HISTORY_ITEM_UPDATED',
      (data) => {
        console.log('HistoryStore: Received HISTORY_ITEM_UPDATED event', data);
        set(state => ({
          historyItems: state.historyItems.map(item =>
            item.id === data.id ? { ...item, ...data } : item
          )
        }));
      },
      'HistoryStore'
    );

    const unsubscribeDataChanged = dataSyncManager.subscribe(
      'DATA_CHANGED',
      (data) => {
        console.log('HistoryStore: Received DATA_CHANGED event', data);
        
        // Handle general data changes
        if (data.type === 'history') {
          switch (data.action) {
            case 'created':
              set(state => ({
                historyItems: [data.data, ...state.historyItems]
              }));
              break;
            case 'updated':
              set(state => ({
                historyItems: state.historyItems.map(item =>
                  item.id === data.data.id ? { ...item, ...data.data } : item
                )
              }));
              break;
            case 'deleted':
              set(state => ({
                historyItems: state.historyItems.filter(item => item.id !== data.data.id)
              }));
              break;
          }
        }
      },
      'HistoryStore'
    );

    // Store unsubscribe functions for cleanup
    set({ 
      _unsubscribeFunctions: [
        unsubscribeHistoryCreated,
        unsubscribeHistoryUpdated,
        unsubscribeDataChanged
      ]
    });
  },

  // Cleanup subscriptions
  cleanup: () => {
    const { _unsubscribeFunctions } = get();
    if (_unsubscribeFunctions) {
      _unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    }
    set({ _unsubscribeFunctions: [] });
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
  }
}));

export default useHistoryStore; 