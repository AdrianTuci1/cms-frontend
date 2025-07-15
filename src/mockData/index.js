/**
 * Mock Data - Exporturi principale
 * 
 * Centralizează toate exporturile pentru datele de demo
 * Folosit în TEST_MODE pentru demonstrații și dezvoltare
 */

// Business Info
export {
  DEMO_BUSINESS_INFO,
  getDemoBusinessInfo,
  getDemoLocations,
  getDemoMainLocation
} from './businessInfo.js';

// User Data
export {
  DEMO_USERS,
  DEFAULT_DEMO_USER,
  getCurrentDemoUser,
  getCurrentUserPermissions,
  hasPermission,
  getCurrentUserRoles,
  hasRole
} from './userData.js';

/**
 * Funcție principală pentru obținerea datelor de demo
 * @param {string} type - Tipul de date (businessInfo, userData)
 * @param {string} businessType - Tipul de business (dental, gym, hotel)
 * @returns {Object} Datele de demo
 */
export function getDemoData(type, businessType = 'dental') {
  switch (type) {
    case 'businessInfo':
    case 'business-info':
      return getDemoBusinessInfo(businessType);
    
    case 'userData':
    case 'user-data':
    case 'currentUser':
      return getCurrentDemoUser(businessType);
    
    default:
      console.warn(`Unknown demo data type: ${type}`);
      return null;
  }
}

/**
 * Verifică dacă suntem în demo mode
 * @returns {boolean} True dacă suntem în test mode
 */
export function isDemoMode() {
  return import.meta.env.VITE_TEST_MODE === 'true';
}

/**
 * Obține toate tipurile de business disponibile pentru demo
 * @returns {Array} Lista tipurilor de business
 */
export function getAvailableBusinessTypes() {
  return ['dental', 'gym', 'hotel'];
}

/**
 * Verifică dacă tipul de business este valid pentru demo
 * @param {string} businessType - Tipul de business
 * @returns {boolean} True dacă este valid
 */
export function isValidBusinessType(businessType) {
  return getAvailableBusinessTypes().includes(businessType);
} 