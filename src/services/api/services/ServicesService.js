import BaseApiService from './BaseApiService.js';
import { treatmentsSectionClinic } from '../../../data/dataModel/homeSectionData.js';
import { gymPackagesData } from '../../../data/dataModel/gymData.js';
import { hotelRoomsData } from '../../../data/dataModel/hotelData.js';

/**
 * Services Service
 * Handles services-related API operations with business-specific data types
 */
class ServicesService extends BaseApiService {
  constructor(apiClient, tenantId, locationId) {
    super(apiClient, tenantId, locationId);
    this.servicesDataType = apiClient.getStrategy().getServicesDataType();
  }

  /**
   * Get services data based on business type
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Services data
   */
  async getServicesData(options = {}) {
    switch (this.servicesDataType) {
      case 'treatments':
        return this.getTreatments(options);
      case 'packages':
        return this.getPackages(options);
      case 'rooms':
        return this.getRooms(options);
      default:
        throw new Error(`Unknown services data type: ${this.servicesDataType}`);
    }
  }

  /**
   * Get treatments (Dental Clinic)
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Treatments
   */
  async getTreatments(options = {}) {
    return this.get('treatments', options);
  }

  /**
   * Get packages (Gym)
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Packages
   */
  async getPackages(options = {}) {
    return this.get('packages', options);
  }

  /**
   * Get rooms (Hotel)
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Rooms
   */
  async getRooms(options = {}) {
    return this.get('rooms', options);
  }

  /**
   * Get all services (generic)
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Services
   */
  async getServices(options = {}) {
    return this.getServicesData(options);
  }

  /**
   * Get service by ID
   * @param {number} serviceId - Service ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Service data
   */
  async getService(serviceId, options = {}) {
    return this.getById(this.getServiceEndpoint(), serviceId, options);
  }

  /**
   * Create a new service
   * @param {Object} serviceData - Service data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Created service
   */
  async createService(serviceData, options = {}) {
    return this.create(this.getServiceEndpoint(), serviceData, options);
  }

  /**
   * Update an existing service
   * @param {number} serviceId - Service ID
   * @param {Object} serviceData - Updated service data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Updated service
   */
  async updateService(serviceId, serviceData, options = {}) {
    return this.update(this.getServiceEndpoint(), serviceId, serviceData, options);
  }

  /**
   * Delete a service
   * @param {number} serviceId - Service ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Deletion result
   */
  async deleteService(serviceId, options = {}) {
    return this.remove(this.getServiceEndpoint(), serviceId, options);
  }

  /**
   * Search services
   * @param {string} searchTerm - Search term
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Search results
   */
  async searchServices(searchTerm, options = {}) {
    return this.search(this.getServiceEndpoint(), searchTerm, options);
  }

  /**
   * Get services by status
   * @param {string} status - Service status
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Services with specified status
   */
  async getServicesByStatus(status, options = {}) {
    const params = { status, ...options.params };
    return this.get(this.getServiceEndpoint(), { ...options, params });
  }

  /**
   * Get active services
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Active services
   */
  async getActiveServices(options = {}) {
    return this.getServicesByStatus('active', options);
  }

  /**
   * Get inactive services
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Inactive services
   */
  async getInactiveServices(options = {}) {
    return this.getServicesByStatus('inactive', options);
  }

  /**
   * Get treatments by category (Dental Clinic)
   * @param {string} category - Treatment category
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Treatments in category
   */
  async getTreatmentsByCategory(category, options = {}) {
    const params = { category, ...options.params };
    return this.get('treatments', { ...options, params });
  }

  /**
   * Get treatments by price range (Dental Clinic)
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Treatments in price range
   */
  async getTreatmentsByPriceRange(minPrice, maxPrice, options = {}) {
    const params = { minPrice, maxPrice, ...options.params };
    return this.get('treatments', { ...options, params });
  }

  /**
   * Get packages by category (Gym)
   * @param {string} category - Package category
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Packages in category
   */
  async getPackagesByCategory(category, options = {}) {
    const params = { category, ...options.params };
    return this.get('packages', { ...options, params });
  }

