import { create } from 'zustand';
import { getBusinessType } from '../../../../src/config/businessTypes';

const businessType = getBusinessType();

// Drawer types
export const DRAWER_TYPES = {
  APPOINTMENT: 'appointment',
  STOCK: 'stock',
  MEMBER: 'member',
  SERVICE: 'service',
  AI_ASSISTANT: 'ai-assistant'
};

// Drawer modes
export const DRAWER_MODES = {
  CREATE: 'create',
  VIEW: 'view',
  EDIT: 'edit',
  DELETE: 'delete'
};

// Business type specific configurations
const BUSINESS_TYPE_CONFIGS = {
  'Dental Clinic': {
    appointment: {
      title: 'Appointment',
      fields: ['patientName', 'phoneNumber', 'date', 'time', 'treatmentType', 'medicId', 'notes'],
      required: ['patientName', 'phoneNumber', 'date', 'time', 'treatmentType'],
      queryFields: ['phoneNumber', 'email'], // Fields that can query database
      searchFields: ['treatmentType', 'medicId'] // Fields with search options
    },
    service: {
      title: 'Treatment',
      fields: ['name', 'price', 'duration', 'category', 'description'],
      required: ['name', 'price', 'duration']
    }
  },
  'Gym': {
    appointment: {
      title: 'Session',
      fields: ['clientName', 'phoneNumber', 'date', 'time', 'sessionType', 'trainerId', 'notes'],
      required: ['clientName', 'phoneNumber', 'date', 'time', 'sessionType'],
      queryFields: ['phoneNumber', 'email'],
      searchFields: ['sessionType', 'trainerId']
    },
    service: {
      title: 'Package',
      fields: ['name', 'price', 'duration', 'type', 'features', 'description'],
      required: ['name', 'price', 'duration', 'type']
    }
  },
  'Hotel': {
    appointment: {
      title: 'Booking',
      fields: ['guestName', 'phoneNumber', 'checkIn', 'checkOut', 'roomType', 'guests', 'notes'],
      required: ['guestName', 'phoneNumber', 'checkIn', 'checkOut', 'roomType'],
      queryFields: ['phoneNumber', 'email'],
      searchFields: ['roomType']
    },
    service: {
      title: 'Room',
      fields: ['name', 'price', 'capacity', 'type', 'amenities', 'description'],
      required: ['name', 'price', 'capacity', 'type']
    }
  }
};

