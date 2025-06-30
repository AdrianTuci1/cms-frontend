/**
 * ValidationError - Eroare de validare (400)
 * Inherită din BaseError și adaugă funcționalități pentru gestionarea erorilor de validare
 */

import { BaseError } from './BaseError.js';

export class ValidationError extends BaseError {
  constructor(message = 'Validation failed', status = 400, details = null) {
    super(message, status, 'VALIDATION_ERROR', details);
    this.retryable = false;
    this.severity = 'warning';
    this.validationErrors = details?.errors || [];
    this.fieldErrors = new Map();
    this.globalErrors = [];
    
    // Parsează erorile de validare
    this.parseValidationErrors();
  }

  /**
   * Parsează erorile de validare din details
   */
  parseValidationErrors() {
    if (this.details?.errors) {
      this.details.errors.forEach(error => {
        if (error.field) {
          this.addFieldError(error.field, error.message);
        } else {
          this.addGlobalError(error.message);
        }
      });
    }
  }

  /**
   * Adaugă o eroare pentru un câmp specific
   */
  addFieldError(field, message) {
    if (!this.fieldErrors.has(field)) {
      this.fieldErrors.set(field, []);
    }
    this.fieldErrors.get(field).push(message);
    this.validationErrors.push({ field, message });
  }

  /**
   * Adaugă o eroare globală
   */
  addGlobalError(message) {
    this.globalErrors.push(message);
    this.validationErrors.push({ message });
  }

  /**
   * Obține erorile pentru un câmp specific
   */
  getFieldErrors(field) {
    return this.fieldErrors.get(field) || [];
  }

  /**
   * Obține toate erorile de câmp
   */
  getAllFieldErrors() {
    const errors = {};
    this.fieldErrors.forEach((messages, field) => {
      errors[field] = messages;
    });
    return errors;
  }

  /**
   * Obține erorile globale
   */
  getGlobalErrors() {
    return this.globalErrors;
  }

  /**
   * Verifică dacă există erori pentru un câmp
   */
  hasFieldError(field) {
    return this.fieldErrors.has(field) && this.fieldErrors.get(field).length > 0;
  }

  /**
   * Verifică dacă există erori globale
   */
  hasGlobalErrors() {
    return this.globalErrors.length > 0;
  }

  /**
   * Verifică dacă există orice erori
   */
  hasErrors() {
    return this.validationErrors.length > 0;
  }

  /**
   * Obține numărul total de erori
   */
  getErrorCount() {
    return this.validationErrors.length;
  }

  /**
   * Obține numărul de câmpuri cu erori
   */
  getFieldErrorCount() {
    return this.fieldErrors.size;
  }

  /**
   * Obține titlul pentru UI
   */
  getUITitle() {
    return 'Eroare de validare';
  }

  /**
   * Obține mesajul pentru UI
   */
  getUIMessage() {
    if (this.hasGlobalErrors()) {
      return this.globalErrors[0];
    }
    
    if (this.getFieldErrorCount() > 0) {
      const fieldNames = Array.from(this.fieldErrors.keys()).join(', ');
      return `Erori în câmpurile: ${fieldNames}`;
    }
    
    return this.details?.userMessage || 'Datele introduse nu sunt valide.';
  }

  /**
   * Obține tipul pentru UI
   */
  getUIType() {
    return 'validation';
  }

  /**
   * Convertește eroarea în format pentru logging
   */
  toLogFormat() {
    return {
      ...super.toLogFormat(),
      fieldErrorCount: this.getFieldErrorCount(),
      globalErrorCount: this.globalErrors.length,
      totalErrorCount: this.getErrorCount()
    };
  }

  /**
   * Convertește eroarea în format pentru UI
   */
  toUIFormat() {
    return {
      ...super.toUIFormat(),
      fieldErrors: this.getAllFieldErrors(),
      globalErrors: this.globalErrors,
      errorCount: this.getErrorCount()
    };
  }

  /**
   * Factory method pentru crearea din response
   */
  static fromResponse(response, details = null) {
    const message = details?.message || 'Validation failed';
    return new ValidationError(message, response.status, details);
  }

  /**
   * Factory method pentru eroare de câmp specific
   */
  static fieldError(field, message) {
    const error = new ValidationError('Field validation failed', 400);
    error.addFieldError(field, message);
    return error;
  }

  /**
   * Factory method pentru eroare globală
   */
  static globalError(message) {
    const error = new ValidationError('Validation failed', 400);
    error.addGlobalError(message);
    return error;
  }

  /**
   * Factory method pentru erori multiple
   */
  static fromErrors(errors) {
    const error = new ValidationError('Multiple validation errors', 400);
    
    errors.forEach(err => {
      if (err.field) {
        error.addFieldError(err.field, err.message);
      } else {
        error.addGlobalError(err.message);
      }
    });
    
    return error;
  }

  /**
   * Factory method pentru erori de tip required
   */
  static requiredField(field) {
    return this.fieldError(field, `Câmpul '${field}' este obligatoriu.`);
  }

  /**
   * Factory method pentru erori de tip email
   */
  static invalidEmail(field = 'email') {
    return this.fieldError(field, 'Adresa de email nu este validă.');
  }

  /**
   * Factory method pentru erori de tip length
   */
  static invalidLength(field, min, max) {
    if (min && max) {
      return this.fieldError(field, `Câmpul '${field}' trebuie să aibă între ${min} și ${max} caractere.`);
    } else if (min) {
      return this.fieldError(field, `Câmpul '${field}' trebuie să aibă cel puțin ${min} caractere.`);
    } else if (max) {
      return this.fieldError(field, `Câmpul '${field}' trebuie să aibă cel mult ${max} caractere.`);
    }
    return this.fieldError(field, `Câmpul '${field}' are o lungime invalidă.`);
  }

  /**
   * Factory method pentru erori de tip format
   */
  static invalidFormat(field, format) {
    return this.fieldError(field, `Câmpul '${field}' nu respectă formatul: ${format}`);
  }
}

export default ValidationError; 