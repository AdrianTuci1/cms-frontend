/**
 * DataSyncInitializer - Inițializator pentru integrarea API cu Design Patterns
 * Configurează toate resursele și serviciile la pornirea aplicației
 * Updated pentru noua structură API din requests.md
 */

import dataSyncManager from '../data-sync/index.js';
import { StrategyRegistry } from '../strategy/base/StrategyRegistry';
import eventBus from '../observer/base/EventBus';

// Import strategii business
import DentalStrategy from '../../api/strategies/DentalStrategy';
import GymStrategy from '../../api/strategies/GymStrategy';
import HotelStrategy from '../../api/strategies/HotelStrategy';
import BaseStrategy from '../../api/strategies/BaseStrategy';

class DataSyncInitializer {
  constructor() {
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  /**
   * Inițializează toate serviciile și resursele
   * @param {Object} config - Configurația de inițializare
   */
  async initialize(config = {}) {
    if (this.isInitialized) {
      console.log('DataSyncInitializer already initialized');
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization(config);
    return this.initializationPromise;
  }

  /**
   * Efectuează inițializarea efectivă
   * @param {Object} config - Configurația
   */
  async performInitialization(config) {
    try {
      console.log('Starting DataSyncInitializer...');

      // 1. Înregistrează strategiile business
      await this.registerBusinessStrategies();

      // 2. Setează business type dacă este specificat
      if (config.businessType) {
        dataSyncManager.setBusinessType(config.businessType);
      }

      // 3. Setup event listeners pentru cross-feature communication
      await this.setupEventListeners();

      // 4. Inițializează WebSocket dacă este configurat
      if (config.websocketUrl) {
        await this.initializeWebSocket(config.websocketUrl);
      }

      // 5. Setup sync intervals
      this.setupSyncIntervals();

      this.isInitialized = true;
      console.log('DataSyncInitializer initialized successfully');

      // Emite eveniment de inițializare completă
      eventBus.emit('datasync:initialized', {
        timestamp: new Date().toISOString(),
        config
      });

    } catch (error) {
      console.error('DataSyncInitializer initialization failed:', error);
      eventBus.emit('datasync:init-failed', error);
      throw error;
    }
  }

  /**
   * Înregistrează strategiile business
   */
  async registerBusinessStrategies() {
    console.log('Registering business strategies...');

    // Înregistrează strategiile în ordinea de prioritate
    StrategyRegistry.register('base', BaseStrategy);
    StrategyRegistry.register('dental', DentalStrategy);
    StrategyRegistry.register('gym', GymStrategy);
    StrategyRegistry.register('hotel', HotelStrategy);

    console.log('Business strategies registered successfully');
  }

  /**
   * Setup event listeners pentru cross-feature communication
   */
  async setupEventListeners() {
    console.log('Setting up cross-feature event listeners...');

    // Timeline events
    eventBus.on('timeline:created', (data) => {
      console.log('Timeline created:', data);
      // Poate declanșa actualizări în alte componente
      eventBus.emit('dashboard:timeline-updated', data);
    });

    eventBus.on('timeline:updated', (data) => {
      console.log('Timeline updated:', data);
      eventBus.emit('dashboard:timeline-updated', data);
    });

    eventBus.on('timeline:deleted', (data) => {
      console.log('Timeline deleted:', data);
      eventBus.emit('dashboard:timeline-updated', data);
    });

    // Client events
    eventBus.on('clients:created', (data) => {
      console.log('Client created:', data);
      eventBus.emit('dashboard:clients-updated', data);
    });

    eventBus.on('clients:updated', (data) => {
      console.log('Client updated:', data);
      eventBus.emit('dashboard:clients-updated', data);
    });

    eventBus.on('clients:deleted', (data) => {
      console.log('Client deleted:', data);
      eventBus.emit('dashboard:clients-updated', data);
    });

    // Package events
    eventBus.on('packages:created', (data) => {
      console.log('Package created:', data);
      eventBus.emit('dashboard:packages-updated', data);
    });

    eventBus.on('packages:updated', (data) => {
      console.log('Package updated:', data);
      eventBus.emit('dashboard:packages-updated', data);
    });

    eventBus.on('packages:deleted', (data) => {
      console.log('Package deleted:', data);
      eventBus.emit('dashboard:packages-updated', data);
    });

    // Member events
    eventBus.on('members:created', (data) => {
      console.log('Member created:', data);
      eventBus.emit('dashboard:members-updated', data);
    });

    eventBus.on('members:updated', (data) => {
      console.log('Member updated:', data);
      eventBus.emit('dashboard:members-updated', data);
    });

    eventBus.on('members:deleted', (data) => {
      console.log('Member deleted:', data);
      eventBus.emit('dashboard:members-updated', data);
    });

    // Invoice events
    eventBus.on('invoices:created', (data) => {
      console.log('Invoice created:', data);
      eventBus.emit('dashboard:invoices-updated', data);
    });

    eventBus.on('invoices:updated', (data) => {
      console.log('Invoice updated:', data);
      eventBus.emit('dashboard:invoices-updated', data);
    });

    eventBus.on('invoices:deleted', (data) => {
      console.log('Invoice deleted:', data);
      eventBus.emit('dashboard:invoices-updated', data);
    });

    // Stock events
    eventBus.on('stocks:created', (data) => {
      console.log('Stock created:', data);
      eventBus.emit('dashboard:stocks-updated', data);
    });

    eventBus.on('stocks:updated', (data) => {
      console.log('Stock updated:', data);
      eventBus.emit('dashboard:stocks-updated', data);
    });

    eventBus.on('stocks:deleted', (data) => {
      console.log('Stock deleted:', data);
      eventBus.emit('dashboard:stocks-updated', data);
    });

    // Sales events
    eventBus.on('sales:created', (data) => {
      console.log('Sale created:', data);
      eventBus.emit('dashboard:sales-updated', data);
    });

    eventBus.on('sales:updated', (data) => {
      console.log('Sale updated:', data);
      eventBus.emit('dashboard:sales-updated', data);
    });

    eventBus.on('sales:deleted', (data) => {
      console.log('Sale deleted:', data);
      eventBus.emit('dashboard:sales-updated', data);
    });

    // Agent events
    eventBus.on('agent:created', (data) => {
      console.log('Agent created:', data);
      eventBus.emit('dashboard:agent-updated', data);
    });

    eventBus.on('agent:updated', (data) => {
      console.log('Agent updated:', data);
      eventBus.emit('dashboard:agent-updated', data);
    });

    eventBus.on('agent:deleted', (data) => {
      console.log('Agent deleted:', data);
      eventBus.emit('dashboard:agent-updated', data);
    });

    // History events
    eventBus.on('history:created', (data) => {
      console.log('History created:', data);
      eventBus.emit('dashboard:history-updated', data);
    });

    eventBus.on('history:updated', (data) => {
      console.log('History updated:', data);
      eventBus.emit('dashboard:history-updated', data);
    });

    eventBus.on('history:deleted', (data) => {
      console.log('History deleted:', data);
      eventBus.emit('dashboard:history-updated', data);
    });

    // Workflow events
    eventBus.on('workflows:created', (data) => {
      console.log('Workflow created:', data);
      eventBus.emit('dashboard:workflows-updated', data);
    });

    eventBus.on('workflows:updated', (data) => {
      console.log('Workflow updated:', data);
      eventBus.emit('dashboard:workflows-updated', data);
    });

    eventBus.on('workflows:deleted', (data) => {
      console.log('Workflow deleted:', data);
      eventBus.emit('dashboard:workflows-updated', data);
    });

    // Report events
    eventBus.on('reports:created', (data) => {
      console.log('Report created:', data);
      eventBus.emit('dashboard:reports-updated', data);
    });

    eventBus.on('reports:updated', (data) => {
      console.log('Report updated:', data);
      eventBus.emit('dashboard:reports-updated', data);
    });

    eventBus.on('reports:deleted', (data) => {
      console.log('Report deleted:', data);
      eventBus.emit('dashboard:reports-updated', data);
    });

    // Role events
    eventBus.on('roles:created', (data) => {
      console.log('Role created:', data);
      eventBus.emit('dashboard:roles-updated', data);
    });

    eventBus.on('roles:updated', (data) => {
      console.log('Role updated:', data);
      eventBus.emit('dashboard:roles-updated', data);
    });

    eventBus.on('roles:deleted', (data) => {
      console.log('Role deleted:', data);
      eventBus.emit('dashboard:roles-updated', data);
    });

    // Permission events
    eventBus.on('permissions:created', (data) => {
      console.log('Permission created:', data);
      eventBus.emit('dashboard:permissions-updated', data);
    });

    eventBus.on('permissions:updated', (data) => {
      console.log('Permission updated:', data);
      eventBus.emit('dashboard:permissions-updated', data);
    });

    eventBus.on('permissions:deleted', (data) => {
      console.log('Permission deleted:', data);
      eventBus.emit('dashboard:permissions-updated', data);
    });

    // UserData events
    eventBus.on('userData:created', (data) => {
      console.log('UserData created:', data);
      eventBus.emit('dashboard:userData-updated', data);
    });

    eventBus.on('userData:updated', (data) => {
      console.log('UserData updated:', data);
      eventBus.emit('dashboard:userData-updated', data);
    });

    eventBus.on('userData:deleted', (data) => {
      console.log('UserData deleted:', data);
      eventBus.emit('dashboard:userData-updated', data);
    });

    // Business info events
    eventBus.on('businessInfo:updated', (data) => {
      console.log('Business info updated:', data);
      eventBus.emit('dashboard:businessInfo-updated', data);
    });

    console.log('Cross-feature event listeners setup successfully');
  }

  /**
   * Inițializează WebSocket connection
   * @param {string} websocketUrl - URL-ul WebSocket
   */
  async initializeWebSocket(websocketUrl) {
    console.log('Initializing WebSocket connection...');
    
    try {
      dataSyncManager.setupWebSocket(websocketUrl);
      console.log('WebSocket connection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      // Nu aruncăm eroarea, WebSocket nu este critic
    }
  }

  /**
   * Setup sync intervals pentru resurse
   */
  setupSyncIntervals() {
    console.log('Setting up sync intervals...');

    // Timeline sync interval
    setInterval(() => {
      if (navigator.onLine) {
        dataSyncManager.getDataWithFallback('timeline', { forceRefresh: false });
      }
    }, 30000); // 30 secunde

    // AI Assistant sync interval
    setInterval(() => {
      if (navigator.onLine) {
        dataSyncManager.getDataWithFallback('aiAssistant', { forceRefresh: false });
      }
    }, 60000); // 1 minut

    // Stocks sync interval
    setInterval(() => {
      if (navigator.onLine) {
        dataSyncManager.getDataWithFallback('stocks', { forceRefresh: false });
      }
    }, 120000); // 2 minute

    console.log('Sync intervals setup successfully');
  }

  /**
   * Resetează toate serviciile
   */
  async reset() {
    console.log('Resetting DataSyncInitializer...');

    try {
      // Clear sync intervals
      if (this.syncIntervals) {
        this.syncIntervals.forEach(interval => clearInterval(interval));
      }

      // Clear event listeners
      eventBus.off('appointment:created');
      eventBus.off('appointment:updated');
      eventBus.off('appointment:deleted');
      eventBus.off('ai:message:sent');
      eventBus.off('ai:response:received');
      eventBus.off('stock:low');
      eventBus.off('invoice:paid');
      eventBus.off('datasync:online');
      eventBus.off('datasync:offline');
      eventBus.off('datasync:api-error');

      // Reset DataSyncManager
      // dataSyncManager.reset(); // Dacă există o metodă reset

      this.isInitialized = false;
      this.initializationPromise = null;

      console.log('DataSyncInitializer reset successfully');

    } catch (error) {
      console.error('Failed to reset DataSyncInitializer:', error);
      throw error;
    }
  }

  /**
   * Obține statusul inițializării
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      initializationPromise: !!this.initializationPromise,
      timestamp: new Date().toISOString()
    };
  }
}

// Creează singleton instance
const dataSyncInitializer = new DataSyncInitializer();

export default dataSyncInitializer; 