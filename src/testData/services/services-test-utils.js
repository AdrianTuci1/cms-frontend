/**
 * Services Test Utilities
 * 
 * Mock services, data processors, and test utilities for services functionality
 * Similar to clients-test-utils.js structure
 */

import servicesTestData from './services-test-data.json';

/**
 * Mock Services API Service
 */
export class MockServicesService {
  constructor() {
    this.data = servicesTestData.response.data;
  }

  async getServices(businessType = 'dental', filters = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    let filteredPackages = this.data.packages.filter(service => 
      service.businessType === businessType
    );

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      filteredPackages = filteredPackages.filter(service => 
        service.status === filters.status
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPackages = filteredPackages.filter(service => 
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        (service.category && service.category.toLowerCase().includes(searchLower)) ||
        (service.type && service.type.toLowerCase().includes(searchLower)) ||
        (service.features && service.features.some(feature => 
          feature.toLowerCase().includes(searchLower)
        )) ||
        (service.amenities && service.amenities.some(amenity => 
          amenity.toLowerCase().includes(searchLower)
        ))
      );
    }

    return {
      success: true,
      data: {
        packages: filteredPackages,
        statistics: this.calculateStatistics(filteredPackages)
      }
    };
  }

  async createService(serviceData) {
    await new Promise(resolve => setTimeout(resolve, 150));

    const newService = {
      id: `service-${Date.now()}`,
      ...serviceData,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.packages.push(newService);

    return {
      success: true,
      data: newService
    };
  }

  async updateService(serviceId, updateData) {
    await new Promise(resolve => setTimeout(resolve, 100));

    const serviceIndex = this.data.packages.findIndex(service => service.id === serviceId);
    
    if (serviceIndex === -1) {
      throw new Error('Service not found');
    }

    this.data.packages[serviceIndex] = {
      ...this.data.packages[serviceIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: this.data.packages[serviceIndex]
    };
  }

  async deleteService(serviceId) {
    await new Promise(resolve => setTimeout(resolve, 100));

    const serviceIndex = this.data.packages.findIndex(service => service.id === serviceId);
    
    if (serviceIndex === -1) {
      throw new Error('Service not found');
    }

    this.data.packages.splice(serviceIndex, 1);

    return {
      success: true,
      message: 'Service deleted successfully'
    };
  }

  calculateStatistics(packages) {
    const total = packages.length;
    const byBusinessType = packages.reduce((acc, service) => {
      acc[service.businessType] = (acc[service.businessType] || 0) + 1;
      return acc;
    }, {});
    
    const byStatus = packages.reduce((acc, service) => {
      acc[service.status] = (acc[service.status] || 0) + 1;
      return acc;
    }, {});

    const prices = packages.map(service => service.price);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length * 100) / 100
    };

    return {
      total,
      byBusinessType,
      byStatus,
      priceRange
    };
  }
}

/**
 * Test Services Data Processor
 */
export class TestServicesDataProcessor {
  processServicesData(data) {
    if (!data || !data.packages) {
      return data;
    }

    return {
      ...data,
      packages: data.packages.map(service => ({
        ...service,
        type: 'service',
        processedAt: new Date().toISOString(),
        isActive: service.status === 'active',
        isInactive: service.status === 'inactive',
        priceFormatted: `$${service.price}`,
        durationFormatted: this.formatDuration(service.duration),
        categoryDisplay: service.category || service.type || 'General'
      }))
    };
  }

  filterByStatus(services, status) {
    return services.filter(service => service.status === status);
  }

  filterBySearch(services, searchTerm) {
    if (!searchTerm) return services;
    
    const searchLower = searchTerm.toLowerCase();
    return services.filter(service => 
      service.name.toLowerCase().includes(searchLower) ||
      service.description.toLowerCase().includes(searchLower) ||
      (service.category && service.category.toLowerCase().includes(searchLower)) ||
      (service.type && service.type.toLowerCase().includes(searchLower)) ||
      (service.features && service.features.some(feature => 
        feature.toLowerCase().includes(searchLower)
      )) ||
      (service.amenities && service.amenities.some(amenity => 
        amenity.toLowerCase().includes(searchLower)
      ))
    );
  }

  filterByBusinessType(services, businessType) {
    return services.filter(service => service.businessType === businessType);
  }

  filterByPriceRange(services, minPrice, maxPrice) {
    return services.filter(service => 
      service.price >= minPrice && service.price <= maxPrice
    );
  }

  getActiveServices(services) {
    return services.filter(service => service.status === 'active');
  }

  getServicesByCategory(services, category) {
    return services.filter(service => 
      service.category === category || service.type === category
    );
  }

  formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }

  sortByPrice(services, ascending = true) {
    return [...services].sort((a, b) => {
      return ascending ? a.price - b.price : b.price - a.price;
    });
  }

  sortByName(services, ascending = true) {
    return [...services].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return ascending ? comparison : -comparison;
    });
  }
}

