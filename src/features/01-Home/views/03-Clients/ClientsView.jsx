import React, { useState, useMemo } from 'react';
import { getBusinessType } from '../../../../config/businessTypes';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useDataSync } from '../../../../design-patterns/hooks';
import useDrawerStore, { DRAWER_TYPES } from '../../../00-Drawers/store/drawerStore';
import GymClientCard from '../../components/gym/clients/GymClientCard';
import DentalClientCard from '../../components/dental/clients/DentalClientCard';
import HotelClientCard from '../../components/hotel/clients/HotelClientCard';
import styles from './ClientsView.module.css';

const ClientsView = () => {
  const businessType = getBusinessType();
  const [searchTerm, setSearchTerm] = useState('');
  const { openDrawer } = useDrawerStore();

  // Use useDataSync hook directly for clients data
  const clientsSync = useDataSync('clients', {
    businessType: businessType.name,
    page: 1,
    limit: 100,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const { data: clientsData, loading, error } = clientsSync;

  // Extract clients array from the nested structure
  const clients = useMemo(() => {
    if (!clientsData) return [];
    
    // Handle different data structures
    if (Array.isArray(clientsData)) {
      return clientsData;
    }
    
    // Handle nested structure from mock data
    if (clientsData.clients && Array.isArray(clientsData.clients)) {
      return clientsData.clients;
    }
    
    // Handle response structure
    if (clientsData.response?.data?.clients && Array.isArray(clientsData.response.data.clients)) {
      return clientsData.response.data.clients;
    }
    
    return [];
  }, [clientsData]);

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    if (!clients || !Array.isArray(clients)) {
      return [];
    }

    if (!searchTerm.trim()) {
      return clients;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower) ||
      client.phone?.includes(searchTerm) ||
      client.doctor?.toLowerCase().includes(searchLower) ||
      client.trainer?.toLowerCase().includes(searchLower) ||
      client.previousTreatment?.name?.toLowerCase().includes(searchLower) ||
      client.nextTreatment?.name?.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, clients]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClientClick = (client) => {
    // Edit existing client
    const clientData = {
      id: client.id,
      name: client.name || client.clientName || client.patientName || client.guestName || '',
      phoneNumber: client.phoneNumber || client.phone || '',
      email: client.email || '',
      role: client.role || 'client'
    };

    openDrawer('edit', DRAWER_TYPES.MEMBER, clientData, {
      title: `Edit ${businessType.name === 'Dental Clinic' ? 'Patient' : businessType.name === 'Gym' ? 'Member' : 'Guest'}`,
      onSave: async (data, mode) => {
        console.log('Updating client:', data);
        
        try {
          // Use optimistic update from useDataSync
          await clientsSync.update(data);
          console.log('Client updated successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to update client:', error);
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onDelete: async (data) => {
        console.log('Deleting client:', data);
        
        try {
          // Use optimistic update from useDataSync
          await clientsSync.remove(data);
          console.log('Client deleted successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to delete client:', error);
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onCancel: () => {
        console.log('Client edit cancelled');
      }
    });
  };

  const handleAddClient = () => {
    // Create new client with default values
    const newClient = {
      name: '',
      phoneNumber: '',
      email: '',
      role: 'client'
    };

    openDrawer('create', DRAWER_TYPES.MEMBER, newClient, {
      title: `New ${businessType.name === 'Dental Clinic' ? 'Patient' : businessType.name === 'Gym' ? 'Member' : 'Guest'}`,
      onSave: async (data, mode) => {
        console.log('Creating client:', data);
        
        try {
          // Use optimistic update from useDataSync
          await clientsSync.create(data);
          console.log('Client created successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to create client:', error);
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onCancel: () => {
        console.log('Client creation cancelled');
      }
    });
  };

  const renderClientCard = (client) => {
    const cardProps = {
      client: client,
      onClick: () => handleClientClick(client)
    };

    switch (businessType.name) {
      case 'Gym':
        return <GymClientCard key={client.id} {...cardProps} />;
      case 'Dental Clinic':
        return <DentalClientCard key={client.id} {...cardProps} />;
      case 'Hotel':
        return <HotelClientCard key={client.id} {...cardProps} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.adminView}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search clients by name, email, phone, doctor, or treatment..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.addButton} onClick={handleAddClient}>
          <FaPlus className={styles.icon}/>
          Adaugă Client
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.membersContainer}>
          {loading ? (
            <div className={styles.loading}>
              <p>Loading clients...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Error loading clients: {error.message}</p>
            </div>
          ) : filteredClients.length > 0 ? (
            filteredClients.map(client => renderClientCard(client))
          ) : searchTerm.trim() ? (
            <div className={styles.emptyState}>
              <p>No clients found matching "{searchTerm}". Try a different search term.</p>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No clients found. Add a client using the button above.</p>
              {import.meta.env.DEV && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                  Debug: Raw data length: {clientsData ? (Array.isArray(clientsData) ? clientsData.length : 'not array') : 'no data'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsView; 