  /**
   * Get packages by price range (Gym)
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Packages in price range
   */
  async getPackagesByPriceRange(minPrice, maxPrice, options = {}) {
    const params = { minPrice, maxPrice, ...options.params };
    return this.get('packages', { ...options, params });
  }

  /**
   * Get rooms by type (Hotel)
   * @param {string} type - Room type
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Rooms of specified type
   */
  async getRoomsByType(type, options = {}) {
    const params = { type, ...options.params };
    return this.get('rooms', { ...options, params });
  }

  /**
   * Get rooms by status (Hotel)
   * @param {string} status - Room status
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Rooms with specified status
   */
  async getRoomsByStatus(status, options = {}) {
    const params = { status, ...options.params };
    return this.get('rooms', { ...options, params });
  }

  /**
   * Get available rooms (Hotel)
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Available rooms
   */
  async getAvailableRooms(options = {}) {
    return this.getRoomsByStatus('available', options);
  }

  /**
   * Get occupied rooms (Hotel)
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Occupied rooms
   */
  async getOccupiedRooms(options = {}) {
    return this.getRoomsByStatus('occupied', options);
  }

  /**
   * Get rooms by floor (Hotel)
   * @param {number} floor - Floor number
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Rooms on specified floor
   */
  async getRoomsByFloor(floor, options = {}) {
    const params = { floor, ...options.params };
    return this.get('rooms', { ...options, params });
  }

  /**
   * Get rooms by capacity (Hotel)
   * @param {number} capacity - Room capacity
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Rooms with specified capacity
   */
  async getRoomsByCapacity(capacity, options = {}) {
    const params = { capacity, ...options.params };
    return this.get('rooms', { ...options, params });
  }

  /**
   * Get services statistics
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Services statistics
   */
  async getServicesStatistics(options = {}) {
    return this.get(`${this.getServiceEndpoint()}/statistics`, options);
  }

  /**
   * Bulk import services
   * @param {Array} servicesData - Array of service data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Import results
   */
  async bulkImportServices(servicesData, options = {}) {
    return this.post(`${this.getServiceEndpoint()}/bulk-import`, { 
      ...options, 
      body: { services: servicesData } 
    });
  }

  /**
   * Export services
   * @param {Object} filters - Export filters
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Export data
   */
  async exportServices(filters = {}, options = {}) {
    return this.post(`${this.getServiceEndpoint()}/export`, { 
      ...options, 
      body: filters 
    });
  }

  /**
   * Get service endpoint based on data type
   * @returns {string} Service endpoint
   */
  getServiceEndpoint() {
    switch (this.servicesDataType) {
      case 'treatments':
        return 'treatments';
      case 'packages':
        return 'packages';
      case 'rooms':
        return 'rooms';
      default:
        throw new Error(`Unknown services data type: ${this.servicesDataType}`);
    }
  }

  /**
   * Get services data type
   * @returns {string} Services data type
   */
  getServicesDataType() {
    return this.servicesDataType;
  }

  /**
   * Get demo data for services
   * @param {string} endpointKey - Endpoint key
   * @returns {Object} Demo data
   */
  getDemoData(endpointKey) {
    const demoDataMap = this.apiClient.getStrategy().getDemoData();
    
    switch (endpointKey) {
      case 'treatments':
        return treatmentsSectionClinic;
      case 'packages':
        return gymPackagesData;
      case 'rooms':
        return hotelRoomsData;
      default:
        return super.getDemoData(endpointKey);
    }
  }

  /**
   * Get validation rules for services
   * @returns {Object} Validation rules
   */
  getServiceValidationRules() {
    return this.getValidationRules(this.getServiceEndpoint());
  }

  /**
   * Get default values for services
   * @returns {Object} Default values
   */
  getServiceDefaultValues() {
    return this.getDefaultValues(this.getServiceEndpoint());
  }

  /**
   * Get data structure for services
   * @returns {Object} Data structure
   */
  getServiceDataStructure() {
    return this.getDataStructure(this.getServiceEndpoint());
  }
}

export default ServicesService; 