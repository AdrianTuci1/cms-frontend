import BaseApiService from './BaseApiService.js';
import { clientsSectionClinic } from '../../../data/dataModel/homeSectionData.js';
import { gymMembersData } from '../../../data/dataModel/gymData.js';
import { hotelGuestsData } from '../../../data/dataModel/hotelData.js';

/**
 * Clients Service
 * Handles client-related API operations with business-specific data types
 */
class ClientsService extends BaseApiService {
  constructor(apiClient, tenantId, locationId) {
    super(apiClient, tenantId, locationId);
    this.clientsDataType = apiClient.getStrategy().getClientsDataType();
  }

  /**
   * Get clients data based on business type
   * @param {Object} pagination - Pagination parameters
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Clients data
   */
  async getClientsData(pagination = {}, options = {}) {
    switch (this.clientsDataType) {
      case 'patients':
        return this.getPatients(pagination, options);
      case 'members':
        return this.getMembers(pagination, options);
      case 'guests':
        return this.getGuests(pagination, options);
      default:
        throw new Error(`Unknown clients data type: ${this.clientsDataType}`);
    }
  }

  /**
   * Get patients (Dental Clinic)
   * @param {Object} pagination - Pagination parameters
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Paginated patients
   */
  async getPatients(pagination = {}, options = {}) {
    return this.getPaginated('clients', pagination, options);
  }

  /**
   * Get members (Gym)
   * @param {Object} pagination - Pagination parameters
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Paginated members
   */
  async getMembers(pagination = {}, options = {}) {
    return this.getPaginated('clients', pagination, options);
  }

  /**
   * Get guests (Hotel)
   * @param {Object} pagination - Pagination parameters
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Paginated guests
   */
  async getGuests(pagination = {}, options = {}) {
    return this.getPaginated('clients', pagination, options);
  }

  /**
   * Get all clients with pagination (generic)
   * @param {Object} pagination - Pagination parameters
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Paginated clients
   */
  async getClients(pagination = {}, options = {}) {
    return this.getPaginated('clients', pagination, options);
  }

  /**
   * Get client by ID
   * @param {number} clientId - Client ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Client data
   */
  async getClient(clientId, options = {}) {
    return this.getById('clients', clientId, options);
  }

  /**
   * Create a new client
   * @param {Object} clientData - Client data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Created client
   */
  async createClient(clientData, options = {}) {
    return this.create('clients', clientData, options);
  }

  /**
   * Update an existing client
   * @param {number} clientId - Client ID
   * @param {Object} clientData - Updated client data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Updated client
   */
  async updateClient(clientId, clientData, options = {}) {
    return this.update('clients', clientId, clientData, options);
  }

  /**
   * Delete a client
   * @param {number} clientId - Client ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Deletion result
   */
  async deleteClient(clientId, options = {}) {
    return this.remove('clients', clientId, options);
  }

  /**
   * Search clients by name or email
   * @param {string} searchTerm - Search term
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Search results
   */
  async searchClients(searchTerm, options = {}) {
    return this.search('clients', searchTerm, options);
  }

  /**
   * Get clients by status
   * @param {string} status - Client status
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Clients with specified status
   */
  async getClientsByStatus(status, options = {}) {
    const params = { status, ...options.params };
    return this.get('clients', { ...options, params });
  }

  /**
   * Get active clients
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Active clients
   */
  async getActiveClients(options = {}) {
    return this.getClientsByStatus('active', options);
  }

  /**
   * Get inactive clients
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Inactive clients
   */
  async getInactiveClients(options = {}) {
    return this.getClientsByStatus('inactive', options);
  }

  /**
   * Get clients with upcoming appointments (Dental Clinic)
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Clients with upcoming appointments
   */
  async getClientsWithUpcomingAppointments(options = {}) {
    const params = { hasUpcomingAppointments: true, ...options.params };
    return this.get('clients', { ...options, params });
  }

  /**
   * Get clients with recent appointments (Dental Clinic)
   * @param {number} days - Number of days to look back
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Clients with recent appointments
   */
  async getClientsWithRecentAppointments(days = 30, options = {}) {
    const params = { recentAppointmentsDays: days, ...options.params };
    return this.get('clients', { ...options, params });
  }

