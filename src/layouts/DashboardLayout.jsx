import { useState, useEffect } from 'react';
import { getBusinessType } from '../config/businessTypes';
import DashboardNavbar from '../components/navbar/DashboardNavbar';
import DashboardSidebar from '../components/sidebar/DashboardSidebar';
import { Outlet } from 'react-router-dom';

const STORAGE_KEYS = {
  SECTION: 'dashboard_current_section',
  VIEW: 'dashboard_current_view'
};

const DashboardLayout = () => {
  const businessType = getBusinessType();
  
  // Initialize state with values from localStorage or defaults
  const [currentSection, setCurrentSection] = useState(() => {
    const savedSection = localStorage.getItem(STORAGE_KEYS.SECTION);
    return savedSection || 'home';
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
    <div className="dashboard-layout">
      <DashboardNavbar 
        businessType={businessType} 
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      <div className="dashboard-content">
        {currentSection === 'home' && (
          <DashboardSidebar 
            businessType={businessType} 
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        )}
        <main className="dashboard-main">
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