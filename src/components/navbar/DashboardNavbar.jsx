import styles from './DashboardNavbar.module.css';
import { FaChartLine, FaShoppingCart, FaUsers, FaBoxes, FaRobot, FaUser } from 'react-icons/fa';

const DashboardNavbar = ({ currentView, setCurrentView }) => {
  
  const getNavbarItems = () => {
    return [
      { id: 'analytics', label: 'Analytics', icon: <FaChartLine className={styles.icon} /> },
      { id: 'orders', label: 'Orders', icon: <FaShoppingCart className={styles.icon} /> },
      { id: 'customers', label: 'Customers', icon: <FaUsers className={styles.icon} /> },
      { id: 'inventory', label: 'Inventory', icon: <FaBoxes className={styles.icon} /> }
    ];
  };

  return (
    <nav className={styles.dashboardNavbar}>
      <div className={styles.navbarStart}>
        <div className={styles.logo}>
          <span>LOGO</span>
        </div>
      </div>
      <div className={styles.navbarCenter}>
        <div className={styles.navbarMenu}>
          {getNavbarItems().map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${currentView === item.id ? styles.active : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.navbarEnd}>
        <button className={styles.navIcon}>
          <FaRobot className={styles.icon} />
        </button>
        <button className={styles.navIcon}>
          <FaUser className={styles.icon} />
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar; 