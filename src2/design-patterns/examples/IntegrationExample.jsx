/**
 * IntegrationExample - Exemplu complet de integrare API cu Design Patterns
 * Demonstrează toate aspectele integrării: data sync, business logic, observer pattern
 * Updated pentru noua structură API din requests.md
 */

import React, { useState, useEffect } from 'react';
import { useDataSync, useObserver, useBusinessLogic } from '../hooks';

const IntegrationExample = ({ businessType = 'dental' }) => {
  const [selectedResource, setSelectedResource] = useState('timeline');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({});

  // Hook-uri pentru toate resursele API din requests.md
  const timelineSync = useDataSync('timeline', {
    autoRefresh: true,
    refreshInterval: 30000,
    useCache: true,
    maxAge: 5 * 60 * 1000,
    businessType
  });

  const clientsSync = useDataSync('clients', {
    autoRefresh: true,
    refreshInterval: 60000,
    useCache: true,
    maxAge: 10 * 60 * 1000,
    businessType
  });

  const packagesSync = useDataSync('packages', {
    autoRefresh: false,
    useCache: true,
    maxAge: 24 * 60 * 60 * 1000,
    businessType
  });

  const membersSync = useDataSync('members', {
    autoRefresh: true,
    refreshInterval: 60000,
    useCache: true,
    maxAge: 10 * 60 * 1000,
    businessType
  });

  const invoicesSync = useDataSync('invoices', {
    autoRefresh: false,
    useCache: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  const stocksSync = useDataSync('stocks', {
    autoRefresh: true,
    refreshInterval: 120000,
    useCache: true,
    maxAge: 60 * 60 * 1000
  });

  const salesSync = useDataSync('sales', {
    autoRefresh: true,
    refreshInterval: 30000,
    useCache: true,
    maxAge: 5 * 60 * 1000
  });

  const agentSync = useDataSync('agent', {
    autoRefresh: false,
    useCache: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  const historySync = useDataSync('history', {
    autoRefresh: false,
    useCache: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  const workflowsSync = useDataSync('workflows', {
    autoRefresh: false,
    useCache: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  const reportsSync = useDataSync('reports', {
    autoRefresh: false,
    useCache: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  const rolesSync = useDataSync('roles', {
    autoRefresh: false,
    useCache: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  const permissionsSync = useDataSync('permissions', {
    autoRefresh: false,
    useCache: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  const userDataSync = useDataSync('userData', {
    autoRefresh: false,
    useCache: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  const businessInfoSync = useDataSync('businessInfo', {
    autoRefresh: false,
    useCache: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  // Hook pentru observer pattern
  const { subscribe, emit } = useObserver();

  // Hook pentru business logic
  const businessLogic = useBusinessLogic(businessType);

  // Selectează resursa activă
  const activeSync = {
    timeline: timelineSync,
    clients: clientsSync,
    packages: packagesSync,
    members: membersSync,
    invoices: invoicesSync,
    stocks: stocksSync,
    sales: salesSync,
    agent: agentSync,
    history: historySync,
    workflows: workflowsSync,
    reports: reportsSync,
    roles: rolesSync,
    permissions: permissionsSync,
    userData: userDataSync,
    businessInfo: businessInfoSync
  }[selectedResource];

  const { data, loading, error, lastUpdated, isOnline, refresh, create, update, remove } = activeSync;

  // Setup event listeners pentru cross-feature communication
  useEffect(() => {
    const listeners = [];

    // Listen pentru evenimente de la toate resursele
    const resources = [
      'timeline', 'clients', 'packages', 'members', 'invoices', 'stocks', 
      'sales', 'agent', 'history', 'workflows', 'reports', 'roles', 
      'permissions', 'userData', 'businessInfo'
    ];

    resources.forEach(resource => {
      listeners.push(
        subscribe(`${resource}:created`, (data) => {
          console.log(`${resource} created event:`, data);
        }),
        subscribe(`${resource}:updated`, (data) => {
          console.log(`${resource} updated event:`, data);
        }),
        subscribe(`${resource}:deleted`, (data) => {
          console.log(`${resource} deleted event:`, data);
        })
      );
    });

    return () => {
      listeners.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe]);

  // Procesează datele conform strategiei business
  const processedData = businessLogic.processData(data, selectedResource);

  // Handler pentru operații CRUD
  const handleCreate = async () => {
    try {
      // Validare business logic
      const validation = businessLogic.validateData(formData, selectedResource);
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        return;
      }

      // Verificare permisiuni
      if (!businessLogic.isOperationAllowed(`create${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, formData)) {
        console.error('Operation not allowed');
        return;
      }

      // Procesare date business-specific
      const processedFormData = businessLogic.processData(formData, selectedResource);

      // Creare
      await create(processedFormData);

      // Emitere eveniment
      emit(`${selectedResource}:created`, {
        data: processedFormData,
        businessType,
        timestamp: new Date().toISOString()
      });

      // Reset form
      setFormData({});

    } catch (error) {
      console.error(`Error creating ${selectedResource}:`, error);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const validation = businessLogic.validateData(updates, selectedResource);
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        return;
      }

      await update({ id, ...updates });

      emit(`${selectedResource}:updated`, {
        id,
        updates,
        businessType,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`Error updating ${selectedResource}:`, error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove({ id });

      emit(`${selectedResource}:deleted`, {
        id,
        businessType,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`Error deleting ${selectedResource}:`, error);
    }
  };

  // Render form pentru resursa selectată
  const renderForm = () => {
    const fields = businessLogic.getConfig(`${selectedResource}Fields`) || [];
    
    return (
      <div className="form-container">
        <h3>Create {selectedResource}</h3>
        {fields.map(field => (
          <div key={field.name} className="form-field">
            <label>{field.label}:</label>
            <input
              type={field.type || 'text'}
              value={formData[field.name] || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                [field.name]: e.target.value
              }))}
              placeholder={field.placeholder}
            />
          </div>
        ))}
        <button onClick={handleCreate}>Create</button>
      </div>
    );
  };

  // Render data pentru resursa selectată
  const renderData = () => {
    if (loading) {
      return <div className="loading">Loading {selectedResource} data...</div>;
    }

    if (error) {
      return (
        <div className="error">
          <h3>Error loading {selectedResource}:</h3>
          <p>{error.message}</p>
          <button onClick={refresh}>Retry</button>
        </div>
      );
    }

    if (!processedData || (Array.isArray(processedData) && processedData.length === 0)) {
      return <div className="empty">No {selectedResource} data found</div>;
    }

    const items = Array.isArray(processedData) ? processedData : [processedData];

    return (
      <div className="data-container">
        <h3>{selectedResource} Data (Processed by {businessType} Strategy)</h3>
        {items.map((item, index) => (
          <div key={item.id || index} className="data-item">
            <h4>{businessLogic.format(selectedResource, item)}</h4>
            <div className="item-details">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="detail">
                  <strong>{key}:</strong> {String(value)}
                </div>
              ))}
            </div>
            <div className="item-actions">
              <button onClick={() => handleUpdate(item.id, { status: 'updated' })}>
                Update
              </button>
              <button onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="integration-example">
      <h2>API Integration Example - {businessType}</h2>
      
      {/* Resource Selection */}
      <div className="resource-selector">
        <h3>Select Resource:</h3>
        <select 
          value={selectedResource} 
          onChange={(e) => setSelectedResource(e.target.value)}
        >
          <option value="timeline">Timeline</option>
          <option value="clients">Clients</option>
          <option value="packages">Packages</option>
          <option value="members">Members</option>
          <option value="invoices">Invoices</option>
          <option value="stocks">Stocks</option>
          <option value="sales">Sales</option>
          <option value="agent">Agent</option>
          <option value="history">History</option>
          <option value="workflows">Workflows</option>
          <option value="reports">Reports</option>
          <option value="roles">Roles</option>
          <option value="permissions">Permissions</option>
          <option value="userData">User Data</option>
          <option value="businessInfo">Business Info</option>
        </select>
      </div>

      {/* Status Information */}
      <div className="status-info">
        <p>Status: {isOnline ? '🟢 Online' : '🔴 Offline'}</p>
        <p>Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}</p>
        <p>Business Type: {businessType}</p>
        <p>Data Count: {Array.isArray(processedData) ? processedData.length : (processedData ? 1 : 0)}</p>
      </div>

      {/* Business Logic Information */}
      <div className="business-logic-info">
        <h3>Business Logic Information</h3>
        <p>Can Create {selectedResource}: {businessLogic.isOperationAllowed(`create${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, {}) ? 'Yes' : 'No'}</p>
        <p>Can Update {selectedResource}: {businessLogic.isOperationAllowed(`update${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, {}) ? 'Yes' : 'No'}</p>
        <p>Can Delete {selectedResource}: {businessLogic.isOperationAllowed(`delete${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, {}) ? 'Yes' : 'No'}</p>
      </div>

      {/* Form and Data */}
      <div className="content">
        {renderForm()}
        {renderData()}
      </div>
    </div>
  );
};

export default IntegrationExample; 