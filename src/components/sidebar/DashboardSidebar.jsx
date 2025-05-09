import styles from './DashboardSidebar.module.css';
import { FaHome, FaRobot, FaHistory, FaUsers, FaCog } from 'react-icons/fa';
import useTabsStore from '../../store/tabsStore';

const DashboardSidebar = ({ currentSection, setCurrentSection }) => {
  const { setActiveSection } = useTabsStore();

  const getSidebarSections = () => {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: <FaHome className={styles.icon} /> },
      { id: 'automations', label: 'Automations', icon: <FaRobot className={styles.icon} /> },
      { id: 'activities', label: 'Activities', icon: <FaHistory className={styles.icon} /> },
      { id: 'admin', label: 'Admin', icon: <FaUsers className={styles.icon} /> },
      { id: 'settings', label: 'Settings', icon: <FaCog className={styles.icon} /> }
    ];
  };

  const handleSectionChange = (sectionId) => {
    setCurrentSection(sectionId);
    if (sectionId === 'admin' || sectionId === 'settings') {
      setActiveSection(sectionId);
    }
  };

  return (
    <aside className={styles.dashboardSidebar}>
      <div className={styles.sidebarMenu}>
        {getSidebarSections().map((section) => (
          <button
            key={section.id}
            className={`${styles.sidebarItem} ${currentSection === section.id ? styles.active : ''}`}
            onClick={() => handleSectionChange(section.id)}
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