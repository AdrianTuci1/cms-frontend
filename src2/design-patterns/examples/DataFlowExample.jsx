/**
 * Exemplu complet de flux de date cu noua arhitectură
 * Demonstrează cum design patterns coordonează între API, WebSocket și componente
 */
import React, { useState, useEffect } from 'react';
import { DataSyncManager } from '../data-sync/DataSyncManager';
import eventBus from '../observer/base/EventBus';
import { StrategyRegistry } from '../strategy/base/StrategyRegistry';
import socketManager from '../../socket/socketManager';
import { useDataSync, useObserver, useBusinessLogic } from '../hooks';

// Import API services (doar pentru preluarea datelor)
import timelineService from '../../api/services/TimelineService';
import aiService from '../../api/services/AIService';

const DataFlowExample = ({ businessType = 'dental' }) => {
  const [timelineData, setTimelineData] = useState([]);
  const [aiMessages, setAiMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    clientId: '',
    serviceId: '',
    startTime: '',
    duration: 60
  });

  // Hook pentru sincronizarea datelor cu API și IndexedDB
  const {
    data: timelineDataHook,
    loading: timelineLoading,
    error: timelineError,
    lastUpdated: timelineLastUpdated,
    isOnline: timelineIsOnline,
    refresh: timelineRefresh,
    create: timelineCreate,
    update: timelineUpdate,
    remove: timelineRemove,
    optimisticUpdate: timelineOptimisticUpdate
  } = useDataSync('timeline', {
    autoRefresh: true,
    refreshInterval: 30000,
    useCache: true,
    maxAge: 5 * 60 * 1000,
    onDataUpdate: (data) => {
      console.log('Timeline data updated:', data);
    },
    onError: (error) => {
      console.error('Timeline error:', error);
    }
  });

  // Hook pentru observer pattern - event handling
  const { subscribe, emit } = useObserver();

  // Hook pentru business logic - procesarea datelor conform strategiei
  const {
    processTimeline,
    validateAppointment,
    formatAppointment,
    calculate,
    getAppointmentSlots,
    isOperationAllowed
  } = useBusinessLogic(businessType);

  useEffect(() => {
    initializeDataFlow();
    setupEventListeners();
    setupWebSocket();

    return () => {
      cleanupEventListeners();
    };
  }, [businessType]);

  /**
   * Inițializează fluxul de date
   */
  const initializeDataFlow = async () => {
    try {
      // 1. Configurează resursele în DataSyncManager
      DataSyncManager.registerResource('timeline', {
        enableOffline: true,
        syncInterval: 30000,
        socketEvents: ['timeline:updated', 'appointment:created'],
        apiEndpoints: {
          get: '/api/timeline',
          post: '/api/timeline',
          put: '/api/timeline/:id',
          delete: '/api/timeline/:id'
        }
      });

      DataSyncManager.registerResource('aiAssistant', {
        enableOffline: false, // AI nu funcționează offline
        syncInterval: 0, // Nu sincronizează automat
        socketEvents: ['ai:message', 'ai:response'],
        apiEndpoints: {
          get: '/api/ai/messages',
          post: '/api/ai/send'
        }
      });

      // 2. Înregistrează strategia business-specific
      const businessStrategy = StrategyRegistry.get(businessType);
      if (!businessStrategy) {
        console.warn(`Strategy not found for business type: ${businessType}`);
      }

      // 3. Prelucrează datele inițiale
      await loadInitialData();

    } catch (error) {
      console.error('Error initializing data flow:', error);
    }
  };

  /**
   * Încarcă datele inițiale folosind DataSyncManager
   */
  const loadInitialData = async () => {
    setLoading(true);

    try {
      // Preluare timeline cu fallback automat
      const timelineResult = await DataSyncManager.getDataWithFallback('timeline', {
        forceRefresh: false,
        useCache: true,
        maxAge: 5 * 60 * 1000 // 5 minute
      });

      // Preluare AI messages (doar online)
      let aiResult = [];
      if (timelineIsOnline) {
        try {
          aiResult = await DataSyncManager.getDataWithFallback('aiAssistant', {
            forceRefresh: true,
            useCache: false
          });
        } catch (error) {
          console.warn('AI service not available:', error);
        }
      }

      // Procesează datele cu strategia business-specific
      const strategy = StrategyRegistry.get(businessType);
      if (strategy) {
        const processedTimeline = strategy.processTimelineData(timelineResult);
        setTimelineData(processedTimeline);
      } else {
        setTimelineData(timelineResult);
      }

      setAiMessages(aiResult);
      setLastSync(Date.now());

    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Configurează event listeners pentru cross-feature communication
   */
  const setupEventListeners = () => {
    // Ascultă pentru actualizări timeline
    const timelineUnsubscribe = eventBus.on('timeline:updated', (data) => {
      console.log('Timeline updated:', data);
      
      const strategy = StrategyRegistry.get(businessType);
      if (strategy) {
        const processedData = strategy.processTimelineData(data.data);
        setTimelineData(processedData);
      } else {
        setTimelineData(data.data);
      }
      
      setLastSync(data.timestamp);
    });

    // Ascultă pentru actualizări AI
    const aiUnsubscribe = eventBus.on('aiAssistant:updated', (data) => {
      console.log('AI Assistant updated:', data);
      setAiMessages(prev => [...prev, data.data]);
    });

    // Ascultă pentru schimbări de stare online/offline
    const onlineUnsubscribe = eventBus.on('datasync:online', () => {
      setIsOnline(true);
      console.log('Back online - syncing data...');
      loadInitialData();
    });

    const offlineUnsubscribe = eventBus.on('datasync:offline', () => {
      setIsOnline(false);
      console.log('Gone offline - using cached data');
    });

    // Ascultă pentru erori de sincronizare
    const errorUnsubscribe = eventBus.on('datasync:error', (error) => {
      console.error('Data sync error:', error);
    });

    // Returnează funcții de cleanup
    return {
      timelineUnsubscribe,
      aiUnsubscribe,
      onlineUnsubscribe,
      offlineUnsubscribe,
      errorUnsubscribe
    };
  };

  /**
   * Configurează WebSocket pentru actualizări live
   */
  const setupWebSocket = () => {
    // Adaugă handler pentru mesaje WebSocket
    const messageHandler = (message) => {
      console.log('WebSocket message received:', message);

      if (message.event === 'timeline:updated') {
        // DataSyncManager va gestiona mesajul
        DataSyncManager.handleSocketMessage('timeline', message.data);
      } else if (message.event === 'ai:message') {
        DataSyncManager.handleSocketMessage('aiAssistant', message.data);
      }
    };

    const errorHandler = (error) => {
      console.error('WebSocket error:', error);
    };

    socketManager.addMessageHandler(messageHandler);
    socketManager.addErrorHandler(errorHandler);

    // Returnează funcții de cleanup
    return () => {
      socketManager.removeMessageHandler(messageHandler);
      socketManager.removeErrorHandler(errorHandler);
    };
  };

  /**
   * Cleanup event listeners
   */
  const cleanupEventListeners = () => {
    // Cleanup-ul se face în useEffect return
  };

  /**
   * Handler pentru crearea unui nou appointment
   */
  const handleCreateAppointment = async () => {
    try {
      // Validează datele conform strategiei business
      const validation = validateAppointment(newAppointment);
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        return;
      }

      // Verifică dacă operația este permisă
      if (!isOperationAllowed('createAppointment', newAppointment)) {
        console.error('Operation not allowed');
        return;
      }

      // Calculează durata conform strategiei business
      const calculatedDuration = calculate('duration', newAppointment) || newAppointment.duration;

      const appointmentData = {
        ...newAppointment,
        duration: calculatedDuration,
        businessType,
        date: selectedDate
      };

      // Creează programarea folosind design patterns
      await timelineCreate(appointmentData);

      // Emite eveniment pentru alte componente
      emit('appointment:created', {
        appointment: appointmentData,
        businessType,
        timestamp: new Date().toISOString()
      });

      // Resetează formularul
      setNewAppointment({
        title: '',
        clientId: '',
        serviceId: '',
        startTime: '',
        duration: 60
      });

    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  /**
   * Handler pentru actualizarea unei programări
   */
  const handleUpdateAppointment = async (appointmentId, updates) => {
    try {
      const validation = validateAppointment(updates);
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        return;
      }

      if (!isOperationAllowed('updateAppointment', { id: appointmentId, ...updates })) {
        console.error('Operation not allowed');
        return;
      }

      await timelineUpdate({ id: appointmentId, ...updates });

      emit('appointment:updated', {
        appointmentId,
        updates,
        businessType,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  /**
   * Handler pentru ștergerea unei programări
   */
  const handleDeleteAppointment = async (appointmentId) => {
    try {
      if (!isOperationAllowed('deleteAppointment', { id: appointmentId })) {
        console.error('Operation not allowed');
        return;
      }

      await timelineRemove({ id: appointmentId });

      emit('appointment:deleted', {
        appointmentId,
        businessType,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  /**
   * Actualizare optimistă pentru UX mai bună
   */
  const handleOptimisticUpdate = (appointmentId, updates) => {
    timelineOptimisticUpdate(prevData => {
      if (Array.isArray(prevData)) {
        return prevData.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, ...updates }
            : appointment
        );
      }
      return prevData;
    });
  };

  // Procesează datele conform strategiei business
  const processedData = processTimeline(timelineData);

  // Setup event listeners
  useEffect(() => {
    const unsubscribe = subscribe('appointment:created', (data) => {
      console.log('Appointment created event received:', data);
      // Poți face actualizări optimiste aici
    });

    return unsubscribe;
  }, [subscribe]);

  if (loading) {
    return (
      <div className="data-flow-loading">
        <div className="loading-spinner" />
        <p>Loading {businessType} data...</p>
      </div>
    );
  }

  return (
    <div className="data-flow-example">
      {/* Header cu status */}
      <div className="status-header">
        <h2>{businessType.charAt(0).toUpperCase() + businessType.slice(1)} Data Flow</h2>
        <div className="status-indicators">
          <span className={`status ${timelineIsOnline ? 'online' : 'offline'}`}>
            {timelineIsOnline ? '🟢 Online' : '🔴 Offline'}
          </span>
          <span className="last-sync">
            Last sync: {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never'}
          </span>
        </div>
      </div>

      {/* Controale */}
      <div className="controls">
        <button onClick={timelineRefresh} disabled={timelineLoading}>
          Refresh Data
        </button>
        <button 
          onClick={() => handleCreateAppointment({
            id: Date.now().toString(),
            title: 'Test Appointment',
            date: new Date().toISOString(),
            clientId: '123'
          })}
        >
          Create Test Appointment
        </button>
      </div>

      {/* Timeline Data */}
      <div className="data-section">
        <h3>Timeline Data ({timelineData.length} items)</h3>
        <div className="data-list">
          {timelineData.map((item, index) => (
            <div key={item.id || index} className="data-item">
              <strong>{item.title || item.id}</strong>
              <span>{new Date(item.date || item.timestamp).toLocaleString()}</span>
              {item.type && <span className="type">{item.type}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* AI Messages */}
      <div className="data-section">
        <h3>AI Messages ({aiMessages.length} messages)</h3>
        <div className="data-list">
          {aiMessages.map((message, index) => (
            <div key={message.id || index} className="data-item">
              <strong>{message.role}:</strong>
              <span>{message.content}</span>
              <span>{new Date(message.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Business Logic Information */}
      <div className="business-logic-info">
        <h3>Business Logic Information</h3>
        <p>Appointment Slots: {JSON.stringify(getAppointmentSlots())}</p>
        <p>Calculated Duration: {calculate('duration', newAppointment)} minutes</p>
        <p>Can Create Appointment: {isOperationAllowed('createAppointment', newAppointment) ? 'Yes' : 'No'}</p>
      </div>

      {/* Error Display */}
      {timelineError && (
        <div className="error-message">
          <h3>Error:</h3>
          <p>{timelineError.message}</p>
        </div>
      )}

      {/* Loading State */}
      {timelineLoading && (
        <div className="loading">
          <p>Loading timeline data...</p>
        </div>
      )}

      {/* Date Selection */}
      <div className="date-selection">
        <label>
          Select Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <button onClick={timelineRefresh}>Refresh Data</button>
      </div>

      {/* Create Appointment Form */}
      <div className="create-appointment">
        <h3>Create New Appointment</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Appointment Title"
            value={newAppointment.title}
            onChange={(e) => setNewAppointment(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Client ID"
            value={newAppointment.clientId}
            onChange={(e) => setNewAppointment(prev => ({ ...prev, clientId: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Service ID"
            value={newAppointment.serviceId}
            onChange={(e) => setNewAppointment(prev => ({ ...prev, serviceId: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <input
            type="time"
            value={newAppointment.startTime}
            onChange={(e) => setNewAppointment(prev => ({ ...prev, startTime: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={newAppointment.duration}
            onChange={(e) => setNewAppointment(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
          />
        </div>
        <button onClick={handleCreateAppointment}>Create Appointment</button>
      </div>

      {/* Timeline Data Display */}
      <div className="timeline-data">
        <h3>Timeline Data (Processed by {businessType} Strategy)</h3>
        {processedData && processedData.length > 0 ? (
          <div className="appointments-list">
            {processedData.map((appointment) => (
              <div key={appointment.id} className="appointment-item">
                <h4>{formatAppointment(appointment)}</h4>
                <p>Client: {appointment.clientId}</p>
                <p>Service: {appointment.serviceId}</p>
                <p>Time: {appointment.startTime}</p>
                <p>Duration: {appointment.duration} minutes</p>
                
                <div className="appointment-actions">
                  <button
                    onClick={() => handleUpdateAppointment(appointment.id, { title: 'Updated Title' })}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleOptimisticUpdate(appointment.id, { status: 'confirmed' })}
                  >
                    Optimistic Update
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    style={{ backgroundColor: '#ff4444' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No appointments found for {selectedDate}</p>
        )}
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <h4>Debug Information</h4>
          <p>Business Type: {businessType}</p>
          <p>Online Status: {timelineIsOnline ? 'Yes' : 'No'}</p>
          <p>Timeline Items: {timelineData.length}</p>
          <p>AI Messages: {aiMessages.length}</p>
          <p>Last Sync: {lastSync ? new Date(lastSync).toLocaleString() : 'Never'}</p>
          <p>DataSyncManager Status: {DataSyncManager.getSyncStatus()}</p>
        </div>
      )}
    </div>
  );
};

export default DataFlowExample; 