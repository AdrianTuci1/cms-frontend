/**
 * Errors Module - Simplificat pentru integrarea cu DataSyncManager
 * Exportă doar componentele esențiale pentru gestionarea erorilor
 */

import { BaseError } from './BaseError.js';
import { NetworkError } from './NetworkError.js';
import { AuthenticationError, AuthorizationError } from './AuthError.js';
import { ValidationError } from './ValidationError.js';
import { ServerError } from './ServerError.js';
import { NotFoundError, ConflictError } from './ResourceError.js';

// Base Error
export { BaseError } from './BaseError.js';

// Network Errors
export { NetworkError } from './NetworkError.js';

// Auth Errors
export { AuthenticationError, AuthorizationError } from './AuthError.js';

// Validation Errors
export { ValidationError } from './ValidationError.js';

// Server Errors
export { ServerError } from './ServerError.js';

// Resource Errors
export { NotFoundError, ConflictError } from './ResourceError.js';

/**
 * ErrorUtils - Utilitare simplificate pentru gestionarea erorilor
 */
export class ErrorUtils {
  /**
   * Verifică dacă o eroare este retryable
   */
  static isRetryable(error) {
    if (error instanceof BaseError) {
      return error.isRetryable();
    }
    return false;
  }

  /**
   * Obține mesajul de eroare pentru utilizator
   */
  static getUserMessage(error) {
    if (error instanceof BaseError) {
      return error.getUIMessage();
    }
    return 'A apărut o eroare neașteptată.';
  }

  /**
   * Loghează o eroare pentru debugging
   */
  static logError(error, context = null) {
    const logData = error instanceof BaseError 
      ? error.toLogFormat() 
      : {
          name: error.name,
          message: error.message,
          stack: error.stack,
          context
        };

    console.error('API Error:', logData);
  }

  /**
   * Convertește o eroare în format pentru UI
   */
  static toUIFormat(error) {
    if (error instanceof BaseError) {
      return error.toUIFormat();
    }
    
    return {
      title: 'Eroare',
      message: this.getUserMessage(error),
      type: 'general',
      retryable: false,
      code: 'UNKNOWN_ERROR'
    };
  }

  /**
   * Determină tipul de eroare pentru UI
   */
  static getErrorType(error) {
    if (error instanceof NetworkError) return 'network';
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) return 'auth';
    if (error instanceof ValidationError) return 'validation';
    if (error instanceof ServerError) return 'server';
    if (error instanceof NotFoundError || error instanceof ConflictError) return 'resource';
    return 'general';
  }

  /**
   * Creează o eroare din response HTTP
   */
  static createFromResponse(response, details = null) {
    const status = response.status;
    const message = details?.message || `HTTP ${status}`;

    switch (status) {
      case 400:
        return new ValidationError(message, details);
      case 401:
        return new AuthenticationError(message, details);
      case 403:
        return new AuthorizationError(message, details);
      case 404:
        return new NotFoundError(message, details);
      case 409:
        return new ConflictError(message, details);
      case 500:
        return new ServerError(message, details);
      default:
        return new BaseError(message, details);
    }
  }

  /**
   * Creează o eroare din error object
   */
  static createFromError(error, context = null) {
    if (error instanceof BaseError) {
      return error;
    }

    if (error.name === 'NetworkError' || error.message.includes('network')) {
      return new NetworkError(error.message, context);
    }

    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      return new ValidationError(error.message, context);
    }

    return new BaseError(error.message, context);
  }
}

// Export default pentru compatibilitate
export default {
  BaseError,
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  ServerError,
  NotFoundError,
  ConflictError,
  ErrorUtils
}; 