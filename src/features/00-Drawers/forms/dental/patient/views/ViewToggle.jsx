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
      >
        <FaUser className={styles.toggleIcon} />
      </button>
      <button
        className={`${styles.toggleBtn} ${activeView === 'notes' ? styles.active : ''}`}
        onClick={() => setActiveView('notes')}
      >
        <FaStickyNote className={styles.toggleIcon} />
      </button>
      <button
        className={`${styles.toggleBtn} ${activeView === 'history' ? styles.active : ''} ${isCreateMode ? styles.disabled : ''}`}
        onClick={() => !isCreateMode && setActiveView('history')}
        disabled={isCreateMode}
      >
        <FaHistory className={styles.toggleIcon} />
      </button>
    </div>
  );
};

export default ViewToggle;