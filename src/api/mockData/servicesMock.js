/**
 * Services Mock Data - Date mock pentru servicii
 */

// Import comprehensive test data from testData
import servicesTestData from '../../testData/services/services-test-data.json';

// Base services data
const baseServicesData = servicesTestData.response.data;

// Dental clinic services (treatments)
export const dentalServicesMock = {
  id: 'dental-services-001',
  businessType: 'dental',
  packages: baseServicesData.packages.map(service => ({
    ...service,
    type: 'treatment',
    category: service.category || 'General Dentistry',
    duration: service.duration || 60,
    requiresMedic: true,
    insuranceCovered: service.insuranceCovered || false,
    followUpRequired: service.followUpRequired || false
  }))
};

// Gym services (packages)
export const gymServicesMock = {
  id: 'gym-services-001',
  businessType: 'gym',
  packages: baseServicesData.packages.map(service => ({
    ...service,
    type: 'package',
    category: service.category || 'Fitness',
    duration: service.duration || 30,
    maxParticipants: service.maxParticipants || 1,
    trainerRequired: service.trainerRequired || false,
    equipmentNeeded: service.equipmentNeeded || [],
    difficultyLevel: service.difficultyLevel || 'beginner'
  }))
};

// Hotel services (rooms)
export const hotelServicesMock = {
  id: 'hotel-services-001',
  businessType: 'hotel',
  packages: baseServicesData.packages.map(service => ({
    ...service,
    type: 'room',
    category: service.category || 'Accommodation',
    capacity: service.capacity || 2,
    amenities: service.amenities || ['WiFi', 'TV', 'AC'],
    roomType: service.roomType || 'standard',
    floor: service.floor || 1,
    view: service.view || 'city',
    breakfastIncluded: service.breakfastIncluded || false
  }))
};

/**
 * Funcție pentru obținerea datelor servicii în funcție de tipul de business
 */
export function getServicesMock(businessType = 'dental') {
  switch (businessType) {
    case 'dental':
      return dentalServicesMock;
    case 'gym':
      return gymServicesMock;
    case 'hotel':
      return hotelServicesMock;
    default:
      return dentalServicesMock; // default
  }
}

// Legacy export for backward compatibility
export const servicesMock = dentalServicesMock;

export default {
  servicesMock,
  dentalServicesMock,
  gymServicesMock,
  hotelServicesMock,
  getServicesMock
}; 