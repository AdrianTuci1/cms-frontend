import React from 'react';
import styles from './AnalyticsView.module.css';

const AnalyticsView = () => {
  return (
    <div className={styles.analyticsView}>
      <h2>Analytics</h2>
      <div className={styles.analyticsContent}>
        <div className={styles.analyticsGrid}>
          <div className={styles.analyticsCard}>
            <h3>Daily Overview</h3>
            <p>Track your daily performance metrics</p>
          </div>
          <div className={styles.analyticsCard}>
            <h3>Trends</h3>
            <p>Analyze business trends over time</p>
          </div>
          <div className={styles.analyticsCard}>
            <h3>Performance</h3>
            <p>Monitor key performance indicators</p>
          </div>
          <div className={styles.analyticsCard}>
            <h3>Reports</h3>
            <p>Generate detailed business reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView; 