import { useCallback } from 'react';
import useDrawerStore, { DRAWER_TYPES, DRAWER_MODES } from '../store/drawerStore';

const useDrawer = () => {
  const {
    openDrawer,
    closeDrawer,
    closeAllDrawers,
    updateCurrentData,
    setLoading,
    getCurrentDrawerConfig,
    getActiveDrawer,
    isDrawerTypeOpen,
    hasPendingChanges,
    toggleAutoSave,
    autoSaveEnabled,
    saveDrawer,
    queryField,
    searchOptions,
    getQueryResults,
    getSearchResults,
    clearFieldResults,
    isCreateMode
  } = useDrawerStore();

  // Open appointment drawer
  const openAppointmentDrawer = useCallback(({
    data = null,
    mode = DRAWER_MODES.EDIT, // Default to edit mode
    onSave = null,
    onDelete = null,
    onCancel = null
  } = {}) => {
    return openDrawer({
      type: DRAWER_TYPES.APPOINTMENT,
      mode,
      data,
      onSave,
      onDelete,
      onCancel,
      allowMultiple: false // Only AI assistant can open multiple drawers
    });
  }, [openDrawer]);

  // Open stock drawer
  const openStockDrawer = useCallback(({
    data = null,
    mode = DRAWER_MODES.EDIT, // Default to edit mode
    onSave = null,
    onDelete = null,
    onCancel = null
  } = {}) => {
    return openDrawer({
      type: DRAWER_TYPES.STOCK,
      mode,
      data,
      onSave,
      onDelete,
      onCancel,
      allowMultiple: false // Only AI assistant can open multiple drawers
    });
  }, [openDrawer]);

  // Open member drawer
  const openMemberDrawer = useCallback(({
    data = null,
    mode = DRAWER_MODES.EDIT, // Default to edit mode
    onSave = null,
    onDelete = null,
    onCancel = null,
    allowMultiple = false // Can be opened from appointment
  } = {}) => {
    return openDrawer({
      type: DRAWER_TYPES.MEMBER,
      mode,
      data,
      onSave,
      onDelete,
      onCancel,
      allowMultiple
    });
  }, [openDrawer]);

  // Open service drawer
  const openServiceDrawer = useCallback(({
    data = null,
    mode = DRAWER_MODES.EDIT, // Default to edit mode
    onSave = null,
    onDelete = null,
    onCancel = null
  } = {}) => {
    return openDrawer({
      type: DRAWER_TYPES.SERVICE,
      mode,
      data,
      onSave,
      onDelete,
      onCancel,
      allowMultiple: false // Only AI assistant can open multiple drawers
    });
  }, [openDrawer]);

  // Open AI assistant drawer (can open multiple drawers)
  const openAIAssistantDrawer = useCallback(({
    data = null,
    mode = DRAWER_MODES.EDIT, // Default to edit mode
    onSave = null,
    onDelete = null,
    onCancel = null
  } = {}) => {
    return openDrawer({
      type: DRAWER_TYPES.AI_ASSISTANT,
      mode,
      data,
      onSave,
      onDelete,
      onCancel,
      allowMultiple: true // AI assistant can open multiple drawers
    });
  }, [openDrawer]);

  // Close specific drawer (with auto-save)
  const closeSpecificDrawer = useCallback(async (drawerId) => {
    await closeDrawer(drawerId);
  }, [closeDrawer]);

  // Close all drawers (with auto-save)
  const closeAllDrawersWithSave = useCallback(async () => {
    await closeAllDrawers();
  }, [closeAllDrawers]);

  // Update current drawer data (for auto-save)
  const updateDrawerData = useCallback((newData) => {
    updateCurrentData(newData);
  }, [updateCurrentData]);

  // Manual save for create mode
  const manualSaveDrawer = useCallback(async (drawerId = null) => {
    await saveDrawer(drawerId);
  }, [saveDrawer]);

  // Database querying functions
  const queryFieldData = useCallback(async (fieldName, value, drawerId = null) => {
    return await queryField(fieldName, value, drawerId);
  }, [queryField]);

  const searchFieldOptions = useCallback(async (fieldName, searchTerm, drawerId = null) => {
    return await searchOptions(fieldName, searchTerm, drawerId);
  }, [searchOptions]);

  const getFieldQueryResults = useCallback((fieldName, drawerId = null) => {
    return getQueryResults(fieldName, drawerId);
  }, [getQueryResults]);

  const getFieldSearchResults = useCallback((fieldName, drawerId = null) => {
    return getSearchResults(fieldName, drawerId);
  }, [getSearchResults]);

  const clearFieldData = useCallback((fieldName, drawerId = null) => {
    clearFieldResults(fieldName, drawerId);
  }, [clearFieldResults]);

  // Check if specific drawer type is open
  const isDrawerOpen = useCallback((type) => {
    return isDrawerTypeOpen(type);
  }, [isDrawerTypeOpen]);

  // Check if there are pending changes
  const hasUnsavedChanges = useCallback((drawerId = null) => {
    return hasPendingChanges(drawerId);
  }, [hasPendingChanges]);

  // Check if current drawer is in create mode
  const isCurrentDrawerCreateMode = useCallback((drawerId = null) => {
    return isCreateMode(drawerId);
  }, [isCreateMode]);

  // Get current drawer configuration
  const getDrawerConfig = useCallback(() => {
    return getCurrentDrawerConfig();
  }, [getCurrentDrawerConfig]);

  // Get active drawer info
  const getActiveDrawerInfo = useCallback(() => {
    return getActiveDrawer();
  }, [getActiveDrawer]);

  // Set loading state
  const setDrawerLoading = useCallback((loading) => {
    setLoading(loading);
  }, [setLoading]);

  // Toggle auto-save
  const toggleAutoSaveFeature = useCallback(() => {
    toggleAutoSave();
  }, [toggleAutoSave]);

  return {
    // Drawer opening functions
    openAppointmentDrawer,
    openStockDrawer,
    openMemberDrawer,
    openServiceDrawer,
    openAIAssistantDrawer,
    
    // Drawer closing functions (with auto-save)
    closeDrawer: closeSpecificDrawer,
    closeAllDrawers: closeAllDrawersWithSave,
    
    // Data management
    updateDrawerData,
    manualSaveDrawer,
    
    // Database querying functions
    queryField: queryFieldData,
    searchOptions: searchFieldOptions,
    getQueryResults: getFieldQueryResults,
    getSearchResults: getFieldSearchResults,
    clearFieldResults: clearFieldData,
    
    // State queries
    isDrawerOpen,
    hasUnsavedChanges,
    isCreateMode: isCurrentDrawerCreateMode,
    getDrawerConfig,
    getActiveDrawerInfo,
    
    // Loading and settings
    setDrawerLoading,
    toggleAutoSave: toggleAutoSaveFeature,
    autoSaveEnabled,
    
    // Constants
    DRAWER_TYPES,
    DRAWER_MODES
  };
};

export default useDrawer; 