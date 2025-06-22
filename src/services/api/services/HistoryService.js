import BaseApiService from './BaseApiService.js';
import { historySectionGeneral } from '../../../data/dataModel/historySectionData.js';

/**
 * History Service
 * Handles history-related API operations
 */
class HistoryService extends BaseApiService {
  constructor(apiClient, tenantId, locationId) {
    super(apiClient, tenantId, locationId);
  }

  /**
   * Get history data
   * @param {Object} filters - Filter parameters
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} History data
   */
  async getHistoryData(filters = {}, options = {}) {
    return this.getGeneralHistory(filters, options);
  }

  /**
   * Get general history
   * @param {Object} filters - Filter parameters
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} History data
   */
  async getGeneralHistory(filters = {}, options = {}) {
    const params = {
      ...filters,
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Get history by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} History data
   */
  async getHistoryByDateRange(startDate, endDate, options = {}) {
    const params = {
      startDate,
      endDate,
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Get history for specific date
   * @param {string} displayDate - Display date (YYYY-MM-DD)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} History data
   */
  async getHistoryByDate(displayDate, options = {}) {
    const params = {
      displayDate,
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Get history by type
   * @param {string} type - History type (check-out, problem, cleaning, deleted, etc.)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} History data
   */
  async getHistoryByType(type, options = {}) {
    const params = {
      type,
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Get history by status
   * @param {string} status - History status (success, failed, pending)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} History data
   */
  async getHistoryByStatus(status, options = {}) {
    const params = {
      status,
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Get history by user
   * @param {number} userId - User ID
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} History data
   */
  async getHistoryByUser(userId, options = {}) {
    const params = {
      initiatedBy: userId,
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Get revertable history items
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Revertable history data
   */
  async getRevertableHistory(options = {}) {
    const params = {
      revertable: true,
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Get non-revertable history items
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Non-revertable history data
   */
  async getNonRevertableHistory(options = {}) {
    const params = {
      revertable: false,
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Revert a history item
   * @param {number} historyId - History item ID
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Revert result
   */
  async revertHistoryItem(historyId, options = {}) {
    return this.post(`history/${historyId}/revert`, options);
  }

  /**
   * Get history statistics
   * @param {Object} filters - Filter parameters
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} History statistics
   */
  async getHistoryStatistics(filters = {}, options = {}) {
    const params = {
      ...filters,
      ...options.params
    };
    return this.get('history/statistics', { ...options, params });
  }

  /**
   * Get history by action
   * @param {string} action - Action description
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} History data
   */
  async getHistoryByAction(action, options = {}) {
    const params = {
      action,
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Search history
   * @param {string} searchTerm - Search term
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Search results
   */
  async searchHistory(searchTerm, options = {}) {
    const params = {
      search: searchTerm,
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Get recent history
   * @param {number} limit - Number of items to return
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Recent history
   */
  async getRecentHistory(limit = 10, options = {}) {
    const params = {
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Get history timeline
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Timeline data
   */
  async getHistoryTimeline(startDate, endDate, options = {}) {
    const params = {
      startDate,
      endDate,
      timeline: true,
      ...options.params
    };
    return this.get('history', { ...options, params });
  }

  /**
   * Export history
   * @param {Object} filters - Filter parameters
   * @param {string} format - Export format (csv, json, pdf)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Export result
   */
  async exportHistory(filters = {}, format = 'csv', options = {}) {
    const params = {
      ...filters,
      format,
      ...options.params
    };
    return this.get('history/export', { ...options, params });
  }

  /**
   * Get demo data for history endpoints
   * @param {string} endpointKey - Endpoint key
   * @returns {*} Demo data
   */
  getDemoData(endpointKey) {
    switch (endpointKey) {
      case 'history':
        return historySectionGeneral;
      case 'history/statistics':
        return {
          total: 150,
          byType: {
            'check-out': 45,
            'problem': 12,
            'cleaning': 38,
            'deleted': 8,
            'other': 47
          },
          byStatus: {
            success: 120,
            failed: 15,
            pending: 15
          },
          revertable: 8
        };
      case 'history/export':
        return {
          success: true,
          downloadUrl: '/api/downloads/history-export.csv',
          message: 'History exported successfully'
        };
      default:
        return historySectionGeneral;
    }
  }

  /**
   * Get history validation rules
   * @returns {Object} Validation rules
   */
  getHistoryValidationRules() {
    return {
      displayDate: { required: false, type: 'date' },
      startDate: { required: false, type: 'date' },
      endDate: { required: false, type: 'date' },
      type: { required: false, type: 'string' },
      status: { required: false, enum: ['success', 'failed', 'pending'] },
      revertable: { required: false, type: 'boolean' }
    };
  }

  /**
   * Get history default values
   * @returns {Object} Default values
   */
  getHistoryDefaultValues() {
    return {
      displayDate: new Date().toISOString().split('T')[0],
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
  }

  /**
   * Get history data structure
   * @returns {Object} Data structure
   */
  getHistoryDataStructure() {
    return {
      entityType: 'HistoryItem',
      dataType: 'general',
      fields: [
        'id',
        'date',
        'hour',
        'initiatedBy',
        'description',
        'action',
        'type',
        'status',
        'revertable'
      ],
      types: [
        'check-out',
        'problem',
        'cleaning',
        'deleted',
        'created',
        'updated',
        'login',
        'logout',
        'other'
      ],
      statuses: ['success', 'failed', 'pending'],
      pagination: true,
      filtering: true,
      sorting: true
    };
  }
}

export default HistoryService; 