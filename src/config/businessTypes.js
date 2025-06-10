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

const ENV_TO_BUSINESS_TYPE = {
  'DENTAL': 'DENTAL_CLINIC',
  'GYM': 'GYM',
  'HOTEL': 'HOTEL'
};

export const getBusinessType = () => {
  const envBusinessType = import.meta.env.VITE_BUSINESS_TYPE;
  const mappedType = ENV_TO_BUSINESS_TYPE[envBusinessType];
  
  if (!envBusinessType || !mappedType || !BUSINESS_TYPES[mappedType]) {
    console.warn('Invalid or missing BUSINESS_TYPE in .env, defaulting to DENTAL_CLINIC');
    return BUSINESS_TYPES.DENTAL_CLINIC;
  }
  return BUSINESS_TYPES[mappedType];
}; 