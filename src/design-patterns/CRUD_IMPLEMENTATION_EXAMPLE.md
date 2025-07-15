# CRUD Implementation Example: Clients Resource

This document provides a complete implementation example showing how to use the data flow system to manage CRUD operations for the `clients` resource across different business types.

## Resource Configuration

```javascript
// ResourceRegistry.js - Auto-configured when business type is set
{
  clients: {
    enableOffline: true,
    requiresAuth: true,
    forceServerFetch: true,
    supportsPagination: true, // Supports page/limit parameters
    apiEndpoints: {
      get: `/${businessType}/clients`,        // GET /dental/clients
      post: `/${businessType}/clients`,       // POST /dental/clients
      put: `/${businessType}/clients/:id`,    // PUT /dental/clients/123
      delete: `/${businessType}/clients/:id`  // DELETE /dental/clients/123
    }
  }
}
```

## Data Models

### Dental Client
```javascript
{
  id: 1,
  name: "John Doe",
  phoneNumber: "+1234567890",
  email: "john@email.com",
  dateOfBirth: "1990-05-15",
  address: "123 Main St",
  emergencyContact: {
    name: "Jane Doe",
    phone: "+0987654321"
  },
  medicalHistory: {
    allergies: ["Penicillin"],
    conditions: ["Diabetes"],
    medications: ["Insulin"]
  },
  treatmentHistory: [
    {
      date: "2024-01-15",
      treatment: "Dental Cleaning",
      dentist: "Dr. Smith"
    }
  ]
}
```

### Gym Client
```javascript
{
  id: 1,
  name: "Mike Johnson",
  phoneNumber: "+1234567890",
  email: "mike@email.com",
  dateOfBirth: "1985-08-20",
  membershipType: "Premium",
  membershipStart: "2024-01-01",
  membershipEnd: "2024-12-31",
  emergencyContact: {
    name: "Sarah Johnson",
    phone: "+0987654321"
  },
  fitnessGoals: ["Weight Loss", "Muscle Building"],
  measurements: {
    weight: 80,
    height: 180,
    bodyFat: 15
  }
}
```

### Hotel Client
```javascript
{
  id: 1,
  name: "Alice Smith",
  phoneNumber: "+1234567890",
  email: "alice@email.com",
  language: "EN",
  address: "456 Hotel St",
  preferences: {
    roomType: "Suite",
    bedType: "King",
    smoking: false,
    floor: "High"
  },
  loyaltyProgram: {
    level: "Gold",
    points: 2500
  },
  bookingHistory: [
    {
      checkIn: "2024-01-10",
      checkOut: "2024-01-15",
      roomNumber: 205
    }
  ]
}
```

## Component Implementation