/**
 * Test Services Store
 */
export class TestServicesStore {
  constructor() {
    this.services = [];
    this.loading = false;
    this.error = null;
    this.filters = {
      search: '',
      status: 'all',
      businessType: 'dental'
    };
  }

  async loadServices(businessType = 'dental', filters = {}) {
    this.loading = true;
    this.error = null;

    try {
      const apiService = new MockServicesService();
      const response = await apiService.getServices(businessType, filters);
      
      if (response.success) {
        this.services = response.data.packages;
        this.filters = { ...this.filters, ...filters };
      } else {
        throw new Error('Failed to load services');
      }
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  }

  async createService(serviceData) {
    this.loading = true;
    this.error = null;

    try {
      const apiService = new MockServicesService();
      const response = await apiService.createService(serviceData);
      
      if (response.success) {
        this.services.push(response.data);
      } else {
        throw new Error('Failed to create service');
      }
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  }

  async updateService(serviceId, updateData) {
    this.loading = true;
    this.error = null;

    try {
      const apiService = new MockServicesService();
      const response = await apiService.updateService(serviceId, updateData);
      
      if (response.success) {
        const index = this.services.findIndex(service => service.id === serviceId);
        if (index !== -1) {
          this.services[index] = response.data;
        }
      } else {
        throw new Error('Failed to update service');
      }
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  }

  async deleteService(serviceId) {
    this.loading = true;
    this.error = null;

    try {
      const apiService = new MockServicesService();
      const response = await apiService.deleteService(serviceId);
      
      if (response.success) {
        this.services = this.services.filter(service => service.id !== serviceId);
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  }

  getServicesByBusinessType(businessType) {
    return this.services.filter(service => service.businessType === businessType);
  }

  getServicesByStatus(status) {
    return this.services.filter(service => service.status === status);
  }

  searchServices(searchTerm) {
    if (!searchTerm) return this.services;
    
    const searchLower = searchTerm.toLowerCase();
    return this.services.filter(service => 
      service.name.toLowerCase().includes(searchLower) ||
      service.description.toLowerCase().includes(searchLower) ||
      (service.category && service.category.toLowerCase().includes(searchLower)) ||
      (service.type && service.type.toLowerCase().includes(searchLower))
    );
  }

  getStatistics() {
    const total = this.services.length;
    const byBusinessType = this.services.reduce((acc, service) => {
      acc[service.businessType] = (acc[service.businessType] || 0) + 1;
      return acc;
    }, {});
    
    const byStatus = this.services.reduce((acc, service) => {
      acc[service.status] = (acc[service.status] || 0) + 1;
      return acc;
    }, {});

    const prices = this.services.map(service => service.price);
    const priceRange = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length * 100) / 100
    } : { min: 0, max: 0, average: 0 };

    return {
      total,
      byBusinessType,
      byStatus,
      priceRange
    };
  }
}

/**
 * Services Data Flow Test
 */
export class ServicesDataFlowTest {
  constructor() {
    this.apiService = new MockServicesService();
    this.dataProcessor = new TestServicesDataProcessor();
    this.store = new TestServicesStore();
  }

  async runTest(options = {}) {
    const { businessType = 'dental', filters = {} } = options;
    
    console.log(`Running Services Data Flow Test for ${businessType}...`);
    
    try {
      // Test API Layer
      const apiResponse = await this.apiService.getServices(businessType, filters);
      console.log('✅ API Layer Test Passed');
      
      // Test Data Processing Layer
      const processedData = this.dataProcessor.processServicesData(apiResponse.data);
      console.log('✅ Data Processing Layer Test Passed');
      
      // Test Store Layer
      await this.store.loadServices(businessType, filters);
      console.log('✅ Store Layer Test Passed');
      
      return {
        success: true,
        apiResponse,
        processedData,
        storeData: this.store.services,
        statistics: this.store.getStatistics()
      };
    } catch (error) {
      console.error('❌ Services Data Flow Test Failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async runScenarioTests() {
    const scenarios = [
      { businessType: 'dental', description: 'Dental Services' },
      { businessType: 'gym', description: 'Gym Services' },
      { businessType: 'hotel', description: 'Hotel Services' }
    ];

    const results = [];

    for (const scenario of scenarios) {
      console.log(`\n🧪 Testing ${scenario.description}...`);
      const result = await this.runTest({ businessType: scenario.businessType });
      results.push({
        scenario: scenario.description,
        ...result
      });
    }

    return results;
  }
}

/**
 * Quick Services Test
 */
export async function runQuickServicesTest(businessType = 'dental') {
  const test = new ServicesDataFlowTest();
  return await test.runTest({ businessType });
} 