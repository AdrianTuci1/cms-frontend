import { create } from 'zustand';
import { FaBuilding, FaStore, FaHome } from 'react-icons/fa';

const useInvoicesStore = create((set, get) => ({
  // State
  searchQuery: '',
  recentInvoices: [
    {
      id: 1,
      number: 'INV-2024-001',
      businessType: 'hotel',
      customer: 'John Smith',
      amount: '€450.00',
      date: '2024-03-15',
      status: 'Paid',
      icon: <FaBuilding />
    },
    {
      id: 2,
      number: 'INV-2024-002',
      businessType: 'restaurant',
      customer: 'Maria Garcia',
      amount: '€125.50',
      date: '2024-03-14',
      status: 'Pending',
      icon: <FaStore />
    },
    {
      id: 3,
      number: 'INV-2024-003',
      businessType: 'apartment',
      customer: 'Alex Johnson',
      amount: '€850.00',
      date: '2024-03-13',
      status: 'Paid',
      icon: <FaHome />
    }
  ],
  billingSuggestions: [
    {
      id: 1,
      customer: 'Sarah Wilson',
      businessType: 'hotel',
      lastVisit: '2024-03-10',
      suggestedAmount: '€380.00',
      icon: <FaBuilding />
    },
    {
      id: 2,
      customer: 'Michael Brown',
      businessType: 'restaurant',
      lastVisit: '2024-03-12',
      suggestedAmount: '€95.00',
      icon: <FaStore />
    },
    {
      id: 3,
      customer: 'Emma Davis',
      businessType: 'apartment',
      lastVisit: '2024-03-08',
      suggestedAmount: '€720.00',
      icon: <FaHome />
    }
  ],

  // Actions
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // Computed values
  getFilteredInvoices: () => {
    const { recentInvoices, searchQuery } = get();
    const searchLower = searchQuery.toLowerCase();
    
    return recentInvoices.filter(invoice => {
      return (
        invoice.number.toLowerCase().includes(searchLower) ||
        invoice.customer.toLowerCase().includes(searchLower) ||
        invoice.amount.toLowerCase().includes(searchLower)
      );
    });
  },

  getFilteredSuggestions: () => {
    const { billingSuggestions, searchQuery } = get();
    const searchLower = searchQuery.toLowerCase();
    
    return billingSuggestions.filter(suggestion => {
      return (
        suggestion.customer.toLowerCase().includes(searchLower) ||
        suggestion.suggestedAmount.toLowerCase().includes(searchLower)
      );
    });
  },

  getTotalItemsCount: () => {
    const { getFilteredInvoices, getFilteredSuggestions } = get();
    return getFilteredInvoices().length + getFilteredSuggestions().length;
  },

  // Business logic methods
  addInvoice: (invoice) => {
    set(state => ({
      recentInvoices: [invoice, ...state.recentInvoices]
    }));
  },

  updateInvoice: (id, updates) => {
    set(state => ({
      recentInvoices: state.recentInvoices.map(invoice =>
        invoice.id === id ? { ...invoice, ...updates } : invoice
      )
    }));
  },

  deleteInvoice: (id) => {
    set(state => ({
      recentInvoices: state.recentInvoices.filter(invoice => invoice.id !== id)
    }));
  },

  addBillingSuggestion: (suggestion) => {
    set(state => ({
      billingSuggestions: [suggestion, ...state.billingSuggestions]
    }));
  },

  removeBillingSuggestion: (id) => {
    set(state => ({
      billingSuggestions: state.billingSuggestions.filter(suggestion => suggestion.id !== id)
    }));
  },

  // Statistics and analytics
  getInvoiceStats: () => {
    const { recentInvoices } = get();
    
    return {
      total: recentInvoices.length,
      paid: recentInvoices.filter(inv => inv.status === 'Paid').length,
      pending: recentInvoices.filter(inv => inv.status === 'Pending').length,
      totalAmount: recentInvoices.reduce((sum, inv) => {
        const amount = parseFloat(inv.amount.replace('€', '').replace(',', ''));
        return sum + amount;
      }, 0),
      byBusinessType: recentInvoices.reduce((acc, inv) => {
        acc[inv.businessType] = (acc[inv.businessType] || 0) + 1;
        return acc;
      }, {})
    };
  },

  getSuggestionStats: () => {
    const { billingSuggestions } = get();
    
    return {
      total: billingSuggestions.length,
      totalSuggestedAmount: billingSuggestions.reduce((sum, suggestion) => {
        const amount = parseFloat(suggestion.suggestedAmount.replace('€', '').replace(',', ''));
        return sum + amount;
      }, 0),
      byBusinessType: billingSuggestions.reduce((acc, suggestion) => {
        acc[suggestion.businessType] = (acc[suggestion.businessType] || 0) + 1;
        return acc;
      }, {})
    };
  },

  // Utility methods
  clearSearch: () => {
    set({ searchQuery: '' });
  },

  // Initialize store
  initialize: () => {
    // This could load data from API in the future
    set({
      searchQuery: '',
      // Data is already initialized in the state above
    });
  },

  // Cleanup
  cleanup: () => {
    set({
      searchQuery: '',
      recentInvoices: [],
      billingSuggestions: []
    });
  }
}));

export default useInvoicesStore;
