/**
 * GeneralService - Serviciu pentru endpoint-urile generale fără JWT
 * 
 * Acest serviciu se ocupă de endpoint-urile care nu necesită JWT:
 * - /api/auth
 * - /api/business-info
 * 
 * Folosește utilitarele pentru construirea cererilor și validarea parametrilor.
 */

import { ApiClient } from '../core/client/ApiClient.js';
import requestBuilder from '../utils/requestBuilder.js';
import { tenantUtils } from '../../config/tenant.js';

class GeneralService {
  constructor(apiClient = null) {
    this.apiClient = apiClient || new ApiClient();
  }

  /**
   * Autentificare
   * Endpoint: /api/auth
   * @param {Object} authData - Datele de autentificare
   * @returns {Promise<Object>} Răspunsul de autentificare
   */
  async authenticate(authData) {
    try {
      // Validează datele de autentificare
      const validatedData = requestBuilder.validateParams(authData, ['code'], {
        code: (value) => {
          if (!value || typeof value !== 'string') {
            return 'Auth code is required and must be a string';
          }
          return true;
        },
        userId: (value) => {
          if (value && typeof value !== 'string') {
            return 'User ID must be a string';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.post('/api/auth', validatedData);

      const response = await this.apiClient.post(requestConfig.url, validatedData);
      return response.data;
    } catch (error) {
      throw this.handleGeneralError(error);
    }
  }

  /**
   * Obține informațiile despre business și locații
   * Endpoint: /api/businessInfo/{businessId}
   * @param {string} businessId - Business ID
   * @returns {Promise<Object>} Informațiile despre business
   */
  async getBusinessInfo(businessId) {
    try {
      // În test mode, returnează date de demo
      if (tenantUtils.isTestMode()) {
        console.log('TEST MODE: Using demo business info data');
        const demoData = tenantUtils.getDemoBusinessInfo();
        return demoData;
      }

      // Construiește cererea folosind utilitarele - noul endpoint
      const endpoint = businessId ? `/api/businessInfo/${businessId}` : '/api/businessInfo';
      const requestConfig = requestBuilder.requestUtils.get(endpoint);

      // Use business info server URL if different from main API
      const businessInfoServerUrl = import.meta.env.VITE_BUSINESS_INFO_URL;
      let fullUrl = requestConfig.url;
      
      if (businessInfoServerUrl && businessInfoServerUrl !== import.meta.env.VITE_API_URL) {
        // Use separate business info server
        fullUrl = `${businessInfoServerUrl}${requestConfig.url}`;
      }

      const response = await this.apiClient.get(fullUrl);
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch business info from API:', error.message);
      throw this.handleGeneralError(error);
    }
  }

  /**
   * Metoda generică pentru request-uri
   */
  async request(method, endpoint, data = null, options = {}) {
    try {
      // Adaugă tenant ID-ul la headers dacă există
      const tenantId = tenantUtils.getCurrentTenantId();
      if (tenantId) {
        options.headers = {
          ...options.headers,
          'X-Tenant-ID': tenantId
        };
      }

      switch (method.toUpperCase()) {
        case 'GET':
          return await this.apiClient.get(endpoint, options);
        case 'POST':
          return await this.apiClient.post(endpoint, data, options);
        case 'PUT':
          return await this.apiClient.put(endpoint, data, options);
        case 'DELETE':
          return await this.apiClient.delete(endpoint, options);
        case 'PATCH':
          return await this.apiClient.patch(endpoint, data, options);
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    } catch (error) {
      throw this.handleGeneralError(error);
    }
  }

  /**
   * Gestionează erorile specifice pentru serviciile generale
   */
  handleGeneralError(error) {
    console.error('GeneralService Error:', error);
    return error;
  }
}

export default GeneralService; 