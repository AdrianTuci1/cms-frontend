/**
 * TimelineService - Serviciu pentru gestionarea timeline-ului
 * Updated to use single endpoint pattern with X-Resource-Type header
 */

import { ApiClient } from '../core/client/ApiClient.js';
import { validateParams, requestUtils } from '../utils/requestBuilder.js';

class TimelineService {
  constructor(apiClient = null) {
    this.apiClient = apiClient || new ApiClient();
  }

  /**
   * Obține timeline-ul folosind single endpoint pattern
   * Endpoint: /api/resources/{businessId-locationId}
   * Headers: X-Resource-Type: timeline
   * @param {Object} params - Parametri suplimentari
   * @returns {Promise<Object>} Timeline-ul de la API
   */
  async getTimeline(params = {}) {
    try {
      // Validează parametrii
      const validatedParams = validateParams(params, [], {
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

      // Obține business ID și location ID din localStorage
      const businessId = localStorage.getItem('businessId');
      const locationId = localStorage.getItem('locationId');

      if (!businessId || !locationId) {
        throw new Error('Business ID and Location ID must be set before accessing timeline. Please select a location first.');
      }

      // Construiește URL-ul pentru single endpoint cu businessId-locationId din localStorage
      // Exemplu: /api/resources/b1-loc1/date-range/?startDate=2025-08-18&endDate=2025-08-26
      const endpoint = `/api/resources/${businessId}-${locationId}/date-range/`;
      
      // Nu mai adăugăm resourceType ca query parameter - serverul îl recunoaște din header
      const queryParams = validatedParams;

      // Construiește cererea cu doar X-Resource-Type header
      const requestConfig = {
        url: endpoint,
        method: 'GET',
        params: queryParams,
        headers: {
          'X-Resource-Type': 'timeline'
        }
      };

      const response = await this.apiClient.get(requestConfig.url, { 
        params: requestConfig.params,
        headers: requestConfig.headers
      });
      
      return response.data;
    } catch (error) {
      throw this.handleTimelineError(error);
    }
  }

  /**
   * Creează o nouă intrare în timeline
   * Endpoint: /api/resources/{businessId-locationId}
   * Headers: X-Resource-Type: timeline
   * @param {Object} timelineData - Datele pentru timeline
   * @returns {Promise<Object>} Răspunsul de la API
   */
  async createTimelineEntry(timelineData) {
    try {
      const businessId = localStorage.getItem('businessId');
      const locationId = localStorage.getItem('locationId');

      if (!businessId || !locationId) {
        throw new Error('Business ID and Location ID must be set before creating timeline entry. Please select a location first.');
      }

      const endpoint = `/api/resources/${businessId}-${locationId}`;
      
      // Nu mai trimitem resourceType și operation în JSON - serverul le recunoaște
      const requestData = timelineData;

      const response = await this.apiClient.post(endpoint, requestData, {
        headers: {
          'X-Resource-Type': 'timeline'
        }
      });

      return response.data;
    } catch (error) {
      throw this.handleTimelineError(error);
    }
  }

  /**
   * Actualizează o intrare din timeline
   * Endpoint: /api/resources/{businessId-locationId}
   * Headers: X-Resource-Type: timeline
   * @param {string} entryId - ID-ul intrării
   * @param {Object} timelineData - Datele actualizate
   * @returns {Promise<Object>} Răspunsul de la API
   */
  async updateTimelineEntry(entryId, timelineData) {
    try {
      const businessId = localStorage.getItem('businessId');
      const locationId = localStorage.getItem('locationId');

      if (!businessId || !locationId) {
        throw new Error('Business ID and Location ID must be set before updating timeline entry. Please select a location first.');
      }

      const endpoint = `/api/resources/${businessId}-${locationId}`;
      
      // Nu mai trimitem resourceType și operation în JSON - serverul le recunoaște
      const requestData = {
        ...timelineData,
        id: entryId
      };

      const response = await this.apiClient.put(endpoint, requestData, {
        headers: {
          'X-Resource-Type': 'timeline'
        }
      });

      return response.data;
    } catch (error) {
      throw this.handleTimelineError(error);
    }
  }

  /**
   * Șterge o intrare din timeline
   * Endpoint: /api/resources/{businessId-locationId}
   * Headers: X-Resource-Type: timeline
   * @param {string} entryId - ID-ul intrării
   * @returns {Promise<Object>} Răspunsul de la API
   */
  async deleteTimelineEntry(entryId) {
    try {
      const businessId = localStorage.getItem('businessId');
      const locationId = localStorage.getItem('locationId');

      if (!businessId || !locationId) {
        throw new Error('Business ID and Location ID must be set before deleting timeline entry. Please select a location first.');
      }

      const endpoint = `/api/resources/${businessId}-${locationId}`;
      
      // Nu mai trimitem resourceType și operation în JSON - serverul le recunoaște
      // Pentru DELETE, trimitem doar ID-ul în URL sau body
      const requestData = { id: entryId };

      const response = await this.apiClient.delete(endpoint, {
        data: requestData,
        headers: {
          'X-Resource-Type': 'timeline'
        }
      });

      return response.data;
    } catch (error) {
      throw this.handleTimelineError(error);
    }
  }



  /**
   * Gestionează erorile specifice timeline-ului
   * @param {Error} error - Eroarea originală
   * @returns {Error} Eroarea procesată
   */
  handleTimelineError(error) {
    console.error('TimelineService Error:', error);

    // Procesează erorile specifice timeline-ului
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(`Invalid timeline request: ${data.message || 'Bad request'}`);
        case 401:
          return new Error('Unauthorized access to timeline');
        case 403:
          return new Error('Forbidden access to timeline');
        case 404:
          return new Error('Timeline not found');
        case 422:
          return new Error(`Timeline validation error: ${data.message || 'Validation failed'}`);
        case 500:
          return new Error('Internal server error while accessing timeline');
        default:
          return new Error(`Timeline error: ${data.message || 'Unknown error'}`);
      }
    }

    // Erori de rețea
    if (error.code === 'NETWORK_ERROR') {
      return new Error('Network error while accessing timeline');
    }

    if (error.code === 'TIMEOUT') {
      return new Error('Request timeout while accessing timeline');
    }

    return error;
  }
}

export default TimelineService; 