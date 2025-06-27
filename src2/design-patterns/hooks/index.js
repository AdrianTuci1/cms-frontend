/**
 * Design Patterns Hooks - Index
 * Exportă toate hook-urile pentru design patterns
 */

// Data synchronization hooks
export { default as useDataSync } from './useDataSync';

// Observer pattern hooks
export { default as useObserver, useEvent, useEvents } from './useObserver';

// Business logic hooks
export { default as useBusinessLogic } from './useBusinessLogic';

// Re-export all hooks for convenience
export {
  useDataSync,
  useObserver,
  useEvent,
  useEvents,
  useBusinessLogic
} from './useDataSync';

// Default export with all hooks
export default {
  useDataSync,
  useObserver,
  useEvent,
  useEvents,
  useBusinessLogic
}; 