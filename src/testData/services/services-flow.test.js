/**
 * Services Flow Tests
 * Automated tests for the complete services data flow
 * Similar to clients-flow.test.js structure
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  MockServicesService,
  TestServicesDataProcessor,
  TestServicesStore,
  ServicesDataFlowTest,
  runQuickServicesTest
} from './services-test-utils.js';

// Test configuration
const TEST_CONFIG = {
  businessTypes: ['dental', 'gym', 'hotel'],
  timeouts: {
    api: 1000,
    processing: 500,
    store: 300
  }
};

describe('Services Data Flow Tests', () => {
  let apiService;
  let dataProcessor;
  let store;

  beforeEach(() => {
    apiService = new MockServicesService();
    dataProcessor = new TestServicesDataProcessor();
    store = new TestServicesStore();
  });

  /**
   * Test API Layer
   */
  describe('API Layer Tests', () => {
    test('should get services data for dental business', async () => {
      const response = await apiService.getServices('dental');
      
      expect(response.success).toBe(true);
      expect(response.data.packages.length).toBeGreaterThan(0);
      expect(response.data.statistics).toBeDefined();
      expect(response.data.packages.every(service => service.businessType === 'dental')).toBe(true);
    });

    test('should get services data for gym business', async () => {
      const response = await apiService.getServices('gym');
      
      expect(response.success).toBe(true);
      expect(response.data.packages.length).toBeGreaterThan(0);
      expect(response.data.statistics).toBeDefined();
      expect(response.data.packages.every(service => service.businessType === 'gym')).toBe(true);
    });

    test('should get services data for hotel business', async () => {
      const response = await apiService.getServices('hotel');
      
      expect(response.success).toBe(true);
      expect(response.data.packages.length).toBeGreaterThan(0);
      expect(response.data.statistics).toBeDefined();
      expect(response.data.packages.every(service => service.businessType === 'hotel')).toBe(true);
    });

    test('should filter services by status', async () => {
      const response = await apiService.getServices('dental', { status: 'active' });
      
      expect(response.success).toBe(true);
      expect(response.data.packages.every(service => service.status === 'active')).toBe(true);
    });

    test('should filter services by search term', async () => {
      const response = await apiService.getServices('dental', { search: 'cleaning' });
      
      expect(response.success).toBe(true);
      expect(response.data.packages.every(service => 
        service.name.toLowerCase().includes('cleaning') ||
        service.description.toLowerCase().includes('cleaning') ||
        (service.category && service.category.toLowerCase().includes('cleaning'))
      )).toBe(true);
    });

    test('should create service successfully', async () => {
      const serviceData = {
        name: 'Test Service',
        price: 150,
        description: 'Test service description',
        duration: 60,
        category: 'Test',
        businessType: 'dental'
      };
      
      const response = await apiService.createService(serviceData);
      
      expect(response.success).toBe(true);
      expect(response.data.id).toBeDefined();
      expect(response.data.name).toBe('Test Service');
      expect(response.data.status).toBe('active');
    });

    test('should update service successfully', async () => {
      const updateData = {
        name: 'Updated Service',
        price: 200
      };
      
      const response = await apiService.updateService('service-001', updateData);
      
      expect(response.success).toBe(true);
      expect(response.data.id).toBe('service-001');
      expect(response.data.name).toBe('Updated Service');
      expect(response.data.price).toBe(200);
    });

    test('should delete service successfully', async () => {
      const response = await apiService.deleteService('service-001');
      
      expect(response.success).toBe(true);
      expect(response.message).toBe('Service deleted successfully');
    });

    test('should handle invalid business type', async () => {
      const response = await apiService.getServices('invalid');
      expect(response.data.packages.length).toBe(0);
    });
  });

  /**
   * Test Data Processing Layer
   */
  describe('Data Processing Layer Tests', () => {
    test('should process services data correctly', async () => {
      const apiResponse = await apiService.getServices('dental');
      const processedData = dataProcessor.processServicesData(apiResponse.data);
      
      expect(processedData.packages).toBeDefined();
      expect(processedData.packages.length).toBeGreaterThan(0);
      expect(processedData.packages[0].type).toBe('service');
      expect(processedData.packages[0].businessType).toBe('dental');
      expect(processedData.packages[0].processedAt).toBeDefined();
      expect(processedData.packages[0].isActive).toBeDefined();
      expect(processedData.packages[0].priceFormatted).toBeDefined();
      expect(processedData.packages[0].categoryDisplay).toBeDefined();
    });

    test('should filter services by status', async () => {
      const apiResponse = await apiService.getServices('dental');
      const processedData = dataProcessor.processServicesData(apiResponse.data);
      const activeServices = dataProcessor.filterByStatus(processedData.packages, 'active');
      
      expect(activeServices.every(service => service.status === 'active')).toBe(true);
    });

    test('should filter services by search term', async () => {
      const apiResponse = await apiService.getServices('dental');
      const processedData = dataProcessor.processServicesData(apiResponse.data);
      const searchResults = dataProcessor.filterBySearch(processedData.packages, 'cleaning');
      
      if (searchResults.length > 0) {
        expect(searchResults.every(service => 
          service.name.toLowerCase().includes('cleaning') ||
          service.description.toLowerCase().includes('cleaning') ||
          (service.category && service.category.toLowerCase().includes('cleaning'))
        )).toBe(true);
      }
    });

    test('should filter services by business type', async () => {
      const apiResponse = await apiService.getServices('dental');
      const processedData = dataProcessor.processServicesData(apiResponse.data);
      const dentalServices = dataProcessor.filterByBusinessType(processedData.packages, 'dental');
      
      expect(dentalServices.every(service => service.businessType === 'dental')).toBe(true);
    });

    test('should filter services by price range', async () => {
      const apiResponse = await apiService.getServices('dental');
      const processedData = dataProcessor.processServicesData(apiResponse.data);
      const affordableServices = dataProcessor.filterByPriceRange(processedData.packages, 0, 200);
      
      expect(affordableServices.every(service => service.price >= 0 && service.price <= 200)).toBe(true);
    });

    test('should get active services', async () => {
      const apiResponse = await apiService.getServices('dental');
      const processedData = dataProcessor.processServicesData(apiResponse.data);
      const activeServices = dataProcessor.getActiveServices(processedData.packages);
      
      expect(activeServices.every(service => service.status === 'active')).toBe(true);
    });

    test('should get services by category', async () => {
      const apiResponse = await apiService.getServices('dental');
      const processedData = dataProcessor.processServicesData(apiResponse.data);
      const preventiveServices = dataProcessor.getServicesByCategory(processedData.packages, 'Preventive');
      
      expect(preventiveServices.every(service => 
        service.category === 'Preventive' || service.type === 'Preventive'
      )).toBe(true);
    });

    test('should format duration correctly', () => {
      expect(dataProcessor.formatDuration(30)).toBe('30 min');
      expect(dataProcessor.formatDuration(60)).toBe('1h');
      expect(dataProcessor.formatDuration(90)).toBe('1h 30min');
      expect(dataProcessor.formatDuration(120)).toBe('2h');
    });

    test('should sort services by price', async () => {
      const apiResponse = await apiService.getServices('dental');
      const processedData = dataProcessor.processServicesData(apiResponse.data);
      const sortedByPrice = dataProcessor.sortByPrice(processedData.packages, true);
      
      for (let i = 1; i < sortedByPrice.length; i++) {
        expect(sortedByPrice[i].price).toBeGreaterThanOrEqual(sortedByPrice[i - 1].price);
      }
    });

    test('should sort services by name', async () => {
      const apiResponse = await apiService.getServices('dental');
      const processedData = dataProcessor.processServicesData(apiResponse.data);
      const sortedByName = dataProcessor.sortByName(processedData.packages, true);
      
      for (let i = 1; i < sortedByName.length; i++) {
        expect(sortedByName[i].name.localeCompare(sortedByName[i - 1].name)).toBeGreaterThanOrEqual(0);
      }
    });

    test('should handle null data processing', async () => {
      const processedData = dataProcessor.processServicesData(null);
      expect(processedData).toBe(null);
    });

    test('should handle empty data processing', async () => {
      const processedData = dataProcessor.processServicesData({});
      expect(processedData).toEqual({});
    });
  });

  /**
   * Test Store Integration Layer
   */
  describe('Store Integration Layer Tests', () => {
    beforeEach(async () => {
      await store.loadServices('dental');
    });

    test('should load services into store', async () => {
      expect(store.services.length).toBeGreaterThan(0);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });

    test('should create service in store', async () => {
      const initialCount = store.services.length;
      const serviceData = {
        name: 'New Service',
        price: 150,
        description: 'New service description',
        duration: 60,
        category: 'Test',
        businessType: 'dental'
      };
      
      await store.createService(serviceData);
      
      expect(store.services.length).toBe(initialCount + 1);
      expect(store.services[store.services.length - 1].name).toBe('New Service');
    });

    test('should update service in store', async () => {
      const serviceId = store.services[0].id;
      const updateData = { name: 'Updated Service Name' };
      
      await store.updateService(serviceId, updateData);
      
      const updatedService = store.services.find(service => service.id === serviceId);
      expect(updatedService.name).toBe('Updated Service Name');
    });

    test('should delete service from store', async () => {
      const initialCount = store.services.length;
      const serviceId = store.services[0].id;
      
      await store.deleteService(serviceId);
      
      expect(store.services.length).toBe(initialCount - 1);
      expect(store.services.find(service => service.id === serviceId)).toBeUndefined();
    });

    test('should get services by business type from store', () => {
      const dentalServices = store.getServicesByBusinessType('dental');
      expect(dentalServices.every(service => service.businessType === 'dental')).toBe(true);
    });

    test('should get services by status from store', () => {
      const activeServices = store.getServicesByStatus('active');
      expect(activeServices.every(service => service.status === 'active')).toBe(true);
    });

    test('should search services in store', () => {
      const searchResults = store.searchServices('cleaning');
      if (searchResults.length > 0) {
        expect(searchResults.every(service => 
          service.name.toLowerCase().includes('cleaning') ||
          service.description.toLowerCase().includes('cleaning')
        )).toBe(true);
      }
    });

    test('should get statistics from store', () => {
      const statistics = store.getStatistics();
      
      expect(statistics.total).toBeGreaterThan(0);
      expect(statistics.byBusinessType).toBeDefined();
      expect(statistics.byStatus).toBeDefined();
      expect(statistics.priceRange).toBeDefined();
      expect(statistics.priceRange.min).toBeGreaterThanOrEqual(0);
      expect(statistics.priceRange.max).toBeGreaterThan(0);
      expect(statistics.priceRange.average).toBeGreaterThan(0);
    });
  });

  /**
   * Test Complete Data Flow
   */
  describe('Complete Data Flow Tests', () => {
    test('should complete full data flow for dental services', async () => {
      const test = new ServicesDataFlowTest();
      const result = await test.runTest({ businessType: 'dental' });
      
      expect(result.success).toBe(true);
      expect(result.apiResponse.success).toBe(true);
      expect(result.processedData.packages).toBeDefined();
      expect(result.storeData.length).toBeGreaterThan(0);
      expect(result.statistics.total).toBeGreaterThan(0);
    });

    test('should complete full data flow for gym services', async () => {
      const test = new ServicesDataFlowTest();
      const result = await test.runTest({ businessType: 'gym' });
      
      expect(result.success).toBe(true);
      expect(result.apiResponse.success).toBe(true);
      expect(result.processedData.packages).toBeDefined();
      expect(result.storeData.length).toBeGreaterThan(0);
      expect(result.statistics.total).toBeGreaterThan(0);
    });

    test('should complete full data flow for hotel services', async () => {
      const test = new ServicesDataFlowTest();
      const result = await test.runTest({ businessType: 'hotel' });
      
      expect(result.success).toBe(true);
      expect(result.apiResponse.success).toBe(true);
      expect(result.processedData.packages).toBeDefined();
      expect(result.storeData.length).toBeGreaterThan(0);
      expect(result.statistics.total).toBeGreaterThan(0);
    });

    test('should run scenario tests for all business types', async () => {
      const test = new ServicesDataFlowTest();
      const results = await test.runScenarioTests();
      
      expect(results.length).toBe(3);
      expect(results.every(result => result.success)).toBe(true);
      expect(results.map(r => r.scenario)).toEqual([
        'Dental Services',
        'Gym Services',
        'Hotel Services'
      ]);
    });
  });

  /**
   * Test Error Handling
   */
  describe('Error Handling Tests', () => {
    test('should handle API errors gracefully', async () => {
      // Mock API service to throw error
      const mockApiService = {
        getServices: vi.fn().mockRejectedValue(new Error('API Error'))
      };
      
      const test = new ServicesDataFlowTest();
      test.apiService = mockApiService;
      
      const result = await test.runTest({ businessType: 'dental' });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    test('should handle store errors gracefully', async () => {
      // Mock store to throw error
      const mockStore = {
        loadServices: vi.fn().mockRejectedValue(new Error('Store Error'))
      };
      
      const test = new ServicesDataFlowTest();
      test.store = mockStore;
      
      const result = await test.runTest({ businessType: 'dental' });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Store Error');
    });
  });
});

/**
 * Export test functions for external use
 */
export async function runServicesFlowTest() {
  const test = new ServicesDataFlowTest();
  return await test.runTest();
}

export async function runServicesBusinessTypeTests() {
  const test = new ServicesDataFlowTest();
  return await test.runScenarioTests();
}

export async function runServicesQuickTest(businessType = 'dental') {
  return await runQuickServicesTest(businessType);
} 