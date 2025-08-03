import React from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import styles from './DrawerLayout.module.css';

const DrawerLayout = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  isLoading = false,
  actions = null,
  drawerIndex = 0,
  totalDrawers = 1,
  isActive = true
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Calculate stacked positioning - drawers on top of each other
  const zIndex = 1000 + (drawerIndex * 10); // Higher z-index for newer drawers with more spacing

  return (
    <div 
      className={styles.drawerOverlay} 
      onClick={handleBackdropClick}
      style={{ zIndex }}
    >
      <div 
        className={`${styles.drawer} ${styles.standard} ${isActive ? styles.active : ''}`}
        style={{
          zIndex: zIndex + 1 // Drawer should be above its overlay
        }}
      >
        
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerContent}>
            <h2 className={styles.drawerTitle}>{title}</h2>
            {isLoading && (
              <div className={styles.loadingIndicator}>
                <FaSpinner className={styles.spinner} />
                Loading...
              </div>
            )}
          </div>
          <div className={styles.headerActions}>
            {totalDrawers > 1 && (
              <div className={styles.drawerCounter}>
                {drawerIndex + 1}/{totalDrawers}
              </div>
            )}
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close drawer"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.drawerContent}>
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className={styles.drawerActions}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawerLayout; 