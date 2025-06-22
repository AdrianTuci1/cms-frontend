/**
 * Authentication Types and Interfaces
 * Defines types for OAuth authentication flow
 */

/**
 * Authentication Types for External OAuth System
 * Manages tokens received from external authentication host
 */

/**
 * OAuth Configuration for External Auth
 */
export const OAUTH_CONFIG = {
  // Token storage
  TOKEN_STORAGE_KEY: 'external_oauth_tokens',
  USER_STORAGE_KEY: 'external_oauth_user',
  STATE_STORAGE_KEY: 'external_oauth_state',
  
  // Token refresh
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  
  // External auth host
  EXTERNAL_AUTH_HOST: import.meta.env.VITE_EXTERNAL_AUTH_HOST || 'https://auth.simplu.io',
  
  // Redirect URI (where external auth will redirect back)
  REDIRECT_URI: import.meta.env.VITE_AUTH_REDIRECT_URI || 'http://localhost:5173/callback',
  
  // API server for validation
  API_SERVER: import.meta.env.VITE_API_SERVER || 'http://localhost:3001',
};

/**
 * Gateway Callback Parameters
 */
export const GATEWAY_CALLBACK_PARAMS = {
  auth_status: '',
  auth_token: '',
  state: '',
  error: '',
  error_description: '',
};

/**
 * Gateway Token Structure (base64 decoded)
 */
export const GatewayToken = {
  userId: '',
  timestamp: 0,
  code: '',
};

/**
 * Gateway Validation Request
 */
export const GatewayValidationRequest = {
  userId: '',
  code: '',
};

/**
 * Gateway Validation Response
 */
export const GatewayValidationResponse = {
  success: false,
  user: null,
  tokens: null,
  error: '',
};

/**
 * OAuth Flow States
 */
export const OAUTH_STATES = {
  INITIAL: 'initial',
  WAITING_CALLBACK: 'waiting_callback',
  PROCESSING_CALLBACK: 'processing_callback',
  VALIDATING_WITH_GATEWAY: 'validating_with_gateway',
  AUTHENTICATED: 'authenticated',
  REFRESHING: 'refreshing',
  ERROR: 'error',
  LOGGED_OUT: 'logged_out',
};

/**
 * OAuth Error Types
 */
export const OAUTH_ERROR_TYPES = {
  INVALID_STATE: 'invalid_state',
  INVALID_CODE: 'invalid_code',
  INVALID_AUTH_TOKEN: 'invalid_auth_token',
  GATEWAY_VALIDATION_FAILED: 'gateway_validation_failed',
  TOKEN_REQUEST_FAILED: 'token_request_failed',
  REFRESH_FAILED: 'refresh_failed',
  NETWORK_ERROR: 'network_error',
  INVALID_TOKEN: 'invalid_token',
  EXPIRED_TOKEN: 'expired_token',
  UNAUTHORIZED: 'unauthorized',
  SERVER_ERROR: 'server_error',
};

/**
 * OAuth Token Response (from external auth)
 */
export const OAuthTokenResponse = {
  access_token: '',
  token_type: '',
  expires_in: 0,
  refresh_token: '',
  scope: '',
  id_token: '',
};

/**
 * OAuth Token Data (received from external auth)
 */
export const OAuthTokenData = {
  accessToken: '',
  tokenType: '',
  expiresAt: 0,
  refreshToken: '',
  scope: '',
  idToken: '',
  tenantId: null,
  locationId: null,
  businessType: '',
  userId: null,
  userEmail: '',
  userName: '',
};

/**
 * OAuth Authorization Request
 */
export const OAuthAuthRequest = {
  client_id: '',
  redirect_uri: '',
  response_type: '',
  scope: '',
  state: '',
  code_challenge: '',
  code_challenge_method: '',
};

/**
 * OAuth Token Request
 */
export const OAuthTokenRequest = {
  client_id: '',
  client_secret: '',
  grant_type: '',
  code: '',
  redirect_uri: '',
  code_verifier: '',
};

/**
 * OAuth Refresh Request
 */
export const OAuthRefreshRequest = {
  client_id: '',
  client_secret: '',
  grant_type: 'refresh_token',
  refresh_token: '',
};

/**
 * OAuth Callback Parameters (from URL)
 */
export const OAuthCallbackParams = {
  code: '',
  state: '',
  error: '',
  error_description: '',
};

/**
 * OAuth Error Response
 */
export const OAuthErrorResponse = {
  error: '',
  error_description: '',
  error_uri: '',
};

/**
 * OAuth User Info (received from external auth)
 */
export const OAuthUserInfo = {
  id: null,
  email: '',
  name: '',
  avatar: '',
  tenantId: null,
  locationId: null,
  businessType: '',
  roles: [],
  permissions: [],
};

/**
 * User Location Data (for multiple locations per user)
 */
