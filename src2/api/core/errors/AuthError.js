/**
 * AuthError - Erori de autentificare și autorizare
 * Include AuthenticationError și AuthorizationError
 */

import { BaseError } from './BaseError.js';

/**
 * AuthenticationError - Eroare de autentificare (401, 403)
 */
export class AuthenticationError extends BaseError {
  constructor(message = 'Authentication failed', status = 401, details = null) {
    super(message, status, 'AUTH_ERROR', details);
    this.retryable = false;
    this.severity = 'error';
    this.authType = 'unknown';
    this.tokenExpired = false;
  }

  /**
   * Setează tipul de autentificare
   */
  setAuthType(type) {
    this.authType = type;
    return this;
  }

  /**
   * Marchează token-ul ca expirat
   */
  setTokenExpired(expired = true) {
    this.tokenExpired = expired;
    return this;
  }

  /**
   * Obține titlul pentru UI
   */
  getUITitle() {
    return 'Eroare de autentificare';
  }

  /**
   * Obține mesajul pentru UI
   */
  getUIMessage() {
    if (this.tokenExpired) {
      return 'Sesiunea a expirat. Te rugăm să te autentifici din nou.';
    }
    return this.details?.userMessage || 'Autentificarea a eșuat. Verifică credențialele.';
  }

  /**
   * Obține tipul pentru UI
   */
  getUIType() {
    return 'auth';
  }

  /**
   * Convertește eroarea în format pentru logging
   */
  toLogFormat() {
    return {
      ...super.toLogFormat(),
      authType: this.authType,
      tokenExpired: this.tokenExpired
    };
  }

  /**
   * Factory method pentru crearea din response
   */
  static fromResponse(response, details = null) {
    const message = details?.message || 'Authentication failed';
    const error = new AuthenticationError(message, response.status, details);
    
    if (details?.tokenExpired) {
      error.setTokenExpired(true);
    }
    
    return error;
  }

  /**
   * Factory method pentru token expirat
   */
  static tokenExpired() {
    return new AuthenticationError(
      'Token expired',
      401,
      {
        userMessage: 'Sesiunea a expirat. Te rugăm să te autentifici din nou.',
        tokenExpired: true
      }
    ).setTokenExpired(true).setAuthType('token');
  }

  /**
   * Factory method pentru credențiale invalide
   */
  static invalidCredentials() {
    return new AuthenticationError(
      'Invalid credentials',
      401,
      {
        userMessage: 'Email-ul sau parola sunt incorecte.',
        invalidCredentials: true
      }
    ).setAuthType('credentials');
  }
}

/**
 * AuthorizationError - Eroare de autorizare (403)
 */
export class AuthorizationError extends BaseError {
  constructor(message = 'Access denied', status = 403, details = null) {
    super(message, status, 'FORBIDDEN', details);
    this.retryable = false;
    this.severity = 'error';
    this.permission = null;
    this.resource = null;
  }

  /**
   * Setează permisiunea lipsă
   */
  setPermission(permission) {
    this.permission = permission;
    return this;
  }

  /**
   * Setează resursa accesată
   */
  setResource(resource) {
    this.resource = resource;
    return this;
  }

  /**
   * Obține titlul pentru UI
   */
  getUITitle() {
    return 'Acces interzis';
  }

  /**
   * Obține mesajul pentru UI
   */
  getUIMessage() {
    if (this.permission) {
      return `Nu ai permisiunea '${this.permission}' pentru această acțiune.`;
    }
    return this.details?.userMessage || 'Nu ai permisiunea de a accesa această resursă.';
  }

  /**
   * Obține tipul pentru UI
   */
  getUIType() {
    return 'auth';
  }

  /**
   * Convertește eroarea în format pentru logging
   */
  toLogFormat() {
    return {
      ...super.toLogFormat(),
      permission: this.permission,
      resource: this.resource
    };
  }

  /**
   * Factory method pentru crearea din response
   */
  static fromResponse(response, details = null) {
    const message = details?.message || 'Access denied';
    const error = new AuthorizationError(message, response.status, details);
    
    if (details?.permission) {
      error.setPermission(details.permission);
    }
    
    if (details?.resource) {
      error.setResource(details.resource);
    }
    
    return error;
  }

  /**
   * Factory method pentru permisiune lipsă
   */
  static missingPermission(permission, resource = null) {
    return new AuthorizationError(
      `Missing permission: ${permission}`,
      403,
      {
        userMessage: `Nu ai permisiunea '${permission}' pentru această acțiune.`,
        permission,
        resource
      }
    ).setPermission(permission).setResource(resource);
  }

  /**
   * Factory method pentru resursă protejată
   */
  static protectedResource(resource) {
    return new AuthorizationError(
      `Protected resource: ${resource}`,
      403,
      {
        userMessage: 'Această resursă este protejată și necesită permisiuni speciale.',
        resource
      }
    ).setResource(resource);
  }
}

export default {
  AuthenticationError,
  AuthorizationError
}; 