/**
 * Clients Test Data & Utilities - Index
 * 
 * Centralized exports for all clients testing functionality
 * Similar to the sales test structure
 */

// Test data
export { default as clientsTestData } from './clients-test-data.json';

// Test utilities
export {
  MockClientsService,
  TestClientsDataProcessor,
  TestClientsStore,
  ClientsDataFlowTest,
  runQuickClientsTest
} from './clients-test-utils';

// Test files
export { default as clientsFlowTest } from './clients-flow.test.js';

// Quick access functions
export const runClientsTests = async (businessType = 'dental') => {
  const { ClientsDataFlowTest } = await import('./clients-test-utils');
  const test = new ClientsDataFlowTest();
  return await test.runTest({ businessType });
};

export const runClientsScenarioTests = async () => {
  const { ClientsDataFlowTest } = await import('./clients-test-utils');
  const test = new ClientsDataFlowTest();
  return await test.runScenarioTests();
};

export const getMockClientsService = () => {
  const { MockClientsService } = require('./clients-test-utils');
  return new MockClientsService();
};

export const getTestClientsStore = () => {
  const { TestClientsStore } = require('./clients-test-utils');
  return new TestClientsStore();
};

// Default export for convenience
export default {
  clientsTestData,
  MockClientsService,
  TestClientsDataProcessor,
  TestClientsStore,
  ClientsDataFlowTest,
  runQuickClientsTest,
  runClientsTests,
  runClientsScenarioTests,
  getMockClientsService,
  getTestClientsStore
}; 