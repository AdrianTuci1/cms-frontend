import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tenantUtils } from '../config/tenant.js';
import GeneralService from '../api/services/GeneralService.js';

import styles from './LocationsPage.module.css';

// Mock user data for demonstration
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  accessLevel: 'manager'
};

const LocationsPage = () => {
  const navigate = useNavigate();
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Get current tenant info
  const currentTenantId = tenantUtils.getCurrentTenantId();
  const currentBusinessType = tenantUtils.getCurrentBusinessType();
  const currentBusinessId = tenantUtils.getCurrentBusinessId();

  useEffect(() => {
    console.log('useEffect triggered with businessId:', currentBusinessId);
    const fetchBusinessInfo = async () => {
      try {
        setLoading(true);
        
        // Get business info from API using business ID
        const generalService = new GeneralService();
        const info = await generalService.getBusinessInfo(currentBusinessId);
        console.log('API Response:', info);
        console.log('API Response type:', typeof info);
        console.log('API Response keys:', Object.keys(info || {}));
        
        // Validate API response structure
        if (!info) {
          throw new Error('API returned null or undefined response');
        }
        
        if (!info.companyName) {
          console.warn('API response missing companyName:', info);
        }
        
        if (!info.locations || !Array.isArray(info.locations)) {
          console.warn('API response missing or invalid locations:', info.locations);
        }
        
        // Transform API response to match expected format
        const transformedInfo = {
          business: {
            id: currentBusinessId,
            name: info.companyName || 'Business Management System',
            businessType: currentBusinessType,
            tenantId: currentTenantId
          },
          locations: Array.isArray(info.locations) ? info.locations : []
        };
        
        console.log('Transformed Info:', transformedInfo);
        console.log('Locations count:', transformedInfo.locations.length);
        setBusinessInfo(transformedInfo);
      } catch (err) {
        setError('Failed to load business information');
        console.error('Error fetching business info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [currentTenantId, currentBusinessId]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleContinue = () => {
    if (selectedLocation) {
      // Set the selected location and business ID in localStorage
      localStorage.setItem('selectedLocation', selectedLocation.id);
      localStorage.setItem('locationId', selectedLocation.id);
      localStorage.setItem('businessId', currentBusinessId);
      
      console.log('🔧 LocationsPage: Setting localStorage values:', {
        selectedLocation: selectedLocation.id,
        locationId: selectedLocation.id,
        businessId: currentBusinessId,
        timestamp: new Date().toISOString()
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    }
  };



  const getBusinessTypeIcon = (businessType) => {
    switch (businessType) {
      case 'dental':
        return '🦷';
      case 'gym':
        return '💪';
      case 'hotel':
        return '🏨';
      default:
        return '🏢';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your business information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('Current businessInfo state:', businessInfo);
  console.log('Current businessId:', currentBusinessId);
  console.log('BusinessInfo type:', typeof businessInfo);
  console.log('BusinessInfo keys:', businessInfo ? Object.keys(businessInfo) : 'null');
  console.log('Locations in state:', businessInfo?.locations);
  console.log('Locations array type:', Array.isArray(businessInfo?.locations));
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.businessInfo}>
            <div className={styles.businessIcon}>
              {getBusinessTypeIcon(currentBusinessType)}
            </div>
            <div className={styles.businessDetails}>
              <h1>{businessInfo?.business?.name || 'Business Management System'}</h1>
              <p className={styles.businessType}>
                {currentBusinessType.charAt(0).toUpperCase() + currentBusinessType.slice(1)} Management
              </p>
              {businessInfo?.business?.id && (
                <p className={styles.businessId}>ID: {businessInfo.business.id}</p>
              )}
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {mockUser.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userDetails}>
                <p className={styles.userName}>{mockUser.name}</p>
                <p className={styles.userEmail}>{mockUser.email}</p>
              </div>
            </div>
          </div>
        </header>



        {/* Locations */}
        <section className={styles.locations}>
          <h3>Available Locations ({businessInfo?.locations?.length || 0})</h3>
          <div className={styles.locationsGrid}>
            {businessInfo?.locations && businessInfo.locations.length > 0 ? (
              businessInfo.locations.map((location, index) => {
                console.log(`Rendering location ${index}:`, location);
                return (
              <div
                key={location.id}
                className={`${styles.locationCard} ${
                  selectedLocation?.id === location.id ? styles.selected : ''
                }`}
                onClick={() => handleLocationSelect(location)}
              >
                <div className={styles.locationHeader}>
                  <div className={styles.locationIcon}>📍</div>
                  <h4>{location.name}</h4>
                </div>
                
                <div className={styles.locationDetails}>
                  <p className={styles.locationAddress}>
                    {typeof location.address === 'string' 
                      ? location.address 
                      : `${location.address?.street || ''}${location.address?.street && location.address?.city ? ', ' : ''}${location.address?.city || ''}`
                    }
                  </p>
                  <p className={styles.locationPhone}>{location.phone}</p>
                  
                  {location.businessHours && (
                    <div className={styles.businessHours}>
                      <p>Today: {location.businessHours.monday?.closed ? 'Closed' : 
                        `${location.businessHours.monday?.open} - ${location.businessHours.monday?.close}`}</p>
                    </div>
                  )}
                  
                  <div className={styles.locationServices}>
                    {location.services?.slice(0, 3).map((service, index) => (
                      <span key={index} className={styles.serviceTag}>
                        {service}
                      </span>
                    ))}
                    {location.services?.length > 3 && (
                      <span className={styles.serviceTag}>+{location.services.length - 3} more</span>
                    )}
                  </div>
                </div>

                {location.isDefault && (
                  <div className={styles.defaultBadge}>Default</div>
                )}
              </div>
            );
            })
            ) : (
              <div className={styles.noLocations}>
                <p>No locations available for this business.</p>
                <details>
                  <summary>Debug: Raw API Response</summary>
                  <pre style={{fontSize: '12px', background: '#f5f5f5', padding: '10px', overflow: 'auto'}}>
                    {JSON.stringify(businessInfo, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </section>

        {/* Continue Button */}
        <section className={styles.actions}>
          <button
            className={`${styles.continueButton} ${
              !selectedLocation ? styles.disabled : ''
            }`}
            onClick={handleContinue}
            disabled={!selectedLocation}
          >
            Continue to Dashboard
          </button>
          
          {!selectedLocation && (
            <p className={styles.selectionHint}>
              Please select a location to continue
            </p>
          )}
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2024 Business Management System. All rights reserved.</p>
          <p>Tenant: {currentTenantId} | Business ID: {currentBusinessId || 'Not set'} | Environment: {import.meta.env.MODE}</p>
        </footer>
      </div>
    </div>
  );
};

export default LocationsPage; 