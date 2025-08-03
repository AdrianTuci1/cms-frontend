import React from 'react';
import { FaCalendarAlt, FaStethoscope, FaImages } from 'react-icons/fa';
import styles from '../../../../styles/FormStyles.module.css';

const AppointmentViewToggle = ({ activeMenu, setActiveMenu, mode }) => {
  return (
    <div className={styles.viewToggle}>
      <button
        type="button"
        className={`${styles.toggleBtn} ${activeMenu === 'form' ? styles.active : ''}`}
        onClick={() => setActiveMenu('form')}
        title="Appointments"
      >
        <FaCalendarAlt className={styles.toggleIcon} />
      </button>
      <button
        type="button"
        className={`${styles.toggleBtn} ${activeMenu === 'operative' ? styles.active : ''}`}
        onClick={() => setActiveMenu('operative')}
        title="Operative Details"
      >
        <FaStethoscope className={styles.toggleIcon} />
      </button>
      <button
        type="button"
        className={`${styles.toggleBtn} ${activeMenu === 'gallery' ? styles.active : ''}`}
        onClick={() => setActiveMenu('gallery')}
        title="Gallery"
      >
        <FaImages className={styles.toggleIcon} />
      </button>
    </div>
  );
};

export default AppointmentViewToggle;