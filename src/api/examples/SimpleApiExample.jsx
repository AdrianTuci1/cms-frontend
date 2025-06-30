/**
 * Exemplu simplu de utilizare a API-ului curățat
 * Demonstrează cum se fac cereri API simple folosind endpoint-urile din requests.md
 * Folosește hook-ul unificat useApiCall pentru toate cererile
 */
import React, { useState, useEffect } from 'react';
import { 
  createApiManager, 
  ApiManager, 
  useApiCall 
} from '../index.js';

// Import API services (doar pentru preluarea datelor)
import GeneralService from '../services/GeneralService';
import SecureService from '../services/SecureService';
import TimelineService from '../services/TimelineService';

const SimpleApiExample = () => {
  const [apiManager, setApiManager] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Hook simplificat pentru apeluri API
  const { 
    data: appointments, 
    loading: appointmentsLoading, 
    error: appointmentsError,
    execute: fetchAppointments 
  } = useApiCall();

  // Hook pentru obținerea datelor de business
  const { 
    data: businessData, 
    loading: businessLoading, 
    error: businessError,
    execute: fetchBusinessData 
  } = useApiCall();

  useEffect(() => {
    // Inițializează API Manager
    const manager = createApiManager({
      baseURL: 'http://localhost:3001/api/v1',
      debug: true,
      timeout: 30000
    });
    
    setApiManager(manager);
  }, []);

  // Funcție pentru obținerea programărilor
  const handleFetchAppointments = async () => {
    if (!apiManager) return;

    try {
      // Folosește serviciul de timeline pentru programări
      const result = await apiManager.timelineRequest('GET', '/appointments');
      
      // Aici datele se duc în DataSyncManager
      console.log('Appointments data for DataSyncManager:', result);
      setData(result);
      
    } catch (err) {
      setError(err.message);
    }
  };

  // Funcție pentru obținerea datelor de business
  const handleFetchBusinessData = async () => {
    if (!apiManager) return;

    try {
      // Folosește serviciul general pentru date de business
      const result = await apiManager.generalRequest('GET', '/business-info');
      
      // Aici datele se duc în DataSyncManager
      console.log('Business data for DataSyncManager:', result);
      setData(result);
      
    } catch (err) {
      setError(err.message);
    }
  };

  // Funcție pentru crearea unei programări
  const handleCreateAppointment = async () => {
    if (!apiManager) return;

    const appointmentData = {
      clientId: '123',
      serviceId: '456',
      date: '2024-01-15',
      time: '10:00',
      duration: 60
    };

    try {
      // Folosește serviciul securizat pentru crearea programărilor
      const result = await apiManager.secureRequest('POST', '/appointments', appointmentData);
      
      // Aici datele se duc în DataSyncManager
      console.log('Created appointment for DataSyncManager:', result);
      setData(result);
      
    } catch (err) {
      setError(err.message);
    }
  };

  // Funcție pentru obținerea istoricului
  const handleFetchHistory = async () => {
    if (!apiManager) return;

    try {
      // Folosește serviciul de timeline pentru istoric
      const result = await apiManager.timelineRequest('GET', '/history');
      
      // Aici datele se duc în DataSyncManager
      console.log('History data for DataSyncManager:', result);
      setData(result);
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Example - Integrare cu DataSyncManager</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Status API Manager:</h3>
        <p>Initialized: {apiManager ? 'Yes' : 'No'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Acțiuni API:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleFetchAppointments}
            style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Fetch Appointments
          </button>
          
          <button 
            onClick={handleFetchBusinessData}
            style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Fetch Business Data
          </button>
          
          <button 
            onClick={handleCreateAppointment}
            style={{ padding: '10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px' }}
          >
            Create Appointment
          </button>
          
          <button 
            onClick={handleFetchHistory}
            style={{ padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Fetch History
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Data for DataSyncManager:</h3>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '5px', 
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3>Hook Examples:</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={() => fetchAppointments(() => apiManager?.timelineRequest('GET', '/appointments'))}
            disabled={appointmentsLoading}
            style={{ padding: '8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px' }}
          >
            {appointmentsLoading ? 'Loading...' : 'Fetch with Hook'}
          </button>
          
          {appointmentsError && (
            <span style={{ color: 'red', marginLeft: '10px' }}>
              Hook Error: {appointmentsError.message}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={() => fetchBusinessData(() => apiManager?.generalRequest('GET', '/business-info'))}
            disabled={businessLoading}
            style={{ padding: '8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px' }}
          >
            {businessLoading ? 'Loading...' : 'Fetch Business with Hook'}
          </button>
          
          {businessError && (
            <span style={{ color: 'red', marginLeft: '10px' }}>
              Hook Error: {businessError.message}
            </span>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#e9ecef', padding: '15px', borderRadius: '5px' }}>
        <h3>Note pentru DataSyncManager:</h3>
        <ul>
          <li>Datele obținute prin API se duc în DataSyncManager pentru sincronizare</li>
          <li>DataSyncManager gestionează cache-ul local și sincronizarea cu serverul</li>
          <li>API-ul este simplificat pentru a fi doar o interfață de comunicare</li>
          <li>Toate operațiunile de date se fac prin DataSyncManager</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleApiExample; 