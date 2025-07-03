import { create } from 'zustand';

const useInvoicesStore = create((set, get) => ({
  // UI State
  searchQuery: '',

  // Actions
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // Utility methods
  clearSearch: () => {
    set({ searchQuery: '' });
  },

  // Initialize store
  initialize: () => {
    set({
      searchQuery: '',
    });
  },

  // Cleanup
  cleanup: () => {
    set({
      searchQuery: '',
    });
  }
}));

export default useInvoicesStore;