```jsx
// ClientsManagement.jsx
import React, { useState, useEffect } from 'react';
import { useDataSync } from '../design-patterns/hooks';
import { getBusinessType } from '../config/businessTypes';

const ClientsManagement = () => {
  const businessType = getBusinessType();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);

  // Map business type name to key
  const businessTypeKey = {
    'Dental Clinic': 'dental',
    'Gym': 'gym',
    'Hotel': 'hotel'
  }[businessType.name] || 'dental';

  // Primary data sync hook for clients
  const clientsSync = useDataSync('clients', {
    businessType: businessTypeKey,
    page: currentPage,
    limit: 20,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    data: clientsData,
    loading,
    error,
    refresh,
    create: createClient,
    update: updateClient,
    remove: removeClient,
    validateData,
    isOperationAllowed
  } = clientsSync;

  // Extract clients array from data structure
  const clients = clientsData?.items || clientsData || [];

  // Create new client
  const handleCreateClient = async (clientData) => {
    try {
      // Validate data before creating
      const validation = validateData(clientData, 'create');
      if (!validation.isValid) {
        alert(`Validation errors: ${validation.errors.join(', ')}`);
        return;
      }

      // Check if creation is allowed
      if (!isOperationAllowed('createClient', clientData)) {
        alert('You do not have permission to create clients');
        return;
      }

      await createClient(clientData);
      console.log('Client created successfully');
      setSelectedClient(null);
      
    } catch (error) {
      console.error('Failed to create client:', error);
      alert('Failed to create client. Please try again.');
    }
  };

  // Update existing client
  const handleUpdateClient = async (clientData) => {
    try {
      const validation = validateData(clientData, 'update');
      if (!validation.isValid) {
        alert(`Validation errors: ${validation.errors.join(', ')}`);
        return;
      }

      if (!isOperationAllowed('updateClient', clientData)) {
        alert('You do not have permission to update clients');
        return;
      }

      await updateClient(clientData);
      console.log('Client updated successfully');
      setSelectedClient(null);
      
    } catch (error) {
      console.error('Failed to update client:', error);
      alert('Failed to update client. Please try again.');
    }
  };

  // Delete client
  const handleDeleteClient = async (client) => {
    if (!confirm(`Are you sure you want to delete ${client.name}?`)) {
      return;
    }

    try {
      if (!isOperationAllowed('deleteClient', client)) {
        alert('You do not have permission to delete clients');
        return;
      }

      await removeClient(client);
      console.log('Client deleted successfully');
      setSelectedClient(null);
      
    } catch (error) {
      console.error('Failed to delete client:', error);
      alert('Failed to delete client. Please try again.');
    }
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error loading clients</h3>
        <p>{error.message}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }

  return (
    <div className="clients-management">
      <div className="header">
        <h2>{businessType.name} Clients</h2>
        <button 
          onClick={() => setSelectedClient({})}
          className="btn-primary"
        >
          Add New Client
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="clients-list">
        {filteredClients.map(client => (
          <ClientCard
            key={client.id}
            client={client}
            businessType={businessTypeKey}
            onEdit={() => setSelectedClient(client)}
            onDelete={() => handleDeleteClient(client)}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={filteredClients.length < 20}
        >
          Next
        </button>
      </div>

      {/* Client Form Modal */}
      {selectedClient && (
        <ClientFormModal
          client={selectedClient}
          businessType={businessTypeKey}
          onSave={selectedClient.id ? handleUpdateClient : handleCreateClient}
          onCancel={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
};

// Client Card Component
const ClientCard = ({ client, businessType, onEdit, onDelete }) => {
  const renderBusinessSpecificInfo = () => {
    switch (businessType) {
      case 'dental':
        return (
          <div className="client-info">
            <p><strong>Last Visit:</strong> {client.lastVisit || 'No visits'}</p>
            <p><strong>Allergies:</strong> {client.medicalHistory?.allergies?.join(', ') || 'None'}</p>
          </div>
        );
      case 'gym':
        return (
          <div className="client-info">
            <p><strong>Membership:</strong> {client.membershipType}</p>
            <p><strong>Expires:</strong> {client.membershipEnd}</p>
          </div>
        );
      case 'hotel':
        return (
          <div className="client-info">
            <p><strong>Loyalty Level:</strong> {client.loyaltyProgram?.level || 'Standard'}</p>
            <p><strong>Preferred Language:</strong> {client.language}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="client-card">
      <div className="client-header">
        <h3>{client.name}</h3>
        <div className="client-actions">
          <button onClick={onEdit} className="btn-secondary">Edit</button>
          <button onClick={onDelete} className="btn-danger">Delete</button>
        </div>
      </div>
      <div className="client-contact">
        <p><strong>Phone:</strong> {client.phoneNumber}</p>
        <p><strong>Email:</strong> {client.email}</p>
      </div>
      {renderBusinessSpecificInfo()}
    </div>
  );
};

// Client Form Modal Component
const ClientFormModal = ({ client, businessType, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: client.name || '',
    phoneNumber: client.phoneNumber || '',
    email: client.email || '',
    ...client
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderBusinessSpecificFields = () => {
    switch (businessType) {
      case 'dental':
        return (
          <>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dateOfBirth: e.target.value
                }))}
              />
            </div>
            <div className="form-group">
              <label>Allergies</label>
              <input
                type="text"
                placeholder="Enter allergies separated by commas"
                value={formData.medicalHistory?.allergies?.join(', ') || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  medicalHistory: {
                    ...prev.medicalHistory,
                    allergies: e.target.value.split(',').map(a => a.trim())
                  }
                }))}
              />
            </div>
          </>
        );
      case 'gym':
        return (
          <>
            <div className="form-group">
              <label>Membership Type</label>
              <select
                value={formData.membershipType || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  membershipType: e.target.value
                }))}
              >
                <option value="">Select membership</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Membership End Date</label>
              <input
                type="date"
                value={formData.membershipEnd || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  membershipEnd: e.target.value
                }))}
              />
            </div>
          </>
        );
      case 'hotel':
        return (
          <>
            <div className="form-group">
              <label>Preferred Language</label>
              <select
                value={formData.language || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  language: e.target.value
                }))}
              >
                <option value="">Select language</option>
                <option value="EN">English</option>
                <option value="RO">Romanian</option>
                <option value="FR">French</option>
                <option value="DE">German</option>
              </select>
            </div>
            <div className="form-group">
              <label>Loyalty Level</label>
              <select
                value={formData.loyaltyProgram?.level || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  loyaltyProgram: {
                    ...prev.loyaltyProgram,
                    level: e.target.value
                  }
                }))}
              >
                <option value="">Select level</option>
                <option value="Standard">Standard</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{client.id ? 'Edit Client' : 'Add New Client'}</h3>
          <button onClick={onCancel} className="btn-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: e.target.value
              }))}
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                phoneNumber: e.target.value
              }))}
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
            />
          </div>

          {renderBusinessSpecificFields()}

          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {client.id ? 'Update' : 'Create'} Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientsManagement;
```

