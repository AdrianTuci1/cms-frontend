/**
 * Sales Mock Data - Date mock pentru vânzări
 */

// Import comprehensive test data from testData
import salesTestData from '../../testData/sales/sales-test-data.json';

// Mock data pentru sales - Using test data
export const salesMock = salesTestData.response.data;

/**
 * Funcție pentru obținerea datelor vânzări
 */
export function getSalesMock(businessType = null) {
  return businessType ? salesMock : salesMock;
}

export default {
  salesMock,
  getSalesMock
}; 