import React from 'react';
import styles from './BlitzOverview.module.css';
import { FaChartLine, FaBolt } from 'react-icons/fa';

const BlitzOverview = () => {
  return (
    <div className={styles.overviewContainer}>
      <div className={styles.header}>
        <FaChartLine className={styles.headerIcon} />
        <h2>Blitz Overview</h2>
      </div>
      <div className={styles.content}>
        <div className={styles.placeholder}>
          <FaBolt className={styles.placeholderIcon} />
          <p>Blitz Overview functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default BlitzOverview;