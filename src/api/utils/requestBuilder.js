/**
 * Request Builder - Constructor de cereri HTTP
 * 
 * Responsabilități:
 * - Construirea URL-urilor cu parametri
 * - Adăugarea headers-urilor standard
 * - Validarea parametrilor de cerere
 * - Formatarea body-ului pentru cereri
 */

/**
 * Construiește URL-ul cu parametri de query
 * @param {string} baseUrl - URL-ul de bază
 * @param {Object} params - Parametrii de query
 * @returns {string} URL-ul complet cu parametri
 */
export function buildUrl(baseUrl, params = {}) {
  if (!baseUrl) {
    throw new Error('Base URL is required');
  }

  const url = new URL(baseUrl);
  
  // Adaugă parametrii de query
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
}

/**
 * Construiește headers-urile standard pentru cereri API
 * @param {Object} customHeaders - Headers personalizate
 * @param {string} token - Token de autentificare
 * @param {string} tenantId - ID-ul tenant-ului
 * @param {string} locationId - ID-ul locației
 * @returns {Object} Headers-urile complete
 */
export function buildHeaders(customHeaders = {}, token = null, tenantId = null, locationId = null) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders
  };

  // Adaugă token de autentificare
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Adaugă headers multi-tenant
  if (tenantId) {
    headers['X-Tenant-ID'] = tenantId;
  }

  if (locationId) {
    headers['X-Location-ID'] = locationId;
  }

  return headers;
}

/**
 * Validează parametrii de cerere
 * @param {Object} params - Parametrii de validat
 * @param {Array} requiredParams - Parametrii obligatorii
 * @param {Object} validators - Funcții de validare personalizate
 * @returns {Object} Parametrii validați
 */
export function validateParams(params = {}, requiredParams = [], validators = {}) {
  const validatedParams = { ...params };

  // Verifică parametrii obligatorii
  requiredParams.forEach(param => {
    if (validatedParams[param] === undefined || validatedParams[param] === null) {
      throw new Error(`Required parameter '${param}' is missing`);
    }
  });

  // Aplică validatori personalizați
  Object.entries(validators).forEach(([param, validator]) => {
    if (validatedParams[param] !== undefined && validatedParams[param] !== null) {
      const validationResult = validator(validatedParams[param]);
      if (validationResult !== true) {
        throw new Error(`Validation failed for parameter '${param}': ${validationResult}`);
      }
    }
  });

  return validatedParams;
}

/**
 * Formatează body-ul pentru cereri POST/PUT
 * @param {Object} data - Datele de formatat
 * @param {string} format - Formatul dorit ('json', 'form-data', 'urlencoded')
 * @returns {Object|FormData|string} Body-ul formatat
 */
export function formatBody(data, format = 'json') {
  if (!data) {
    return null;
  }

  switch (format) {
    case 'json':
      return JSON.stringify(data);
    
    case 'form-data':
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      return formData;
    
    case 'urlencoded':
      return new URLSearchParams(data).toString();
    
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Construiește o cerere HTTP completă
 * @param {Object} config - Configurația cererii
 * @returns {Object} Configurația completă a cererii
 */
export function buildRequest(config) {
  const {
    method = 'GET',
    url,
    params = {},
    headers = {},
    body = null,
    token = null,
    tenantId = null,
    locationId = null,
    format = 'json'
  } = config;

  // Construiește URL-ul
  const fullUrl = buildUrl(url, params);

  // Construiește headers-urile
  const fullHeaders = buildHeaders(headers, token, tenantId, locationId);

  // Formatează body-ul
  const formattedBody = body ? formatBody(body, format) : null;

  return {
    method: method.toUpperCase(),
    url: fullUrl,
    headers: fullHeaders,
    body: formattedBody
  };
}

/**
 * Utilitare pentru construirea de cereri specifice
 */
export const requestUtils = {
  /**
   * Construiește o cerere GET
   */
  get: (url, params = {}, headers = {}) => 
    buildRequest({ method: 'GET', url, params, headers }),

  /**
   * Construiește o cerere POST
   */
  post: (url, body = {}, headers = {}, format = 'json') => 
    buildRequest({ method: 'POST', url, body, headers, format }),

  /**
   * Construiește o cerere PUT
   */
  put: (url, body = {}, headers = {}, format = 'json') => 
    buildRequest({ method: 'PUT', url, body, headers, format }),

  /**
   * Construiește o cerere DELETE
   */
  delete: (url, headers = {}) => 
    buildRequest({ method: 'DELETE', url, headers })
};

export default {
  buildUrl,
  buildHeaders,
  validateParams,
  formatBody,
  buildRequest,
  requestUtils
}; 