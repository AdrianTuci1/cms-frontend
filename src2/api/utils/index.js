/**
 * API Utils - Exporturi principale
 * 
 * Acest fișier exportă toate utilitarele din directorul utils
 * pentru a facilita importurile în alte părți ale aplicației.
 */

// Request Builder
export {
  buildUrl,
  buildHeaders,
  validateParams,
  formatBody,
  buildRequest,
  requestUtils
} from './requestBuilder.js';

// Importuri pentru exportare ca default
import requestBuilder from './requestBuilder.js';

/**
 * Export default care combină toate utilitarele
 */
const apiUtils = {
  // Request Builder
  ...requestBuilder,
  
  // Grupuri de utilitare pentru organizare
  request: requestBuilder
};

export default apiUtils; 