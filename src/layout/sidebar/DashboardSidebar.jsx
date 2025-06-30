import styles from './DashboardSidebar.module.css';
import { FaHome, FaRobot, FaHistory, FaUsers, FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaAngleDown, FaChartLine, FaFileInvoiceDollar, FaBolt } from 'react-icons/fa';
import useTabsStore from '../tabsStore';
import useLocationsStore from '../locationsStore';
import { useState, useEffect } from 'react';
import React from 'react';

const DashboardSidebar = ({ currentSection, setCurrentSection, isExpanded, setIsExpanded }) => {
  const { setActiveSection } = useTabsStore();
  const { locations, currentLocation, setCurrentLocation, fetchLocations } = useLocationsStore();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  
  useEffect(() => {
    // Fetch locations when component mounts
    fetchLocations();
  }, [fetchLocations]);

  const getSidebarSections = () => {
    return [
      { id: 'blitz', label: 'Blitz', icon: <FaBolt className={styles.icon} />, isSpecial: true },
      { id: 'dashboard', label: 'Dashboard', icon: <FaHome className={styles.icon} /> },
      { id: 'stocks', label: 'Stocks', icon: <FaChartLine className={styles.icon} /> },
      { id: 'invoices', label: 'Invoices', icon: <FaFileInvoiceDollar className={styles.icon} /> },
      { id: 'automations', label: 'Automations', icon: <FaRobot className={styles.icon} /> },
      { id: 'activities', label: 'Activities', icon: <FaHistory className={styles.icon} /> },
      { id: 'admin', label: 'Admin', icon: <FaUsers className={styles.icon} /> },
    ];
  };

  const handleSectionChange = (sectionId) => {
    setCurrentSection(sectionId);
    if (sectionId === 'admin' || sectionId === 'settings') {
      setActiveSection(sectionId);
    }
  };
  
  const handleLocationChange = (locationId) => {
    setCurrentLocation(locationId);
    setIsLocationDropdownOpen(false);
  };

  return (
    <aside className={`${styles.dashboardSidebar} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.sidebarTop}>
        <button 
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={styles.iconWrapper}>
            {isExpanded ? 
              <FaArrowLeft className={styles.icon} /> : 
              <FaArrowRight className={styles.icon} />
            }
          </div>
        </button>
      </div>
      
      {isExpanded && currentLocation && (
        <div className={styles.locationSelector}>
          <div 
            className={styles.currentLocation} 
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
          >
            <div className={styles.locationIcon}>
              <FaMapMarkerAlt />
            </div>
            <div className={styles.locationInfo}>
              <div className={styles.locationName}>{currentLocation.name}</div>
              <div className={styles.locationIdentifier}>{currentLocation.identifier}</div>
            </div>
            <div className={`${styles.dropdownIcon} ${isLocationDropdownOpen ? styles.open : ''}`}>
              <FaAngleDown />
            </div>
          </div>
          
          {isLocationDropdownOpen && (
            <div className={styles.locationsDropdown}>
              {locations.map(location => (
                <div 
                  key={location.id} 
                  className={`${styles.locationOption} ${location.id === currentLocation.id ? styles.active : ''}`}
                  onClick={() => handleLocationChange(location.id)}
                >
                  <div className={styles.locationName}>{location.name}</div>
                  <div className={styles.locationIdentifier}>{location.identifier}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className={styles.sidebarMenu}>
        {getSidebarSections().map((section, index) => (
          <React.Fragment key={section.id}>
            {index === 1 && <div className={styles.menuSeparator} />}
            <button
              className={`${styles.sidebarItem} ${currentSection === section.id ? styles.active : ''} ${section.isSpecial ? styles.special : ''}`}
              onClick={() => handleSectionChange(section.id)}
            >
              <div className={styles.iconWrapper}>
                {section.icon}
              </div>
              <span className={styles.label}>{section.label}</span>
            </button>
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
};

export default DashboardSidebar; 