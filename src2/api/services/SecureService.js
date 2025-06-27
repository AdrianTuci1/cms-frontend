/**
 * SecureService - Serviciu pentru endpoint-urile care necesită JWT
 * 
 * Acest serviciu se ocupă de endpoint-urile care necesită JWT:
 * - /api/invoices
 * - /api/stocks
 * - /api/sales
 * - /api/agent
 * - /api/history
 * - /api/workflows
 * - /api/reports
 * - /api/roles
 * - /api/permissions
 * - /api/userData
 * 
 * Folosește utilitarele pentru construirea cererilor și validarea parametrilor.
 */

import { ApiClient } from '../core/index.js';
import { requestBuilder } from '../utils/requestBuilder.js';

class SecureService {
  constructor(apiClient = null) {
    this.apiClient = apiClient || new ApiClient();
  }

  /**
   * Obține facturile
   * Endpoint: /api/invoices
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Facturile de la API
   */
  async getInvoices(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        status: (value) => {
          if (value && !['pending', 'paid', 'cancelled'].includes(value)) {
            return 'Status must be pending, paid, or cancelled';
          }
          return true;
        },
        limit: (value) => {
          if (value && (value < 1 || value > 100)) {
            return 'Limit must be between 1 and 100';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/invoices', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleSecureError(error);
    }
  }

  /**
   * Obține stocul
   * Endpoint: /api/stocks
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Stocul de la API
   */
  async getStocks(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        category: (value) => {
          if (value && typeof value !== 'string') {
            return 'Category must be a string';
          }
          return true;
        },
        lowStock: (value) => {
          if (value && typeof value !== 'boolean') {
            return 'Low stock must be a boolean';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/stocks', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleSecureError(error);
    }
  }

  /**
   * Obține vânzările
   * Endpoint: /api/sales
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Vânzările de la API
   */
  async getSales(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        startDate: (value) => {
          if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return 'Start date must be in YYYY-MM-DD format';
          }
          return true;
        },
        endDate: (value) => {
          if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return 'End date must be in YYYY-MM-DD format';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/sales', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleSecureError(error);
    }
  }

  /**
   * Obține datele agentului
   * Endpoint: /api/agent
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Datele agentului de la API
   */
  async getAgentData(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        includeStats: (value) => {
          if (value && typeof value !== 'boolean') {
            return 'Include stats must be a boolean';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/agent', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleSecureError(error);
    }
  }

  /**
   * Obține istoricul
   * Endpoint: /api/history
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Istoricul de la API
   */
  async getHistory(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        type: (value) => {
          if (value && !['appointments', 'sales', 'invoices'].includes(value)) {
            return 'Type must be appointments, sales, or invoices';
          }
          return true;
        },
        limit: (value) => {
          if (value && (value < 1 || value > 1000)) {
            return 'Limit must be between 1 and 1000';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/history', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleSecureError(error);
    }
  }

  /**
   * Obține workflow-urile
   * Endpoint: /api/workflows
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Workflow-urile de la API
   */
  async getWorkflows(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        status: (value) => {
          if (value && !['active', 'inactive', 'draft'].includes(value)) {
            return 'Status must be active, inactive, or draft';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/workflows', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleSecureError(error);
    }
  }

  /**
   * Obține rapoartele
   * Endpoint: /api/reports
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Rapoartele de la API
   */
  async getReports(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        type: (value) => {
          if (value && !['daily', 'weekly', 'monthly', 'yearly'].includes(value)) {
            return 'Type must be daily, weekly, monthly, or yearly';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/reports', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleSecureError(error);
    }
  }

  /**
   * Obține rolurile
   * Endpoint: /api/roles
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Rolurile de la API
   */
  async getRoles(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        active: (value) => {
          if (value && typeof value !== 'boolean') {
            return 'Active must be a boolean';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/roles', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleSecureError(error);
    }
  }

  /**
   * Obține permisiunile
   * Endpoint: /api/permissions
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Permisiunile de la API
   */
  async getPermissions(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        roleId: (value) => {
          if (value && typeof value !== 'string') {
            return 'Role ID must be a string';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/permissions', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleSecureError(error);
    }
  }

  /**
   * Obține datele utilizatorului
   * Endpoint: /api/userData
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Datele utilizatorului de la API
   */
  async getUserData(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        includeProfile: (value) => {
          if (value && typeof value !== 'boolean') {
            return 'Include profile must be a boolean';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/userData', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleSecureError(error);
    }
  }

  /**
   * Gestionează erorile specifice pentru serviciile securizate
   */
  handleSecureError(error) {
    console.error('SecureService Error:', error);
    return error;
  }
}

export default SecureService; 