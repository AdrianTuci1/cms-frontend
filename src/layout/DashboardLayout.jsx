import { useState, useEffect } from 'react';
import { getBusinessType, getBusinessTypeKey, getCurrentBusinessTypeForSync } from '../config/businessTypes';
import { tenantUtils } from '../config/tenant.js';
import dataSyncManager from '../design-patterns/data-sync';
import DashboardNavbar from './navbar/DashboardNavbar';
import DashboardSidebar from './sidebar/DashboardSidebar';
import DrawerManager from '../features/00-Drawers/DrawerManager';
import useDrawerStore from '../features/00-Drawers/store/drawerStore';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './DashboardLayout.module.css';

const STORAGE_KEYS = {
  SECTION: 'dashboard_current_section',
  VIEW: 'dashboard_current_view',
  SIDEBAR_EXPANDED: 'dashboard_sidebar_expanded',
  SELECTED_LOCATION: 'selectedLocation'
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const businessType = getBusinessType();
  
  // Drawer state
  const { isOpen: isDrawerOpen, getActiveDrawerSize } = useDrawerStore();
  const drawerSize = getActiveDrawerSize();
  
  // Initialize state with values from localStorage or defaults
  const [currentSection, setCurrentSection] = useState(() => {
    const savedSection = localStorage.getItem(STORAGE_KEYS.SECTION);
    return savedSection || 'dashboard';
  });

  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem(STORAGE_KEYS.VIEW);
    return savedView || 'timeline';
  });

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    const savedState = localStorage.getItem(STORAGE_KEYS.SIDEBAR_EXPANDED);
    return savedState === 'true';
  });

  const [selectedLocation, setSelectedLocation] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION);
  });

  // Check if location is selected, if not redirect to locations page
  useEffect(() => {
    if (!selectedLocation) {
      navigate('/', { replace: true });
    }
  }, [selectedLocation, navigate]);

  // Initialize data sync manager with business info
  useEffect(() => {
    if (selectedLocation) {
      const initializeDataSync = async () => {
        try {
          // Get business info from tenant config
          const tenantConfig = tenantUtils.getTenantConfig();
          const businessTypeKey = getBusinessTypeKey();
          const businessTypeForSync = getCurrentBusinessTypeForSync();
          
          // Create business info object
          const businessInfo = {
            business: {
              id: tenantConfig.tenantId,
              name: tenantConfig.name,
              businessType: businessTypeForSync,
              tenantId: tenantConfig.tenantId
            },
            location: {
              id: selectedLocation,
              name: `${tenantConfig.name} - Location ${selectedLocation}`,
              address: 'Main Office'
            }
          };

          // Initialize data sync manager with business info
          dataSyncManager.setBusinessInfo(businessInfo);
          console.log('DataSyncManager initialized with business info:', businessInfo);
        } catch (error) {
          console.error('Failed to initialize DataSyncManager with business info:', error);
        }
      };

      initializeDataSync();
    }
  }, [selectedLocation]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECTION, currentSection);
  }, [currentSection]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW, currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_EXPANDED, isSidebarExpanded);
  }, [isSidebarExpanded]);

  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, selectedLocation);
    }
  }, [selectedLocation]);

  // Get drawer size class
  const getDrawerSizeClass = () => {
    if (!isDrawerOpen) return '';
    return `mainWithDrawer${drawerSize.charAt(0).toUpperCase() + drawerSize.slice(1)}`;
  };

  // If no location is selected, show loading
  if (!selectedLocation) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading location...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardLayout}>
      <DashboardNavbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentSection={currentSection}
      />
      <div className={styles.dashboardContent}>
        <DashboardSidebar 
          businessType={businessType} 
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
          selectedLocation={selectedLocation}
        />
        <main className={`${styles.dashboardMain} ${isSidebarExpanded ? styles.mainExpanded : ''} ${getDrawerSizeClass()}`}>
          <div className={styles.mainContent}>
            <Outlet context={{ 
              currentSection, 
              setCurrentSection,
              currentView, 
              setCurrentView,
              selectedLocation,
              setSelectedLocation
            }} />
          </div>
          <DrawerManager />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 