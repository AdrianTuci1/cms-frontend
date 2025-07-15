import styles from './DashboardSidebar.module.css';
import { FaHome, FaRobot, FaHistory, FaUsers, FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaAngleDown, FaChartLine, FaFileInvoiceDollar, FaBolt } from 'react-icons/fa';
import useTabsStore from '../tabsStore';
import { useState, useEffect } from 'react';
import React from 'react';
import { tenantUtils } from '../../config/tenant.js';
import GeneralService from '../../api/services/GeneralService.js';

const DashboardSidebar = ({ currentSection, setCurrentSection, isExpanded, setIsExpanded, selectedLocation }) => {
  const { setActiveSection } = useTabsStore();
  const [locations, setLocations] = useState([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  
  useEffect(() => {
    // Fetch business info to get locations
    const fetchLocations = async () => {
      try {
        // În test mode, folosește datele de demo direct
        if (tenantUtils.isTestMode()) {
          console.log('TEST MODE: Using demo business locations data');
          const demoInfo = tenantUtils.getDemoBusinessInfo();
          if (demoInfo?.locations) {
            setLocations(demoInfo.locations);
          }
          return;
        }
        
        // Try to get business info from API first
        const generalService = new GeneralService();
        try {
          const businessInfo = await generalService.getBusinessInfo();
          if (businessInfo?.locations) {
            setLocations(businessInfo.locations);
          }
        } catch (apiError) {
          console.warn('Failed to get business info from API, using tenant config:', apiError);
          
          // Fallback to tenant configuration
          const tenantConfig = tenantUtils.getTenantConfig();
          const fallbackLocations = [{
            id: tenantConfig.defaultLocation,
            name: `${tenantConfig.name} - Main Location`,
            address: 'Main Office',
            isActive: true
          }];
          setLocations(fallbackLocations);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    
    fetchLocations();
  }, []);

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
    // Update localStorage and reload to change location
    localStorage.setItem('selectedLocation', locationId);
    window.location.reload();
  };

  // Find current location object from locations array
  const currentLocation = locations.find(loc => loc.id === selectedLocation) || null;

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
              <div className={styles.locationIdentifier}>{currentLocation.id}</div>
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
                  className={`${styles.locationOption} ${location.id === selectedLocation ? styles.active : ''}`}
                  onClick={() => handleLocationChange(location.id)}
                >
                  <div className={styles.locationName}>{location.name}</div>
                  <div className={styles.locationIdentifier}>{location.id}</div>
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