export const UserLocationData = {
  locationId: '',
  locationName: '',
  businessType: '',
  roles: [],
  permissions: [],
  isActive: true,
};

/**
 * Sign-In Data Structure
 */
export const SignInData = {
  userData: {
    userId: '',
    email: '',
    name: '',
    avatar: '',
    businessType: '',
    roles: [],
    permissions: [],
  },
  userLocationData: [], // Array of UserLocationData
  tokens: {
    accessToken: '',
    expiresAt: 0,
    refreshToken: '',
    scope: '',
    idToken: '',
  },
};

/**
 * Authentication State
 */
export const AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  tokens: null,
  error: null,
  state: 'initial',
};

/**
 * Authentication Events
 */
export const AUTH_EVENTS = {
  AUTH_STATE_CHANGED: 'auth_state_changed',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_ERROR: 'login_error',
  LOGOUT_SUCCESS: 'logout_success',
  TOKEN_REFRESHED: 'token_refreshed',
  REFRESH_FAILED: 'refresh_failed',
  GATEWAY_VALIDATION_SUCCESS: 'gateway_validation_success',
  GATEWAY_VALIDATION_ERROR: 'gateway_validation_error',
  SIGNIN_SUCCESS: 'signin_success',
  SIGNIN_ERROR: 'signin_error',
  LOCATION_CHANGED: 'location_changed',
};

/**
 * Authentication Methods
 */
export const AUTH_METHODS = {
  OAUTH: 'oauth',
  GOOGLE: 'google',
  MICROSOFT: 'microsoft',
  APPLE: 'apple',
  CUSTOM: 'custom',
  GATEWAY: 'gateway',
};

/**
 * PKCE (Proof Key for Code Exchange) Configuration
 */
export const PKCEConfig = {
  codeVerifier: '',
  codeChallenge: '',
  codeChallengeMethod: 'S256',
};

/**
 * OAuth Provider Configuration
 */
export const OAuthProviderConfig = {
  name: '',
  authorizationUrl: '',
  tokenUrl: '',
  revokeUrl: '',
  clientId: '',
  clientSecret: '',
  redirectUri: '',
  scopes: [],
  responseType: '',
  grantType: '',
  usePKCE: false,
};

/**
 * Authentication Configuration
 */
export const AuthConfig = {
  providers: {},
  defaultProvider: '',
  tokenStorage: 'localStorage',
  autoRefresh: true,
  refreshThreshold: OAUTH_CONFIG.REFRESH_THRESHOLD,
  enablePKCE: true,
  enableStateValidation: true,
  enableLogging: false,
};

/**
 * Token Validation Result
 */
export const TokenValidationResult = {
  isValid: false,
  isExpired: false,
  expiresIn: 0,
  needsRefresh: false,
  error: '',
};

/**
 * Authentication Result
 */
export const AuthResult = {
  success: false,
  user: null,
  tokens: null,
  error: '',
  errorCode: '',
};

/**
 * Logout Options
 */
export const LogoutOptions = {
  revokeToken: false,
  clearStorage: true,
  redirectTo: '',
};

/**
 * Token Refresh Result
 */
export const TokenRefreshResult = {
  success: false,
  tokens: null,
  error: '',
};

/**
 * External Auth Configuration
 */
export const ExternalAuthConfig = {
  // External auth host
  authHost: OAUTH_CONFIG.EXTERNAL_AUTH_HOST,
  
  // Redirect URI
  redirectUri: OAUTH_CONFIG.REDIRECT_URI,
  
  // API server for gateway validation
  apiServer: OAUTH_CONFIG.API_SERVER,
  
  // Token storage
  tokenStorage: 'localStorage', // 'localStorage' | 'sessionStorage' | 'memory'
  
  // Auto refresh
  autoRefresh: true,
  refreshThreshold: OAUTH_CONFIG.REFRESH_THRESHOLD,
  
  // Validation
  validateTokens: true,
  validateState: true,
  
  // Logging
  enableLogging: false,
  logLevel: 'info', // 'debug' | 'info' | 'warn' | 'error'
};

/**
 * Authentication Options
 */
export const AuthOptions = {
  provider: '',
  scopes: [],
  state: '',
  prompt: '',
  loginHint: '',
  domainHint: '',
};

/**
 * OAuth Flow Configuration
 */
export const OAuthFlowConfig = {
  // Flow type
  flow: 'authorization_code', // 'authorization_code' | 'implicit' | 'client_credentials'
  
  // Security settings
  usePKCE: true,
  useState: true,
  
  // Token settings
  autoRefresh: true,
  refreshThreshold: OAUTH_CONFIG.REFRESH_THRESHOLD,
  
  // Storage settings
  tokenStorage: 'localStorage',
  
  // Validation settings
  validateTokens: true,
  validateState: true,
  
  // Logging settings
  enableLogging: false,
  logLevel: 'info',
}; 