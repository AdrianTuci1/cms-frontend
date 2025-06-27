/**
 * Client Module - Simplificat pentru integrarea cu DataSyncManager
 * Exportă doar ApiClient-ul esențial
 */

// Main ApiClient
export { ApiClient } from './ApiClient.js';
export { default as apiClient } from './ApiClient.js';

/**
 * ClientFactory - Factory simplificat pentru crearea de client-e
 */
export class ClientFactory {
  /**
   * Creează un client API complet
   */
  static createApiClient(config = {}) {
    return new ApiClient(config);
  }

  /**
   * Creează un client pentru development
   */
  static createDevelopmentClient(config = {}) {
    return new ApiClient({
      ...config,
      debug: true,
      logRequests: true,
      logResponses: true,
      logErrors: true
    });
  }

  /**
   * Creează un client pentru production
   */
  static createProductionClient(config = {}) {
    return new ApiClient({
      ...config,
      debug: false,
      logRequests: false,
      logResponses: false,
      logErrors: true
    });
  }
}

/**
 * ClientUtils - Utilitare simplificate pentru client-e
 */
export class ClientUtils {
  /**
   * Verifică dacă un client este inițializat
   */
  static isInitialized(client) {
    return client && client.isInitialized;
  }

  /**
   * Testează conectivitatea unui client
   */
  static async testClientConnectivity(client) {
    try {
      const response = await client.get('/health/ping');
      return {
        success: true,
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validează configurația unui client
   */
  static validateClientConfig(config) {
    const errors = [];

    if (!config.baseURL) {
      errors.push('Base URL is required');
    }

    if (config.timeout && config.timeout <= 0) {
      errors.push('Timeout must be greater than 0');
    }

    if (config.retryAttempts && config.retryAttempts < 0) {
      errors.push('Retry attempts must be non-negative');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export default pentru compatibilitate
export default {
  ApiClient,
  ClientFactory,
  ClientUtils
}; 