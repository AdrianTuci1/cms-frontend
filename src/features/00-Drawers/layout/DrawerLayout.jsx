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
  size = 'medium' // 'small', 'medium', 'large', 'full'
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

  return (
    <div className={styles.drawerOverlay} onClick={handleBackdropClick}>
      <div className={`${styles.drawer} ${styles[size]}`}>
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerContent}>
            <h2 className={styles.drawerTitle}>{title}</h2>
            {isLoading && (
              <div className={styles.loadingIndicator}>
                <FaSpinner className={styles.spinner} />
              </div>
            )}
          </div>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close drawer"
          >
            <FaTimes />
          </button>
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