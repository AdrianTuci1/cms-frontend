/**
 * ResourceError - Erori de resurse (404, 409)
 * Include NotFoundError și ConflictError
 */

import { BaseError } from './BaseError.js';

/**
 * NotFoundError - Eroare de resursă negăsită (404)
 */
export class NotFoundError extends BaseError {
  constructor(message = 'Resource not found', status = 404, details = null) {
    super(message, status, 'NOT_FOUND', details);
    this.retryable = false;
    this.severity = 'warning';
    this.resourceType = 'unknown';
    this.resourceId = null;
    this.suggestions = [];
  }

  /**
   * Setează tipul de resursă
   */
  setResourceType(type) {
    this.resourceType = type;
    return this;
  }

  /**
   * Setează ID-ul resursei
   */
  setResourceId(id) {
    this.resourceId = id;
    return this;
  }

  /**
   * Adaugă sugestii pentru utilizator
   */
  addSuggestion(suggestion) {
    this.suggestions.push(suggestion);
    return this;
  }

  /**
   * Obține titlul pentru UI
   */
  getUITitle() {
    return 'Resursă negăsită';
  }

  /**
   * Obține mesajul pentru UI
   */
  getUIMessage() {
    if (this.resourceType && this.resourceId) {
      return `${this.resourceType} cu ID ${this.resourceId} nu a fost găsit.`;
    } else if (this.resourceType) {
      return `${this.resourceType} nu a fost găsit.`;
    }
    return this.details?.userMessage || 'Resursa căutată nu a fost găsită.';
  }

  /**
   * Obține tipul pentru UI
   */
  getUIType() {
    return 'not-found';
  }

  /**
   * Convertește eroarea în format pentru logging
   */
  toLogFormat() {
    return {
      ...super.toLogFormat(),
      resourceType: this.resourceType,
      resourceId: this.resourceId,
      suggestions: this.suggestions
    };
  }

  /**
   * Factory method pentru crearea din response
   */
  static fromResponse(response, details = null) {
    const message = details?.message || 'Resource not found';
    const error = new NotFoundError(message, response.status, details);
    
    if (details?.resourceType) {
      error.setResourceType(details.resourceType);
    }
    
    if (details?.resourceId) {
      error.setResourceId(details.resourceId);
    }
    
    return error;
  }

  /**
   * Factory method pentru resursă specifică
   */
  static resourceNotFound(resourceType, resourceId = null) {
    const error = new NotFoundError(
      `${resourceType} not found`,
      404,
      {
        userMessage: `${resourceType} nu a fost găsit.`,
        resourceType,
        resourceId
      }
    );
    
    error.setResourceType(resourceType);
    if (resourceId) {
      error.setResourceId(resourceId);
    }
    
    return error;
  }

  /**
   * Factory method pentru endpoint negăsit
   */
  static endpointNotFound(endpoint) {
    return new NotFoundError(
      'Endpoint not found',
      404,
      {
        userMessage: 'Endpoint-ul căutat nu există.',
        endpoint
      }
    ).setResourceType('endpoint').setResourceId(endpoint);
  }
}

/**
 * ConflictError - Eroare de conflict (409)
 */
export class ConflictError extends BaseError {
  constructor(message = 'Resource conflict', status = 409, details = null) {
    super(message, status, 'CONFLICT', details);
    this.retryable = false;
    this.severity = 'warning';
    this.conflictType = 'unknown';
    this.conflictingFields = [];
    this.resolution = null;
  }

  /**
   * Setează tipul de conflict
   */
  setConflictType(type) {
    this.conflictType = type;
    return this;
  }

  /**
   * Adaugă câmpuri conflictuale
   */
  addConflictingField(field, value) {
    this.conflictingFields.push({ field, value });
    return this;
  }

  /**
   * Setează rezoluția conflictului
   */
  setResolution(resolution) {
    this.resolution = resolution;
    return this;
  }

  /**
   * Obține titlul pentru UI
   */
  getUITitle() {
    return 'Conflict de resurse';
  }

  /**
   * Obține mesajul pentru UI
   */
  getUIMessage() {
    if (this.conflictType === 'duplicate') {
      return 'Această resursă există deja.';
    } else if (this.conflictType === 'version') {
      return 'Versiunea resursei a fost modificată. Reîncarcă și încearcă din nou.';
    }
    return this.details?.userMessage || 'A apărut un conflict cu resursa.';
  }

  /**
   * Obține tipul pentru UI
   */
  getUIType() {
    return 'conflict';
  }

  /**
   * Convertește eroarea în format pentru logging
   */
  toLogFormat() {
    return {
      ...super.toLogFormat(),
      conflictType: this.conflictType,
      conflictingFields: this.conflictingFields,
      resolution: this.resolution
    };
  }

  /**
   * Factory method pentru crearea din response
   */
  static fromResponse(response, details = null) {
    const message = details?.message || 'Resource conflict';
    const error = new ConflictError(message, response.status, details);
    
    if (details?.conflictType) {
      error.setConflictType(details.conflictType);
    }
    
    if (details?.conflictingFields) {
      details.conflictingFields.forEach(field => {
        error.addConflictingField(field.name, field.value);
      });
    }
    
    return error;
  }

  /**
   * Factory method pentru conflict de duplicat
   */
  static duplicateResource(resourceType, field, value) {
    return new ConflictError(
      `${resourceType} already exists`,
      409,
      {
        userMessage: `${resourceType} cu ${field} '${value}' există deja.`,
        conflictType: 'duplicate',
        resourceType,
        field,
        value
      }
    ).setConflictType('duplicate').addConflictingField(field, value);
  }

  /**
   * Factory method pentru conflict de versiune
   */
  static versionConflict(resourceType, currentVersion, expectedVersion) {
    return new ConflictError(
      'Version conflict',
      409,
      {
        userMessage: 'Versiunea resursei a fost modificată. Reîncarcă și încearcă din nou.',
        conflictType: 'version',
        resourceType,
        currentVersion,
        expectedVersion
      }
    ).setConflictType('version');
  }

  /**
   * Factory method pentru conflict de stare
   */
  static stateConflict(resourceType, currentState, requiredState) {
    return new ConflictError(
      'State conflict',
      409,
      {
        userMessage: `Resursa trebuie să fie în starea '${requiredState}' pentru această acțiune.`,
        conflictType: 'state',
        resourceType,
        currentState,
        requiredState
      }
    ).setConflictType('state');
  }
}

export default {
  NotFoundError,
  ConflictError
}; 