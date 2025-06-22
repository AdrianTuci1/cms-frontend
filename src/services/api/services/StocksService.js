import BaseApiService from './BaseApiService.js';
import { stocksSectionGeneral } from '../../../data/dataModel/stocksSectionData.js';

/**
 * Stocks Service
 * Handles stock-related API operations
 */
class StocksService extends BaseApiService {
  constructor(apiClient, tenantId, locationId) {
    super(apiClient, tenantId, locationId);
  }

  /**
   * Get all stocks with pagination and optional search
   * @param {Object} pagination - Pagination parameters (page, limit, search)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Paginated stocks
   */
  async getStocks(pagination = {}, options = {}) {
    return this.getPaginated('stocks', pagination, options);
  }

  /**
   * Get stock by ID
   * @param {number} stockId - Stock ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Stock data
   */
  async getStock(stockId, options = {}) {
    return this.getById('stocks', stockId, options);
  }

  /**
   * Create a new stock
   * @param {Object} stockData - Stock data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Created stock
   */
  async createStock(stockData, options = {}) {
    return this.create('stocks', stockData, options);
  }

  /**
   * Update an existing stock
   * @param {number} stockId - Stock ID
   * @param {Object} stockData - Updated stock data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Updated stock
   */
  async updateStock(stockId, stockData, options = {}) {
    return this.update('stocks', stockId, stockData, options);
  }

  /**
   * Delete a stock
   * @param {number} stockId - Stock ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Deletion result
   */
  async deleteStock(stockId, options = {}) {
    return this.remove('stocks', stockId, options);
  }

  /**
   * Search stocks by name or category
   * @param {string} searchTerm - Search term
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Search results
   */
  async searchStocks(searchTerm, options = {}) {
    return this.search('stocks', searchTerm, options);
  }

  /**
   * Get demo data for stocks endpoint
   * @param {string} endpointKey - Endpoint key
   * @returns {*} Demo data
   */
  getDemoData(endpointKey) {
    if (endpointKey === 'stocks') {
      return stocksSectionGeneral;
    }
    return {};
  }
}

export default StocksService; 