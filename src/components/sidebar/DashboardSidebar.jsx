import styles from './DashboardSidebar.module.css';
import { FaHome, FaRobot, FaHistory, FaUsers } from 'react-icons/fa';

const DashboardSidebar = ({ businessType, currentSection, setCurrentSection }) => {
  const getSidebarItems = () => {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: <FaHome className={styles.icon} /> },
      { id: 'automations', label: 'Automations', icon: <FaRobot className={styles.icon} /> },
      { id: 'activities', label: 'Activities', icon: <FaHistory className={styles.icon} /> },
      { id: 'team', label: 'Team', icon: <FaUsers className={styles.icon} /> }
    ];
  };

  return (
    <aside className={styles.dashboardSidebar}>
      <div className={styles.sidebarHeader}>
        <span>{businessType.name} Dashboard</span>
      </div>
      <div className={styles.sidebarMenu}>
        {getSidebarItems().map((item) => (
          <button
            key={item.id}
            className={`${styles.sidebarItem} ${currentSection === item.id ? styles.active : ''}`}
            onClick={() => setCurrentSection(item.id)}
          >
            <div className={styles.iconWrapper}>
              {item.icon}
            </div>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default DashboardSidebar; 