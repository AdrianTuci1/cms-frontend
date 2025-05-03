import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome,
  FaDumbbell,
  FaHotel,
  FaHospital,
  FaDoorOpen,
  FaUsers,
  FaStethoscope,
  FaCalendarAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaIdCard,
  FaDatabase
} from 'react-icons/fa';
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
          { path: '/medics', label: 'Medics', icon: FaUsers },
          { path: '/treatments', label: 'Treatments', icon: FaStethoscope }
        ];
      case BUSINESS_TYPES.GYM.name:
        return [
          { path: '/packages', label: 'Packages', icon: FaIdCard },
          { path: '/classes', label: 'Classes', icon: FaCalendarAlt }
        ];
      case BUSINESS_TYPES.HOTEL.name:
        return [
          { path: '/rooms', label: 'Rooms', icon: FaDoorOpen }
        ];
      default:
        return [];
    }
  };

  const getBusinessIcon = () => {
    switch (businessType.name) {
      case BUSINESS_TYPES.DENTAL_CLINIC.name:
        return FaHospital;
      case BUSINESS_TYPES.GYM.name:
        return FaDumbbell;
      case BUSINESS_TYPES.HOTEL.name:
        return FaHotel;
      default:
        return FaHome;
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
            {React.createElement(getBusinessIcon())}
            <span className={styles.buttonLabel}>{businessType.name}</span>
          </button>
          {getNavItems().map((item) => (
            <button
              key={item.path}
              className={`${styles.navButton} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              {React.createElement(item.icon)}
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
                  <FaDatabase />
                  <span className={styles.buttonLabel}>Dashboard</span>
                </button>
              )}
              <div className={styles.userMenu}>
                <button className={styles.userButton} onClick={handleMenuToggle}>
                  <FaUser />
                </button>
                {isMenuOpen && (
                  <div className={styles.menuDropdown}>
                    <button className={styles.menuItem} onClick={() => switchDemoUser()}>
                      <FaDumbbell />
                      <span>Schimbă Utilizator Demo</span>
                    </button>
                    <button className={styles.menuItem} onClick={() => handleNavigation('/settings')}>
                      <FaCog />
                      <span>Settings</span>
                    </button>
                    <button className={`${styles.menuItem} ${styles.logout}`} onClick={() => handleNavigation('/logout')}>
                      <FaSignOutAlt />
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
              <FaUser />
              <span className={styles.buttonLabel}>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar; 