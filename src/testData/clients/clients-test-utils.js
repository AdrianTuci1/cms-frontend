/**
 * Clients Test Utilities
 * Complete test utilities for clients functionality testing
 * Similar to sales-test-utils.js structure
 */

import clientsTestData from './clients-test-data.json';

/**
 * Mock Clients Service
 * Simulates the API layer for clients functionality
 */
export class MockClientsService {
  constructor() {
    this.data = clientsTestData;
    this.clientsHistory = [];
  }

  /**
   * Simulate API call to get clients
   * @param {string} businessType - Business type
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Clients data
   */
  async getClients(businessType, params = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Validate parameters
    if (!['dental', 'gym', 'hotel'].includes(businessType)) {
      throw new Error('Invalid business type');
    }

    // Filter data based on business type and parameters
    let filteredData = { ...this.data };
    let clients = [...this.data.response.data.clients];
    
    // Filter by business type
    if (businessType === 'dental') {
      clients = clients.filter(client => client.doctor);
    } else if (businessType === 'gym') {
      clients = clients.filter(client => client.trainer);
    } else if (businessType === 'hotel') {
      clients = clients.filter(client => client.roomNumber);
    }
    
    // Filter by status if provided
    if (params.status && params.status !== 'all') {
      clients = clients.filter(client => client.status === params.status);
    }
    
    // Filter by search term if provided
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      clients = clients.filter(client => 
        client.name?.toLowerCase().includes(searchTerm) ||
        client.email?.toLowerCase().includes(searchTerm) ||
        client.phone?.includes(params.search) ||
        client.doctor?.toLowerCase().includes(searchTerm) ||
        client.trainer?.toLowerCase().includes(searchTerm) ||
        client.previousTreatment?.name?.toLowerCase().includes(searchTerm) ||
        client.nextTreatment?.name?.toLowerCase().includes(searchTerm)
      );
    }

    // Update statistics
    const statistics = {
      totalClients: clients.length,
      activeClients: clients.filter(client => client.status === 'active').length,
      inactiveClients: clients.filter(client => client.status === 'inactive').length,
      pendingClients: clients.filter(client => client.status === 'pending').length,
      businessTypes: {
        [businessType]: clients.length
      },
      statusDistribution: {
        active: clients.filter(client => client.status === 'active').length,
        inactive: clients.filter(client => client.status === 'inactive').length,
        pending: clients.filter(client => client.status === 'pending').length
      }
    };

    return {
      success: true,
      data: {
        clients,
        statistics
      }
    };
  }

  /**
   * Simulate API call to create a client
   * @param {Object} clientData - Client data
   * @returns {Promise<Object>} Created client
   */
  async createClient(clientData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newClient = {
      id: `client-${Date.now()}`,
      ...clientData,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to clients history
    this.clientsHistory.push(newClient);

    return {
      success: true,
      data: newClient,
      message: 'Client created successfully'
    };
  }

  /**
   * Simulate API call to update a client
   * @param {string} clientId - Client ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated client
   */
  async updateClient(clientId, updateData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return {
      success: true,
      data: { 
        id: clientId, 
        ...updateData,
        updatedAt: new Date().toISOString() 
      },
      message: 'Client updated successfully'
    };
  }

  /**
   * Simulate API call to delete a client
   * @param {string} clientId - Client ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteClient(clientId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      message: 'Client deleted successfully'
    };
  }

  /**
   * Get clients history
   * @returns {Array} Clients history
   */
  getClientsHistory() {
    return this.clientsHistory;
  }

  /**
   * Clear clients history (for testing)
   */
  clearClientsHistory() {
    this.clientsHistory = [];
  }
}

/**
 * Test Data Processor
 * Simulates the design patterns data processing
 */
export class TestClientsDataProcessor {
  constructor() {
    this.businessType = 'dental';
  }

  /**
   * Process clients data (simulates DataProcessor.processClientsData)
   * @param {Object} data - Raw API data
   * @returns {Object} Processed data
   */
  processClientsData(data) {
    if (!data || !data.clients) {
      return data;
    }

    return {
      ...data,
      clients: data.clients.map(client => ({
        ...client,
        type: 'client',
        businessType: this.businessType,
        processedAt: new Date().toISOString(),
        // Add computed fields
        isActive: client.status === 'active',
        isPending: client.status === 'pending',
        isInactive: client.status === 'inactive',
        daysSinceLastVisit: this.calculateDaysSinceLastVisit(client.lastVisit),
        formattedLastVisit: client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'N/A'
      }))
    };
  }

