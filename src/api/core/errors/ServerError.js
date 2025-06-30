/**
 * ServerError - Erori de server (5xx)
 * Include ServerError, RateLimitError, TimeoutError
 */

import { BaseError } from './BaseError.js';

/**
 * ServerError - Eroare de server (500, 502, 503, 504)
 */
export class ServerError extends BaseError {
  constructor(message = 'Server error', status = 500, details = null) {
    super(message, status, 'SERVER_ERROR', details);
    this.retryable = true;
    this.severity = 'error';
    this.serverType = 'unknown';
    this.recoveryTime = null;
  }

  /**
   * Setează tipul de server
   */
  setServerType(type) {
    this.serverType = type;
    return this;
  }

  /**
   * Setează timpul de recuperare
   */
  setRecoveryTime(time) {
    this.recoveryTime = time;
    return this;
  }

  /**
   * Obține titlul pentru UI
   */
  getUITitle() {
    return 'Eroare de server';
  }

  /**
   * Obține mesajul pentru UI
   */
  getUIMessage() {
    if (this.recoveryTime) {
      return `Server temporar indisponibil. Încearcă din nou în ${this.recoveryTime} secunde.`;
    }
    return this.details?.userMessage || 'A apărut o eroare pe server. Încearcă din nou.';
  }

  /**
   * Obține tipul pentru UI
   */
  getUIType() {
    return 'server';
  }

  /**
   * Convertește eroarea în format pentru logging
   */
  toLogFormat() {
    return {
      ...super.toLogFormat(),
      serverType: this.serverType,
      recoveryTime: this.recoveryTime
    };
  }

  /**
   * Factory method pentru crearea din response
   */
  static fromResponse(response, details = null) {
    const message = details?.message || 'Server error';
    const error = new ServerError(message, response.status, details);
    
    if (details?.recoveryTime) {
      error.setRecoveryTime(details.recoveryTime);
    }
    
    return error;
  }

  /**
   * Factory method pentru eroare internă
   */
  static internalError() {
    return new ServerError(
      'Internal server error',
      500,
      {
        userMessage: 'A apărut o eroare internă pe server. Contactează administratorul.',
        serverType: 'internal'
      }
    ).setServerType('internal');
  }

  /**
   * Factory method pentru serviciu indisponibil
   */
  static serviceUnavailable(recoveryTime = null) {
    return new ServerError(
      'Service unavailable',
      503,
      {
        userMessage: 'Serviciul este temporar indisponibil. Încearcă din nou.',
        serverType: 'unavailable'
      }
    ).setServerType('unavailable').setRecoveryTime(recoveryTime);
  }

  /**
   * Factory method pentru gateway error
   */
  static gatewayError() {
    return new ServerError(
      'Bad gateway',
      502,
      {
        userMessage: 'Eroare de gateway. Serverul nu poate procesa cererea.',
        serverType: 'gateway'
      }
    ).setServerType('gateway');
  }
}

/**
 * RateLimitError - Eroare de rate limit (429)
 */
export class RateLimitError extends BaseError {
  constructor(message = 'Rate limit exceeded', status = 429, details = null) {
    super(message, status, 'RATE_LIMIT', details);
    this.retryable = true;
    this.severity = 'warning';
    this.retryAfter = details?.retryAfter || 60;
    this.limit = details?.limit || null;
    this.resetTime = null;
  }

  /**
   * Setează timpul de așteptare pentru retry
   */
  setRetryAfter(seconds) {
    this.retryAfter = seconds;
    return this;
  }

  /**
   * Setează limita de rate
   */
  setLimit(limit) {
    this.limit = limit;
    return this;
  }

  /**
   * Setează timpul de reset
   */
  setResetTime(time) {
    this.resetTime = time;
    return this;
  }

  /**
   * Obține titlul pentru UI
   */
  getUITitle() {
    return 'Limită depășită';
  }

  /**
   * Obține mesajul pentru UI
   */
  getUIMessage() {
    if (this.retryAfter) {
      return `Ai depășit limita de cereri. Încearcă din nou în ${this.retryAfter} secunde.`;
    }
    return this.details?.userMessage || 'Ai depășit limita de cereri. Încearcă din nou.';
  }

  /**
   * Obține tipul pentru UI
   */
  getUIType() {
    return 'rate-limit';
  }

  /**
   * Convertește eroarea în format pentru logging
   */
  toLogFormat() {
    return {
      ...super.toLogFormat(),
      retryAfter: this.retryAfter,
      limit: this.limit,
      resetTime: this.resetTime
    };
  }

  /**
   * Factory method pentru crearea din response
   */
  static fromResponse(response, details = null) {
    const message = details?.message || 'Rate limit exceeded';
    const retryAfter = response.headers?.get('Retry-After');
    
    return new RateLimitError(message, response.status, {
      ...details,
      retryAfter: retryAfter ? parseInt(retryAfter) : 60
    });
  }

  /**
   * Factory method pentru rate limit cu timp specific
   */
  static withRetryAfter(retryAfter) {
    return new RateLimitError(
      'Rate limit exceeded',
      429,
      {
        userMessage: `Ai depășit limita de cereri. Încearcă din nou în ${retryAfter} secunde.`,
        retryAfter
      }
    ).setRetryAfter(retryAfter);
  }
}

/**
 * TimeoutError - Eroare de timeout
 */
export class TimeoutError extends BaseError {
  constructor(message = 'Request timeout', timeout = null, details = null) {
    super(message, null, 'TIMEOUT', details);
    this.retryable = true;
    this.severity = 'warning';
    this.timeout = timeout;
    this.timeoutType = 'request';
  }

  /**
   * Setează tipul de timeout
   */
  setTimeoutType(type) {
    this.timeoutType = type;
    return this;
  }

  /**
   * Obține titlul pentru UI
   */
  getUITitle() {
    return 'Cerere expirată';
  }

  /**
   * Obține mesajul pentru UI
   */
  getUIMessage() {
    return this.details?.userMessage || 'Cererea a expirat. Încearcă din nou.';
  }

  /**
   * Obține tipul pentru UI
   */
  getUIType() {
    return 'timeout';
  }

  /**
   * Convertește eroarea în format pentru logging
   */
  toLogFormat() {
    return {
      ...super.toLogFormat(),
      timeout: this.timeout,
      timeoutType: this.timeoutType
    };
  }

  /**
   * Factory method pentru crearea din AbortSignal
   */
  static fromAbortSignal(signal, timeout = null) {
    return new TimeoutError(
      'Request timeout',
      timeout,
      {
        signal: signal.reason,
        userMessage: 'Cererea a fost anulată din cauza timeout-ului.'
      }
    ).setTimeoutType('abort');
  }

  /**
   * Factory method pentru timeout de rețea
   */
  static networkTimeout(timeout) {
    return new TimeoutError(
      'Network timeout',
      timeout,
      {
        userMessage: 'Conexiunea la server a expirat. Verifică conexiunea la internet.'
      }
    ).setTimeoutType('network');
  }

  /**
   * Factory method pentru timeout de procesare
   */
  static processingTimeout(timeout) {
    return new TimeoutError(
      'Processing timeout',
      timeout,
      {
        userMessage: 'Procesarea cererii a durat prea mult. Încearcă din nou.'
      }
    ).setTimeoutType('processing');
  }
}

export default {
  ServerError,
  RateLimitError,
  TimeoutError
}; 