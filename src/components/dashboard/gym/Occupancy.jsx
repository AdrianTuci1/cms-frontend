import React from 'react';
import styles from './Occupancy.module.css';

const Occupancy = () => {
  return (
    <div className={styles.occupancyList}>
      <div className={styles.occupancyItem}>
        <div className={styles.areaName}>Sala Fitness</div>
        <div className={styles.occupancyBar}>
          <div 
            className={styles.occupancyFill}
            style={{ width: '60%' }}
          />
        </div>
        <div className={styles.occupancyCount}>30/50</div>
      </div>
      <div className={styles.occupancyItem}>
        <div className={styles.areaName}>Bazin</div>
        <div className={styles.occupancyBar}>
          <div 
            className={styles.occupancyFill}
            style={{ width: '50%' }}
          />
        </div>
        <div className={styles.occupancyCount}>15/30</div>
      </div>
    </div>
  );
};

export default Occupancy; 