import { 
  OAUTH_CONFIG, 
} from './types.js';

/**
 * OAuth Callback Handler
 * Handles OAuth callbacks from external authentication system
 */
class CallbackHandler {
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * Parse URL parameters from callback
   * @param {string} url - URL to parse
   * @returns {Object} Parsed parameters
   */
  parseCallbackUrl(url) {
    try {
      const urlObj = new URL(url);
      const params = {};

      // Parse hash fragment (for implicit flow)
      if (urlObj.hash) {
        const hashParams = new URLSearchParams(urlObj.hash.substring(1));
        for (const [key, value] of hashParams) {
          params[key] = value;
        }
      }

      // Parse query parameters (for authorization code flow)
      for (const [key, value] of urlObj.searchParams) {
        params[key] = value;
      }

      return params;
    } catch (error) {
      throw new Error('Invalid callback URL');
    }
  }

  /**
   * Handle OAuth callback
   * @param {string} url - Callback URL
   * @returns {Promise<Object>} Authentication result
   */
  async handleCallback(url) {
    try {
      // Parse callback parameters
      const callbackParams = this.parseCallbackUrl(url);
      
      // Log callback details for debugging
      this.logCallbackDetails(callbackParams);
      
      // Check if this is a gateway callback
      if (this.isGatewayCallback(callbackParams)) {
        return await this.handleGatewayCallback(callbackParams);
      }
      
      // Handle traditional OAuth callback
      this.validateCallbackParams(callbackParams);
      const result = await this.authService.processCallback(callbackParams);
      
      return result;
    } catch (error) {
      throw new Error(`Callback handling failed: ${error.message}`);
    }
  }

  /**
   * Check if callback is from gateway
   * @param {Object} params - Callback parameters
   * @returns {boolean} True if gateway callback
   */
  isGatewayCallback(params) {
    return params.auth_status !== undefined || params.auth_token !== undefined;
  }

  /**
   * Handle gateway callback
   * @param {Object} params - Gateway callback parameters
   * @returns {Promise<Object>} Authentication result
   */
  async handleGatewayCallback(params) {
    try {
      // Check auth status
      if (params.auth_status !== 'success') {
        throw new Error(params.error_description || 'Authentication failed');
      }

      // Validate required parameters
      if (!params.auth_token) {
        throw new Error('No auth token received from gateway');
      }

      // Validate state parameter
      if (this.authService.config.validateState && params.state) {
        const savedState = this.authService.loadFromStorage(OAUTH_CONFIG.STATE_STORAGE_KEY);
        if (savedState && params.state !== savedState) {
          throw new Error('Invalid state parameter');
        }
      }

      // Decode and validate auth token
      const gatewayToken = this.decodeGatewayToken(params.auth_token);
      if (!gatewayToken) {
        throw new Error('Invalid auth token format');
      }

      // Validate with gateway
      const validationResult = await this.validateWithGateway(gatewayToken);
      
      if (!validationResult.success) {
        throw new Error(validationResult.error || 'Gateway validation failed');
      }

      // Process successful validation
      await this.authService.handleGatewayValidation(validationResult);

      return {
        success: true,
        user: validationResult.user,
        tokens: validationResult.tokens
      };

    } catch (error) {
      throw new Error(`Gateway callback handling failed: ${error.message}`);
    }
  }

  /**
   * Decode gateway auth token (base64)
   * @param {string} authToken - Base64 encoded auth token
   * @returns {Object|null} Decoded token or null if invalid
   */
  decodeGatewayToken(authToken) {
    try {
      // Decode base64
      const decodedString = atob(authToken);
      const tokenData = JSON.parse(decodedString);
      
      // Validate token structure
      if (!tokenData.userId || !tokenData.timestamp) {
        return null;
      }

      return {
        userId: tokenData.userId,
        timestamp: tokenData.timestamp,
        code: tokenData.code || ''
      };
    } catch (error) {
      this.authService.log('Failed to decode gateway token:', error);
      return null;
    }
  }

