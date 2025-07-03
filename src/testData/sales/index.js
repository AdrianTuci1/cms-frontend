/**
 * Sales Test Data & Utilities - Index
 * 
 * Centralized exports for all sales testing functionality
 * Similar to the dental timeline test structure
 */

// Test data
export { default as salesTestData } from './sales-test-data.json';

// Test utilities
export {
  MockSalesService,
  TestSalesDataProcessor,
  TestSalesStore,
  SalesDataFlowTest,
  runQuickSalesTest
} from './sales-test-utils';

// Test components - Removed redundant examples

// Test files
export { default as salesFlowTest } from './sales-flow.test.js';

// Quick access functions
export const runSalesTests = async (businessType = 'dental') => {
  const { SalesDataFlowTest } = await import('./sales-test-utils');
  const test = new SalesDataFlowTest();
  return await test.runTest({ businessType });
};

export const runSalesScenarioTests = async () => {
  const { SalesDataFlowTest } = await import('./sales-test-utils');
  const test = new SalesDataFlowTest();
  return await test.runScenarioTests();
};

export const getMockSalesService = () => {
  const { MockSalesService } = require('./sales-test-utils');
  return new MockSalesService();
};

export const getTestSalesStore = () => {
  const { TestSalesStore } = require('./sales-test-utils');
  return new TestSalesStore();
};

// Default export for convenience
export default {
  salesTestData,
  MockSalesService,
  TestSalesDataProcessor,
  TestSalesStore,
  SalesDataFlowTest,
  runQuickSalesTest,
  runSalesTests,
  runSalesScenarioTests,
  getMockSalesService,
  getTestSalesStore
}; 