  /**
   * Get members with expiring memberships (Gym)
   * @param {number} days - Number of days to look ahead
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Members with expiring memberships
   */
  async getMembersWithExpiringMemberships(days = 30, options = {}) {
    const params = { expiringMembershipsDays: days, ...options.params };
    return this.get('clients', { ...options, params });
  }

  /**
   * Get members by trainer (Gym)
   * @param {number} trainerId - Trainer ID
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Members assigned to trainer
   */
  async getMembersByTrainer(trainerId, options = {}) {
    const params = { trainerId, ...options.params };
    return this.get('clients', { ...options, params });
  }

  /**
   * Get guests with current reservations (Hotel)
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Guests with current reservations
   */
  async getGuestsWithCurrentReservations(options = {}) {
    const params = { hasCurrentReservation: true, ...options.params };
    return this.get('clients', { ...options, params });
  }

  /**
   * Get guests by loyalty level (Hotel)
   * @param {string} loyaltyLevel - Loyalty level
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Guests with specified loyalty level
   */
  async getGuestsByLoyaltyLevel(loyaltyLevel, options = {}) {
    const params = { loyaltyLevel, ...options.params };
    return this.get('clients', { ...options, params });
  }

  /**
   * Get client statistics
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Client statistics
   */
  async getClientStatistics(options = {}) {
    return this.get('clients/statistics', options);
  }

  /**
   * Bulk import clients
   * @param {Array} clientsData - Array of client data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Import results
   */
  async bulkImportClients(clientsData, options = {}) {
    return this.post('clients/bulk-import', { 
      ...options, 
      body: { clients: clientsData } 
    });
  }

  /**
   * Export clients
   * @param {Object} filters - Export filters
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Export data
   */
  async exportClients(filters = {}, options = {}) {
    return this.post('clients/export', { 
      ...options, 
      body: filters 
    });
  }

  /**
   * Get client history
   * @param {number} clientId - Client ID
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Client history
   */
  async getClientHistory(clientId, options = {}) {
    return this.get(`clients/${clientId}/history`, options);
  }

  /**
   * Get client appointments
   * @param {number} clientId - Client ID
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Client appointments
   */
  async getClientAppointments(clientId, options = {}) {
    return this.get(`clients/${clientId}/appointments`, options);
  }

  /**
   * Get client invoices
   * @param {number} clientId - Client ID
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Client invoices
   */
  async getClientInvoices(clientId, options = {}) {
    return this.get(`clients/${clientId}/invoices`, options);
  }

  /**
   * Merge duplicate clients
   * @param {number} primaryClientId - Primary client ID
   * @param {Array} duplicateClientIds - Array of duplicate client IDs
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Merge result
   */
  async mergeClients(primaryClientId, duplicateClientIds, options = {}) {
    return this.post('clients/merge', { 
      ...options, 
      body: { 
        primaryClientId, 
        duplicateClientIds 
      } 
    });
  }

  /**
   * Get clients data type
   * @returns {string} Clients data type
   */
  getClientsDataType() {
    return this.clientsDataType;
  }

  /**
   * Get demo data for clients
   * @param {string} endpointKey - Endpoint key
   * @returns {Object} Demo data
   */
  getDemoData(endpointKey) {
    const demoDataMap = this.apiClient.getStrategy().getDemoData();
    
    switch (endpointKey) {
      case 'clients':
        switch (this.clientsDataType) {
          case 'patients':
            return clientsSectionClinic;
          case 'members':
            return gymMembersData;
          case 'guests':
            return hotelGuestsData;
          default:
            return super.getDemoData(endpointKey);
        }
      default:
        return super.getDemoData(endpointKey);
    }
  }

  /**
   * Get validation rules for clients
   * @returns {Object} Validation rules
   */
  getClientValidationRules() {
    return this.getValidationRules('clients');
  }

  /**
   * Get default values for clients
   * @returns {Object} Default values
   */
  getClientDefaultValues() {
    return this.getDefaultValues('clients');
  }

  /**
   * Get data structure for clients
   * @returns {Object} Data structure
   */
  getClientDataStructure() {
    return this.getDataStructure('clients');
  }
}

export default ClientsService; 