import { create } from 'zustand';

// Mock data for triggers - in a real app this would come from an API
const mockTriggers = [
  {
    id: 'new-booking',
    name: 'Rezervare Nouă',
    description: 'Se activează când un client face o nouă rezervare',
    isActive: true,
    type: 'booking',
    conditions: [
      {
        field: 'status',
        operator: 'equals',
        value: 'new'
      }
    ],
    actions: [
      {
        type: 'email',
        template: 'welcome-email',
        recipients: ['client']
      },
      {
        type: 'notification',
        message: 'Nouă rezervare primită',
        recipients: ['admin']
      }
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    executionCount: 156,
    lastExecuted: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-cancellation',
    name: 'Anulare Rezervare',
    description: 'Se activează când un client anulează o rezervare',
    isActive: true,
    type: 'booking',
    conditions: [
      {
        field: 'status',
        operator: 'equals',
        value: 'cancelled'
      }
    ],
    actions: [
      {
        type: 'email',
        template: 'cancellation-email',
        recipients: ['client']
      },
      {
        type: 'notification',
        message: 'Rezervare anulată',
        recipients: ['admin']
      }
    ],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    executionCount: 23,
    lastExecuted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'new-rating',
    name: 'Rating Nou',
    description: 'Se activează când un client adaugă un nou rating',
    isActive: false,
    type: 'rating',
    conditions: [
      {
        field: 'rating',
        operator: 'greater_than',
        value: 0
      }
    ],
    actions: [
      {
        type: 'email',
        template: 'thank-you-rating',
        recipients: ['client']
      },
      {
        type: 'notification',
        message: 'Nou rating primit',
        recipients: ['admin']
      }
    ],
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    executionCount: 89,
    lastExecuted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const useRulesStore = create((set, get) => ({
  // State
  triggers: mockTriggers,
  isLoading: false,
  error: null,
  selectedTrigger: null,
  isEditing: false,

  // Actions
  toggleTrigger: (triggerId) => {
    set((state) => ({
      triggers: state.triggers.map(trigger =>
        trigger.id === triggerId
          ? { ...trigger, isActive: !trigger.isActive }
          : trigger
      )
    }));
  },

  addTrigger: (trigger) => {
    const newTrigger = {
      ...trigger,
      id: `trigger-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionCount: 0,
      lastExecuted: null
    };

    set((state) => ({
      triggers: [...state.triggers, newTrigger]
    }));
  },

  updateTrigger: (triggerId, updates) => {
    set((state) => ({
      triggers: state.triggers.map(trigger =>
        trigger.id === triggerId
          ? { ...trigger, ...updates, updatedAt: new Date().toISOString() }
          : trigger
      )
    }));
  },

  deleteTrigger: (triggerId) => {
    set((state) => ({
      triggers: state.triggers.filter(trigger => trigger.id !== triggerId),
      selectedTrigger: state.selectedTrigger?.id === triggerId ? null : state.selectedTrigger
    }));
  },

  selectTrigger: (triggerId) => {
    const trigger = get().triggers.find(t => t.id === triggerId);
    set({ selectedTrigger: trigger });
  },

  clearSelection: () => {
    set({ selectedTrigger: null, isEditing: false });
  },

  setEditing: (isEditing) => {
    set({ isEditing });
  },

  // Trigger execution
  executeTrigger: (triggerId) => {
    set((state) => ({
      triggers: state.triggers.map(trigger =>
        trigger.id === triggerId
          ? {
              ...trigger,
              executionCount: trigger.executionCount + 1,
              lastExecuted: new Date().toISOString()
            }
          : trigger
      )
    }));
  },

  // Bulk operations
  toggleAllTriggers: (isActive) => {
    set((state) => ({
      triggers: state.triggers.map(trigger => ({
        ...trigger,
        isActive
      }))
    }));
  },

  deleteMultipleTriggers: (triggerIds) => {
    set((state) => ({
      triggers: state.triggers.filter(trigger => !triggerIds.includes(trigger.id)),
      selectedTrigger: triggerIds.includes(state.selectedTrigger?.id) ? null : state.selectedTrigger
    }));
  },

  // Async actions
  fetchTriggers: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be an API call
      // For now, we'll just use the mock data
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  saveTrigger: async (trigger) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (trigger.id) {
        // Update existing trigger
        get().updateTrigger(trigger.id, trigger);
      } else {
        // Add new trigger
        get().addTrigger(trigger);
      }
      
      set({ isLoading: false, isEditing: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteTriggerAsync: async (triggerId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      get().deleteTrigger(triggerId);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Computed values
  getActiveTriggers: () => {
    return get().triggers.filter(trigger => trigger.isActive);
  },

  getInactiveTriggers: () => {
    return get().triggers.filter(trigger => !trigger.isActive);
  },

  getTriggersByType: (type) => {
    return get().triggers.filter(trigger => trigger.type === type);
  },

  getTriggerStats: () => {
    const triggers = get().triggers;
    return {
      total: triggers.length,
      active: triggers.filter(t => t.isActive).length,
      inactive: triggers.filter(t => !t.isActive).length,
      totalExecutions: triggers.reduce((sum, t) => sum + t.executionCount, 0),
      averageExecutions: triggers.length > 0 
        ? triggers.reduce((sum, t) => sum + t.executionCount, 0) / triggers.length 
        : 0
    };
  },

  // Validation
  validateTrigger: (trigger) => {
    const errors = [];
    
    if (!trigger.name || trigger.name.trim().length === 0) {
      errors.push('Numele trigger-ului este obligatoriu');
    }
    
    if (!trigger.description || trigger.description.trim().length === 0) {
      errors.push('Descrierea trigger-ului este obligatorie');
    }
    
    if (!trigger.type) {
      errors.push('Tipul trigger-ului este obligatoriu');
    }
    
    if (!trigger.conditions || trigger.conditions.length === 0) {
      errors.push('Cel puțin o condiție este obligatorie');
    }
    
    if (!trigger.actions || trigger.actions.length === 0) {
      errors.push('Cel puțin o acțiune este obligatorie');
    }
    
    return errors;
  }
}));