  /**
   * Calculate days since last visit
   * @param {string} lastVisit - Last visit date
   * @returns {number} Days since last visit
   */
  calculateDaysSinceLastVisit(lastVisit) {
    if (!lastVisit) return null;
    const lastVisitDate = new Date(lastVisit);
    const today = new Date();
    const diffTime = Math.abs(today - lastVisitDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Filter clients by status
   * @param {Array} clients - Clients array
   * @param {string} status - Status to filter by
   * @returns {Array} Filtered clients
   */
  filterByStatus(clients, status) {
    if (!status || status === 'all') {
      return clients;
    }
    return clients.filter(client => client.status === status);
  }

  /**
   * Filter clients by search term
   * @param {Array} clients - Clients array
   * @param {string} searchTerm - Search term
   * @returns {Array} Filtered clients
   */
  filterBySearch(clients, searchTerm) {
    if (!searchTerm) {
      return clients;
    }
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      (client.name && client.name.toLowerCase().includes(term)) ||
      (client.email && client.email.toLowerCase().includes(term)) ||
      (client.phone && client.phone.includes(searchTerm)) ||
      (client.doctor && client.doctor.toLowerCase().includes(term)) ||
      (client.trainer && client.trainer.toLowerCase().includes(term)) ||
      (client.previousTreatment?.name && client.previousTreatment.name.toLowerCase().includes(term)) ||
      (client.nextTreatment?.name && client.nextTreatment.name.toLowerCase().includes(term))
    );
  }

  /**
   * Get active clients
   * @param {Array} clients - Clients array
   * @returns {Array} Active clients
   */
  getActiveClients(clients) {
    return clients.filter(client => client.status === 'active');
  }

  /**
   * Get clients by business type
   * @param {Array} clients - Clients array
   * @param {string} businessType - Business type
   * @returns {Array} Filtered clients
   */
  getClientsByBusinessType(clients, businessType) {
    if (businessType === 'dental') {
      return clients.filter(client => client.doctor);
    } else if (businessType === 'gym') {
      return clients.filter(client => client.trainer);
    } else if (businessType === 'hotel') {
      return clients.filter(client => client.roomNumber);
    }
    return clients;
  }
}

/**
 * Test Store Integration
 * Simulates the features layer store integration
 */
export class TestClientsStore {
  constructor() {
    this.state = {
      clients: [],
      filteredClients: [],
      loading: false,
      error: null,
      searchTerm: '',
      selectedStatus: 'all',
      selectedBusinessType: 'dental'
    };
  }

  /**
   * Load clients data
   * @param {Array} clients - Clients data
   */
  loadClientsData(clients) {
    this.state.clients = clients;
    this.state.filteredClients = clients;
    this.state.loading = false;
    this.state.error = null;
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoading(loading) {
    this.state.loading = loading;
  }

  /**
   * Set error state
   * @param {Error} error - Error object
   */
  setError(error) {
    this.state.error = error;
    this.state.loading = false;
  }

  /**
   * Set search term
   * @param {string} searchTerm - Search term
   */
  setSearchTerm(searchTerm) {
    this.state.searchTerm = searchTerm;
    this.applyFilters();
  }

  /**
   * Set selected status
   * @param {string} status - Selected status
   */
  setSelectedStatus(status) {
    this.state.selectedStatus = status;
    this.applyFilters();
  }

  /**
   * Set selected business type
   * @param {string} businessType - Selected business type
   */
  setSelectedBusinessType(businessType) {
    this.state.selectedBusinessType = businessType;
    this.applyFilters();
  }

  /**
   * Apply filters to clients
   */
  applyFilters() {
    let filtered = [...this.state.clients];

    // Filter by business type
    if (this.state.selectedBusinessType === 'dental') {
      filtered = filtered.filter(client => client.doctor);
    } else if (this.state.selectedBusinessType === 'gym') {
      filtered = filtered.filter(client => client.trainer);
    } else if (this.state.selectedBusinessType === 'hotel') {
      filtered = filtered.filter(client => client.roomNumber);
    }

    // Filter by status
    if (this.state.selectedStatus !== 'all') {
      filtered = filtered.filter(client => client.status === this.state.selectedStatus);
    }

    // Filter by search term
    if (this.state.searchTerm) {
      const term = this.state.searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        (client.name && client.name.toLowerCase().includes(term)) ||
        (client.email && client.email.toLowerCase().includes(term)) ||
        (client.phone && client.phone.includes(this.state.searchTerm)) ||
        (client.doctor && client.doctor.toLowerCase().includes(term)) ||
        (client.trainer && client.trainer.toLowerCase().includes(term)) ||
        (client.previousTreatment?.name && client.previousTreatment.name.toLowerCase().includes(term)) ||
        (client.nextTreatment?.name && client.nextTreatment.name.toLowerCase().includes(term))
      );
    }

    this.state.filteredClients = filtered;
  }

