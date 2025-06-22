import { ApiError, NetworkError } from '../types.js';

/**
 * HTTP Client using Adapter Pattern
 * Handles all HTTP requests with retry logic, timeout, and error handling
 */
class HttpClient {
  constructor() {
    if (HttpClient.instance) {
      return HttpClient.instance;
    }
    
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    };
    
    HttpClient.instance = this;
  }

  /**
   * Set configuration for the HTTP client
   * @param {Object} config - Configuration object
   */
  setConfig(config) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get authentication headers
   * @returns {Object} Headers object
   */
  getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Build full URL with query parameters
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {string} Full URL
   */
  buildUrl(endpoint, params = {}) {
    const url = new URL(endpoint, this.config.baseURL);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  }

  /**
   * Create fetch request with timeout
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Retry mechanism for failed requests
   * @param {Function} requestFn - Request function to retry
   * @param {number} attempts - Number of attempts
   * @returns {Promise<Response>} Response
   */
  async retryRequest(requestFn, attempts = this.config.retryAttempts) {
    let lastError;
    
    for (let i = 0; i < attempts; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }
        
        // Wait before retrying (except on last attempt)
        if (i < attempts - 1) {
          await new Promise(resolve => 
            setTimeout(resolve, this.config.retryDelay * Math.pow(2, i))
          );
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Handle response and throw appropriate errors
   * @param {Response} response - Fetch response
   * @returns {Promise<Object>} Parsed response data
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (!response.ok) {
      let errorData = {};
      
      if (isJson) {
        try {
          errorData = await response.json();
        } catch (e) {
          // Ignore JSON parsing errors for error responses
        }
      }
      
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData.details
      );
    }
    
    if (isJson) {
      return await response.json();
    }
    
    return await response.text();
  }

  /**
   * Make HTTP request
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async request(method, endpoint, options = {}) {
    const { params, body, headers, skipRetry = false } = options;
    const url = this.buildUrl(endpoint, params);
    
    const requestFn = async () => {
      try {
        const response = await this.fetchWithTimeout(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
        
        return await this.handleResponse(response);
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout', error);
        }
        
        if (error instanceof ApiError) {
          throw error;
        }
        
        throw new NetworkError('Network error', error);
      }
    };
    
    if (skipRetry) {
      return await requestFn();
    }
    
    return await this.retryRequest(requestFn);
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, options);
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async post(endpoint, options = {}) {
    return this.request('POST', endpoint, options);
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async put(endpoint, options = {}) {
    return this.request('PUT', endpoint, options);
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, options);
  }

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async patch(endpoint, options = {}) {
    return this.request('PATCH', endpoint, options);
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
export default httpClient; 