import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faDumbbell,
  faHotel,
  faHospital,
  faDoorOpen,
  faUsers,
  faStethoscope,
  faCalendarAlt,
  faUser,
  faCog,
  faSignOutAlt,
  faIdCard,
  faDatabase
} from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../../store/authStore';
import { BUSINESS_TYPES } from '../../config/businessTypes';
import styles from './PublicNavbar.module.css';

const PublicNavbar = ({ businessType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, login, logout, switchDemoUser } = useAuthStore();


  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    if (path === '/logout') {
      logout();
      setIsMenuOpen(false);
      navigate('/');
    } else {
      navigate(path);
      setIsMenuOpen(false);
    }
  };

  const handleLogin = async () => {
    await login();
  };

  const isActive = (path) => location.pathname === path;

  const getNavItems = () => {
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return [
          { path: '/medics', label: 'Medics', icon: faUsers },
          { path: '/treatments', label: 'Treatments', icon: faStethoscope }
        ];
      case BUSINESS_TYPES.GYM.name:
        return [
          { path: '/packages', label: 'Packages', icon: faIdCard },
          { path: '/classes', label: 'Classes', icon: faCalendarAlt }
        ];
      case BUSINESS_TYPES.HOTEL.name:
        return [
          { path: '/rooms', label: 'Rooms', icon: faDoorOpen }
        ];
      default:
        return [];
    }
  };

  const getBusinessIcon = () => {
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return faHospital;
      case BUSINESS_TYPES.GYM.name:
        return faDumbbell;
      case BUSINESS_TYPES.HOTEL.name:
        return faHotel;
      default:
        return faHome;
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.navbarLeft}>
          <button 
            className={`${styles.navButton} ${isActive('/') ? styles.active : ''}`}
            onClick={() => handleNavigation('/')}
          >
            <FontAwesomeIcon icon={getBusinessIcon()} />
            <span className={styles.buttonLabel}>{businessType.name}</span>
          </button>
          {getNavItems().map((item) => (
            <button
              key={item.path}
              className={`${styles.navButton} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span className={styles.buttonLabel}>{item.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.navbarDivider}></div>

        <div className={styles.navbarRight}>
          {user ? (
            <>
              {user.accessLevel === 'vip' && (
                <button
                  className={`${styles.navButton} ${isActive('/dashboard') ? styles.active : ''}`}
                  onClick={() => handleNavigation('/dashboard')}
                >
                  <FontAwesomeIcon icon={faDatabase} />
                  <span className={styles.buttonLabel}>Dashboard</span>
                </button>
              )}
              <div className={styles.userMenu}>
                <button className={styles.userButton} onClick={handleMenuToggle}>
                  <FontAwesomeIcon icon={faUser} />
                </button>
                {isMenuOpen && (
                  <div className={styles.menuDropdown}>
                    <button className={styles.menuItem} onClick={() => switchDemoUser()}>
                      <FontAwesomeIcon icon={faDumbbell} />
                      <span>Schimbă Utilizator Demo</span>
                    </button>
                    <button className={styles.menuItem} onClick={() => handleNavigation('/settings')}>
                      <FontAwesomeIcon icon={faCog} />
                      <span>Settings</span>
                    </button>
                    <button className={`${styles.menuItem} ${styles.logout}`} onClick={() => handleNavigation('/logout')}>
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              className={`${styles.navButton} ${isActive('/login') ? styles.active : ''}`}
              onClick={handleLogin}
            >
              <FontAwesomeIcon icon={faUser} />
              <span className={styles.buttonLabel}>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar; 