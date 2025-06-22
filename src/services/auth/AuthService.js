import { 
  OAUTH_CONFIG, 
  OAUTH_STATES, 
  OAUTH_ERROR_TYPES,
  AUTH_EVENTS,
  OAuthTokenData,
  OAuthUserInfo,
  AuthState,
  TokenValidationResult,
  AuthResult,
  TokenRefreshResult
} from './types.js';
import CallbackHandler from './CallbackHandler.js';

/**
 * Authentication Service
 * Manages OAuth tokens and user authentication state
 */
class AuthService {
  constructor(config = {}) {
    this.config = {
      ...OAUTH_CONFIG,
      ...config
    };
    
    this.state = OAUTH_STATES.INITIAL;
    this.tokens = null;
    this.user = null;
    this.userLocations = []; // Array of available locations for the user
    this.currentLocationId = null; // Currently selected location
    this.error = null;
    this.eventListeners = new Map();
    
    // Get tenantId from environment variable
    this.tenantId = import.meta.env.VITE_TENANT_ID || 'test-00001';
    
    // Initialize callback handler
    this.callbackHandler = new CallbackHandler(this);
    
    // Load existing tokens on initialization
    this.loadTokens();
    
    // Set up auto-refresh if enabled
    if (this.config.autoRefresh) {
      this.setupAutoRefresh();
    }
  }

  /**
   * Get tenant ID from environment variable
   * @returns {string} Tenant ID
   */
  getTenantId() {
    return this.tenantId;
  }

  /**
   * Get current location ID
   * @returns {string|null} Current location ID
   */
  getCurrentLocationId() {
    return this.currentLocationId;
  }

  /**
   * Get all available locations for the user
   * @returns {Array} Array of user location data
   */
  getUserLocations() {
    return this.userLocations;
  }

  /**
   * Set current location
   * @param {string} locationId - Location ID to set as current
   */
  setCurrentLocation(locationId) {
    if (this.userLocations.some(loc => loc.locationId === locationId)) {
      this.currentLocationId = locationId;
      this.saveUser();
      this.emit(AUTH_EVENTS.LOCATION_CHANGED, { locationId });
    } else {
      throw new Error(`Location ${locationId} not available for this user`);
    }
  }

  /**
   * Handle sign-in with location data
   * @param {Object} signInData - Sign-in data including user locations
   * @returns {Promise<AuthResult>} Authentication result
   */
  async handleSignIn(signInData) {
    try {
      const { userData, userLocationData } = signInData;
      
      if (!userData || !userLocationData) {
        throw new Error('Invalid sign-in data: missing userData or userLocationData');
      }

      // Store user locations
      this.userLocations = Array.isArray(userLocationData) ? userLocationData : [userLocationData];
      
      // Set first location as current if none selected
      if (!this.currentLocationId && this.userLocations.length > 0) {
        this.currentLocationId = this.userLocations[0].locationId;
      }

      // Create user object with general data
      this.user = {
        id: userData.userId,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        tenantId: this.tenantId, // From environment variable
        locationId: this.currentLocationId,
        businessType: userData.businessType,
        roles: userData.roles || [],
        permissions: userData.permissions || []
      };

      // Create tokens object
      this.tokens = {
        accessToken: signInData.tokens?.accessToken || 'signin_token',
        tokenType: 'Bearer',
        expiresAt: signInData.tokens?.expiresAt || (Date.now() + 3600000),
        refreshToken: signInData.tokens?.refreshToken || null,
        scope: signInData.tokens?.scope || 'read write',
        idToken: signInData.tokens?.idToken || null,
        tenantId: this.tenantId,
        locationId: this.currentLocationId,
        businessType: userData.businessType,
        userId: userData.userId,
        userEmail: userData.email,
        userName: userData.name
      };

      // Save tokens and user data
      this.saveTokens();
      this.saveUser();

      this.setState(OAUTH_STATES.AUTHENTICATED);
      this.emit(AUTH_EVENTS.SIGNIN_SUCCESS, {
        user: this.user,
        tokens: this.tokens,
        userLocations: this.userLocations
      });

      return {
        success: true,
        user: this.user,
        tokens: this.tokens,
        userLocations: this.userLocations
      };

    } catch (error) {
      this.setState(OAUTH_STATES.ERROR);
      this.error = error.message;
      this.emit(AUTH_EVENTS.SIGNIN_ERROR, { error: error.message });
      throw error;
    }
  }

