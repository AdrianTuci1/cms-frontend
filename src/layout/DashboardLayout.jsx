import { useState, useEffect } from 'react';
import { getBusinessType } from '../config/businessTypes';
import DashboardNavbar from './navbar/DashboardNavbar';
import DashboardSidebar from './sidebar/DashboardSidebar';
import DrawerManager from '../features/00-Drawers/DrawerManager';
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
        <main className={`${styles.dashboardMain} ${isSidebarExpanded ? styles.mainExpanded : ''}`}>
          <Outlet context={{ 
            currentSection, 
            setCurrentSection,
            currentView, 
            setCurrentView,
            selectedLocation,
            setSelectedLocation
          }} />
        </main>
      </div>
      <DrawerManager />
    </div>
  );
};

export default DashboardLayout; 