  /**
   * Get filtered clients
   * @returns {Array} Filtered clients
   */
  getFilteredClients() {
    return this.state.filteredClients;
  }

  /**
   * Get all clients
   * @returns {Array} All clients
   */
  getAllClients() {
    return this.state.clients;
  }

  /**
   * Get loading state
   * @returns {boolean} Loading state
   */
  getLoading() {
    return this.state.loading;
  }

  /**
   * Get error state
   * @returns {Error|null} Error state
   */
  getError() {
    return this.state.error;
  }

  /**
   * Get search term
   * @returns {string} Search term
   */
  getSearchTerm() {
    return this.state.searchTerm;
  }

  /**
   * Get selected status
   * @returns {string} Selected status
   */
  getSelectedStatus() {
    return this.state.selectedStatus;
  }

  /**
   * Get selected business type
   * @returns {string} Selected business type
   */
  getSelectedBusinessType() {
    return this.state.selectedBusinessType;
  }
}

/**
 * Clients Data Flow Test
 * Complete test runner for the entire clients data flow
 */
export class ClientsDataFlowTest {
  constructor() {
    this.apiService = new MockClientsService();
    this.dataProcessor = new TestClientsDataProcessor();
    this.store = new TestClientsStore();
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Run complete test
   * @param {Object} params - Test parameters
   * @returns {Object} Test results
   */
  async runTest(params = {}) {
    const businessType = params.businessType || 'dental';
    
    console.log(`🧪 Running Clients Data Flow Test for ${businessType}...`);
    
    try {
      // Test API layer
      await this.testApiLayer(params);
      
      // Test data processing layer
      await this.testDataProcessingLayer(params);
      
      // Test store integration layer
      await this.testStoreIntegrationLayer(params);
      
      // Test complete flow
      await this.testCompleteFlow(params);
      
      // Test error scenarios
      await this.testErrorScenarios(params);
      
      console.log(`✅ Clients Data Flow Test completed for ${businessType}`);
      return this.results;
    } catch (error) {
      console.error(`❌ Clients Data Flow Test failed for ${businessType}:`, error);
      this.results.errors.push(error.message);
      return this.results;
    }
  }

  /**
   * Test API Layer
   * @param {Object} params - Test parameters
   */
  async testApiLayer(params) {
    console.log('  📡 Testing API Layer...');
    
    const businessType = params.businessType || 'dental';
    
    // Test get clients
    const response = await this.apiService.getClients(businessType);
    if (response.success && response.data.clients.length > 0) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('API getClients failed');
    }

    // Test search functionality
    const searchResponse = await this.apiService.getClients(businessType, { search: 'Maria' });
    if (searchResponse.success) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('API search failed');
    }

    // Test status filtering
    const statusResponse = await this.apiService.getClients(businessType, { status: 'active' });
    if (statusResponse.success) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('API status filtering failed');
    }

