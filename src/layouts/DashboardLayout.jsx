import { useState, useEffect } from 'react';
import { getBusinessType } from '../config/businessTypes';
import DashboardNavbar from '../components/navbar/DashboardNavbar';
import DashboardSidebar from '../components/sidebar/DashboardSidebar';
import { Outlet } from 'react-router-dom';
import styles from './DashboardLayout.module.css';

const STORAGE_KEYS = {
  SECTION: 'dashboard_current_section',
  VIEW: 'dashboard_current_view'
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

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECTION, currentSection);
  }, [currentSection]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW, currentView);
  }, [currentView]);

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
        />
        <main className={styles.dashboardMain}>
          <Outlet context={{ 
            currentSection, 
            setCurrentSection,
            currentView, 
            setCurrentView 
          }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 