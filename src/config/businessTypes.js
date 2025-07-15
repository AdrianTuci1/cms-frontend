export const BUSINESS_TYPES = {
  DENTAL: {
    name: 'Dental Clinic',
  },
  GYM: {
    name: 'Gym',
  },
  HOTEL: {
    name: 'Hotel',
  }
};

// Default business type - can be changed here or via environment variable
const DEFAULT_BUSINESS_TYPE = 'DENTAL';

/**
 * Get current business type configuration
 * @returns {Object} Business type configuration
 */
export const getBusinessType = () => {
  // Get from environment variable
  const envBusinessType = import.meta.env.VITE_BUSINESS_TYPE;
  
  // Use environment variable if valid, otherwise use default
  const businessTypeKey = (envBusinessType && BUSINESS_TYPES[envBusinessType]) 
    ? envBusinessType 
    : DEFAULT_BUSINESS_TYPE;
  
  return BUSINESS_TYPES[businessTypeKey];
};

/**
 * Get current business type key (DENTAL, GYM, HOTEL)
 * @returns {string} Business type key
 */
export const getBusinessTypeKey = () => {
  const envBusinessType = import.meta.env.VITE_BUSINESS_TYPE;
  
  const businessTypeKey = (envBusinessType && BUSINESS_TYPES[envBusinessType]) 
    ? envBusinessType 
    : DEFAULT_BUSINESS_TYPE;
  
  return businessTypeKey;
};

/**
 * Get business type key for data sync (lowercase)
 * @param {string} businessTypeKey - Business type key (DENTAL, GYM, HOTEL)
 * @returns {string} Lowercase business type key
 */
export const getBusinessTypeKeyForSync = (businessTypeKey) => {
  return businessTypeKey.toLowerCase();
};

/**
 * Get current business type for data sync (lowercase)
 * @returns {string} Current business type for sync
 */
export const getCurrentBusinessTypeForSync = () => {
  const businessTypeKey = getBusinessTypeKey();
  return getBusinessTypeKeyForSync(businessTypeKey);
};

/**
 * Get all available business types
 * @returns {Array} Array of business type keys
 */
export const getAvailableBusinessTypes = () => {
  return Object.keys(BUSINESS_TYPES);
};

/**
 * Check if business type is valid
 * @param {string} businessTypeKey - Business type key to validate
 * @returns {boolean} True if valid
 */
export const isValidBusinessType = (businessTypeKey) => {
  return Object.keys(BUSINESS_TYPES).includes(businessTypeKey);
}; 