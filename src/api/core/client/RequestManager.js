/**
 * RequestManager - Manager pentru request-uri HTTP
 * Gestionează request-uri cu retry, timeout, cache și queue management
 */

export default class RequestManager {
  constructor(client) {
    this.client = client;
    this.pendingRequests = new Map();
    this.requestCache = new Map();
    this.retryConfig = {
      maxRetries: 1,
      retryDelay: 2000,
      backoffMultiplier: 1.5
    };
    this.retryCounts = new Map();
  }

  /**
   * Metoda principală pentru request-uri
   */
  async request(config) {
    const requestId = this.client.generateRequestId();
    const startTime = Date.now();
    
    // Apply request interceptors
    const interceptedConfig = this.client.applyRequestInterceptors(config);
    
    // Add request to pending
    this.pendingRequests.set(requestId, { config: interceptedConfig, startTime });
    
    try {
      // Check cache first
      if (interceptedConfig.useCache) {
        const cachedResponse = this.getCachedResponse(interceptedConfig);
        if (cachedResponse) {
          this.pendingRequests.delete(requestId);
          return cachedResponse;
        }
      }
      
      // Create cancel token
      const cancelToken = this.client.createCancelToken();
      interceptedConfig.signal = cancelToken.signal;
      
      // Execute request with retry
      const response = await this.executeRequestWithRetry(interceptedConfig, requestId);
      
      // Apply response interceptors
      const interceptedResponse = this.client.applyResponseInterceptors(response);
      
      // Update stats
      this.client.updateStats(interceptedResponse, startTime);
      
      // Cache response if needed
      if (interceptedConfig.useCache) {
        this.cacheResponse(interceptedConfig, interceptedResponse);
      }
      
      return interceptedResponse;
    } catch (error) {
      // Apply error interceptors
      const interceptedError = this.client.applyResponseInterceptors(null, error);
      
      // Update stats
      this.client.stats.failedRequests++;
      
      throw interceptedError;
    } finally {
      this.pendingRequests.delete(requestId);
    }
  }

  /**
   * Execută request cu retry logic
   */
  async executeRequestWithRetry(config, requestId, retryCount = 0) {
    try {
      const response = await this.executeRequest(config);
      return response;
    } catch (error) {
      // Check if we should retry
      if (this.shouldRetry(error, retryCount, config)) {
        const delay = this.calculateRetryDelay(retryCount);
        
        // Only log retry message once per request
        if (retryCount === 0) {
          console.warn(`Request failed for ${config.url}, retrying once in ${delay}ms...`);
        }
        
        await this.delay(delay);
        return this.executeRequestWithRetry(config, requestId, retryCount + 1);
      }
      
      // Log final error without retry
      if (retryCount === 0) {
        console.error(`Request failed for ${config.url}:`, error.message);
      }
      
      throw error;
    }
  }

