/**
 * Data Processor - Processes and transforms data from API responses
 */

class DataProcessor {
  constructor() {
    this.businessType = null;
  }

  /**
   * Set business type for data processing
   * @param {string} businessType - Business type
   */
  setBusinessType(businessType) {
    this.businessType = businessType;
  }

  /**
   * Process response based on resource type
   * @param {string} resource - Resource name
   * @param {Object} response - API response data
   */
  processResponse(resource, response) {
    switch (resource) {
      case 'timeline':
        return this.processTimelineData(response);
      case 'clients':
        return this.processClientsData(response);
      case 'packages':
        return this.processPackagesData(response);
      case 'members':
        return this.processMembersData(response);
      case 'invoices':
        return this.processInvoicesData(response);
      case 'stocks':
        return this.processStocksData(response);
      case 'sales':
        return this.processSalesData(response);
      case 'agent':
        return this.processAgentData(response);
      case 'history':
        return this.processHistoryData(response);
      case 'workflows':
        return this.processWorkflowsData(response);
      case 'reports':
        return this.processReportsData(response);
      case 'roles':
        return this.processRolesData(data);
      case 'permissions':
        return this.processPermissionsData(response);
      case 'userData':
        return this.processUserDataData(response);
      case 'businessInfo':
        return this.processBusinessInfoData(response);
      default:
        return response;
    }
  }

  /**
   * Process timeline data
   */
  processTimelineData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'timeline',
      businessType: this.businessType
    })) : data;
  }

  /**
   * Process clients data
   */
  processClientsData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'client',
      businessType: this.businessType
    })) : data;
  }

  /**
   * Process packages data
   */
  processPackagesData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'package',
      businessType: this.businessType
    })) : data;
  }

  /**
   * Process members data
   */
  processMembersData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'member',
      businessType: this.businessType
    })) : data;
  }

  /**
   * Process invoices data
   */
  processInvoicesData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'invoice'
    })) : data;
  }

  /**
   * Process stocks data
   */
  processStocksData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'stock'
    })) : data;
  }

  /**
   * Process sales data
   */
  processSalesData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'sale'
    })) : data;
  }

  /**
   * Process agent data
   */
  processAgentData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'agent'
    })) : data;
  }

  /**
   * Process history data
   */
  processHistoryData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'history'
    })) : data;
  }

  /**
   * Process workflows data
   */
  processWorkflowsData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'workflow'
    })) : data;
  }

  /**
   * Process reports data
   */
  processReportsData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'report'
    })) : data;
  }

  /**
   * Process roles data
   */
  processRolesData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'role'
    })) : data;
  }

  /**
   * Process permissions data
   */
  processPermissionsData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'permission'
    })) : data;
  }

  /**
   * Process userData data
   */
  processUserDataData(data) {
    return Array.isArray(data) ? data.map(item => ({
      ...item,
      type: 'userData'
    })) : data;
  }

  /**
   * Process business info data
   */
  processBusinessInfoData(data) {
    return {
      ...data,
      type: 'businessInfo',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check if data is stale
   * @param {Object|Array} data - Data to check
   * @param {Object} config - Resource configuration
   */
  isDataStale(data, config) {
    if (!config || !config.maxOfflineAge) return false;

    const items = Array.isArray(data) ? data : [data];
    const now = new Date().getTime();

    return items.some(item => {
      const timestamp = new Date(item._syncTimestamp || item.timestamp).getTime();
      return (now - timestamp) > config.maxOfflineAge;
    });
  }

  /**
   * Add metadata to data
   * @param {Object} data - Data to process
   * @param {string} resource - Resource name
   */
  addMetadata(data, resource) {
    const timestamp = new Date().toISOString();
    return {
      ...data,
      _syncTimestamp: timestamp,
      _lastModified: timestamp,
      _version: (data._version || 0) + 1,
      _resource: resource
    };
  }
}

export function createDataProcessor() {
  return new DataProcessor();
} 