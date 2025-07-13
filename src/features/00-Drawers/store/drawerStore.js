import { create } from 'zustand';
import { getBusinessType } from '../../../../src/config/businessTypes';

const businessType = getBusinessType();

// Drawer types - to be defined based on forms
export const DRAWER_TYPES = {
  TIMELINE: 'timeline',
  STOCK: 'stock',
  MEMBER: 'member',
  SERVICE: 'service',
  AI_ASSISTANT: 'ai-assistant',
  PERMISSIONS: 'permissions',
  USER: 'user'
};

// Drawer modes - only edit and create
export const DRAWER_MODES = {
  CREATE: 'create',
  EDIT: 'edit'
};

// Business type specific configurations
const BUSINESS_TYPE_CONFIGS = {
  'Dental Clinic': {
    timeline: {
      title: 'Appointment',
      fields: [
        { name: 'clientName', type: 'text', label: 'Client Name', required: true },
        { name: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'displayTreatment', type: 'text', label: 'Treatment Name', required: true },
        { name: 'medicName', type: 'text', label: 'Medic Name', required: true },
        { name: 'date', type: 'datetime-local', label: 'Appointment Date & Time', required: true },
        { name: 'duration', type: 'number', label: 'Duration (minutes)', min: 15, max: 180, required: true },
        { name: 'done', type: 'checkbox', label: 'Done' },
        { name: 'paid', type: 'checkbox', label: 'Paid' },
        { name: 'notes', type: 'textarea', label: 'Notes', placeholder: 'Additional notes about the appointment...' }
      ],
      required: ['clientName', 'displayTreatment', 'medicName', 'date', 'duration'],
      queryFields: ['phoneNumber', 'email'],
      searchFields: ['displayTreatment', 'medicName']
    },
    service: {
      title: 'Treatment',
      fields: ['name', 'price', 'duration', 'category', 'description'],
      required: ['name', 'price', 'duration']
    }
  },
  'Gym': {
    timeline: {
      title: 'Session',
      fields: [
        { name: 'clientName', type: 'text', label: 'Client Name', required: true },
        { name: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'date', type: 'date', label: 'Session Date', required: true },
        { name: 'time', type: 'time', label: 'Session Time', required: true },
        { 
          name: 'sessionType', 
          type: 'select', 
          label: 'Session Type', 
          required: true,
          options: [
            { value: 'personal_training', label: 'Personal Training' },
            { value: 'group_class', label: 'Group Class' },
            { value: 'consultation', label: 'Consultation' },
            { value: 'assessment', label: 'Fitness Assessment' },
            { value: 'other', label: 'Other' }
          ]
        },
        { 
          name: 'trainerId', 
          type: 'select', 
          label: 'Trainer', 
          required: true,
          options: [
            { value: '1', label: 'Mike Johnson' },
            { value: '2', label: 'Lisa Chen' },
            { value: '3', label: 'David Wilson' }
          ]
        },
        { name: 'duration', type: 'number', label: 'Duration (minutes)', min: 30, max: 120 },
        { name: 'notes', type: 'textarea', label: 'Notes', placeholder: 'Session goals or special requirements...' }
      ],
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
    timeline: {
      title: 'Booking',
      fields: [
        { name: 'guestName', type: 'text', label: 'Guest Name', required: true },
        { name: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'checkIn', type: 'date', label: 'Check-in Date', required: true },
        { name: 'checkOut', type: 'date', label: 'Check-out Date', required: true },
        { 
          name: 'roomType', 
          type: 'select', 
          label: 'Room Type', 
          required: true,
          options: [
            { value: 'standard', label: 'Standard Room' },
            { value: 'deluxe', label: 'Deluxe Room' },
            { value: 'suite', label: 'Suite' },
            { value: 'family', label: 'Family Room' },
            { value: 'presidential', label: 'Presidential Suite' }
          ]
        },
        { name: 'guests', type: 'number', label: 'Number of Guests', min: 1, max: 6 },
        { name: 'specialRequests', type: 'textarea', label: 'Special Requests', placeholder: 'Any special requests or preferences...' }
      ],
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
  activeDrawerId: null,
  drawers: [],
  
  // Current drawer data
  currentData: null,
  currentMode: null,
  currentDrawerType: null,
  
  // Loading states
  isLoading: false,
  
  // Query and search results
  queryResults: {},
  searchResults: {},
  
  // Open drawer with simplified API: openDrawer('mode', 'type', 'data')
  openDrawer: (mode, type, data = null, options = {}) => {
    const {
      title = null,
      size = 'medium',
      onSave = null,
      onDelete = null,
      onCancel = null
    } = options;
    
    const state = get();
    
    // Validate mode
    if (!Object.values(DRAWER_MODES).includes(mode)) {
      console.error(`Invalid drawer mode: ${mode}. Must be 'create' or 'edit'`);
      return null;
    }
    
    // Validate type
    if (!Object.values(DRAWER_TYPES).includes(type)) {
      console.error(`Invalid drawer type: ${type}`);
      return null;
    }
    
    // Close existing drawer if not AI assistant
    if (type !== DRAWER_TYPES.AI_ASSISTANT && state.drawers.length > 0) {
      set(state => ({
        drawers: [],
        activeDrawerId: null,
        isOpen: false
      }));
    }
    
    const drawerId = `drawer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate title if not provided
    const drawerTitle = title || (() => {
      const modeText = mode === DRAWER_MODES.CREATE ? 'New' : 'Edit';
      const typeText = type.charAt(0).toUpperCase() + type.slice(1);
      return `${modeText} ${typeText}`;
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
      isOpen: true
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
  
  // Close specific drawer
  closeDrawer: (drawerId = null) => {
    const state = get();
    const targetId = drawerId || state.activeDrawerId;
    
    set(state => {
      const updatedDrawers = state.drawers.filter(d => d.id !== targetId);
      const newActiveId = updatedDrawers.length > 0 ? updatedDrawers[updatedDrawers.length - 1].id : null;
      
      return {
        drawers: updatedDrawers,
        activeDrawerId: newActiveId,
        isOpen: updatedDrawers.length > 0,
        currentData: newActiveId ? updatedDrawers.find(d => d.id === newActiveId)?.data : null,
        currentMode: newActiveId ? updatedDrawers.find(d => d.id === newActiveId)?.mode : null,
        currentDrawerType: newActiveId ? updatedDrawers.find(d => d.id === newActiveId)?.type : null
      };
    });
  },
  
  // Close all drawers
  closeAllDrawers: () => {
    set({
      drawers: [],
      activeDrawerId: null,
      isOpen: false,
      currentData: null,
      currentMode: null,
      currentDrawerType: null
    });
  },
  
  // Set loading state
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  // Get active drawer
  getActiveDrawer: () => {
    const state = get();
    return state.drawers.find(d => d.id === state.activeDrawerId);
  },
  
  // Check if drawer is open
  isDrawerOpen: (type = null) => {
    const state = get();
    if (!type) return state.isOpen;
    return state.drawers.some(d => d.type === type);
  },
  
  // Get drawer configuration for a specific type and business type
  getDrawerConfig: (drawerType, businessTypeName = null) => {
    const targetBusinessType = businessTypeName || 'Dental Clinic'; // Default fallback
    const businessConfig = BUSINESS_TYPE_CONFIGS[targetBusinessType] || {};
    return businessConfig[drawerType] || null;
  },
  
  // Get fields for a specific drawer type and business type
  getDrawerFields: (drawerType, businessTypeName = null) => {
    const config = get().getDrawerConfig(drawerType, businessTypeName);
    return config?.fields || [];
  },
  
  // Get required fields for a specific drawer type and business type
  getRequiredFields: (drawerType, businessTypeName = null) => {
    const config = get().getDrawerConfig(drawerType, businessTypeName);
    return config?.required || [];
  },
  
  // Get title for a specific drawer type and business type
  getDrawerTitle: (drawerType, businessTypeName = null) => {
    const config = get().getDrawerConfig(drawerType, businessTypeName);
    return config?.title || drawerType;
  },
  
  // Form-related functions for BaseForm
  updateCurrentData: (newData) => {
    set(state => ({
      currentData: { ...state.currentData, ...newData }
    }));
  },
  
  hasPendingChanges: () => {
    const state = get();
    // For now, always return false - this can be enhanced later
    return false;
  },
  
  isCreateMode: () => {
    const state = get();
    return state.currentMode === DRAWER_MODES.CREATE;
  },
  
  saveDrawer: async (data) => {
    const state = get();
    const activeDrawer = state.drawers.find(d => d.id === state.activeDrawerId);
    if (activeDrawer && activeDrawer.onSave) {
      return await activeDrawer.onSave(data, state.currentMode);
    }
  },
  
  queryField: async (fieldName, value) => {
    // Mock query function - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const results = await mockQueryDatabase(fieldName, value);
    set(state => ({
      queryResults: { ...state.queryResults, [fieldName]: results }
    }));
  },
  
  searchOptions: async (fieldName, searchTerm) => {
    // Mock search function - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 200));
    const results = await mockSearchOptions(fieldName, searchTerm);
    set(state => ({
      searchResults: { ...state.searchResults, [fieldName]: results }
    }));
  },
  
  getQueryResults: (fieldName) => {
    const state = get();
    return state.queryResults?.[fieldName] || [];
  },
  
  getSearchResults: (fieldName) => {
    const state = get();
    return state.searchResults?.[fieldName] || [];
  },
  
  clearFieldResults: (fieldName) => {
    set(state => ({
      queryResults: { ...state.queryResults, [fieldName]: [] },
      searchResults: { ...state.searchResults, [fieldName]: [] }
    }));
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