/**
 * GeneralService - Serviciu pentru endpoint-urile generale fără JWT
 * 
 * Acest serviciu se ocupă de endpoint-urile care nu necesită JWT:
 * - /api/auth
 * - /api/business-info
 * 
 * Folosește utilitarele pentru construirea cererilor și validarea parametrilor.
 */

import { ApiClient } from '../core/index.js';
import { requestBuilder } from '../utils/requestBuilder.js';

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
      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/business-info');

      const response = await this.apiClient.get(requestConfig.url);
      return response.data;
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