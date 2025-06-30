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
import { getMockData, tenantUtils } from '../mockData/index.js';

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
   * Endpoint: /api/business-info
   * @returns {Promise<Object>} Informațiile despre business
   */
  async getBusinessInfo() {
    try {
      // Verifică dacă suntem offline sau în development
      if (!navigator.onLine || import.meta.env.DEV) {
        console.log('Using mock business info data');
        const mockData = getMockData('business-info');
        
        // Salvează tenant ID-ul în cookie
        if (mockData.business && mockData.business.tenantId) {
          tenantUtils.setTenantId(mockData.business.tenantId);
        }
        
        return mockData;
      }

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/business-info');

      const response = await this.apiClient.get(requestConfig.url);
      
      // Salvează tenant ID-ul în cookie dacă există în răspuns
      if (response.data && response.data.business && response.data.business.tenantId) {
        tenantUtils.setTenantId(response.data.business.tenantId);
      }
      
      return response.data;
    } catch (error) {
      console.warn('API request failed for business-info, using mock data:', error.message);
      
      // Returnează date mock în caz de eroare
      const mockData = getMockData('business-info');
      
      // Salvează tenant ID-ul în cookie
      if (mockData.business && mockData.business.tenantId) {
        tenantUtils.setTenantId(mockData.business.tenantId);
      }
      
      return mockData;
    }
  }

  /**
   * Metoda generică pentru request-uri
   */
  async request(method, endpoint, data = null, options = {}) {
    try {
      // Adaugă tenant ID-ul din cookie la headers dacă există
      const tenantId = tenantUtils.getTenantId();
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