  /**
   * Validate with gateway
   * @param {Object} gatewayToken - Decoded gateway token
   * @returns {Promise<Object>} Validation result
   */
  async validateWithGateway(gatewayToken) {
    try {
      this.authService.emit('gateway_validation_started', { userId: gatewayToken.userId });

      // Extract tenant ID from userId if needed
      const tenantId = this.extractTenantId(gatewayToken.userId);
      
      // Prepare validation request
      const validationRequest = {
        userId: gatewayToken.userId,
        code: gatewayToken.code
      };

      // Make request to gateway
      const response = await fetch(`${this.authService.config.apiServer}/gateway/validate-client/${tenantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationRequest)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Gateway validation failed: ${response.status}`);
      }

      const validationResult = await response.json();
      
      if (validationResult.success) {
        this.authService.emit('gateway_validation_success', validationResult);
      } else {
        this.authService.emit('gateway_validation_error', validationResult);
      }

      return validationResult;

    } catch (error) {
      this.authService.emit('gateway_validation_error', { error: error.message });
      throw error;
    }
  }

  /**
   * Extract tenant ID from userId
   * @param {string} userId - User ID
   * @returns {string} Tenant ID (default: 'default')
   */
  extractTenantId(userId) {
    // This is a placeholder - implement based on your userId format
    // Example: if userId is "tenant1_user123", extract "tenant1"
    const match = userId.match(/^([^_]+)_(.+)$/);
    return match ? match[1] : 'default';
  }

  /**
   * Validate callback parameters
   * @param {Object} params - Callback parameters
   */
  validateCallbackParams(params) {
    // Check for error parameters
    if (params.error) {
      throw new Error(params.error_description || params.error);
    }

    // Check for required parameters
    if (!params.access_token && !params.code) {
      throw new Error('No access token or authorization code received');
    }

    // Validate state parameter if present
    if (params.state) {
      const savedState = this.authService.loadFromStorage(OAUTH_CONFIG.STATE_STORAGE_KEY);
      if (savedState && params.state !== savedState) {
        throw new Error('Invalid state parameter');
      }
    }
  }

  /**
   * Extract tokens from callback parameters
   * @param {Object} params - Callback parameters
   * @returns {Object} Token data
   */
  extractTokens(params) {
    if (params.access_token) {
      // Direct token response (implicit flow)
      return {
        access_token: params.access_token,
        token_type: params.token_type || 'Bearer',
        expires_in: params.expires_in ? parseInt(params.expires_in) : null,
        refresh_token: params.refresh_token || null,
        scope: params.scope || '',
        id_token: params.id_token || null,
        tenant_id: params.tenant_id || null,
        location_id: params.location_id || null,
        business_type: params.business_type || '',
        user_id: params.user_id || null,
        user_email: params.user_email || '',
        user_name: params.user_name || '',
        user_avatar: params.user_avatar || '',
        user_roles: params.user_roles ? JSON.parse(params.user_roles) : [],
        user_permissions: params.user_permissions ? JSON.parse(params.user_permissions) : [],
      };
    }

    return null;
  }

  /**
   * Handle callback from window location
   * @returns {Promise<Object>} Authentication result
   */
  async handleCurrentLocation() {
    return await this.handleCallback(window.location.href);
  }

  /**
   * Check if current URL is a callback
   * @returns {boolean} True if current URL is a callback
   */
  isCallbackUrl() {
    const url = window.location.href;
    const urlObj = new URL(url);
    
    // Check for callback indicators in pathname
    const pathname = urlObj.pathname;
    const isCallbackPath = pathname.includes('/callback') || 
                          pathname.includes('/auth/callback') ||
                          pathname === '/callback' ||
                          pathname === '/auth/callback';
    
    // Check for callback parameters
    const hasCallbackParams = urlObj.searchParams.has('access_token') ||
                             urlObj.searchParams.has('code') ||
                             urlObj.searchParams.has('error') ||
                             urlObj.searchParams.has('auth_status') ||
                             urlObj.searchParams.has('auth_token') ||
                             urlObj.hash.includes('access_token') ||
                             urlObj.hash.includes('code') ||
                             urlObj.hash.includes('error');
    
    return isCallbackPath || hasCallbackParams;
  }

  /**
   * Clean up callback URL
   * @param {string} redirectTo - URL to redirect to after cleanup
   */
  cleanupCallbackUrl(redirectTo = '/') {
    // Remove callback parameters from URL
    const url = new URL(window.location.href);
    
    // Clear search parameters
    url.search = '';
    
    // Clear hash fragment
    url.hash = '';
    
    // Update URL without page reload
    window.history.replaceState({}, document.title, url.pathname);
    
    // Redirect if specified
    if (redirectTo && redirectTo !== window.location.pathname) {
      window.location.href = redirectTo;
    }
  }

  /**
   * Generate state parameter for OAuth flow
   * @returns {string} State parameter
   */
  generateState() {
    const state = this.generateRandomString(32);
    this.authService.saveToStorage(OAUTH_CONFIG.STATE_STORAGE_KEY, state);
    return state;
  }

  /**
   * Generate random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Build OAuth authorization URL
   * @param {Object} options - Authorization options
   * @returns {string} Authorization URL
   */
  buildAuthorizationUrl(options = {}) {
    const {
      clientId = '',
      redirectUri = OAUTH_CONFIG.REDIRECT_URI,
      scope = 'read write offline_access',
      responseType = 'token',
      state = this.generateState(),
      prompt = '',
      loginHint = '',
      domainHint = ''
    } = options;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope: scope,
      state: state
    });

    if (prompt) params.append('prompt', prompt);
    if (loginHint) params.append('login_hint', loginHint);
    if (domainHint) params.append('domain_hint', domainHint);

    return `${this.authService.config.authHost}/oauth/authorize?${params.toString()}`;
  }

  /**
   * Redirect to external auth system
   * @param {Object} options - Authorization options
   */
  redirectToAuth(options = {}) {
    const authUrl = this.buildAuthorizationUrl(options);
    window.location.href = authUrl;
  }

  /**
   * Handle silent token refresh
   * @returns {Promise<Object>} Refresh result
   */
  async handleSilentRefresh() {
    try {
      if (!this.authService.tokens || !this.authService.tokens.refreshToken) {
        throw new Error('No refresh token available');
      }

      return await this.authService.refreshToken();
    } catch (error) {
      throw new Error(`Silent refresh failed: ${error.message}`);
    }
  }

  /**
   * Check if token refresh is needed
   * @returns {boolean} True if refresh is needed
   */
  isRefreshNeeded() {
    return this.authService.needsRefresh();
  }

  /**
   * Get callback error details
   * @param {Object} params - Callback parameters
   * @returns {Object} Error details
   */
  getCallbackError(params) {
    if (!params.error && params.auth_status !== 'error') {
      return null;
    }

    return {
      error: params.error || 'Authentication failed',
      errorDescription: params.error_description || '',
      errorUri: params.error_uri || '',
      state: params.state || ''
    };
  }

  /**
   * Log callback details (for debugging)
   * @param {Object} params - Callback parameters
   */
  logCallbackDetails(params) {
    if (this.authService.config.enableLogging) {
      console.log('[CallbackHandler] Callback parameters:', {
        isGatewayCallback: this.isGatewayCallback(params),
        authStatus: params.auth_status,
        hasAuthToken: !!params.auth_token,
        hasAccessToken: !!params.access_token,
        hasCode: !!params.code,
        hasError: !!params.error,
        state: params.state,
        scope: params.scope
      });
    }
  }
}

export default CallbackHandler; 