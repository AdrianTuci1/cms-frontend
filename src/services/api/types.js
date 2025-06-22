// API Types and Interfaces

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

export const API_ENDPOINTS = {
  // Base endpoints
  AUTH: '/auth',
  USERS: '/users',
  TENANTS: '/tenants',
  LOCATIONS: '/locations',
  
  // Business specific endpoints
  CALENDAR: '/calendar',
  CLIENTS: '/clients',
  EMPLOYEES: '/employees',
  TREATMENTS: '/treatments',
  PACKAGES: '/packages',
  ROOMS: '/rooms',
  STOCKS: '/stocks',
  INVOICES: '/invoices',
  HISTORY: '/history',
  REPORTS: '/reports',
  
  // Demo endpoint
  DEMO_DATA: '/demo-data'
};

export const BUSINESS_TYPES = {
  DENTAL_CLINIC: 'dental_clinic',
  GYM: 'gym',
  HOTEL: 'hotel'
};

/**
 * @typedef {Object} ApiRequest
 * @property {string} method - HTTP method
 * @property {string} url - Request URL
 * @property {Object.<string, string>} [headers] - Request headers
 * @property {*} [body] - Request body
 * @property {Object.<string, *>} [params] - Query parameters
 */

/**
 * @typedef {Object} ApiResponse
 * @property {*} data - Response data
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {Object.<string, string>} headers - Response headers
 * @property {boolean} success - Whether the request was successful
 * @property {string} [error] - Error message if any
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} [page] - Page number
 * @property {number} [limit] - Items per page
 * @property {string} [search] - Search term
 * @property {string} [sortBy] - Sort field
 * @property {'asc'|'desc'} [sortOrder] - Sort order
 */

/**
 * @typedef {Object} DateRangeParams
 * @property {string} startDate - Start date (ISO string)
 * @property {string} endDate - End date (ISO string)
 */

/**
 * @typedef {Object} BaseEntity
 * @property {number} id - Entity ID
 * @property {number} tenantId - Tenant ID
 * @property {number} locationId - Location ID
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 * @property {'active'|'inactive'|'deleted'} status - Entity status
 */

/**
 * @typedef {Object} CalendarEvent
 * @extends BaseEntity
 * @property {number} patientId - Patient ID
 * @property {string} patientName - Patient name
 * @property {number} medicId - Medic ID
 * @property {string} medicName - Medic name
 * @property {string} date - Appointment date
 * @property {number} duration - Duration in minutes
 * @property {'scheduled'|'done'|'missed'|'upcoming'|'notpaid'} status - Appointment status
 * @property {string} initialTreatment - Treatment type
 * @property {string} color - UI color
 */

/**
 * @typedef {Object} Client
 * @extends BaseEntity
 * @property {string} name - Client name
 * @property {string} email - Client email
 * @property {string} phone - Client phone
 * @property {string} [avatar] - Client avatar URL
 * @property {CalendarEvent} [previousAppointment] - Previous appointment
 * @property {CalendarEvent} [nextAppointment] - Next appointment
 */

/**
 * @typedef {Object} Employee
 * @extends BaseEntity
 * @property {string} name - Employee name
 * @property {string} role - Employee role
 * @property {string} email - Employee email
 * @property {string} phone - Employee phone
 * @property {string} address - Employee address
 * @property {string} city - Employee city
 * @property {string} state - Employee state
 * @property {string} [avatar] - Employee avatar URL
 * @property {string[]} workingDays - Working days
 * @property {string} workingHours - Working hours
 * @property {string[]} specializations - Specializations
 */

/**
 * @typedef {Object} Treatment
 * @extends BaseEntity
 * @property {string} name - Treatment name
 * @property {number} price - Treatment price
 * @property {number} duration - Duration in minutes
 * @property {string} category - Treatment category
 * @property {string} color - UI color
 * @property {Array<{id: number, name: string, quantity: number}>} components - Treatment components
 */

/**
 * @typedef {Object} Package
 * @extends BaseEntity
 * @property {string} name - Package name
 * @property {number} price - Package price
 * @property {number} duration - Duration in minutes
 * @property {string} category - Package category
 * @property {string} color - UI color
 * @property {string[]} features - Package features
 */

/**
 * @typedef {Object} Room
 * @extends BaseEntity
 * @property {string} number - Room number
 * @property {string} type - Room type
 * @property {number} capacity - Room capacity
 * @property {number} price - Room price
 * @property {'available'|'occupied'|'maintenance'} status - Room status
 * @property {string[]} amenities - Room amenities
 */

/**
 * @typedef {Object} StockItem
 * @extends BaseEntity
 * @property {string} name - Item name
 * @property {number} quantity - Current quantity
 * @property {number} minQuantity - Minimum quantity
 * @property {number} price - Item price
 * @property {string} category - Item category
 * @property {string} supplier - Supplier name
 */

/**
 * @typedef {Object} HistoryItem
 * @extends BaseEntity
 * @property {string} date - History date (YYYY-MM-DD)
 * @property {string} hour - History hour (HH:MM)
 * @property {Object} initiatedBy - User who initiated the action
 * @property {number} initiatedBy.id - User ID
 * @property {string} initiatedBy.name - User name
 * @property {string} initiatedBy.role - User role
 * @property {string} description - Action description
 * @property {string} action - Specific action performed
 * @property {string} type - History type (check-out, problem, cleaning, deleted, created, updated, login, logout, other)
 * @property {'success'|'failed'|'pending'} status - Action status
 * @property {boolean} revertable - Whether the action can be reverted
 */

/**
 * @typedef {Object} OfflineQueueItem
 * @property {string} id - Queue item ID
 * @property {number} tenantId - Tenant ID
 * @property {number} locationId - Location ID
 * @property {string} endpoint - API endpoint
 * @property {string} method - HTTP method
 * @property {*} payload - Request payload
 * @property {'pending'|'processing'|'completed'|'failed'} status - Queue status
 * @property {number} retryCount - Current retry count
 * @property {number} maxRetries - Maximum retry attempts
 * @property {string} createdAt - Creation timestamp
 * @property {string} [processedAt] - Processing timestamp
 * @property {string} [error] - Error message
 */

/**
 * @typedef {Object} ApiConfig
 * @property {string} baseURL - Base API URL
 * @property {number} timeout - Request timeout in ms
 * @property {number} retryAttempts - Number of retry attempts
 * @property {number} retryDelay - Delay between retries in ms
 * @property {boolean} enableOfflineMode - Enable offline mode
 * @property {boolean} enableDemoMode - Enable demo mode
 */

/**
 * @typedef {Object} AuthConfig
 * @property {string} token - Access token
 * @property {string} refreshToken - Refresh token
 * @property {number} expiresAt - Token expiration timestamp
 */

// Error Classes
export class ApiError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {string} [code] - Error code
   * @param {*} [details] - Error details
   */
  constructor(message, status, code, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends Error {
  /**
   * @param {string} message - Error message
   * @param {Error} [originalError] - Original error
   */
  constructor(message, originalError) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
  }
}

export class OfflineError extends Error {
  /**
   * @param {string} message - Error message
   * @param {OfflineQueueItem} [queuedAction] - Queued action
   */
  constructor(message, queuedAction) {
    super(message);
    this.name = 'OfflineError';
    this.queuedAction = queuedAction;
  }
} 