import styles from './DashboardNavbar.module.css';
import { FaChartLine, FaShoppingCart, FaUsers, FaRobot, FaUser, FaCalendarAlt, FaHistory, FaCog, FaArrowLeft, FaPlus } from 'react-icons/fa';
import ConversationsMenu from '../dashboard/ConversationsMenu';

const DashboardNavbar = ({ currentView, setCurrentView, currentSection }) => {
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
      case 'team':
        return [
          { id: 'members', label: 'Members', icon: <FaUsers className={styles.icon} /> },
          { id: 'roles', label: 'Roles', icon: <FaUser className={styles.icon} /> }
        ];
      default:
        return [];
    }
  };

  return (
    <nav className={styles.dashboardNavbar}>
      <div className={styles.navbarStart}>
        <div className={styles.logo}>
          <span>Dashboard</span>
        </div>
      </div>
      <div className={styles.navbarCenter}>
        <div className={styles.navbarMenu}>
          {getNavbarViews().map((view) => (
            <button
              key={view.id}
              className={`${styles.navItem} ${currentView === view.id ? styles.active : ''}`}
              onClick={() => setCurrentView(view.id)}
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