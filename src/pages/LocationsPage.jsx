import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMockData, tenantUtils } from '../api/mockData';
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
  const currentTenantId = tenantUtils.getTenantId();
  const currentBusinessType = tenantUtils.getBusinessType();

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        setLoading(true);
        const info = getMockData('business-info', currentTenantId);
        setBusinessInfo(info);
      } catch (err) {
        setError('Failed to load business information');
        console.error('Error fetching business info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [currentTenantId]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleContinue = () => {
    if (selectedLocation) {
      // Set the selected location in localStorage or context
      localStorage.setItem('selectedLocation', selectedLocation.id);
      // Navigate to dashboard
      navigate('/dashboard');
    }
  };

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) {
      timeGreeting = 'Good morning';
    } else if (hour < 18) {
      timeGreeting = 'Good afternoon';
    } else {
      timeGreeting = 'Good evening';
    }
    
    return `${timeGreeting}, ${mockUser.name}! Welcome back to your business management system.`;
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
            </div>
          </div>
          
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {mockUser.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{mockUser.name}</p>
              <p className={styles.userEmail}>{mockUser.email}</p>
            </div>
          </div>
        </header>

        {/* Greeting */}
        <section className={styles.greeting}>
          <h2>{getGreetingMessage()}</h2>
          <p>Please select a location to continue to your dashboard.</p>
        </section>

        {/* Locations */}
        <section className={styles.locations}>
          <h3>Available Locations</h3>
          <div className={styles.locationsGrid}>
            {businessInfo?.locations?.map((location) => (
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
                    {location.address?.street}, {location.address?.city}
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
            ))}
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
          <p>Tenant: {currentTenantId} | Environment: {import.meta.env.MODE}</p>
        </footer>
      </div>
    </div>
  );
};

export default LocationsPage; 