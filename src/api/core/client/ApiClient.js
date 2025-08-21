/**
 * ApiClient - Client HTTP principal pentru API
 * Inherită din BaseClient și folosește AuthManager și RequestManager
 */

import BaseClient from './BaseClient.js';
import AuthManager from './AuthManager.js';
import RequestManager from './RequestManager.js';

export class ApiClient extends BaseClient {
  constructor(config = {}) {
    super(config);
    
    // Multi-tenant support - tenantId is actually businessId
    this.tenantId = config.tenantId || import.meta.env.VITE_BUSINESS_ID;
    this.locationId = config.locationId || localStorage.getItem('locationId');
    
    // Unified architecture support
    this.baseURL = config.baseURL || import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    // Inițializează manager-ele
    this.authManager = new AuthManager({
      baseURL: this.baseURL,
      refreshThreshold: config.refreshThreshold || 5 * 60 * 1000
    });
    
    this.requestManager = new RequestManager(this);
    
    // Setup interceptori pentru autentificare
    this.setupAuthInterceptors();
    
    // Inițializează client-ul
    this.initialize();
  }

  /**
   * Determine which base URL to use based on the request URL
   * @param {string} url - Request URL
   * @returns {string} Base URL to use
   */
  getBaseURLForRequest(url) {
    // For absolute URLs, return as is (they already contain the base URL)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return '';
    }
    
