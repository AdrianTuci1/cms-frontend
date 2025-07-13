// Main drawer components
export { default as DrawerManager } from './DrawerManager';
export { default as DrawerLayout } from './layout/DrawerLayout';

// Form components
export { default as BaseForm } from './forms/BaseForm';
export { default as TimelineForm } from './forms/TimelineForm';
export { default as ServiceForm } from './forms/ServiceForm';
export { default as StockForm } from './forms/StockForm';
export { default as MemberForm } from './forms/MemberForm';
export { default as UserDrawer } from './forms/UserDrawer';

// Store and hooks
export { default as useDrawerStore } from './store/drawerStore';
export { default as useDrawer } from './hooks/useDrawer';

// Constants
export { DRAWER_TYPES, DRAWER_MODES } from './store/drawerStore';

// Import the store directly
import useDrawerStore from './store/drawerStore';

// Helper function for opening drawers with simplified API
export const openDrawer = (mode, type, data = null, options = {}) => {
  return useDrawerStore.getState().openDrawer(mode, type, data, options);
}; 