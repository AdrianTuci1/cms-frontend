/**
 * IntegrationExample - Exemplu complet de integrare API cu Design Patterns
 * Demonstrează toate aspectele integrării: data sync, business logic, observer pattern
 * Updated pentru noua structură API din requests.md - Server-First Approach
 * Updated pentru a folosi useDataSync îmbunătățit cu Strategy Pattern
 */

import React, { useState, useEffect } from 'react';
import { useDataSync, useObserver, useBusinessLogic } from '../hooks';

const IntegrationExample = ({ businessType = 'dental' }) => {
  const [selectedResource, setSelectedResource] = useState('timeline');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({});
  
  // Date range state for timeline
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Pagination state for clients/members
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Hook-uri pentru toate resursele API din requests.md cu Strategy Pattern integrat
  const timelineSync = useDataSync('timeline', {
    businessType,
    startDate,
    endDate,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const clientsSync = useDataSync('clients', {
    businessType,
    page: currentPage,
    limit: pageSize,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const packagesSync = useDataSync('packages', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const membersSync = useDataSync('members', {
    businessType,
    page: currentPage,
    limit: pageSize,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const invoicesSync = useDataSync('invoices', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const stocksSync = useDataSync('stocks', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const salesSync = useDataSync('sales', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const agentSync = useDataSync('agent', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const historySync = useDataSync('history', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const workflowsSync = useDataSync('workflows', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const reportsSync = useDataSync('reports', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const rolesSync = useDataSync('roles', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const permissionsSync = useDataSync('permissions', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const userDataSync = useDataSync('userData', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const businessInfoSync = useDataSync('businessInfo', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
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

  const { 
    data, 
    loading, 
    error, 
    lastUpdated, 
    isOnline, 
    refresh, 
    create, 
    update, 
    remove,
    validateData,
    isOperationAllowed,
    processData,
    strategy
  } = activeSync;

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

  // Handlers folosind useDataSync îmbunătățit (în loc de Command Pattern redundant)
  const handleCreate = async () => {
    try {
      // Folosește useDataSync cu validare și business logic integrat
      await create(formData);
      
      console.log('✅ Created successfully using enhanced useDataSync');
      setFormData({}); // Reset form

    } catch (error) {
      console.error('❌ Creation failed:', error.message);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      // Folosește useDataSync cu validare și business logic integrat
      await update({ id, ...updates });
      
      console.log('✅ Updated successfully using enhanced useDataSync');

    } catch (error) {
      console.error('❌ Update failed:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Folosește useDataSync cu validare și business logic integrat
      await remove({ id });
      
      console.log('✅ Deleted successfully using enhanced useDataSync');

    } catch (error) {
      console.error('❌ Deletion failed:', error.message);
    }
  };

  // Validare folosind Strategy Pattern integrat în useDataSync
  const validateForm = () => {
    const validation = validateData(formData, 'create');
    
    if (!validation.isValid) {
      console.error('❌ Validation errors:', validation.errors);
      return false;
    }
    
    return true;
  };

  // Verificare permisiuni folosind Strategy Pattern integrat în useDataSync
  const checkPermissions = () => {
    const canCreate = isOperationAllowed(`create${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, formData);
    const canUpdate = isOperationAllowed(`update${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, {});
    const canDelete = isOperationAllowed(`delete${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, {});

    return { canCreate, canUpdate, canDelete };
  };

  // Render form pentru resursa selectată
  const renderForm = () => {
    const fields = businessLogic.getConfig(`${selectedResource}Fields`) || [];
    const { canCreate } = checkPermissions();
    const isValid = validateForm();
    
    return (
      <div className="form-container">
        <h3>Create {selectedResource} (Enhanced useDataSync + Strategy Pattern)</h3>
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
        <button 
          onClick={handleCreate}
          disabled={!canCreate || !isValid || loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
        
        {/* Status information */}
        <div className="status-info">
          <p>Strategy: {strategy}</p>
          <p>Can Create: {canCreate ? 'Yes' : 'No'}</p>
          <p>Form Valid: {isValid ? 'Yes' : 'No'}</p>
          {error && (
            <p className="error">Error: {error.message}</p>
          )}
        </div>
      </div>
    );
  };

  // Render controls for timeline date range
  const renderTimelineControls = () => {
    if (selectedResource !== 'timeline') return null;

    return (
      <div className="timeline-controls">
        <h4>Timeline Date Range</h4>
        <div className="date-inputs">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button onClick={() => timelineSync.refresh()}>Refresh Timeline</button>
        </div>
      </div>
    );
  };

  // Render controls for pagination
  const renderPaginationControls = () => {
    if (!['clients', 'members'].includes(selectedResource)) return null;

    return (
      <div className="pagination-controls">
        <h4>Pagination</h4>
        <div className="pagination-inputs">
          <label>
            Page:
            <input
              type="number"
              min="1"
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value))}
            />
          </label>
          <label>
            Page Size:
            <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
          <button onClick={() => activeSync.refresh()}>Refresh</button>
        </div>
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
    const { canUpdate, canDelete } = checkPermissions();

    return (
      <div className="data-container">
        <h3>{selectedResource} Data (Processed by {businessType} Strategy)</h3>
        
        {/* Show current day filter info */}
        {['invoices', 'stocks', 'sales', 'history'].includes(selectedResource) && (
          <div className="current-day-info">
            <p>📅 Showing data for current day only: {new Date().toISOString().split('T')[0]}</p>
          </div>
        )}
        
        {/* Show pagination info */}
        {['clients', 'members'].includes(selectedResource) && (
          <div className="pagination-info">
            <p>📄 Page {currentPage} of {items.length} items (showing {pageSize} per page)</p>
          </div>
        )}
        
        {/* Show date range info for timeline */}
        {selectedResource === 'timeline' && (
          <div className="date-range-info">
            <p>📅 Date Range: {startDate} to {endDate}</p>
          </div>
        )}
        
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
              <button 
                onClick={() => handleUpdate(item.id, { status: 'updated' })}
                disabled={!canUpdate || loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                disabled={!canDelete || loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="integration-example">
      <h2>API Integration Example - {businessType} (Enhanced useDataSync + Strategy Pattern)</h2>
      
      {/* Resource Selection */}
      <div className="resource-selector">
        <h3>Select Resource:</h3>
        <select 
          value={selectedResource} 
          onChange={(e) => setSelectedResource(e.target.value)}
        >
          <option value="timeline">Timeline (with date range)</option>
          <option value="clients">Clients (with pagination)</option>
          <option value="packages">Packages</option>
          <option value="members">Members (with pagination)</option>
          <option value="invoices">Invoices (current day only)</option>
          <option value="stocks">Stocks (current day only)</option>
          <option value="sales">Sales (current day only)</option>
          <option value="agent">Agent</option>
          <option value="history">History (current day only)</option>
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
        <p>🔄 Server-First: Data fetched on demand, stored in IndexedDB</p>
        <p>📊 Strategy Pattern: Business-specific validation and data processing</p>
        <p>🎯 Enhanced useDataSync: Built-in CRUD operations with validation</p>
      </div>

      {/* Business Logic Information */}
      <div className="business-logic-info">
        <h3>Business Logic Information</h3>
        <p>Strategy: {strategy}</p>
        <p>Can Create {selectedResource}: {isOperationAllowed(`create${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, {}) ? 'Yes' : 'No'}</p>
        <p>Can Update {selectedResource}: {isOperationAllowed(`update${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, {}) ? 'Yes' : 'No'}</p>
        <p>Can Delete {selectedResource}: {isOperationAllowed(`delete${selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}`, {}) ? 'Yes' : 'No'}</p>
      </div>

      {/* Resource-specific controls */}
      {renderTimelineControls()}
      {renderPaginationControls()}

      {/* Form and Data */}
      <div className="content">
        {renderForm()}
        {renderData()}
      </div>

      {/* Design Patterns Benefits */}
      <div className="patterns-benefits">
        <h3>Enhanced useDataSync Benefits</h3>
        <div className="strategy-benefits">
          <h4>Strategy Pattern Integration:</h4>
          <ul>
            <li>✅ Business-specific validation rules</li>
            <li>✅ Business-specific data processing</li>
            <li>✅ Business-specific permissions</li>
            <li>✅ Automatic validation on CRUD operations</li>
            <li>✅ Consistent interface across business types</li>
          </ul>
        </div>
        <div className="usability-benefits">
          <h4>Usability Benefits:</h4>
          <ul>
            <li>✅ No redundant Command Pattern layer</li>
            <li>✅ Direct use of existing useDataSync</li>
            <li>✅ Built-in validation and business logic</li>
            <li>✅ Automatic error handling</li>
            <li>✅ Optimistic updates</li>
            <li>✅ Event emission</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntegrationExample; 