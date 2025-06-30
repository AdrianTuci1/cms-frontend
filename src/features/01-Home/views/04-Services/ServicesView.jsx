import React, { useState, useMemo } from 'react';
import styles from './ServicesView.module.css';
import { getBusinessType, BUSINESS_TYPES } from '../config/businessTypes';
import { useDataSync } from '../../../design-patterns/hooks';
import TreatmentCard from '../components/dashboard/dental/TreatmentCard/TreatmentCard';
import PackageCard from '../components/dashboard/gym/Packages/PackageCard';
import RoomCard from '../components/dashboard/hotel/RoomCard/RoomCard';
import useDrawerStore from '../store/drawerStore';
import AddService from '../components/drawer/AddService/AddService';

const ServicesView = () => {
  const businessType = getBusinessType();
  const { openDrawer } = useDrawerStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Data sync hook pentru packages
  const {
    data: packages,
    loading,
    error
  } = useDataSync('packages', {
    businessType: businessType.name,
    enableValidation: true,
    enableBusinessLogic: true
  });

  // Fallback data pentru când nu sunt date de la API
  const fallbackServices = useMemo(() => {
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return [
          {
            id: 1,
            name: 'Dental Cleaning',
            price: 100,
            description: 'Professional teeth cleaning and examination',
            duration: 60,
            category: 'Preventive'
          },
          {
            id: 2,
            name: 'Root Canal',
            price: 800,
            description: 'Treatment for infected tooth pulp',
            duration: 90,
            category: 'Restorative'
          }
        ];
      case BUSINESS_TYPES.GYM.name:
        return [
          {
            id: 1,
            name: 'Basic Fitness',
            price: 49,
            description: 'Access to gym equipment and basic facilities',
            duration: 1,
            type: 'Standard',
            features: ['Gym Access', 'Locker Room', 'Basic Equipment']
          },
          {
            id: 2,
            name: 'Premium Wellness',
            price: 89,
            description: 'Full access to all facilities including pool and spa',
            duration: 3,
            type: 'Premium',
            features: ['Gym Access', 'Pool', 'Spa', 'Personal Trainer', 'Group Classes']
          }
        ];
      case BUSINESS_TYPES.HOTEL.name:
        return [
          {
            id: 1,
            name: 'Deluxe Suite',
            price: 299,
            description: 'Spacious suite with ocean view and private balcony',
            capacity: 2,
            type: 'Suite'
          },
          {
            id: 2,
            name: 'Family Room',
            price: 399,
            description: 'Large room perfect for families with two bedrooms',
            capacity: 4,
            type: 'Family'
          }
        ];
      default:
        return [];
    }
  }, [businessType.name]);

  // Folosește datele de la API sau fallback data
  const services = packages || fallbackServices;

  const handleAddService = () => {
    openDrawer(<AddService />, 'add service');
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesView; 