/**
 * BaseError - Clasa de bază pentru toate erorile API
 * Oferă funcționalități comune pentru toate tipurile de erori
 */

export class BaseError extends Error {
  constructor(message, status = null, code = null, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    this.retryable = false;
    this.severity = 'error';
  }

  /**
   * Verifică dacă eroarea este retryable
   */
  isRetryable() {
    return this.retryable;
  }

  /**
   * Setează dacă eroarea este retryable
   */
  setRetryable(retryable) {
    this.retryable = retryable;
    return this;
  }

  /**
   * Setează severitatea erorii
   */
  setSeverity(severity) {
    this.severity = severity;
    return this;
  }

  /**
   * Adaugă detalii suplimentare
   */
  addDetails(key, value) {
    if (!this.details) {
      this.details = {};
    }
    this.details[key] = value;
    return this;
  }

  /**
   * Obține detaliile pentru o cheie specifică
   */
  getDetail(key) {
    return this.details?.[key];
  }

  /**
   * Convertește eroarea în obiect serializabil
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      retryable: this.retryable,
      severity: this.severity
    };
  }

  /**
   * Convertește eroarea în format pentru logging
   */
  toLogFormat() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
      retryable: this.retryable,
      severity: this.severity,
      stack: this.stack
    };
  }

  /**
   * Convertește eroarea în format pentru UI
   */
  toUIFormat() {
    return {
      title: this.getUITitle(),
      message: this.getUIMessage(),
      type: this.getUIType(),
      retryable: this.retryable,
      code: this.code
    };
  }

  /**
   * Obține titlul pentru UI
   */
  getUITitle() {
    return this.message;
  }

  /**
   * Obține mesajul pentru UI
   */
  getUIMessage() {
    return this.details?.userMessage || this.message;
  }

  /**
   * Obține tipul pentru UI
   */
  getUIType() {
    return 'general';
  }

  /**
   * Clonează eroarea
   */
  clone() {
    const cloned = new this.constructor(this.message, this.status, this.code, this.details);
    cloned.timestamp = this.timestamp;
    cloned.retryable = this.retryable;
    cloned.severity = this.severity;
    return cloned;
  }

  /**
   * Verifică dacă eroarea este de un anumit tip
   */
  isInstanceOf(errorClass) {
    return this instanceof errorClass;
  }

  /**
   * Verifică dacă eroarea are un anumit cod
   */
  hasCode(code) {
    return this.code === code;
  }

  /**
   * Verifică dacă eroarea are un anumit status
   */
  hasStatus(status) {
    return this.status === status;
  }
}

export default BaseError; 