    // Test invalid business type
    try {
      await this.apiService.getClients('invalid');
      this.results.failed++;
      this.results.errors.push('API should throw error for invalid business type');
    } catch (error) {
      this.results.passed++;
    }
  }

  /**
   * Test Data Processing Layer
   * @param {Object} params - Test parameters
   */
  async testDataProcessingLayer(params) {
    console.log('  🔄 Testing Data Processing Layer...');
    
    const businessType = params.businessType || 'dental';
    this.dataProcessor.businessType = businessType;
    
    // Get API data
    const apiResponse = await this.apiService.getClients(businessType);
    const processedData = this.dataProcessor.processClientsData(apiResponse.data);
    
    if (processedData.clients && processedData.clients.length > 0) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('Data processing failed');
    }

    // Test filtering by status
    const activeClients = this.dataProcessor.filterByStatus(processedData.clients, 'active');
    if (activeClients.length >= 0) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('Status filtering failed');
    }

    // Test search filtering
    const searchResults = this.dataProcessor.filterBySearch(processedData.clients, 'Maria');
    if (searchResults.length >= 0) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('Search filtering failed');
    }

    // Test business type filtering
    const businessTypeClients = this.dataProcessor.getClientsByBusinessType(processedData.clients, businessType);
    if (businessTypeClients.length >= 0) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('Business type filtering failed');
    }
  }

  /**
   * Test Store Integration Layer
   * @param {Object} params - Test parameters
   */
  async testStoreIntegrationLayer(params) {
    console.log('  🏪 Testing Store Integration Layer...');
    
    const businessType = params.businessType || 'dental';
    
    // Get and process data
    const apiResponse = await this.apiService.getClients(businessType);
    const processedData = this.dataProcessor.processClientsData(apiResponse.data);
    
    // Load into store
    this.store.loadClientsData(processedData.clients);
    
    if (this.store.getAllClients().length > 0) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('Store data loading failed');
    }

    // Test search functionality
    this.store.setSearchTerm('Maria');
    const searchResults = this.store.getFilteredClients();
    if (searchResults.length >= 0) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('Store search failed');
    }

    // Test status filtering
    this.store.setSelectedStatus('active');
    const statusResults = this.store.getFilteredClients();
    if (statusResults.length >= 0) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('Store status filtering failed');
    }

    // Test business type filtering
    this.store.setSelectedBusinessType(businessType);
    const businessTypeResults = this.store.getFilteredClients();
    if (businessTypeResults.length >= 0) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('Store business type filtering failed');
    }
  }

  /**
   * Test Complete Flow
   * @param {Object} params - Test parameters
   */
  async testCompleteFlow(params) {
    console.log('  🔄 Testing Complete Flow...');
    
    const businessType = params.businessType || 'dental';
    
    // 1. Get data from API
    const apiResponse = await this.apiService.getClients(businessType);
    if (!apiResponse.success) {
      this.results.failed++;
      this.results.errors.push('API call failed in complete flow');
      return;
    }
    
    // 2. Process data
    const processedData = this.dataProcessor.processClientsData(apiResponse.data);
    if (!processedData.clients || processedData.clients.length === 0) {
      this.results.failed++;
      this.results.errors.push('Data processing failed in complete flow');
      return;
    }
    
    // 3. Load into store
    this.store.loadClientsData(processedData.clients);
    if (this.store.getAllClients().length === 0) {
      this.results.failed++;
      this.results.errors.push('Store loading failed in complete flow');
      return;
    }
    
    // 4. Test search and filtering
    this.store.setSearchTerm('Maria');
    this.store.setSelectedStatus('active');
    const filteredClients = this.store.getFilteredClients();
    
    if (filteredClients.length >= 0) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('Complete flow filtering failed');
    }
  }

  /**
   * Test Error Scenarios
   * @param {Object} params - Test parameters
   */
  async testErrorScenarios(params) {
    console.log('  ⚠️ Testing Error Scenarios...');
    
    // Test invalid business type
    try {
      await this.apiService.getClients('invalid');
      this.results.failed++;
      this.results.errors.push('Should throw error for invalid business type');
    } catch (error) {
      this.results.passed++;
    }

    // Test null data processing
    const nullProcessed = this.dataProcessor.processClientsData(null);
    if (nullProcessed === null) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('Should handle null data');
    }

    // Test empty data processing
    const emptyProcessed = this.dataProcessor.processClientsData({});
    if (emptyProcessed && !emptyProcessed.clients) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push('Should handle empty data');
    }
  }

  /**
   * Run scenario tests
   * @returns {Object} Scenario test results
   */
  async runScenarioTests() {
    console.log('🎭 Running Clients Scenario Tests...');
    
    const scenarios = [
      { name: 'Dental Clinic', businessType: 'dental' },
      { name: 'Gym', businessType: 'gym' },
      { name: 'Hotel', businessType: 'hotel' }
    ];
    
    const results = {};
    
    for (const scenario of scenarios) {
      console.log(`  Testing ${scenario.name} scenario...`);
      try {
        const result = await this.runTest({ businessType: scenario.businessType });
        results[scenario.name] = result;
      } catch (error) {
        results[scenario.name] = { error: error.message };
      }
    }
    
    return results;
  }
}

/**
 * Quick test function for immediate testing
 */
export async function runQuickClientsTest() {
  console.log('🚀 Running Quick Clients Test...');
  
  try {
    const test = new ClientsDataFlowTest();
    const results = await test.runTest();
    
    console.log('✅ Quick Clients Test completed');
    console.log(`📊 Results: ${results.passed} passed, ${results.failed} failed`);
    
    if (results.errors.length > 0) {
      console.log('❌ Errors:', results.errors);
    }
    
    return results;
  } catch (error) {
    console.error('❌ Quick Clients Test failed:', error);
    throw error;
  }
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