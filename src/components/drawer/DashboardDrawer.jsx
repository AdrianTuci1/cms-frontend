import { useEffect } from 'react';
import useDrawerStore from '../../store/drawerStore';
import styles from './DashboardDrawer.module.css';

const DashboardDrawer = () => {
  const { isOpen, content, title, type, closeDrawer } = useDrawerStore();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen && type === 'drawer') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, type]);

  if (!isOpen) return null;

  // Handle AI Assistant chat differently
  if (type === 'ai-assistant') {
    return content;
  }

  // Regular drawer
  return (
    <>
      <div className={styles.overlay} onClick={closeDrawer} />
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.drawerContent}>
          {content}
        </div>
      </div>
    </>
  );
};

export default DashboardDrawer; 