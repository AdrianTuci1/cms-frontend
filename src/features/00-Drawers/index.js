// Main drawer exports
export { default as DrawerManager } from './DrawerManager';
export { default as useDrawerStore, DRAWER_TYPES, DRAWER_MODES } from './store/drawerStore';



// General forms (same for all business types)
export { default as StockForm } from './forms/general/stock';
export { default as MemberForm } from './forms/general/member';
export { default as PermissionsForm } from './forms/general/permissions';
export { default as UserDrawer } from './forms/general/user';

// Business-specific forms (using dental as default)
export { default as TimelineForm } from './forms/dental/appointments';
export { default as ServiceForm } from './forms/dental/service';
export { default as PatientForm } from './forms/dental/patient';
// OperativeDetailsForm and GalleryForm are views within appointments, not standalone forms

// Hooks exports
export { useDrawer, useTimelineDrawerActions, useGenericDrawerActions } from './hooks';

// Layout exports
export { default as DrawerLayout } from './layout/DrawerLayout'; 