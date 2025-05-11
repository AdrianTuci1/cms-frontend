import { useEffect } from 'react';
import useDrawerStore from '../../store/drawerStore';
import styles from './DashboardDrawer.module.css';

const DashboardDrawer = () => {
  const { isOpen, content, title, closeDrawer } = useDrawerStore();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={closeDrawer} />
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={closeDrawer}>
            ×
          </button>
        </div>
        <div className={styles.drawerContent}>
          {content}
        </div>
      </div>
    </>
  );
};

export default DashboardDrawer; 