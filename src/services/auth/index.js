import AuthService from './AuthService.js';
import CallbackHandler from './CallbackHandler.js';
import { 
  OAUTH_CONFIG, 
  OAUTH_STATES, 
  OAUTH_ERROR_TYPES,
  AUTH_EVENTS,
  AUTH_METHODS,
  ExternalAuthConfig
} from './types.js';

/**
 * Authentication Manager Singleton
 * Provides a unified interface for external OAuth authentication
 */
class AuthManager {
  constructor() {
    if (AuthManager.instance) {
      return AuthManager.instance;
    }
    
    this.authService = null;
    this.isInitialized = false;
    AuthManager.instance = this;
  }

  /**
   * Initialize authentication manager
   * @param {Object} config - Configuration options
   * @returns {Promise<Object>} Initialization result
   */
  async initialize(config = {}) {
    if (this.isInitialized) {
      return this.authService.getAuthState();
    }

    try {
      // Create auth service with configuration
      this.authService = new AuthService(config);
      
      // Initialize auth service
      const result = await this.authService.initialize();
      
      this.isInitialized = true;
      
      return result;
    } catch (error) {
      throw new Error(`AuthManager initialization failed: ${error.message}`);
    }
  }

  /**
   * Get authentication service instance
   * @returns {AuthService} Auth service instance
   */
  getAuthService() {
    if (!this.authService) {
      throw new Error('AuthManager not initialized. Call initialize() first.');
    }
    return this.authService;
  }

  /**
   * Get callback handler instance
   * @returns {CallbackHandler} Callback handler instance
   */
  getCallbackHandler() {
    return this.getAuthService().callbackHandler;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return this.getAuthService().isAuthenticated();
  }

  /**
   * Get current authentication state
   * @returns {Object} Authentication state
   */
  getAuthState() {
    return this.getAuthService().getAuthState();
  }

  /**
   * Get access token
   * @returns {string|null} Access token
   */
  getAccessToken() {
    return this.getAuthService().getAccessToken();
  }

  /**
   * Get authorization header
   * @returns {string|null} Authorization header
   */
  getAuthorizationHeader() {
    return this.getAuthService().getAuthorizationHeader();
  }

  /**
   * Get user information
   * @returns {Object|null} User information
   */
  getUser() {
    return this.getAuthService().user;
  }

  /**
   * Get tenant ID from environment variable
   * @returns {string} Tenant ID
   */
  getTenantId() {
    return this.getAuthService().getTenantId();
  }

  /**
   * Get current location ID
   * @returns {string|null} Current location ID
   */
  getCurrentLocationId() {
    return this.getAuthService().getCurrentLocationId();
  }

  /**
   * Get all available locations for the user
   * @returns {Array} Array of user location data
   */
  getUserLocations() {
    return this.getAuthService().getUserLocations();
  }

  /**
   * Set current location
   * @param {string} locationId - Location ID to set as current
   */
  setCurrentLocation(locationId) {
    return this.getAuthService().setCurrentLocation(locationId);
  }

  /**
   * Handle sign-in with location data
   * @param {Object} signInData - Sign-in data including user locations
   * @returns {Promise<Object>} Authentication result
   */
  async handleSignIn(signInData) {
    return await this.getAuthService().handleSignIn(signInData);
  }

  /**
   * Get tokens
   * @returns {Object|null} Tokens
   */
  getTokens() {
    return this.getAuthService().tokens;
  }

  /**
   * Handle OAuth callback
   * @returns {Promise<Object>} Authentication result
   */
  async handleCallback() {
    return await this.getAuthService().handleCallback();
  }

  /**
   * Refresh access token
   * @returns {Promise<Object>} Refresh result
   */
  async refreshToken() {
    return await this.getAuthService().refreshToken();
  }

  /**
   * Validate token with server
   * @returns {Promise<Object>} Validation result
   */
  async validateToken() {
    return await this.getAuthService().validateToken();
  }

  /**
   * Logout user
   * @param {Object} options - Logout options
   * @returns {Promise<Object>} Logout result
   */
  async logout(options = {}) {
    return await this.getAuthService().logout(options);
  }

  /**
   * Redirect to external auth system
   * @param {Object} options - Authorization options
   */
  redirectToAuth(options = {}) {
    this.getAuthService().redirectToAuth(options);
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    this.getAuthService().on(event, callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off(event, callback) {
    this.getAuthService().off(event, callback);
  }

  /**
   * Check if current URL is a callback
   * @returns {boolean} True if callback URL
   */
  isCallbackUrl() {
    return this.getCallbackHandler().isCallbackUrl();
  }

  /**
   * Clean up callback URL
   * @param {string} redirectTo - URL to redirect to
   */
  cleanupCallbackUrl(redirectTo) {
    this.getCallbackHandler().cleanupCallbackUrl(redirectTo);
  }

  /**
   * Handle gateway validation result
   * @param {Object} validationResult - Gateway validation result
   */
  async handleGatewayValidation(validationResult) {
    return await this.getAuthService().handleGatewayValidation(validationResult);
  }

  /**
   * Destroy authentication manager
   */
  destroy() {
    if (this.authService) {
      this.authService.destroy();
      this.authService = null;
    }
    this.isInitialized = false;
  }
}

// Create singleton instance
const authManager = new AuthManager();

// Export singleton instance and classes
export default authManager;
export { AuthService, CallbackHandler, AuthManager };
export {
  OAUTH_CONFIG,
  OAUTH_STATES,
  OAUTH_ERROR_TYPES,
  AUTH_EVENTS,
  AUTH_METHODS,
  ExternalAuthConfig
}; 