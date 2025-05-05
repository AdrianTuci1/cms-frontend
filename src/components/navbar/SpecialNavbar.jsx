import React from 'react';
import styles from './SpecialNavbar.module.css';

const SpecialNavbar = ({ viewMode, setViewMode }) => {
  return (
    <div className={styles.filterMenu}>
      <button
        className={`${styles.filterButton} ${viewMode === 'active' ? styles.active : ''}`}
        onClick={() => setViewMode('active')}
      >
        Active
      </button>
      <button
        className={`${styles.filterButton} ${viewMode === 'all' ? styles.active : ''}`}
        onClick={() => setViewMode('all')}
      >
        Toata Ziua
      </button>
    </div>
  );
};

export default SpecialNavbar; 