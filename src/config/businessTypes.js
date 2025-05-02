export const BUSINESS_TYPES = {
  DENTAL_CLINIC: {
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
      { path: '/classes', component: 'Classes' }
    ]
  },
  HOTEL: {
    name: 'Hotel',
    homeComponents: ['Rooms'],
    dashboardComponents: ['Timeline', 'Sales', 'Clients', 'Stocks'],
    customRoutes: [
      { path: '/rooms', component: 'Rooms' }
    ]
  }
};

export const getBusinessType = () => {
  const businessType = import.meta.env.VITE_BUSINESS_TYPE;
  if (!businessType || !BUSINESS_TYPES[businessType]) {
    console.warn('Invalid or missing BUSINESS_TYPE in .env, defaulting to DENTAL_CLINIC');
    return BUSINESS_TYPES.DENTAL_CLINIC;
  }
  return BUSINESS_TYPES[businessType];
}; 