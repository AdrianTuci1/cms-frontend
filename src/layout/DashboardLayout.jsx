import { useState, useEffect } from 'react';
import { getBusinessType } from '../config/businessTypes';
import DashboardNavbar from '../components/navbar/DashboardNavbar';
import DashboardSidebar from '../components/sidebar/DashboardSidebar';
import DashboardDrawer from '../components/drawer/DashboardDrawer';
import { Outlet } from 'react-router-dom';
import styles from './DashboardLayout.module.css';

const STORAGE_KEYS = {
  SECTION: 'dashboard_current_section',
  VIEW: 'dashboard_current_view',
  SIDEBAR_EXPANDED: 'dashboard_sidebar_expanded'
};

const DashboardLayout = () => {
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
        />
        <main className={`${styles.dashboardMain} ${isSidebarExpanded ? styles.mainExpanded : ''}`}>
          <Outlet context={{ 
            currentSection, 
            setCurrentSection,
            currentView, 
            setCurrentView
          }} />
        </main>
      </div>
      <DashboardDrawer />
    </div>
  );
};

export default DashboardLayout; 