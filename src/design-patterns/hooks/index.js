import { useDataSync } from './useDataSync';
import { default as useObserver, useEvent, useEvents } from './useObserver';
import { default as useBusinessLogic } from './useBusinessLogic';
import { default as useOfflineData } from './useOfflineData';

/**
 * Design Patterns Hooks - Index
 * Exportă toate hook-urile pentru design patterns
 */

// Data synchronization hooks
export { useDataSync } from './useDataSync';

// Observer pattern hooks
export { default as useObserver, useEvent, useEvents } from './useObserver';

// Business logic hooks
export { default as useBusinessLogic } from './useBusinessLogic';

// Offline data hooks
export { default as useOfflineData } from './useOfflineData';

// Default export with all hooks
export default {
  useDataSync,
  useObserver,
  useEvent,
  useEvents,
  useBusinessLogic,
  useOfflineData
}; 