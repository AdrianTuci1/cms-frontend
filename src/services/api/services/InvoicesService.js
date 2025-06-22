import BaseApiService from './BaseApiService.js';
import { invoicesSectionGeneral, billingSuggestionsSectionGeneral } from '../../../data/dataModel/invoicesSectionData.js';

/**
 * Invoices Service
 * Handles invoice-related API operations
 */
class InvoicesService extends BaseApiService {
  constructor(apiClient, tenantId, locationId) {
    super(apiClient, tenantId, locationId);
  }

  /**
   * Get all invoices with pagination and optional filters
   * @param {Object} pagination - Pagination parameters (page, limit, search, displayDate)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Paginated invoices
   */
  async getInvoices(pagination = {}, options = {}) {
    return this.getPaginated('invoices', pagination, options);
  }

  /**
   * Get invoice by ID
   * @param {number} invoiceId - Invoice ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Invoice data
   */
  async getInvoice(invoiceId, options = {}) {
    return this.getById('invoices', invoiceId, options);
  }

  /**
   * Create a new invoice
   * @param {Object} invoiceData - Invoice data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Created invoice
   */
  async createInvoice(invoiceData, options = {}) {
    return this.create('invoices', invoiceData, options);
  }

  /**
   * Update an existing invoice
   * @param {number} invoiceId - Invoice ID
   * @param {Object} invoiceData - Updated invoice data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Updated invoice
   */
  async updateInvoice(invoiceId, invoiceData, options = {}) {
    return this.update('invoices', invoiceId, invoiceData, options);
  }

  /**
   * Delete an invoice
   * @param {number} invoiceId - Invoice ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Deletion result
   */
  async deleteInvoice(invoiceId, options = {}) {
    return this.remove('invoices', invoiceId, options);
  }

  /**
   * Search invoices by client or business name
   * @param {string} searchTerm - Search term
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Search results
   */
  async searchInvoices(searchTerm, options = {}) {
    return this.search('invoices', searchTerm, options);
  }

  /**
   * Get billing suggestions
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Billing suggestions
   */
  async getBillingSuggestions(options = {}) {
    return this.get('billing-suggestions', options);
  }

  /**
   * Get demo data for invoices endpoints
   * @param {string} endpointKey - Endpoint key
   * @returns {*} Demo data
   */
  getDemoData(endpointKey) {
    switch (endpointKey) {
      case 'invoices':
        return invoicesSectionGeneral;
      case 'billing-suggestions':
        return billingSuggestionsSectionGeneral;
      default:
        return invoicesSectionGeneral;
    }
  }
}

export default InvoicesService; 