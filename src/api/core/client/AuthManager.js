/**
 * AuthManager - Manager pentru autentificare și gestionarea token-urilor
 * Gestionează JWT tokens, refresh tokens și validarea lor
 */

export default class AuthManager {
  constructor(config = {}) {
    this.baseURL = config.baseURL;
    this.refreshThreshold = config.refreshThreshold || 5 * 60 * 1000; // 5 minute
    
    // Token storage
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    
    // Callbacks
    this.onTokenRefresh = null;
    this.onTokenExpired = null;
    this.onAuthError = null;
    
    // User info
    this.userInfo = null;
    this.roles = [];
    this.permissions = [];
    
    // Load tokens from storage
    this.loadTokensFromStorage();
  }

  /**
   * Setează token-urile
   */
  setTokens(accessToken, refreshToken = null, expiry = null) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = expiry || this.calculateExpiry(accessToken);
    
    // Parse user info from token
    this.parseTokenClaims(accessToken);
    
    // Save to storage
    this.saveTokensToStorage();
  }

  /**
   * Obține header-ul de autentificare
   */
  getAuthHeader() {
    if (!this.accessToken) return null;
    
    // Check if token needs refresh
    if (this.shouldRefreshToken()) {
      this.refreshAuthToken();
    }
    
    return `Bearer ${this.accessToken}`;
  }

  /**
   * Verifică dacă token-ul trebuie refresh-uit
   */
  shouldRefreshToken() {
    if (!this.tokenExpiry || !this.refreshToken) return false;
    
    const now = Date.now();
    const timeUntilExpiry = this.tokenExpiry - now;
    
    return timeUntilExpiry <= this.refreshThreshold;
  }

  /**
   * Refresh token-ul de acces
   */
  async refreshAuthToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('Refresh token failed');
      }

      const data = await response.json();
      
      // Update tokens
      this.setTokens(data.accessToken, data.refreshToken, data.expiry);
      
      // Call callback
      if (this.onTokenRefresh) {
        this.onTokenRefresh(data.accessToken);
      }
      
      return data.accessToken;
    } catch (error) {
      // Clear tokens on refresh failure
      this.clearTokens();
      
      // Call error callback
      if (this.onAuthError) {
        this.onAuthError(error);
      }
      
      throw error;
    }
  }

  /**
   * Autentificare cu email și parolă
   */
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Set tokens
      this.setTokens(data.accessToken, data.refreshToken, data.expiry);
      
      return data;
    } catch (error) {
      if (this.onAuthError) {
        this.onAuthError(error);
      }
      throw error;
    }
  }

  /**
   * Logout
   */
  async logout() {
    try {
      // Call logout endpoint if token exists
      if (this.accessToken) {
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Clear tokens regardless of logout success
      this.clearTokens();
    }
  }

  /**
   * Verifică dacă utilizatorul este autentificat
   */
  isAuthenticated() {
    return !!this.accessToken && !this.isTokenExpired();
  }

  /**
   * Verifică dacă token-ul a expirat
   */
  isTokenExpired() {
    if (!this.tokenExpiry) return true;
    return Date.now() >= this.tokenExpiry;
  }

  /**
   * Parse token claims
   */
  parseTokenClaims(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      this.userInfo = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        businessType: payload.businessType
      };
      
      this.roles = Array.isArray(payload.roles) ? payload.roles : [];
      this.permissions = Array.isArray(payload.permissions) ? payload.permissions : [];
      
      return payload;
    } catch (error) {
      console.warn('Failed to parse token claims:', error);
      // Set default empty arrays
      this.roles = [];
      this.permissions = [];
      return null;
    }
  }

  /**
   * Verifică dacă utilizatorul are un rol specific
   */
  hasRole(role) {
    return Array.isArray(this.roles) && this.roles.includes(role);
  }

  /**
   * Verifică dacă utilizatorul are o permisiune specifică
   */
  hasPermission(permission) {
    return Array.isArray(this.permissions) && this.permissions.includes(permission);
  }

  /**
   * Obține informațiile utilizatorului
   */
  getUserInfo() {
    return this.userInfo;
  }

  /**
   * Obține rolurile utilizatorului
   */
  getRoles() {
    return Array.isArray(this.roles) ? [...this.roles] : [];
  }

  /**
   * Obține permisiunile utilizatorului
   */
  getPermissions() {
    return Array.isArray(this.permissions) ? [...this.permissions] : [];
  }

  /**
   * Calculează expirarea token-ului
   */
  calculateExpiry(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.warn('Failed to calculate token expiry:', error);
      return null;
    }
  }

  /**
   * Salvează token-urile în storage
   */
  saveTokensToStorage() {
    try {
      const tokens = {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        tokenExpiry: this.tokenExpiry,
        userInfo: this.userInfo,
        roles: this.roles,
        permissions: this.permissions
      };
      
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    } catch (error) {
      console.warn('Failed to save tokens to storage:', error);
    }
  }

  /**
   * Încarcă token-urile din storage
   */
  loadTokensFromStorage() {
    try {
      const tokensData = localStorage.getItem('auth_tokens');
      if (!tokensData) return;
      
      const tokens = JSON.parse(tokensData);
      
      // Check if tokens are still valid
      if (tokens.tokenExpiry && Date.now() < tokens.tokenExpiry) {
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
        this.tokenExpiry = tokens.tokenExpiry;
        this.userInfo = tokens.userInfo;
        this.roles = Array.isArray(tokens.roles) ? tokens.roles : [];
        this.permissions = Array.isArray(tokens.permissions) ? tokens.permissions : [];
      } else {
        // Clear expired tokens
        this.clearTokens();
      }
    } catch (error) {
      console.warn('Failed to load tokens from storage:', error);
      this.clearTokens();
    }
  }

  /**
   * Șterge token-urile
   */
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.userInfo = null;
    this.roles = [];
    this.permissions = [];
    
    // Remove from storage
    localStorage.removeItem('auth_tokens');
    
    // Call expired callback
    if (this.onTokenExpired) {
      this.onTokenExpired();
    }
  }

  /**
   * Setează callback pentru refresh token
   */
  setOnTokenRefresh(callback) {
    this.onTokenRefresh = callback;
  }

  /**
   * Setează callback pentru token expirat
   */
  setOnTokenExpired(callback) {
    this.onTokenExpired = callback;
  }

  /**
   * Setează callback pentru erori de autentificare
   */
  setOnAuthError(callback) {
    this.onAuthError = callback;
  }
} 