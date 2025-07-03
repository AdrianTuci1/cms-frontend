/**
 * Services Mock Data - Date mock pentru servicii
 */

// Import comprehensive test data from testData
import servicesTestData from '../../testData/services/services-test-data.json';

// Mock data pentru services - Using test data
export const servicesMock = servicesTestData.response.data;

/**
 * Funcție pentru obținerea datelor servicii
 */
export function getServicesMock(businessType = null) {
  return businessType ? servicesMock : servicesMock;
}

export default {
  servicesMock,
  getServicesMock
}; 