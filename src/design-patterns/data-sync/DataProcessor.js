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
   * @param {Object} config - Resource configuration
   */
  processResponse(resource, response, config = {}) {
    let processedData;

    switch (resource) {
      case 'timeline':
        processedData = this.processTimelineData(response);
        break;
      case 'clients':
        processedData = this.processClientsData(response);
        break;
      case 'packages':
        processedData = this.processPackagesData(response);
        break;
      case 'members':
        processedData = this.processMembersData(response);
        break;
      case 'invoices':
        processedData = this.processInvoicesData(response);
        break;
      case 'stocks':
        processedData = this.processStocksData(response);
        break;
      case 'sales':
        processedData = this.processSalesData(response);
        break;
      case 'agent':
        processedData = this.processAgentData(response);
        break;
      case 'history':
        processedData = this.processHistoryData(response);
        break;
      case 'workflows':
        processedData = this.processWorkflowsData(response);
        break;
      case 'reports':
        processedData = this.processReportsData(response);
        break;
      case 'roles':
        processedData = this.processRolesData(response);
        break;
      case 'permissions':
        processedData = this.processPermissionsData(response);
        break;
      case 'userData':
        processedData = this.processUserDataData(response);
        break;
      case 'businessInfo':
        processedData = this.processBusinessInfoData(response);
        break;
      default:
        processedData = response;
    }

    // Apply current day filtering if configured
    if (config.currentDayOnly) {
      processedData = this.filterForCurrentDay(processedData, resource);
    }

    return processedData;
  }

  /**
   * Filter data for current day only
   * @param {Array|Object} data - Data to filter
   * @param {string} resource - Resource name
   */
  filterForCurrentDay(data, resource) {
    if (!data) return data;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const items = Array.isArray(data) ? data : [data];

    const filteredItems = items.filter(item => {
      // Check different date fields based on resource type
      const dateFields = this.getDateFieldsForResource(resource);
      
      return dateFields.some(field => {
        const itemDate = item[field];
        if (!itemDate) return false;
        
        // Handle different date formats
        if (typeof itemDate === 'string') {
          // If it's already in YYYY-MM-DD format
          if (itemDate.length === 10) {
            return itemDate === today;
          }
          // If it's a full ISO string, extract the date part
          if (itemDate.includes('T')) {
            return itemDate.split('T')[0] === today;
          }
        }
        
        // If it's a Date object
        if (itemDate instanceof Date) {
          return itemDate.toISOString().split('T')[0] === today;
        }
        
        return false;
      });
    });

    return Array.isArray(data) ? filteredItems : (filteredItems[0] || null);
  }

  /**
   * Get date fields to check for each resource type
   * @param {string} resource - Resource name
   */
  getDateFieldsForResource(resource) {
    const dateFieldMap = {
      invoices: ['createdAt', 'date', 'invoiceDate'],
      stocks: ['createdAt', 'updatedAt', 'lastUpdated'],
      sales: ['createdAt', 'saleDate', 'date'],
      history: ['createdAt', 'date', 'timestamp']
    };

    return dateFieldMap[resource] || ['createdAt', 'date', 'timestamp'];
  }

  /**
   * Process timeline data
   * Timeline data should already be standardized as an array from DataSyncManager
   */
  processTimelineData(data) {
    // Ensure data is an array and add timeline-specific metadata
    const timelineArray = Array.isArray(data) ? data : [data];
    
    return timelineArray.map(item => ({
      ...item,
      type: 'timeline',
      businessType: this.businessType,
      processedAt: new Date().toISOString()
    }));
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
   * @param {Object|Array} data - Data to process
   * @param {string} resource - Resource name
   * @param {string} source - Data source (api, mock, indexeddb, etc.)
   */
  addMetadata(data, resource, source = 'api') {
    const timestamp = new Date().toISOString();
    
    // Handle arrays by adding metadata to each item
    if (Array.isArray(data)) {
      return data.map(item => {
        // Ensure each item has a valid id
        let itemWithId = item;
        if (!item.id) {
          itemWithId = {
            ...item,
            id: `${resource}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          };
        }
        
        return {
          ...itemWithId,
          _syncTimestamp: timestamp,
          _lastModified: timestamp,
          _version: (item._version || 0) + 1,
          _resource: resource,
          _source: source
        };
      });
    }
    
    // Handle single objects
    let dataWithId = data;
    if (!data.id) {
      // Generate a unique id if none exists
      dataWithId = {
        ...data,
        id: `${resource}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
    }
    
    return {
      ...dataWithId,
      _syncTimestamp: timestamp,
      _lastModified: timestamp,
      _version: (data._version || 0) + 1,
      _resource: resource,
      _source: source
    };
  }
}

export function createDataProcessor() {
  return new DataProcessor();
} 