    // Default to main API server (unified architecture)
    return this.baseURL;
  }

  /**
   * Setup interceptori pentru autentificare
   */
  setupAuthInterceptors() {
    // Request interceptor pentru auth headers
    this.addRequestInterceptor((config) => {
      // Inițializează headers dacă nu există
      if (!config.headers) {
        config.headers = {};
      }

      // Nu mai adăugăm automat X-Tenant-ID și X-Location-ID ca headers
      // Acestea sunt deja în URL (ex: /api/resources/b1-loc1/...)
      // Doar adăugăm auth header

      // Adaugă auth header
      const authHeader = this.authManager.getAuthHeader();
      if (authHeader) {
        config.headers['Authorization'] = authHeader;
      }

      return config;
    });

    // Response interceptor pentru refresh token
    this.addResponseInterceptor(
      (response) => response,
      async (error) => {
        if (error.status === 401 && this.authManager.getRefreshToken()) {
          try {
            // Încearcă refresh token
            const newToken = await this.authManager.refreshAuthToken();
            if (newToken) {
              // Reexecută request-ul original cu noul token
              if (!error.config.headers) {
                error.config.headers = {};
              }
              error.config.headers['Authorization'] = `Bearer ${newToken}`;
              return this.request(error.config);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens
            this.authManager.clearTokens();
            throw refreshError;
          }
        }
        throw error;
      }
    );
  }

  /**
   * Setează token-ul de autentificare
   */
  setAuthToken(token, refreshToken = null, expiry = null) {
    this.authManager.setTokens(token, refreshToken, expiry);
  }

  /**
   * Setează location ID-ul curent
   */
  setLocationId(locationId) {
    this.locationId = locationId;
    // Also update localStorage
    if (locationId) {
      localStorage.setItem('locationId', locationId);
    }
  }

  /**
   * Update location ID from localStorage
   */
  updateLocationIdFromStorage() {
    this.locationId = localStorage.getItem('locationId');
  }

  /**
   * Obține location ID-ul curent
   */
  getLocationId() {
    return this.locationId;
  }

  /**
   * Obține tenant ID-ul
   */
  getTenantId() {
    return this.tenantId;
  }

  /**
   * Metoda principală pentru cereri HTTP
   */
  async request(config) {
    return this.requestManager.request(config);
  }

  /**
   * Metode helper pentru HTTP methods
   */
  async get(url, config = {}) {
    return this.requestManager.get(url, config);
  }

  async post(url, data = null, config = {}) {
    return this.requestManager.post(url, data, config);
  }

  async put(url, data = null, config = {}) {
    return this.requestManager.put(url, data, config);
  }

  async patch(url, data = null, config = {}) {
    return this.requestManager.patch(url, data, config);
  }

  async delete(url, config = {}) {
    return this.requestManager.delete(url, config);
  }

  /**
   * Upload file
   */
  async upload(url, file, config = {}) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(url, files, config = {}) {
    const formData = new FormData();
    
    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
    } else {
      Object.entries(files).forEach(([key, file]) => {
        formData.append(key, file);
      });
    }

    return this.request({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Download file
   */
  async download(url, filename = null, config = {}) {
    const response = await this.request({
      ...config,
      method: 'GET',
      url,
      responseType: 'blob'
    });

    // Creează link pentru download
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return response;
  }

  /**
   * Upload cu progress tracking
   */
  async uploadWithProgress(url, file, onProgress, config = {}) {
    const formData = new FormData();
    formData.append('file', file);

    return this.requestManager.requestWithProgress({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data'
      }
    }, onProgress);
  }

  /**
   * Cerere cu timeout personalizat
   */
  async requestWithTimeout(config, timeout) {
    return this.requestManager.requestWithTimeout(config, timeout);
  }

  /**
   * Cereri în paralel
   */
  async requestAll(requests) {
    return this.requestManager.requestAll(requests);
  }

  /**
   * Cereri în serie
   */
  async requestSequential(requests) {
    return this.requestManager.requestSequential(requests);
  }

  /**
   * Cerere cu retry personalizat
   */
  async requestWithRetry(config, retryConfig = {}) {
    return this.requestManager.requestWithRetry(config, retryConfig);
  }

  /**
   * Cerere cu cache
   */
  async requestWithCache(config, cacheKey, cacheOptions = {}) {
    return this.requestManager.requestWithCache(config, cacheKey, cacheOptions);
  }

  /**
   * Anulează o cerere în curs
   */
  cancelRequest(requestId) {
    return this.requestManager.cancelRequest(requestId);
  }

  /**
   * Anulează toate cererile în curs
   */
  cancelAllRequests() {
    return this.requestManager.cancelAllRequests();
  }

  /**
   * Obține cererile în curs
   */
  getPendingRequests() {
    return this.requestManager.getPendingRequests();
  }

  /**
   * Adaugă o cerere la queue
   */
  addToQueue(requestConfig, priority = 0) {
    return this.requestManager.addToQueue(requestConfig, priority);
  }

  /**
   * Obține informații despre autentificare
   */
  getAuthInfo() {
    return this.authManager.getTokenInfo();
  }

  /**
   * Verifică dacă utilizatorul este autentificat
   */
  isAuthenticated() {
    return this.authManager.isTokenValid();
  }

  /**
   * Verifică dacă utilizatorul are o rolă specifică
   */
  hasRole(role) {
    return this.authManager.hasRole(role);
  }

  /**
   * Verifică dacă utilizatorul are o permisiune specifică
   */
  hasPermission(permission) {
    return this.authManager.hasPermission(permission);
  }

  /**
   * Obține ID-ul utilizatorului
   */
  getUserId() {
    return this.authManager.getUserId();
  }

  /**
   * Obține claims din token
   */
  getTokenClaims() {
    return this.authManager.getTokenClaims();
  }

  /**
   * Curăță token-urile de autentificare
   */
  clearAuthTokens() {
    return this.authManager.clearTokens();
  }

  /**
   * Setează callback pentru refresh token
   */
  setOnTokenRefresh(callback) {
    return this.authManager.setOnTokenRefresh(callback);
  }

  /**
   * Setează callback pentru token expirat
   */
  setOnTokenExpired(callback) {
    return this.authManager.setOnTokenExpired(callback);
  }

  /**
   * Setează callback pentru erori de autentificare
   */
  setOnAuthError(callback) {
    return this.authManager.setOnAuthError(callback);
  }

  /**
   * Obține statistici complete
   */
  getStats() {
    return {
      ...super.getStats(),
      auth: this.authManager.getTokenInfo(),
      requests: this.requestManager.getRequestStats(),
      tenantId: this.tenantId,
      locationId: this.locationId
    };
  }

  /**
   * Testează conectivitatea
   */
  async testConnectivity() {
    try {
      const response = await this.get('/health/ping');
      return {
        success: true,
        latency: response.headers['x-response-time'] || 'unknown',
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status
      };
    }
  }

  /**
   * Inițializează client-ul
   */
  initialize() {
    console.log('ApiClient initialized with:', {
      baseURL: this.baseURL,
      tenantId: this.tenantId,
      locationId: this.locationId
    });
  }
}

// Instanță singleton
const apiClient = new ApiClient();

export default apiClient; 