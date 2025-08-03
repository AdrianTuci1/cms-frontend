import React from 'react';
import styles from '../../../../styles/FormStyles.module.css';

const AppointmentViewToggle = ({ activeMenu, setActiveMenu, mode }) => {
  return (
    <div className={styles.viewToggle}>
      <button
        type="button"
        className={`${styles.toggleBtn} ${activeMenu === 'form' ? styles.active : ''}`}
        onClick={() => setActiveMenu('form')}
      >
        Appointments
      </button>
      <button
        type="button"
        className={`${styles.toggleBtn} ${activeMenu === 'operative' ? styles.active : ''}`}
        onClick={() => setActiveMenu('operative')}
      >
        Operative Details
      </button>
      <button
        type="button"
        className={`${styles.toggleBtn} ${activeMenu === 'gallery' ? styles.active : ''}`}
        onClick={() => setActiveMenu('gallery')}
      >
        Gallery
      </button>
    </div>
  );
};

export default AppointmentViewToggle;