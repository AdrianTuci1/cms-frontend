/**
 * BaseClient - Clasa de bază pentru client API
 * Oferă funcționalități de bază pentru interceptori și configurare
 */

export default class BaseClient {
  constructor(config = {}) {
    // Configurare de bază
    this.baseURL = config.baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    this.timeout = config.timeout || 30000;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers
    };

    // Interceptori
    this.requestInterceptors = [];
    this.responseInterceptors = [];

    // Request queue și cancel tokens
    this.requestQueue = [];
    this.cancelTokens = new Map();
    this.requestId = 0;

    // Stats
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0
    };
  }

  /**
   * Adaugă request interceptor
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Adaugă response interceptor
   */
  addResponseInterceptor(onFulfilled, onRejected) {
    this.responseInterceptors.push({ onFulfilled, onRejected });
  }

  /**
   * Aplică request interceptori
   */
  applyRequestInterceptors(config) {
    let modifiedConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = interceptor(modifiedConfig);
    }
    
    return modifiedConfig;
  }

  /**
   * Aplică response interceptori
   */
  applyResponseInterceptors(response, error = null) {
    if (error) {
      // Aplică error interceptori
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onRejected) {
          try {
            return interceptor.onRejected(error);
          } catch (interceptorError) {
            error = interceptorError;
          }
        }
      }
      throw error;
    } else {
      // Aplică success interceptori
      let modifiedResponse = response;
      
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onFulfilled) {
          modifiedResponse = interceptor.onFulfilled(modifiedResponse);
        }
      }
      
      return modifiedResponse;
    }
  }

  /**
   * Creează un request ID unic
   */
  generateRequestId() {
    return `req_${Date.now()}_${++this.requestId}`;
  }

  /**
   * Creează un cancel token
   */
  createCancelToken() {
    const controller = new AbortController();
    return {
      signal: controller.signal,
      cancel: () => controller.abort()
    };
  }

  /**
   * Adaugă request în queue
   */
  addToQueue(requestConfig, priority = 0) {
    this.requestQueue.push({ config: requestConfig, priority });
    this.requestQueue.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Procesează queue-ul de request-uri
   */
  async processQueue() {
    while (this.requestQueue.length > 0) {
      const { config } = this.requestQueue.shift();
      try {
        await this.request(config);
      } catch (error) {
        console.error('Queue request failed:', error);
      }
    }
  }

  /**
   * Actualizează statisticile
   */
  updateStats(response, startTime) {
    this.stats.totalRequests++;
    
    if (response.status >= 200 && response.status < 300) {
      this.stats.successfulRequests++;
    } else {
      this.stats.failedRequests++;
    }

    const responseTime = Date.now() - startTime;
    this.stats.averageResponseTime = 
      (this.stats.averageResponseTime * (this.stats.totalRequests - 1) + responseTime) / 
      this.stats.totalRequests;
  }

  /**
   * Obține statisticile
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Resetează statisticile
   */
  resetStats() {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0
    };
  }

  /**
   * Testează conectivitatea
   */
  async testConnectivity() {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: this.headers,
        signal: AbortSignal.timeout(this.timeout)
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        success: response.ok,
        status: response.status,
        responseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }
} 