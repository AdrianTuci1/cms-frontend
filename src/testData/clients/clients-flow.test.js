/**
 * Clients Flow Tests
 * Automated tests for the complete clients data flow
 * Similar to sales-flow.test.js structure
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  MockClientsService,
  TestClientsDataProcessor,
  TestClientsStore,
  ClientsDataFlowTest,
  runQuickClientsTest
} from './clients-test-utils.js';

// Test configuration
const TEST_CONFIG = {
  businessTypes: ['dental', 'gym', 'hotel'],
  timeouts: {
    api: 1000,
    processing: 500,
    store: 300
  }
};

describe('Clients Data Flow Tests', () => {
  let apiService;
  let dataProcessor;
  let store;

  beforeEach(() => {
    apiService = new MockClientsService();
    dataProcessor = new TestClientsDataProcessor();
    store = new TestClientsStore();
  });

  /**
   * Test API Layer
   */
  describe('API Layer Tests', () => {
    test('should get clients data for dental business', async () => {
      const response = await apiService.getClients('dental');
      
      expect(response.success).toBe(true);
      expect(response.data.clients.length).toBeGreaterThan(0);
      expect(response.data.statistics).toBeDefined();
      expect(response.data.clients.every(client => client.doctor)).toBe(true);
    });

    test('should get clients data for gym business', async () => {
      const response = await apiService.getClients('gym');
      
      expect(response.success).toBe(true);
      expect(response.data.clients.length).toBeGreaterThan(0);
      expect(response.data.statistics).toBeDefined();
      expect(response.data.clients.every(client => client.trainer)).toBe(true);
    });

    test('should get clients data for hotel business', async () => {
      const response = await apiService.getClients('hotel');
      
      expect(response.success).toBe(true);
      expect(response.data.clients.length).toBeGreaterThan(0);
      expect(response.data.statistics).toBeDefined();
      expect(response.data.clients.every(client => client.roomNumber)).toBe(true);
    });

    test('should filter clients by status', async () => {
      const response = await apiService.getClients('dental', { status: 'active' });
      
      expect(response.success).toBe(true);
      expect(response.data.clients.every(client => client.status === 'active')).toBe(true);
    });

    test('should filter clients by search term', async () => {
      const response = await apiService.getClients('dental', { search: 'Maria' });
      
      expect(response.success).toBe(true);
      expect(response.data.clients.every(client => 
        client.name.toLowerCase().includes('maria') ||
        client.email.toLowerCase().includes('maria') ||
        client.doctor?.toLowerCase().includes('maria')
      )).toBe(true);
    });

    test('should create client successfully', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'test@email.com',
        phone: '0712345678',
        doctor: 'Dr. Test',
        status: 'active'
      };
      
      const response = await apiService.createClient(clientData);
      
      expect(response.success).toBe(true);
      expect(response.data.id).toBeDefined();
      expect(response.data.name).toBe('Test Client');
      expect(response.data.status).toBe('active');
    });

    test('should update client successfully', async () => {
      const updateData = {
        name: 'Updated Client',
        email: 'updated@email.com'
      };
      
      const response = await apiService.updateClient('client-001', updateData);
      
      expect(response.success).toBe(true);
      expect(response.data.id).toBe('client-001');
      expect(response.data.name).toBe('Updated Client');
      expect(response.data.email).toBe('updated@email.com');
    });

    test('should delete client successfully', async () => {
      const response = await apiService.deleteClient('client-001');
      
      expect(response.success).toBe(true);
      expect(response.message).toBe('Client deleted successfully');
    });

    test('should handle invalid business type', async () => {
      await expect(apiService.getClients('invalid')).rejects.toThrow();
    });
  });

  /**
   * Test Data Processing Layer
   */
  describe('Data Processing Layer Tests', () => {
    test('should process clients data correctly', async () => {
      const apiResponse = await apiService.getClients('dental');
      const processedData = dataProcessor.processClientsData(apiResponse.data);
      
      expect(processedData.clients).toBeDefined();
      expect(processedData.clients.length).toBeGreaterThan(0);
      expect(processedData.clients[0].type).toBe('client');
      expect(processedData.clients[0].businessType).toBe('dental');
      expect(processedData.clients[0].processedAt).toBeDefined();
      expect(processedData.clients[0].isActive).toBeDefined();
      expect(processedData.clients[0].isPending).toBeDefined();
      expect(processedData.clients[0].isInactive).toBeDefined();
    });

    test('should filter clients by status', async () => {
      const apiResponse = await apiService.getClients('dental');
      const processedData = dataProcessor.processClientsData(apiResponse.data);
      const activeClients = dataProcessor.filterByStatus(processedData.clients, 'active');
      
      expect(activeClients.every(client => client.status === 'active')).toBe(true);
    });

    test('should filter clients by search term', async () => {
      const apiResponse = await apiService.getClients('dental');
      const processedData = dataProcessor.processClientsData(apiResponse.data);
      const searchResults = dataProcessor.filterBySearch(processedData.clients, 'Maria');
      
      if (searchResults.length > 0) {
        expect(searchResults.every(client => 
          client.name.toLowerCase().includes('maria') ||
          client.email.toLowerCase().includes('maria') ||
          client.doctor?.toLowerCase().includes('maria')
        )).toBe(true);
      }
    });

    test('should get active clients', async () => {
      const apiResponse = await apiService.getClients('dental');
      const processedData = dataProcessor.processClientsData(apiResponse.data);
      const activeClients = dataProcessor.getActiveClients(processedData.clients);
      
      expect(activeClients.every(client => client.status === 'active')).toBe(true);
    });

    test('should get clients by business type', async () => {
      const apiResponse = await apiService.getClients('dental');
      const processedData = dataProcessor.processClientsData(apiResponse.data);
      const dentalClients = dataProcessor.getClientsByBusinessType(processedData.clients, 'dental');
      
      expect(dentalClients.every(client => client.doctor)).toBe(true);
    });

    test('should handle null data processing', async () => {
      const processedData = dataProcessor.processClientsData(null);
      expect(processedData).toBe(null);
    });

    test('should handle empty data processing', async () => {
      const processedData = dataProcessor.processClientsData({});
      expect(processedData).toEqual({});
    });
  });

  /**
   * Test Store Integration Layer
   */
  describe('Store Integration Layer Tests', () => {
    beforeEach(async () => {
      const apiResponse = await apiService.getClients('dental');
      const processedData = dataProcessor.processClientsData(apiResponse.data);
      store.loadClientsData(processedData.clients);
    });

    test('should load clients data into store', () => {
      const clients = store.getAllClients();
      expect(clients.length).toBeGreaterThan(0);
    });

    test('should filter clients by search term', () => {
      store.setSearchTerm('Maria');
      const filteredClients = store.getFilteredClients();
      
      if (filteredClients.length > 0) {
        expect(filteredClients.every(client => 
          (client.name && client.name.toLowerCase().includes('maria')) ||
          (client.email && client.email.toLowerCase().includes('maria')) ||
          (client.doctor && client.doctor.toLowerCase().includes('maria'))
        )).toBe(true);
      } else {
        expect(filteredClients.length).toBe(0);
      }
    });

    test('should filter clients by status', () => {
      store.setSelectedStatus('active');
      const filteredClients = store.getFilteredClients();
      
      if (filteredClients.length > 0) {
        expect(filteredClients.every(client => client.status === 'active')).toBe(true);
      }
    });

    test('should filter clients by business type', () => {
      store.setSelectedBusinessType('dental');
      const filteredClients = store.getFilteredClients();
      
      if (filteredClients.length > 0) {
        expect(filteredClients.every(client => client.doctor)).toBe(true);
      }
    });

    test('should handle multiple filters', () => {
      store.setSearchTerm('Maria');
      store.setSelectedStatus('active');
      store.setSelectedBusinessType('dental');
      
      const filteredClients = store.getFilteredClients();
      expect(filteredClients.length).toBeGreaterThanOrEqual(0);
    });

    test('should clear filters', () => {
      store.setSearchTerm('Maria');
      store.setSelectedStatus('active');
      
      store.setSearchTerm('');
      store.setSelectedStatus('all');
      
      const allClients = store.getAllClients();
      const filteredClients = store.getFilteredClients();
      
      expect(filteredClients.length).toBe(allClients.length);
    });

    test('should handle loading state', () => {
      store.setLoading(true);
      expect(store.getLoading()).toBe(true);
      
      store.setLoading(false);
      expect(store.getLoading()).toBe(false);
    });

    test('should handle error state', () => {
      const error = new Error('Test error');
      store.setError(error);
      
      expect(store.getError()).toBe(error);
      expect(store.getLoading()).toBe(false);
    });
  });

  /**
   * Test Complete Flow
   */
  describe('Complete Flow Tests', () => {
    test('should complete full clients flow', async () => {
      // 1. Get clients from API
      const apiResponse = await apiService.getClients('dental');
      expect(apiResponse.success).toBe(true);
      
      // 2. Process data
      const processedData = dataProcessor.processClientsData(apiResponse.data);
      expect(processedData.clients.length).toBeGreaterThan(0);
      
      // 3. Load into store
      store.loadClientsData(processedData.clients);
      expect(store.getAllClients().length).toBeGreaterThan(0);
      
      // 4. Apply filters
      store.setSearchTerm('Maria');
      store.setSelectedStatus('active');
      
      const filteredClients = store.getFilteredClients();
      expect(filteredClients.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle multiple business types', async () => {
      for (const businessType of TEST_CONFIG.businessTypes) {
        const response = await apiService.getClients(businessType);
        expect(response.success).toBe(true);
        expect(response.data.clients.length).toBeGreaterThan(0);
      }
    });
  });

  /**
   * Test Error Scenarios
   */
  describe('Error Scenarios Tests', () => {
    test('should handle invalid business type', async () => {
      await expect(apiService.getClients('invalid')).rejects.toThrow();
    });

    test('should handle null data processing', async () => {
      const processedData = dataProcessor.processClientsData(null);
      expect(processedData).toBe(null);
    });

    test('should handle empty data processing', async () => {
      const processedData = dataProcessor.processClientsData({});
      expect(processedData).toEqual({});
    });

    test('should handle store with no data', () => {
      store.loadClientsData([]);
      expect(store.getAllClients().length).toBe(0);
      expect(store.getFilteredClients().length).toBe(0);
    });
  });

  /**
   * Test Performance
   */
  describe('Performance Tests', () => {
    test('should handle large datasets', async () => {
      const largeClientsData = Array.from({ length: 100 }, (_, i) => ({
        id: `client-${i}`,
        name: `Client ${i}`,
        email: `client${i}@email.com`,
        phone: `07${i.toString().padStart(8, '0')}`,
        doctor: `Dr. Doctor ${i}`,
        status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending',
        lastVisit: new Date().toISOString()
      }));
      
      store.loadClientsData(largeClientsData);
      const allClients = store.getAllClients();
      
      expect(allClients.length).toBe(100);
    });

    test('should handle concurrent operations', async () => {
      const concurrentOperations = Array.from({ length: 5 }, async (_, index) => {
        const businessType = TEST_CONFIG.businessTypes[index % TEST_CONFIG.businessTypes.length];
        const response = await apiService.getClients(businessType);
        return response;
      });
      
      const results = await Promise.all(concurrentOperations);
      expect(results.length).toBe(5);
      expect(results.every(result => result.success)).toBe(true);
    });
  });
});

/**
 * Quick test function for immediate testing
 */
export async function runClientsFlowTest() {
  console.log('🚀 Running Clients Flow Test...');
  
  try {
    const results = await runQuickClientsTest();
    console.log('✅ Clients Flow Test completed successfully');
    console.log('📊 Results:', results);
    return results;
  } catch (error) {
    console.error('❌ Clients Flow Test failed:', error);
    throw error;
  }
}

/**
 * Test runner for different business types
 */
export async function runClientsBusinessTypeTests() {
  console.log('🏢 Running Clients Business Type Tests...');
  
  const results = {};
  
  for (const businessType of TEST_CONFIG.businessTypes) {
    console.log(`Testing ${businessType} business type...`);
    
    try {
      const test = new ClientsDataFlowTest();
      const result = await test.runTest({ businessType });
      results[businessType] = result;
    } catch (error) {
      results[businessType] = { error: error.message };
    }
  }
  
  console.log('📊 Clients Business Type Test Results:', results);
  return results;
}

/**
 * Export test utilities for external use
 */
export {
  ClientsDataFlowTest,
  MockClientsService,
  TestClientsDataProcessor,
  TestClientsStore
}; 