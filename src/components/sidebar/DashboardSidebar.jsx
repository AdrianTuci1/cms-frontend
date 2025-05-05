import styles from './DashboardSidebar.module.css';
import { FaHome, FaRobot, FaHistory, FaUsers, FaCog } from 'react-icons/fa';

const DashboardSidebar = ({ currentSection, setCurrentSection }) => {
  const getSidebarSections = () => {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: <FaHome className={styles.icon} /> },
      { id: 'automations', label: 'Automations', icon: <FaRobot className={styles.icon} /> },
      { id: 'activities', label: 'Activities', icon: <FaHistory className={styles.icon} /> },
      { id: 'team', label: 'Team', icon: <FaUsers className={styles.icon} /> },
      { id: 'settings', label: 'Settings', icon: <FaCog className={styles.icon} /> }
    ];
  };

  return (
    <aside className={styles.dashboardSidebar}>
      <div className={styles.sidebarMenu}>
        {getSidebarSections().map((section) => (
          <button
            key={section.id}
            className={`${styles.sidebarItem} ${currentSection === section.id ? styles.active : ''}`}
            onClick={() => setCurrentSection(section.id)}
          >
            <div className={styles.iconWrapper}>
              {section.icon}
            </div>
            <span className={styles.label}>{section.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default DashboardSidebar; 