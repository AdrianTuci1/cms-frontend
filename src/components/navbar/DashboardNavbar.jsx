import styles from './DashboardNavbar.module.css';
import { FaChartLine, FaShoppingCart, FaUsers, FaRobot, FaUser, FaCalendarAlt, FaHistory, FaCog, FaDumbbell } from 'react-icons/fa';
import ConversationsMenu from '../dashboard/ConversationsMenu';
import useTabsStore from '../../store/tabsStore';

const DashboardNavbar = ({ currentView, setCurrentView, currentSection }) => {
  const { activeTab, setActiveTab, getTabsBySection } = useTabsStore();

  const getNavbarViews = () => {
    switch (currentSection) {
      case 'dashboard':
        return [
          { id: 'timeline', label: 'Timeline', icon: <FaCalendarAlt className={styles.icon} /> },
          { id: 'stocks', label: 'Stocks', icon: <FaChartLine className={styles.icon} /> },
          { id: 'sales', label: 'Sales', icon: <FaShoppingCart className={styles.icon} /> },
          { id: 'clients', label: 'Clients', icon: <FaUsers className={styles.icon} /> }
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
          <FaDumbbell className={styles.icon} />
          <span>YourCompany</span>
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
        <ConversationsMenu />
        <button className={styles.navIcon}>
          <FaUser className={styles.icon} />
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar; 