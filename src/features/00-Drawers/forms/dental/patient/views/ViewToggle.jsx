import React from 'react';
import { FaUser, FaStickyNote, FaHistory } from 'react-icons/fa';
import styles from '../../../../styles/FormStyles.module.css';

const ViewToggle = ({ activeView, setActiveView, mode }) => {
  const isCreateMode = mode === 'create';
  
  return (
    <div className={styles.viewToggle}>
      <button
        className={`${styles.toggleBtn} ${activeView === 'details' ? styles.active : ''}`}
        onClick={() => setActiveView('details')}
        title="Patient Details"
      >
        <FaUser className={styles.toggleIcon} />
      </button>
      <button
        className={`${styles.toggleBtn} ${activeView === 'notes' ? styles.active : ''}`}
        onClick={() => setActiveView('notes')}
        title="Dental Notes"
      >
        <FaStickyNote className={styles.toggleIcon} />
      </button>
      <button
        className={`${styles.toggleBtn} ${activeView === 'history' ? styles.active : ''} ${isCreateMode ? styles.disabled : ''}`}
        onClick={() => !isCreateMode && setActiveView('history')}
        disabled={isCreateMode}
        title="Appointment History"
      >
        <FaHistory className={styles.toggleIcon} />
      </button>
    </div>
  );
};

export default ViewToggle;