const useDrawerStore = create((set, get) => ({
  // Main drawer state
  isOpen: false,
  content: null,
  title: '',
  type: 'drawer',
  businessType: businessType,
  
  // Multiple drawer support
  drawers: [],
  activeDrawerId: null,
  
  // Current drawer data
  currentData: null,
  currentMode: DRAWER_MODES.EDIT, // Default to edit mode
  currentDrawerType: null,
  
  // Loading states
  isLoading: false,
  
  // Auto-save functionality
  autoSaveEnabled: true,
  pendingChanges: new Map(), // Track changes for auto-save
  
  // Database querying support
  queryResults: new Map(), // Store query results for fields
  searchResults: new Map(), // Store search results for options
  
  // Open a new drawer
  openDrawer: (config) => {
    const {
      type = DRAWER_TYPES.APPOINTMENT,
      mode = DRAWER_MODES.EDIT, // Default to edit mode
      data = null,
      title = null,
      size = 'medium',
      onSave = null,
      onDelete = null,
      onCancel = null,
      allowMultiple = false // Only AI assistant can open multiple drawers
    } = config;
    
    const state = get();
    
    // Check if we can open multiple drawers
    if (!allowMultiple && state.drawers.length > 0 && type !== DRAWER_TYPES.AI_ASSISTANT) {
      console.warn('Only AI assistant can open multiple drawers. Closing existing drawer.');
      // Close existing drawer and open new one
      set(state => ({
        drawers: [],
        activeDrawerId: null,
        isOpen: false
      }));
    }
    
    const drawerId = `drawer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get business-specific configuration
    const businessConfig = BUSINESS_TYPE_CONFIGS[businessType.name] || {};
    const typeConfig = businessConfig[type] || {};
    
    // Generate title if not provided
    const drawerTitle = title || (() => {
      const modeText = mode === DRAWER_MODES.CREATE ? 'New' : 
                      mode === DRAWER_MODES.EDIT ? 'Edit' : 
                      mode === DRAWER_MODES.VIEW ? 'View' : 'Delete';
      return `${modeText} ${typeConfig.title || type}`;
    })();
    
    const newDrawer = {
      id: drawerId,
      type,
      mode,
      title: drawerTitle,
      data,
      size,
      onSave,
      onDelete,
      onCancel,
      isOpen: true,
      allowMultiple
    };
    
    set(state => ({
      drawers: [...state.drawers, newDrawer],
      activeDrawerId: drawerId,
      isOpen: true,
      currentData: data,
      currentMode: mode,
      currentDrawerType: type
    }));
    
    return drawerId;
  },
  
  // Close specific drawer with auto-save (only for edit mode)
  closeDrawer: async (drawerId = null) => {
    const state = get();
    const targetId = drawerId || state.activeDrawerId;
    const targetDrawer = state.drawers.find(d => d.id === targetId);
    
    // Auto-save only for edit mode, not create mode
    if (state.autoSaveEnabled && targetDrawer && targetDrawer.onSave && targetDrawer.mode === DRAWER_MODES.EDIT) {
      const pendingData = state.pendingChanges.get(targetId);
      if (pendingData) {
        try {
          set({ isLoading: true });
          await targetDrawer.onSave(pendingData, targetDrawer.mode);
          console.log('Auto-saved changes for drawer:', targetId);
        } catch (error) {
          console.error('Auto-save failed:', error);
          // You could show a toast notification here
        } finally {
          set({ isLoading: false });
        }
      }
    }
    
    // Remove pending changes for this drawer
    const newPendingChanges = new Map(state.pendingChanges);
    newPendingChanges.delete(targetId);
    
    set(state => {
      const updatedDrawers = state.drawers.filter(d => d.id !== targetId);
      const newActiveId = updatedDrawers.length > 0 ? updatedDrawers[updatedDrawers.length - 1].id : null;
      
      return {
        drawers: updatedDrawers,
        activeDrawerId: newActiveId,
        isOpen: updatedDrawers.length > 0,
        currentData: newActiveId ? updatedDrawers.find(d => d.id === newActiveId)?.data : null,
        currentMode: newActiveId ? updatedDrawers.find(d => d.id === newActiveId)?.mode : null,
        currentDrawerType: newActiveId ? updatedDrawers.find(d => d.id === newActiveId)?.type : null,
        pendingChanges: newPendingChanges
      };
    });
  },
  
  // Close all drawers (with auto-save only for edit mode)
  closeAllDrawers: async () => {
    const state = get();
    
    // Auto-save only for edit mode drawers
    if (state.autoSaveEnabled) {
      const savePromises = Array.from(state.pendingChanges.entries()).map(async ([drawerId, data]) => {
        const drawer = state.drawers.find(d => d.id === drawerId);
        if (drawer && drawer.onSave && drawer.mode === DRAWER_MODES.EDIT) {
          try {
            await drawer.onSave(data, drawer.mode);
            console.log('Auto-saved changes for drawer:', drawerId);
          } catch (error) {
            console.error('Auto-save failed for drawer:', drawerId, error);
          }
        }
      });
      
      if (savePromises.length > 0) {
        set({ isLoading: true });
        await Promise.all(savePromises);
        set({ isLoading: false });
      }
    }
    
    set({
      drawers: [],
      activeDrawerId: null,
      isOpen: false,
      currentData: null,
      currentMode: null,
      currentDrawerType: null,
      pendingChanges: new Map()
    });
  },
  
  // Update current drawer data (for auto-save)
  updateCurrentData: (newData) => {
    set(state => {
      const updatedData = { ...state.currentData, ...newData };
      const newPendingChanges = new Map(state.pendingChanges);
      newPendingChanges.set(state.activeDrawerId, updatedData);
      
      return {
        currentData: updatedData,
        pendingChanges: newPendingChanges
      };
    });
  },
  
  // Manual save for create mode
  saveDrawer: async (drawerId = null) => {
    const state = get();
    const targetId = drawerId || state.activeDrawerId;
    const targetDrawer = state.drawers.find(d => d.id === targetId);
    
    if (targetDrawer && targetDrawer.onSave) {
      const dataToSave = state.pendingChanges.get(targetId) || state.currentData;
      
      try {
        set({ isLoading: true });
        await targetDrawer.onSave(dataToSave, targetDrawer.mode);
        console.log('Manually saved drawer:', targetId);
        
        // Clear pending changes after successful save
        const newPendingChanges = new Map(state.pendingChanges);
        newPendingChanges.delete(targetId);
        
        set({ pendingChanges: newPendingChanges });
      } catch (error) {
        console.error('Manual save failed:', error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    }
  },
  
  // Database querying for fields
  queryField: async (fieldName, value, drawerId = null) => {
    const targetId = drawerId || get().activeDrawerId;
    
    try {
      // This would be replaced with actual API call
      const results = await mockQueryDatabase(fieldName, value);
      
      set(state => {
        const newQueryResults = new Map(state.queryResults);
        newQueryResults.set(`${targetId}_${fieldName}`, results);
        return { queryResults: newQueryResults };
      });
      
      return results;
    } catch (error) {
      console.error('Query failed:', error);
      return [];
    }
  },
  
  // Search options for select fields
  searchOptions: async (fieldName, searchTerm, drawerId = null) => {
    const targetId = drawerId || get().activeDrawerId;
    
    try {
      // This would be replaced with actual API call
      const results = await mockSearchOptions(fieldName, searchTerm);
      
      set(state => {
        const newSearchResults = new Map(state.searchResults);
        newSearchResults.set(`${targetId}_${fieldName}`, results);
        return { searchResults: newSearchResults };
      });
      
      return results;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  },
  
  // Get query results for a field
  getQueryResults: (fieldName, drawerId = null) => {
    const targetId = drawerId || get().activeDrawerId;
    return get().queryResults.get(`${targetId}_${fieldName}`) || [];
  },
  
  // Get search results for a field
  getSearchResults: (fieldName, drawerId = null) => {
    const targetId = drawerId || get().activeDrawerId;
    return get().searchResults.get(`${targetId}_${fieldName}`) || [];
  },
  
  // Clear query/search results
  clearFieldResults: (fieldName, drawerId = null) => {
    const targetId = drawerId || get().activeDrawerId;
    
    set(state => {
      const newQueryResults = new Map(state.queryResults);
      const newSearchResults = new Map(state.searchResults);
      
      newQueryResults.delete(`${targetId}_${fieldName}`);
      newSearchResults.delete(`${targetId}_${fieldName}`);
      
      return {
        queryResults: newQueryResults,
        searchResults: newSearchResults
      };
    });
  },
  
  // Set loading state
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  // Toggle auto-save
  toggleAutoSave: () => {
    set(state => ({ autoSaveEnabled: !state.autoSaveEnabled }));
  },
  
  // Get current drawer configuration
  getCurrentDrawerConfig: () => {
    const state = get();
    const businessConfig = BUSINESS_TYPE_CONFIGS[state.businessType.name] || {};
    return businessConfig[state.currentDrawerType] || {};
  },
  
  // Get active drawer
  getActiveDrawer: () => {
    const state = get();
    return state.drawers.find(d => d.id === state.activeDrawerId);
  },
  
  // Check if specific drawer type is open
  isDrawerTypeOpen: (type) => {
    const state = get();
    return state.drawers.some(d => d.type === type && d.isOpen);
  },
  
  // Check if there are pending changes
  hasPendingChanges: (drawerId = null) => {
    const state = get();
    const targetId = drawerId || state.activeDrawerId;
    return state.pendingChanges.has(targetId);
  },
  
  // Check if current drawer is in create mode
  isCreateMode: (drawerId = null) => {
    const state = get();
    const targetId = drawerId || state.activeDrawerId;
    const drawer = state.drawers.find(d => d.id === targetId);
    return drawer?.mode === DRAWER_MODES.CREATE;
  },
  
  // Legacy support
  openLegacyDrawer: (content, title, type = 'drawer', businessType) => {
    return get().openDrawer({
      type: DRAWER_TYPES.APPOINTMENT,
      mode: DRAWER_MODES.EDIT,
      data: { content },
      title,
      size: 'medium'
    });
  }
}));

// Mock functions for database querying (replace with actual API calls)
const mockQueryDatabase = async (fieldName, value) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock data based on field and value
  if (fieldName === 'phoneNumber' && value) {
    return [
      { id: 1, name: 'John Doe', phoneNumber: value, email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', phoneNumber: value, email: 'jane@example.com' }
    ];
  }
  
  if (fieldName === 'email' && value) {
    return [
      { id: 1, name: 'John Doe', phoneNumber: '+1234567890', email: value },
      { id: 2, name: 'Jane Smith', phoneNumber: '+1987654321', email: value }
    ];
  }
  
  return [];
};

const mockSearchOptions = async (fieldName, searchTerm) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Mock search results based on field
  if (fieldName === 'treatmentType') {
    return [
      { value: 'cleaning', label: 'Dental Cleaning' },
      { value: 'checkup', label: 'Checkup' },
      { value: 'root_canal', label: 'Root Canal' }
    ].filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (fieldName === 'medicId') {
    return [
      { value: '1', label: 'Dr. John Smith' },
      { value: '2', label: 'Dr. Sarah Johnson' },
      { value: '3', label: 'Dr. Michael Brown' }
    ].filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  return [];
};

export default useDrawerStore; 