  /**
   * Initialize authentication
   * @returns {Promise<AuthResult>} Initialization result
   */
  async initialize() {
    try {
      this.setState(OAUTH_STATES.WAITING_CALLBACK);
      
      // Check if we have valid tokens
      if (this.tokens && this.isTokenValid()) {
        this.setState(OAUTH_STATES.AUTHENTICATED);
        return {
          success: true,
          user: this.user,
          tokens: this.tokens
        };
      }
      
      // Check if we need to refresh tokens
      if (this.tokens && this.needsRefresh()) {
        return await this.refreshToken();
      }
      
      // Check if we're on a callback URL
      if (this.callbackHandler.isCallbackUrl()) {
        return await this.handleCallback();
      }
      
      this.setState(OAUTH_STATES.INITIAL);
      return {
        success: false,
        user: null,
        tokens: null
      };
      
    } catch (error) {
      this.setState(OAUTH_STATES.ERROR);
      this.error = error.message;
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Handle OAuth callback
   * @returns {Promise<AuthResult>} Authentication result
   */
  async handleCallback() {
    try {
      this.setState(OAUTH_STATES.PROCESSING_CALLBACK);
      
      const result = await this.callbackHandler.handleCurrentLocation();
      
      if (result.success) {
        this.setState(OAUTH_STATES.AUTHENTICATED);
        this.emit(AUTH_EVENTS.LOGIN_SUCCESS, result);
      }
      
      // Clean up callback URL
      this.callbackHandler.cleanupCallbackUrl();
      
      return result;
      
    } catch (error) {
      this.setState(OAUTH_STATES.ERROR);
      this.error = error.message;
      this.emit(AUTH_EVENTS.LOGIN_ERROR, { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Handle gateway validation result
   * @param {Object} validationResult - Gateway validation result
   */
  async handleGatewayValidation(validationResult) {
    try {
      // Extract user data
      const userData = validationResult.user;
      if (!userData) {
        throw new Error('No user data received from gateway');
      }

      // Create user object
      this.user = {
        id: userData.userId,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        tenantId: this.tenantId,
        locationId: this.currentLocationId,
        businessType: userData.businessType,
        roles: userData.roles || [],
        permissions: userData.permissions || []
      };

      // Create tokens object
      this.tokens = {
        accessToken: validationResult.tokens?.accessToken || 'gateway_token',
        tokenType: 'Bearer',
        expiresAt: validationResult.tokens?.expiresAt || (Date.now() + 3600000), // 1 hour default
        refreshToken: validationResult.tokens?.refreshToken || null,
        scope: validationResult.tokens?.scope || 'read write',
        idToken: validationResult.tokens?.idToken || null,
        tenantId: this.tenantId,
        locationId: this.currentLocationId,
        businessType: userData.businessType,
        userId: userData.userId,
        userEmail: userData.email,
        userName: userData.name
      };

      // Save tokens and user data
      this.saveTokens();
      this.saveUser();

      this.setState(OAUTH_STATES.AUTHENTICATED);
      this.emit(AUTH_EVENTS.GATEWAY_VALIDATION_SUCCESS, validationResult);

    } catch (error) {
      this.setState(OAUTH_STATES.ERROR);
      this.error = error.message;
      this.emit(AUTH_EVENTS.GATEWAY_VALIDATION_ERROR, { error: error.message });
      throw error;
    }
  }

  /**
   * Process OAuth callback parameters
   * @param {Object} params - Callback parameters
   * @returns {Promise<AuthResult>} Authentication result
   */
  async processCallback(params) {
    try {
      // Extract tokens from callback
      const tokenData = this.callbackHandler.extractTokens(params);
      
      if (!tokenData) {
        throw new Error('No token data received');
      }

      // Convert to internal format
      this.tokens = {
        accessToken: tokenData.access_token,
        tokenType: tokenData.token_type,
        expiresAt: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
        refreshToken: tokenData.refresh_token,
        scope: tokenData.scope,
        idToken: tokenData.id_token,
        tenantId: this.tenantId,
        locationId: this.currentLocationId,
        businessType: tokenData.business_type,
        userId: tokenData.user_id,
        userEmail: tokenData.user_email,
        userName: tokenData.user_name
      };

      // Create user object
      this.user = {
        id: tokenData.user_id,
        email: tokenData.user_email,
        name: tokenData.user_name,
        avatar: tokenData.user_avatar,
        tenantId: this.tenantId,
        locationId: this.currentLocationId,
        businessType: tokenData.business_type,
        roles: tokenData.user_roles || [],
        permissions: tokenData.user_permissions || []
      };

      // Save tokens and user data
      this.saveTokens();
      this.saveUser();

      return {
        success: true,
        user: this.user,
        tokens: this.tokens
      };

    } catch (error) {
      throw new Error(`Token processing failed: ${error.message}`);
    }
  }

  /**
   * Refresh access token
   * @returns {Promise<TokenRefreshResult>} Refresh result
   */
  async refreshToken() {
    try {
      this.setState(OAUTH_STATES.REFRESHING);
      
      if (!this.tokens || !this.tokens.refreshToken) {
        throw new Error('No refresh token available');
      }

      // Make refresh request
      const response = await fetch(`${this.config.apiServer}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: this.tokens.refreshToken,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const refreshData = await response.json();
      
      // Update tokens
      this.tokens = {
        ...this.tokens,
        accessToken: refreshData.access_token,
        expiresAt: refreshData.expires_in ? Date.now() + (refreshData.expires_in * 1000) : this.tokens.expiresAt,
        refreshToken: refreshData.refresh_token || this.tokens.refreshToken
      };

      // Save updated tokens
      this.saveTokens();
      
      this.setState(OAUTH_STATES.AUTHENTICATED);
      this.emit(AUTH_EVENTS.TOKEN_REFRESHED, this.tokens);

      return {
        success: true,
        tokens: this.tokens
      };

    } catch (error) {
      this.setState(OAUTH_STATES.ERROR);
      this.error = error.message;
      this.emit(AUTH_EVENTS.REFRESH_FAILED, { error: error.message });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Logout user
   * @param {Object} options - Logout options
   * @returns {Promise<AuthResult>} Logout result
   */
  async logout(options = {}) {
    try {
      const { revokeToken = false, clearStorage = true, redirectTo = '/' } = options;

      // Revoke token if requested
      if (revokeToken && this.tokens?.accessToken) {
        try {
          await fetch(`${this.config.apiServer}/auth/revoke`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: this.tokens.accessToken
            })
          });
        } catch (error) {
          this.log('Token revocation failed:', error);
        }
      }

      // Clear authentication state
      this.clearAuthState();

      // Clear storage if requested
      if (clearStorage) {
        this.clearStorage();
      }

      this.setState(OAUTH_STATES.LOGGED_OUT);
      this.emit(AUTH_EVENTS.LOGOUT_SUCCESS);

      // Redirect if specified
      if (redirectTo) {
        window.location.href = redirectTo;
      }

      return {
        success: true
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get current authentication state
   * @returns {AuthState} Current auth state
   */
  getAuthState() {
    return {
      isAuthenticated: this.isAuthenticated(),
      isLoading: this.state === OAUTH_STATES.PROCESSING_CALLBACK || this.state === OAUTH_STATES.REFRESHING,
      user: this.user,
      tokens: this.tokens,
      error: this.error,
      state: this.state
    };
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return this.state === OAUTH_STATES.AUTHENTICATED && 
           this.tokens && 
           this.isTokenValid();
  }

  /**
   * Check if token is valid
   * @returns {boolean} True if token is valid
   */
  isTokenValid() {
    if (!this.tokens || !this.tokens.accessToken) {
      return false;
    }

    // Check if token is expired
    if (this.tokens.expiresAt && Date.now() >= this.tokens.expiresAt) {
      return false;
    }

    return true;
  }

  /**
   * Check if token needs refresh
   * @returns {boolean} True if refresh is needed
   */
  needsRefresh() {
    if (!this.tokens || !this.tokens.expiresAt) {
      return false;
    }

    const timeUntilExpiry = this.tokens.expiresAt - Date.now();
    return timeUntilExpiry <= this.config.refreshThreshold;
  }

  /**
   * Validate token with server
   * @returns {Promise<TokenValidationResult>} Validation result
   */
  async validateToken() {
    try {
      if (!this.tokens || !this.tokens.accessToken) {
        return {
          isValid: false,
          isExpired: false,
          expiresIn: 0,
          needsRefresh: false,
          error: 'No token available'
        };
      }

      const response = await fetch(`${this.config.apiServer}/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.tokens.accessToken}`
        }
      });

      if (!response.ok) {
        return {
          isValid: false,
          isExpired: response.status === 401,
          expiresIn: 0,
          needsRefresh: false,
          error: `Token validation failed: ${response.status}`
        };
      }

      const validationData = await response.json();
      
      return {
        isValid: validationData.valid,
        isExpired: validationData.expired || false,
        expiresIn: validationData.expiresIn || 0,
        needsRefresh: validationData.needsRefresh || false,
        error: validationData.error || ''
      };

    } catch (error) {
      return {
        isValid: false,
        isExpired: false,
        expiresIn: 0,
        needsRefresh: false,
        error: error.message
      };
    }
  }

  /**
   * Get access token for API requests
   * @returns {string|null} Access token
   */
  getAccessToken() {
    if (this.isTokenValid()) {
      return this.tokens.accessToken;
    }
    return null;
  }

  /**
   * Get authorization header
   * @returns {string|null} Authorization header
   */
  getAuthorizationHeader() {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * Redirect to external auth system
   * @param {Object} options - Authorization options
   */
  redirectToAuth(options = {}) {
    this.callbackHandler.redirectToAuth(options);
  }

  /**
   * Set authentication state
   * @param {string} state - New state
   */
  setState(state) {
    this.state = state;
    this.emit(AUTH_EVENTS.AUTH_STATE_CHANGED, this.getAuthState());
  }

  /**
   * Clear authentication state
   */
  clearAuthState() {
    this.state = OAUTH_STATES.INITIAL;
    this.tokens = null;
    this.user = null;
    this.error = null;
  }

  /**
   * Save tokens to storage
   */
  saveTokens() {
    if (this.tokens) {
      this.saveToStorage(OAUTH_CONFIG.TOKEN_STORAGE_KEY, this.tokens);
    }
  }

  /**
   * Load tokens from storage
   */
  loadTokens() {
    const tokens = this.loadFromStorage(OAUTH_CONFIG.TOKEN_STORAGE_KEY);
    if (tokens) {
      this.tokens = tokens;
    }
  }

  /**
   * Save user to storage
   */
  saveUser() {
    if (this.user) {
      this.saveToStorage(OAUTH_CONFIG.USER_STORAGE_KEY, this.user);
    }
  }

  /**
   * Load user from storage
   */
  loadUser() {
    const user = this.loadFromStorage(OAUTH_CONFIG.USER_STORAGE_KEY);
    if (user) {
      this.user = user;
    }
  }

  /**
   * Save data to storage
   * @param {string} key - Storage key
   * @param {any} data - Data to save
   */
  saveToStorage(key, data) {
    try {
      const storage = this.getStorage();
      storage.setItem(key, JSON.stringify(data));
    } catch (error) {
      this.log('Failed to save to storage:', error);
    }
  }

  /**
   * Load data from storage
   * @param {string} key - Storage key
   * @returns {any} Loaded data
   */
  loadFromStorage(key) {
    try {
      const storage = this.getStorage();
      const data = storage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.log('Failed to load from storage:', error);
      return null;
    }
  }

  /**
   * Clear storage
   */
  clearStorage() {
    try {
      const storage = this.getStorage();
      storage.removeItem(OAUTH_CONFIG.TOKEN_STORAGE_KEY);
      storage.removeItem(OAUTH_CONFIG.USER_STORAGE_KEY);
      storage.removeItem(OAUTH_CONFIG.STATE_STORAGE_KEY);
    } catch (error) {
      this.log('Failed to clear storage:', error);
    }
  }

  /**
   * Get storage object
   * @returns {Storage} Storage object
   */
  getStorage() {
    switch (this.config.tokenStorage) {
      case 'sessionStorage':
        return sessionStorage;
      case 'localStorage':
      default:
        return localStorage;
    }
  }

  /**
   * Set up auto-refresh
   */
  setupAutoRefresh() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }

    this.autoRefreshInterval = setInterval(() => {
      if (this.needsRefresh() && this.isAuthenticated()) {
        this.refreshToken();
      }
    }, 60000); // Check every minute
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          this.log(`Event callback error for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Log message
   * @param {...any} args - Log arguments
   */
  log(...args) {
    if (this.config.enableLogging) {
      console.log('[AuthService]', ...args);
    }
  }

  /**
   * Destroy service
   */
  destroy() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
    this.eventListeners.clear();
  }
}

export default AuthService; 