## Business-Specific Hooks (Optional Enhancement)

```javascript
// hooks/useClientManagement.js
import { useDataSync } from '../design-patterns/hooks';
import { useMemo } from 'react';

export const useClientManagement = (businessType, options = {}) => {
  const clientsSync = useDataSync('clients', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true,
    ...options
  });

  // Business-specific client processing
  const processedClients = useMemo(() => {
    const clients = clientsSync.data?.items || clientsSync.data || [];
    
    switch (businessType) {
      case 'dental':
        return clients.map(client => ({
          ...client,
          upcomingAppointments: getUpcomingAppointments(client.id),
          riskLevel: calculateRiskLevel(client.medicalHistory)
        }));
        
      case 'gym':
        return clients.map(client => ({
          ...client,
          membershipStatus: getMembershipStatus(client),
          fitnessProgress: calculateProgress(client)
        }));
        
      case 'hotel':
        return clients.map(client => ({
          ...client,
          preferredRoom: getPreferredRoom(client.preferences),
          totalStays: client.bookingHistory?.length || 0
        }));
        
      default:
        return clients;
    }
  }, [clientsSync.data, businessType]);

  // Business-specific validation
  const validateClient = (clientData, operation) => {
    const baseValidation = clientsSync.validateData(clientData, operation);
    
    if (!baseValidation.isValid) {
      return baseValidation;
    }

    // Additional business-specific validation
    const businessErrors = [];
    
    switch (businessType) {
      case 'dental':
        if (operation === 'create' && !clientData.dateOfBirth) {
          businessErrors.push('Date of birth is required for dental patients');
        }
        break;
        
      case 'gym':
        if (operation === 'create' && !clientData.membershipType) {
          businessErrors.push('Membership type is required');
        }
        if (clientData.membershipEnd && new Date(clientData.membershipEnd) < new Date()) {
          businessErrors.push('Membership end date cannot be in the past');
        }
        break;
        
      case 'hotel':
        if (!clientData.language) {
          businessErrors.push('Preferred language is required');
        }
        break;
    }

    return {
      isValid: businessErrors.length === 0,
      errors: businessErrors
    };
  };

  return {
    ...clientsSync,
    clients: processedClients,
    validateClient
  };
};

// Helper functions
const getUpcomingAppointments = (clientId) => {
  // Implementation to fetch upcoming appointments
  return [];
};

const calculateRiskLevel = (medicalHistory) => {
  // Implementation to calculate risk level based on medical history
  return 'low';
};

const getMembershipStatus = (client) => {
  const endDate = new Date(client.membershipEnd);
  const now = new Date();
  
  if (endDate < now) return 'expired';
  if (endDate - now < 30 * 24 * 60 * 60 * 1000) return 'expiring';
  return 'active';
};

const calculateProgress = (client) => {
  // Implementation to calculate fitness progress
  return { trend: 'improving', score: 85 };
};

const getPreferredRoom = (preferences) => {
  // Implementation to determine preferred room type
  return preferences?.roomType || 'Standard';
};
```

## Usage in Different Business Types

### Dental Clinic
```jsx
// DentalClientsView.jsx
import ClientsManagement from './ClientsManagement';

const DentalClientsView = () => {
  return <ClientsManagement />;
  // Automatically handles dental-specific fields and validation
};
```

### Gym
```jsx
// GymMembersView.jsx  
import ClientsManagement from './ClientsManagement';

const GymMembersView = () => {
  return <ClientsManagement />;
  // Automatically handles gym membership fields and validation
};
```

### Hotel
```jsx
// HotelGuestsView.jsx
import ClientsManagement from './ClientsManagement';

const HotelGuestsView = () => {
  return <ClientsManagement />;
  // Automatically handles hotel guest preferences and validation
};
```

## Key Features Demonstrated

1. **Unified Component**: Single component works across all business types
2. **Automatic Configuration**: Resource endpoints configured based on business type
3. **Optimistic Updates**: UI updates immediately with automatic rollback on errors
4. **Offline Support**: Operations queued when offline and synced when online
5. **Validation**: Business-specific validation with user feedback
6. **Permission Checks**: Role-based operation permissions
7. **Error Handling**: Comprehensive error handling with user-friendly messages
8. **Pagination**: Built-in pagination support for large datasets
9. **Search/Filter**: Client-side filtering with server-side search capability
10. **Business Logic**: Conditional fields and behavior based on business type

This example demonstrates how the data flow system provides a robust, scalable foundation for building CRUD operations that work seamlessly across different business types while maintaining offline functionality and optimal user experience. 