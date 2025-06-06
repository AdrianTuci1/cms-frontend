import * as sessionsApi from './sessionsApi';
import { v4 as uuidv4 } from 'uuid';

class SessionsService {
  constructor() {
    this.tenantId = import.meta.env.VITE_TENANT_ID || 'test-00001';
    this.userId = import.meta.env.VITE_USER_ID || 'user123';
    this.currentSessionId = null;
  }

  /**
   * Generate a unique session ID
   * @returns {string}
   */
  generateSessionId() {
    return uuidv4();
  }

  /**
   * Initialize a new session or get an existing active one
   * @returns {Promise<string>} The session ID
   */
  async initializeSession() {
    try {
      // First try to get active sessions
      const sessions = await this.loadSessions(1);
      const activeSession = sessions.find(session => session.isActive);

      if (activeSession) {
        this.currentSessionId = activeSession.id;
        console.log('Using existing session:', this.currentSessionId);
        return this.currentSessionId;
      }

      // Create a new session if no active session exists
      const sessionId = this.generateSessionId();
      await sessionsApi.createSession(this.tenantId, this.userId, sessionId);
      this.currentSessionId = sessionId;
      console.log('Created new session:', this.currentSessionId);
      return this.currentSessionId;
    } catch (error) {
      console.error('Error initializing session:', error);
      // Fallback to generated session ID if API fails
      this.currentSessionId = this.generateSessionId();
      console.log('Using fallback session:', this.currentSessionId);
      return this.currentSessionId;
    }
  }

  /**
   * Load sessions for the current user
   * @param {number} [limit=10] - Number of sessions to return
   * @param {string} [before] - ID of session for pagination
   * @returns {Promise<import('./sessionsTypes').Session[]>}
   */
  async loadSessions(limit = 10, before = null) {
    return sessionsApi.loadSessions({
      tenantId: this.tenantId,
      userId: this.userId,
      limit,
      before
    });
  }

  /**
   * Load a specific session
   * @param {string} sessionId
   * @returns {Promise<import('./sessionsTypes').Session>}
   */
  async loadSession(sessionId) {
    return sessionsApi.loadSession(this.tenantId, sessionId);
  }

  /**
   * Load messages for the current session
   * @param {number} [limit=20] - Number of messages to return
   * @param {string} [before] - ID of message for pagination
   * @returns {Promise<import('./sessionsTypes').Message[]>}
   */
  async loadMessages(limit = 20, before = null) {
    if (!this.currentSessionId) {
      throw new Error('No active session');
    }
    return sessionsApi.loadMessages({
      sessionId: this.currentSessionId,
      limit,
      before
    });
  }

  /**
   * Close the current session
   * @returns {Promise<void>}
   */
  async closeSession() {
    if (!this.currentSessionId) {
      return;
    }
    await sessionsApi.closeSession(this.tenantId, this.currentSessionId, this.userId);
    this.currentSessionId = null;
  }

  /**
   * Get the current session ID
   * @returns {string|null}
   */
  getCurrentSessionId() {
    return this.currentSessionId;
  }

  /**
   * Set the current session ID
   * @param {string} sessionId
   */
  setCurrentSessionId(sessionId) {
    this.currentSessionId = sessionId;
  }
}

export default new SessionsService(); 