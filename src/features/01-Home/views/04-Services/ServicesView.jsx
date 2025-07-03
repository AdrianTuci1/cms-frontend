import React, { useState, useMemo } from 'react';
import styles from './ServicesView.module.css';
import { getBusinessType, BUSINESS_TYPES } from '../../../../config/businessTypes';
import { useDataSync } from '../../../../design-patterns/hooks';
import TreatmentCard from '../../components/dental/services/TreatmentCard.jsx';
import PackageCard from '../../components/gym/services/PackageCard.jsx';
import RoomCard from '../../components/hotel/services/RoomCard.jsx';
import useDrawerStore from '../../../00-Drawers/store/drawerStore';
// import AddService from '../components/drawer/AddService/AddService';

const ServicesView = () => {
  const businessType = getBusinessType();
  const { openDrawer } = useDrawerStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Use useDataSync hook directly for packages data
  const packagesSync = useDataSync('packages', {
    businessType: businessType.name,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const { data: packagesData, loading, error } = packagesSync;

  // Extract packages array from the nested structure
  const packages = useMemo(() => {
    if (!packagesData) return [];
    
    // Handle different data structures
    if (Array.isArray(packagesData)) {
      return packagesData;
    }
    
    // Handle nested structure from mock data
    if (packagesData.packages && Array.isArray(packagesData.packages)) {
      return packagesData.packages;
    }
    
    // Handle response structure
    if (packagesData.response?.data?.packages && Array.isArray(packagesData.response.data.packages)) {
      return packagesData.response.data.packages;
    }
    
    return [];
  }, [packagesData]);

  // Folosește doar datele de la API
  const services = packages || [];

  const handleAddService = () => {
    // openDrawer(<AddService />, 'add service');
    console.log('Add service functionality not implemented yet');
  }

  const getSearchPlaceholder = () => {
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return 'Search treatments...';
      case BUSINESS_TYPES.GYM.name:
        return 'Search packages...';
      case BUSINESS_TYPES.HOTEL.name:
        return 'Search rooms...';
      default:
        return 'Search services...';
    }
  };

  const getCountText = () => {
    const count = filteredServices.length;
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return `${count} treatments`;
      case BUSINESS_TYPES.GYM.name:
        return `${count} packages`;
      case BUSINESS_TYPES.HOTEL.name:
        return `${count} rooms`;
      default:
        return `${count} services`;
    }
  };

  const filteredServices = useMemo(() => {
    if (!services || !Array.isArray(services)) {
      return [];
    }

    if (!searchQuery.trim()) {
      return services;
    }

    const searchLower = searchQuery.toLowerCase();
    return services.filter(service => 
      service.name?.toLowerCase().includes(searchLower) ||
      service.description?.toLowerCase().includes(searchLower) ||
      (service.category && service.category.toLowerCase().includes(searchLower)) ||
      (service.type && service.type.toLowerCase().includes(searchLower)) ||
      (service.features && service.features.some(feature => 
        feature.toLowerCase().includes(searchLower)
      )) ||
      (service.amenities && service.amenities.some(amenity => 
        amenity.toLowerCase().includes(searchLower)
      ))
    );
  }, [searchQuery, services]);

  const renderServiceCard = (service) => {
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return <TreatmentCard key={service.id} treatment={service} />;
      case BUSINESS_TYPES.GYM.name:
        return <PackageCard key={service.id} packageData={service} />;
      case BUSINESS_TYPES.HOTEL.name:
        return <RoomCard key={service.id} room={service} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.servicesView}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.actions}>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className={styles.filterButton}>
              <svg className={styles.filterIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14 14V21C14 21.5523 13.5523 22 13 22H11C10.4477 22 10 21.5523 10 21V14L3.29289 7.29289C3.10536 7.10536 3 6.851 3 6.58579V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={styles.addButton} onClick={handleAddService}>
              <svg className={styles.plusIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <span className={styles.serviceCount}>{getCountText()}</span>
        </div>
      </div>
      <div className={styles.servicesContainer}>
        {loading ? (
          <div className={styles.loading}>
            <p>Loading services...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>Error loading services: {error.message}</p>
          </div>
        ) : filteredServices.length > 0 ? (
          filteredServices.map(service => renderServiceCard(service))
        ) : searchQuery.trim() ? (
          <div className={styles.emptyState}>
            <p>No services found matching "{searchQuery}". Try a different search term.</p>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No services found. Add a service using the button above.</p>
            {import.meta.env.DEV && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                Debug: Raw data length: {packagesData ? (Array.isArray(packagesData) ? packagesData.length : 'not array') : 'no data'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesView; 