  /**
   * Execută o cerere HTTP
   */
  async executeRequest(config) {
    const { method, url, data, headers = {}, timeout } = config;
    
    // Build request config
    const requestConfig = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    // Add body for non-GET requests
    if (data && method.toUpperCase() !== 'GET') {
      requestConfig.body = typeof data === 'string' ? data : JSON.stringify(data);
    }
    
    // Add timeout
    if (timeout || this.client.timeout) {
      requestConfig.signal = AbortSignal.timeout(timeout || this.client.timeout);
    }
    
    const fullUrl = url.startsWith('http') ? url : `${this.client.baseURL}${url}`;
    
    try {
      const response = await fetch(fullUrl, requestConfig);
      
      // Handle non-2xx responses
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.statusText = response.statusText;
        error.response = response;
        throw error;
      }
      
      // Parse response based on content type
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else if (contentType && contentType.includes('text/')) {
        responseData = await response.text();
      } else {
        responseData = await response.blob();
      }
      
      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        config
      };
    } catch (error) {
      // Handle network errors specifically
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error('Backend indisponibil - folosind datele din IndexedDB');
        networkError.code = 'NETWORK_ERROR';
        networkError.originalError = error;
        throw networkError;
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Verifică dacă trebuie să retry
   */
  shouldRetry(error, retryCount, config) {
    // Don't retry if max retries reached
    if (retryCount >= this.retryConfig.maxRetries) {
      return false;
    }
    
    // Don't retry if request was cancelled
    if (error.name === 'AbortError') {
      return false;
    }
    
    // Don't retry if config says not to
    if (config.noRetry) {
      return false;
    }
    
    // Don't retry on client errors (4xx)
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    
    // Don't retry on network errors or backend unavailable
    if (error.code === 'NETWORK_ERROR' || 
        error.message.includes('Backend indisponibil') || 
        error.message.includes('NetworkError') ||
        error.message.includes('fetch') ||
        error.name === 'TypeError') {
      return false;
    }
    
    // Only retry on 5xx server errors
    return error.status >= 500 && error.status < 600;
  }

  /**
   * Calculează delay-ul pentru retry
   */
  calculateRetryDelay(retryCount) {
    return this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount);
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  async get(url, config = {}) {
    return this.request({
      method: 'GET',
      url,
      ...config
    });
  }

  /**
   * POST request
   */
  async post(url, data = null, config = {}) {
    return this.request({
      method: 'POST',
      url,
      data,
      ...config
    });
  }

  /**
   * PUT request
   */
  async put(url, data = null, config = {}) {
    return this.request({
      method: 'PUT',
      url,
      data,
      ...config
    });
  }

  /**
   * PATCH request
   */
  async patch(url, data = null, config = {}) {
    return this.request({
      method: 'PATCH',
      url,
      data,
      ...config
    });
  }

  /**
   * DELETE request
   */
  async delete(url, config = {}) {
    return this.request({
      method: 'DELETE',
      url,
      ...config
    });
  }

  /**
   * Cache management
   */
  cacheResponse(config, response) {
    const cacheKey = this.generateCacheKey(config);
    const cacheData = {
      response,
      timestamp: Date.now(),
      ttl: config.cacheTTL || 5 * 60 * 1000 // 5 minutes default
    };
    
    this.requestCache.set(cacheKey, cacheData);
  }

  getCachedResponse(config) {
    const cacheKey = this.generateCacheKey(config);
    const cacheData = this.requestCache.get(cacheKey);
    
    if (!cacheData) return null;
    
    // Check if cache is still valid
    if (Date.now() - cacheData.timestamp > cacheData.ttl) {
      this.requestCache.delete(cacheKey);
      return null;
    }
    
    return cacheData.response;
  }

  generateCacheKey(config) {
    const { method, url, params } = config;
    const paramsString = params ? JSON.stringify(params) : '';
    return `${method}:${url}:${paramsString}`;
  }

  clearCache() {
    this.requestCache.clear();
  }

  /**
   * Request queue management
   */
  addToQueue(requestConfig, priority = 0) {
    this.client.addToQueue(requestConfig, priority);
  }

  async processQueue() {
    await this.client.processQueue();
  }

  /**
   * Cancel request
   */
  cancelRequest(requestId) {
    const pendingRequest = this.pendingRequests.get(requestId);
    if (pendingRequest) {
      // Cancel the request if it has a signal
      if (pendingRequest.config.signal) {
        pendingRequest.config.signal.abort();
      }
      this.pendingRequests.delete(requestId);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests() {
    for (const [requestId, pendingRequest] of this.pendingRequests) {
      if (pendingRequest.config.signal) {
        pendingRequest.config.signal.abort();
      }
    }
    this.pendingRequests.clear();
  }

  /**
   * Get pending requests
   */
  getPendingRequests() {
    return Array.from(this.pendingRequests.entries()).map(([id, request]) => ({
      id,
      config: request.config,
      startTime: request.startTime,
      duration: Date.now() - request.startTime
    }));
  }

  /**
   * Set retry configuration
   */
  setRetryConfig(config) {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const entries = Array.from(this.requestCache.values());
    const now = Date.now();
    
    return {
      totalEntries: entries.length,
      validEntries: entries.filter(entry => now - entry.timestamp <= entry.ttl).length,
      expiredEntries: entries.filter(entry => now - entry.timestamp > entry.ttl).length,
      totalSize: entries.length // Simplified size calculation
    };
  }
} 