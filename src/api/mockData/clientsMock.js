/**
 * Clients Mock Data - Date mock pentru clienți
 */

// Import comprehensive test data from testData
import clientsTestData from '../../testData/clients/clients-test-data.json';

// Mock data pentru clients - Using test data
export const clientsMock = clientsTestData.response.data;

/**
 * Funcție pentru obținerea datelor clienți
 */
export function getClientsMock(businessType = null) {
  return businessType ? clientsMock : clientsMock;
}

export default {
  clientsMock,
  getClientsMock
}; 