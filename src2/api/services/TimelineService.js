/**
 * TimelineService - Serviciu pentru Timeline API endpoints
 * 
 * Acest serviciu se ocupă exclusiv de preluarea datelor de timeline din API-ul extern.
 * Folosește endpoint-urile documentate în requests.md și utilitarele pentru construirea cererilor.
 */

import { ApiClient } from '../core/index.js';
import { requestBuilder } from '../utils/requestBuilder.js';

class TimelineService {
  constructor(apiClient = null) {
    this.apiClient = apiClient || new ApiClient();
  }

  /**
   * Obține timeline-ul pentru un tip de business specific
   * Endpoint: /api/{businessType}/timeline
   * @param {string} businessType - Tipul de business (dental, gym, hotel)
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Timeline-ul de la API
   */
  async getTimeline(businessType, params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, ['businessType'], {
        businessType: (value) => {
          if (!['dental', 'gym', 'hotel'].includes(value)) {
            return 'Business type must be dental, gym, or hotel';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get(
        `/api/${businessType}/timeline`,
        validatedParams
      );

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleTimelineError(error);
    }
  }

  /**
   * Obține clienții pentru un tip de business specific
   * Endpoint: /api/{businessType}/clients
   * @param {string} businessType - Tipul de business (dental, gym, hotel)
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Clienții de la API
   */
  async getClients(businessType, params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, ['businessType'], {
        businessType: (value) => {
          if (!['dental', 'gym', 'hotel'].includes(value)) {
            return 'Business type must be dental, gym, or hotel';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get(
        `/api/${businessType}/clients`,
        validatedParams
      );

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleTimelineError(error);
    }
  }

  /**
   * Obține pachetele pentru un tip de business specific
   * Endpoint: /api/{businessType}/packages
   * @param {string} businessType - Tipul de business (dental, gym, hotel)
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Pachetele de la API
   */
  async getPackages(businessType, params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, ['businessType'], {
        businessType: (value) => {
          if (!['dental', 'gym', 'hotel'].includes(value)) {
            return 'Business type must be dental, gym, or hotel';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get(
        `/api/${businessType}/packages`,
        validatedParams
      );

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleTimelineError(error);
    }
  }

  /**
   * Obține membrii pentru un tip de business specific
   * Endpoint: /api/{businessType}/members
   * @param {string} businessType - Tipul de business (dental, gym, hotel)
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Membrii de la API
   */
  async getMembers(businessType, params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, ['businessType'], {
        businessType: (value) => {
          if (!['dental', 'gym', 'hotel'].includes(value)) {
            return 'Business type must be dental, gym, or hotel';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get(
        `/api/${businessType}/members`,
        validatedParams
      );

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleTimelineError(error);
    }
  }

  /**
   * Gestionează erorile specifice pentru timeline
   */
  handleTimelineError(error) {
    console.error('TimelineService Error:', error);
    return error;
  }
}

export default TimelineService; 