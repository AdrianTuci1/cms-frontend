/**
 * NetworkError - Eroare de rețea (conectivitate)
 * Inherită din BaseError și adaugă funcționalități specifice pentru erorile de rețea
 */

import { BaseError } from './BaseError.js';

export class NetworkError extends BaseError {
  constructor(message = 'Network connection failed', details = null) {
    super(message, null, 'NETWORK_ERROR', details);
    this.retryable = true;
    this.severity = 'warning';
    this.networkType = 'unknown';
    this.connectionAttempts = 0;
  }

  /**
   * Setează tipul de eroare de rețea
   */
  setNetworkType(type) {
    this.networkType = type;
    return this;
  }

  /**
   * Incrementează numărul de încercări de conectare
   */
  incrementConnectionAttempts() {
    this.connectionAttempts++;
    return this;
  }

  /**
   * Setează numărul de încercări de conectare
   */
  setConnectionAttempts(attempts) {
    this.connectionAttempts = attempts;
    return this;
  }

  /**
   * Obține titlul pentru UI
   */
  getUITitle() {
    return 'Eroare de conexiune';
  }

  /**
   * Obține mesajul pentru UI
   */
  getUIMessage() {
    return this.details?.userMessage || 'Nu se poate conecta la server. Verifică conexiunea la internet.';
  }

  /**
   * Obține tipul pentru UI
   */
  getUIType() {
    return 'network';
  }

  /**
   * Convertește eroarea în format pentru logging
   */
  toLogFormat() {
    return {
      ...super.toLogFormat(),
      networkType: this.networkType,
      connectionAttempts: this.connectionAttempts
    };
  }

  /**
   * Factory method pentru crearea din fetch error
   */
  static fromFetchError(fetchError) {
    const error = new NetworkError(
      'Network request failed',
      {
        originalError: fetchError.message,
        type: fetchError.name,
        userMessage: 'Eroare de rețea. Verifică conexiunea la internet.'
      }
    );

    // Determină tipul de eroare de rețea
    if (fetchError.message.includes('fetch')) {
      error.setNetworkType('fetch');
    } else if (fetchError.message.includes('timeout')) {
      error.setNetworkType('timeout');
    } else if (fetchError.message.includes('abort')) {
      error.setNetworkType('abort');
    }

    return error;
  }

  /**
   * Factory method pentru crearea din navigator.onLine
   */
  static fromOfflineStatus() {
    return new NetworkError(
      'Device is offline',
      {
        userMessage: 'Dispozitivul nu este conectat la internet.',
        offline: true
      }
    ).setNetworkType('offline');
  }

  /**
   * Factory method pentru crearea din timeout
   */
  static fromTimeout(timeout = null) {
    return new NetworkError(
      'Request timeout',
      {
        userMessage: 'Cererea a expirat. Încearcă din nou.',
        timeout
      }
    ).setNetworkType('timeout');
  }
}

export default NetworkError; 