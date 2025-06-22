/**
 * CacheManager - Gestionează cache-ul cu invalidare inteligentă
 * Implementează Strategy Pattern pentru diferite strategii de cache
 */
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.cacheConfig = {
      appointments: { ttl: 5 * 60 * 1000 }, // 5 minutes
      history: { ttl: 10 * 60 * 1000 },     // 10 minutes
      clients: { ttl: 15 * 60 * 1000 },     // 15 minutes
      default: { ttl: 5 * 60 * 1000 }       // 5 minutes default
    };
  }

  /**
   * Get cached data
   * @param {string} key - Cache key
   * @param {Object} params - Parameters for cache key generation
   * @returns {*} Cached data or null
   */
  get(key, params = {}) {
    const cacheKey = this.generateKey(key, params);
    const cached = this.cache.get(cacheKey);

    if (!cached) {
      return null;
    }

    // Check if expired
    if (this.isExpired(cached)) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cached data
   * @param {string} key - Cache key
   * @param {Object} params - Parameters for cache key generation
   * @param {*} data - Data to cache
   */
  set(key, params = {}, data) {
    const cacheKey = this.generateKey(key, params);
    const config = this.cacheConfig[key] || this.cacheConfig.default;
    
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: config.ttl
    });
  }

  /**
   * Invalidate cache by pattern
   * @param {string} pattern - Pattern to match cache keys
   */
  invalidate(pattern) {
    const keysToDelete = [];
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Invalidate appointments cache
   */
  invalidateAppointments() {
    this.invalidate('appointments');
  }

  /**
   * Invalidate history cache
   */
  invalidateHistory() {
    this.invalidate('history');
  }

  /**
   * Invalidate clients cache
   */
  invalidateClients() {
    this.invalidate('clients');
  }

  /**
   * Get appointments from cache
   * @param {Object} dateRange - Date range
   * @returns {Array|null} Cached appointments or null
   */
  getAppointments(dateRange) {
    return this.get('appointments', dateRange);
  }

  /**
   * Set appointments in cache
   * @param {Object} dateRange - Date range
   * @param {Array} appointments - Appointments data
   */
  setAppointments(dateRange, appointments) {
    this.set('appointments', dateRange, appointments);
  }

  /**
   * Get history items from cache
   * @param {Object} filters - Filter parameters
   * @returns {Array|null} Cached history items or null
   */
  getHistoryItems(filters) {
    return this.get('history', filters);
  }

  /**
   * Set history items in cache
   * @param {Object} filters - Filter parameters
   * @param {Array} historyItems - History items data
   */
  setHistoryItems(filters, historyItems) {
    this.set('history', filters, historyItems);
  }

  /**
   * Generate cache key
   * @param {string} key - Base key
   * @param {Object} params - Parameters
   * @returns {string} Generated cache key
   */
  generateKey(key, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(k => `${k}:${params[k]}`)
      .join('|');
    
    return paramString ? `${key}:${paramString}` : key;
  }

  /**
   * Check if cached item is expired
   * @param {Object} cached - Cached item
   * @returns {boolean} True if expired
   */
  isExpired(cached) {
    return Date.now() - cached.timestamp > cached.ttl;
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const total = this.cache.size;
    const expired = Array.from(this.cache.values()).filter(item => this.isExpired(item)).length;
    const valid = total - expired;

    return {
      total,
      valid,
      expired,
      hitRate: this.calculateHitRate()
    };
  }

  /**
   * Calculate cache hit rate (mock implementation)
   * @returns {number} Hit rate percentage
   */
  calculateHitRate() {
    // This would be implemented with actual hit/miss tracking
    return 85; // Mock 85% hit rate
  }

  /**
   * Clean expired items
   */
  cleanup() {
    const keysToDelete = [];
    
    for (const [key, value] of this.cache.entries()) {
      if (this.isExpired(value)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

export default CacheManager; 