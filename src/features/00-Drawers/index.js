// Main drawer exports
export { default as DrawerManager } from './DrawerManager';
export { default as useDrawerStore, DRAWER_TYPES, DRAWER_MODES } from './store/drawerStore';

// Base form export
export { default as BaseForm } from './forms/BaseForm';

// General forms (same for all business types)
export { default as StockForm } from './forms/general/StockForm';
export { default as MemberForm } from './forms/general/MemberForm';
export { default as PermissionsForm } from './forms/general/PermissionsForm';
export { default as UserDrawer } from './forms/general/UserDrawer';

// Business-specific forms (using dental as default)
export { default as TimelineForm } from './forms/dental/TimelineForm';
export { default as ServiceForm } from './forms/dental/ServiceForm';
export { default as PatientForm } from './forms/dental/PatientForm';
export { default as OperativeDetailsForm } from './forms/dental/OperativeDetailsForm';
export { default as GalleryForm } from './forms/dental/GalleryForm';

// Hooks exports
export { useDrawer, useTimelineDrawerActions, useGenericDrawerActions } from './hooks';

// Layout exports
export { default as DrawerLayout } from './layout/DrawerLayout'; 