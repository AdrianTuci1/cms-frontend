import React from 'react';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import styles from '../../../../styles/FormStyles.module.css';

const MemberViewToggle = ({ activeView, setActiveView, mode }) => {
  const isCreateMode = mode === 'create';
  
  return (
    <div className={styles.viewToggle}>
      <button
        className={`${styles.toggleBtn} ${activeView === 'details' ? styles.active : ''}`}
        onClick={() => setActiveView('details')}
        title="Member Details"
      >
        <FaUser className={styles.toggleIcon} />
      </button>
      <button
        className={`${styles.toggleBtn} ${activeView === 'appointments' ? styles.active : ''} ${isCreateMode ? styles.disabled : ''}`}
        onClick={() => !isCreateMode && setActiveView('appointments')}
        disabled={isCreateMode}
        title="Upcoming Appointments"
      >
        <FaCalendarAlt className={styles.toggleIcon} />
      </button>
    </div>
  );
};

export default MemberViewToggle;