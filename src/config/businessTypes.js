export const BUSINESS_TYPES = {
  DENTAL: {
    name: 'Dental Clinic',
    homeComponents: ['Medics', 'Treatments'],
    dashboardComponents: ['Timeline', 'Sales', 'Clients', 'Stocks'],
    customRoutes: [
      { path: '/medics', component: 'Medics' },
      { path: '/treatments', component: 'Treatments' }
    ]
  },
  GYM: {
    name: 'Gym',
    homeComponents: ['Packages', 'Classes'],
    dashboardComponents: ['Timeline', 'Sales', 'Clients', 'Stocks'],
    customRoutes: [
      { path: '/packages', component: 'Packages' },
      { path: '/classes', component: 'Classes' },
      { path: '/gym-demo', component: 'GymDemo' }
    ]
  },
  HOTEL: {
    name: 'Hotel',
    homeComponents: ['Rooms'],
    dashboardComponents: ['Timeline', 'Sales', 'Clients', 'Stocks'],
    customRoutes: [
      { path: '/rooms', component: 'Rooms' },
      { path: '/hotel-demo', component: 'HotelDemo' }
    ]
  }
};

// Default business type - can be changed here or via environment variable
const DEFAULT_BUSINESS_TYPE = 'DENTAL';

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