import React from 'react';
import styles from '../../../../styles/FormStyles.module.css';

const MemberViewToggle = ({ activeView, setActiveView }) => {
  return (
    <div className={styles.viewToggle}>
      <button
        className={`${styles.toggleBtn} ${activeView === 'details' ? styles.active : ''}`}
        onClick={() => setActiveView('details')}
      >
        Details
      </button>
      <button
        className={`${styles.toggleBtn} ${activeView === 'appointments' ? styles.active : ''}`}
        onClick={() => setActiveView('appointments')}
      >
        Upcoming
      </button>
    </div>
  );
};

export default MemberViewToggle;