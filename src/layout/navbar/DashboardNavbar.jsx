import styles from './DashboardNavbar.module.css';
import { FaChartLine, FaShoppingCart, FaUsers, FaRobot, FaUser, FaCalendarAlt, FaHistory, FaCog, FaDumbbell, FaHome, FaTooth, FaBed } from 'react-icons/fa';
import useTabsStore from '../tabsStore';
import useDrawerStore from '../../features/00-Drawers/store/drawerStore';

import { useEffect } from 'react';
import { getBusinessType, BUSINESS_TYPES } from '../../config/businessTypes';
// import AIAssistantChat from '../drawer/AIAssistant';
// import UserDrawer from '../drawer/UserDrawer/UserDrawer';

const DashboardNavbar = ({ currentView, setCurrentView, currentSection }) => {
  const { activeTab, setActiveTab, getTabsBySection } = useTabsStore();
  const { openDrawer } = useDrawerStore();
  const businessType = getBusinessType();

  useEffect(() => {
    const views = getNavbarViews();
    if (views.length > 0) {
      if (currentSection === 'admin' || currentSection === 'settings') {
        setActiveTab(views[0].id);
      } else {
        setCurrentView(views[0].id);
      }
    }
  }, [currentSection, setActiveTab, setCurrentView]);

  const getNavbarViews = () => {
    switch (currentSection) {
      case 'dashboard':
        const views = [
          { id: 'timeline', label: 'Timeline', icon: <FaCalendarAlt className={styles.icon} /> },
          { id: 'sales', label: 'Sales', icon: <FaShoppingCart className={styles.icon} /> },
          { id: 'clients', label: 'Clients', icon: <FaUsers className={styles.icon} /> }
        ];
        
        // Add Treatments view only for dental clinic
        if (businessType.name === 'Dental Clinic') {
          views.push({ id: 'services', label: 'Treatments', icon: <FaTooth className={styles.icon} /> });
        }
        
        // Add Packages view only for gym
        if (businessType.name === 'Gym') {
          views.push({ id: 'services', label: 'Packages', icon: <FaDumbbell className={styles.icon} /> });
        }

        // Add Rooms view only for hotel
        if (businessType.name === 'Hotel') {
          views.push({ id: 'services', label: 'Rooms', icon: <FaBed className={styles.icon} /> });
        }
        
        return views;
      case 'stocks':
        return [
          { id: 'inventory', label: 'Inventory', icon: <FaChartLine className={styles.icon} /> }
        ];
      case 'automations':
        return [
          { id: 'workflows', label: 'Workflows', icon: <FaRobot className={styles.icon} /> },
          { id: 'triggers', label: 'Triggers', icon: <FaCog className={styles.icon} /> }
        ];
      case 'activities':
        return [
          { id: 'history', label: 'History', icon: <FaHistory className={styles.icon} /> },
          { id: 'reports', label: 'Reports', icon: <FaChartLine className={styles.icon} /> }
        ];
      case 'admin':
        return getTabsBySection('admin').map(tab => ({
          id: tab.id,
          label: tab.label,
          icon: <span className={styles.icon}>{tab.icon}</span>
        }));
      case 'settings':
        return getTabsBySection('settings').map(tab => ({
          id: tab.id,
          label: tab.label,
          icon: <span className={styles.icon}>{tab.icon}</span>
        }));
      default:
        return [];
    }
  };

  const getBusinessLogo = () => {
    // Check for custom logo
    const customLogo = import.meta.env.VITE_CUSTOM_LOGO;
    if (customLogo) {
      return <img src={customLogo} alt="Logo" className={styles.logoImage} />;
    }

    // Display icon based on business type
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return <FaTooth className={styles.logoIcon} />;
      case BUSINESS_TYPES.GYM.name:
        return <FaDumbbell className={styles.logoIcon} />;
      case BUSINESS_TYPES.HOTEL.name:
        return <FaBed className={styles.logoIcon} />;
      default:
        return <FaHome className={styles.logoIcon} />;
    }
  };

  const handleTabClick = (tabId) => {
    if (currentSection === 'admin' || currentSection === 'settings') {
      setActiveTab(tabId);
    } else {
      setCurrentView(tabId);
    }
  };

  return (
    <nav className={styles.dashboardNavbar}>
      <div className={styles.navbarStart}>
        <div className={styles.logo}>
          <div className={styles.logoContainer}>
            {getBusinessLogo()}
          </div>
        </div>
      </div>
      <div className={styles.navbarCenter}>
        <div className={styles.navbarMenu}>
          {getNavbarViews().map((view) => (
            <button
              key={view.id}
              className={`${styles.navItem} ${(currentSection === 'admin' || currentSection === 'settings' ? activeTab : currentView) === view.id ? styles.active : ''}`}
              onClick={() => handleTabClick(view.id)}
            >
              {view.icon}
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.navbarEnd}>
        <button 
          className={styles.navIcon}
          onClick={() => {
            // openDrawer(<AIAssistantChat />, 'Assistants', 'ai-assistant')
            console.log('AI Assistant not implemented yet');
          }}
        >
          <FaRobot className={styles.icon}/>
        </button>
        
        <button 
          className={styles.navIcon}
          onClick={() => {
            // openDrawer(<UserDrawer />, 'User Profile')
            console.log('User Profile not implemented yet');
          }}
        >
          <FaUser className={styles.icon} />
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;