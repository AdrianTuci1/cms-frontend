import { useCallback } from 'react';
import useDrawerStore, { DRAWER_TYPES, DRAWER_MODES } from '../store/drawerStore';

const useDrawer = () => {
  const {
    openDrawer,
    closeDrawer,
    closeAllDrawers,
    setLoading,
    getActiveDrawer,
    isDrawerOpen,
    isOpen,
    activeDrawerId,
    currentData,
    currentMode,
    currentDrawerType,
    isLoading
  } = useDrawerStore();

  // Open timeline drawer
  const openTimelineDrawer = useCallback((mode, data = null, options = {}) => {
    return openDrawer(mode, DRAWER_TYPES.TIMELINE, data, options);
  }, [openDrawer]);

  // Open stock drawer
  const openStockDrawer = useCallback((mode, data = null, options = {}) => {
    return openDrawer(mode, DRAWER_TYPES.STOCK, data, options);
  }, [openDrawer]);

  // Open member drawer
  const openMemberDrawer = useCallback((mode, data = null, options = {}) => {
    return openDrawer(mode, DRAWER_TYPES.MEMBER, data, options);
  }, [openDrawer]);

  // Open service drawer
  const openServiceDrawer = useCallback((mode, data = null, options = {}) => {
    return openDrawer(mode, DRAWER_TYPES.SERVICE, data, options);
  }, [openDrawer]);

  // Open AI assistant drawer
  const openAIAssistantDrawer = useCallback((mode, data = null, options = {}) => {
    return openDrawer(mode, DRAWER_TYPES.AI_ASSISTANT, data, options);
  }, [openDrawer]);

  // Close specific drawer
  const closeSpecificDrawer = useCallback((drawerId) => {
    closeDrawer(drawerId);
  }, [closeDrawer]);

  // Close all drawers
  const closeAllDrawersWithSave = useCallback(() => {
    closeAllDrawers();
  }, [closeAllDrawers]);

  // Set loading state
  const setDrawerLoading = useCallback((loading) => {
    setLoading(loading);
  }, [setLoading]);

  // Get active drawer info
  const getActiveDrawerInfo = useCallback(() => {
    return getActiveDrawer();
  }, [getActiveDrawer]);

  return {
    // Drawer opening functions
    openTimelineDrawer,
    openStockDrawer,
    openMemberDrawer,
    openServiceDrawer,
    openAIAssistantDrawer,
    
    // Drawer closing functions
    closeSpecificDrawer,
    closeAllDrawersWithSave,
    
    // State
    isOpen,
    activeDrawerId,
    currentData,
    currentMode,
    currentDrawerType,
    isLoading,
    
    // Utility functions
    isDrawerOpen,
    getActiveDrawerInfo,
    setDrawerLoading
  };
};

export default useDrawer; 