/**
 * Dental Services Mock Data
 * 
 * Mock data for dental clinic services (treatments) with tenant and location management
 */

// Import comprehensive test data from testData
import servicesTestData from '../../../testData/services/services-test-data.json';

// Base services data
const baseServicesData = servicesTestData.response.data;

// Dental clinic services (treatments) with tenant and location IDs
export const dentalServicesMock = {
  id: 'dental-services-001',
  tenantId: 'T0001',
  businessType: 'dental',
  packages: baseServicesData.packages.map((service, index) => ({
    ...service,
    id: `T0001-01-SERVICE-${String(index + 1).padStart(3, '0')}`,
    tenantId: 'T0001',
    locationId: 'T0001-01', // Default location
    type: 'treatment',
    category: service.category || 'General Dentistry',
    duration: service.duration || 60,
    requiresMedic: true,
    insuranceCovered: service.insuranceCovered || false,
    followUpRequired: service.followUpRequired || false,
    dentalSpecific: {
      treatmentType: service.treatmentType || 'preventive',
      anesthesiaRequired: service.anesthesiaRequired || false,
      xRayRequired: service.xRayRequired || false,
      followUpDays: service.followUpDays || 0,
      contraindications: service.contraindications || [],
      materials: service.materials || [],
      equipment: service.equipment || []
    }
  }))
};

/**
 * Funcție pentru obținerea datelor servicii dental
 */
export function getDentalServicesMock(tenantId = 'T0001', locationId = 'T0001-01') {
  const packages = dentalServicesMock.packages.map(service => ({
    ...service,
    tenantId,
    locationId
  }));
  
  return {
    ...dentalServicesMock,
    tenantId,
    packages
  };
}

/**
 * Funcție pentru obținerea unui serviciu specific după ID
 */
export function getDentalServiceById(serviceId, tenantId = 'T0001') {
  return dentalServicesMock.packages.find(service => 
    service.id === serviceId && service.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea serviciilor după locație
 */
export function getDentalServicesByLocation(locationId, tenantId = 'T0001') {
  return dentalServicesMock.packages.filter(service => 
    service.locationId === locationId && service.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea serviciilor după categorie
 */
export function getDentalServicesByCategory(category, tenantId = 'T0001') {
  return dentalServicesMock.packages.filter(service => 
    service.category === category && service.tenantId === tenantId
  );
}

/**
 * Funcție pentru obținerea serviciilor acoperite de asigurare
 */
export function getDentalServicesByInsurance(covered = true, tenantId = 'T0001') {
  return dentalServicesMock.packages.filter(service => 
    service.insuranceCovered === covered && service.tenantId === tenantId
  );
}

export default {
  dentalServicesMock,
  getDentalServicesMock,
  getDentalServiceById,
  getDentalServicesByLocation,
  getDentalServicesByCategory,
  getDentalServicesByInsurance
}; 