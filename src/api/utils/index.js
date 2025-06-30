/**
 * API Utils - Exporturi principale
 * 
 * Acest fișier exportă toate utilitarele din directorul utils
 * pentru a facilita importurile în alte părți ale aplicației.
 */
import requestBuilder from './requestBuilder.js';

// Request Builder
export * from './requestBuilder.js';
export { default as requestBuilder } from './requestBuilder.js';

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