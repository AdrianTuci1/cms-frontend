/**
 * TimelineService - Serviciu pentru endpoint-urile de timeline
 * 
 * Acest serviciu se ocupă de endpoint-urile pentru timeline:
 * - /api/timeline
 * - /api/appointments
 * - /api/reservations
 * 
 * Folosește utilitarele pentru construirea cererilor și validarea parametrilor.
 */

import { ApiClient } from '../core/client/ApiClient.js';
import requestBuilder from '../utils/requestBuilder.js';
import { tenantUtils } from '../mockData/index.js';

class TimelineService {
  constructor(apiClient = null) {
    this.apiClient = apiClient || new ApiClient();
  }

  /**
   * Obține timeline-ul
   * Endpoint: /api/timeline
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Timeline-ul de la API
   */
  async getTimeline(params = {}) {
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
        },
        businessType: (value) => {
          if (value && !['dental', 'gym', 'hotel'].includes(value)) {
            return 'Business type must be dental, gym, or hotel';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/timeline', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleTimelineError(error);
    }
  }

  /**
   * Obține programările
   * Endpoint: /api/appointments
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Programările de la API
   */
  async getAppointments(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        date: (value) => {
          if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return 'Date must be in YYYY-MM-DD format';
          }
          return true;
        },
        status: (value) => {
          if (value && !['confirmed', 'pending', 'cancelled'].includes(value)) {
            return 'Status must be confirmed, pending, or cancelled';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/appointments', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleTimelineError(error);
    }
  }

  /**
   * Obține rezervările
   * Endpoint: /api/reservations
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Rezervările de la API
   */
  async getReservations(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = requestBuilder.validateParams(params, [], {
        checkIn: (value) => {
          if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return 'Check-in date must be in YYYY-MM-DD format';
          }
          return true;
        },
        checkOut: (value) => {
          if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return 'Check-out date must be in YYYY-MM-DD format';
          }
          return true;
        }
      });

      // Construiește cererea folosind utilitarele
      const requestConfig = requestBuilder.requestUtils.get('/api/reservations', validatedParams);

      const response = await this.apiClient.get(requestConfig.url, { params: validatedParams });
      return response.data;
    } catch (error) {
      throw this.handleTimelineError(error);
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
      throw this.handleTimelineError(error);
    }
  }

  /**
   * Gestionează erorile specifice pentru serviciile de timeline
   */
  handleTimelineError(error) {
    console.error('TimelineService Error:', error);
    return error;
  }
}

export default TimelineService; 