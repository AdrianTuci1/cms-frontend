import React, { useState } from 'react';
import { FaPlay, FaStop, FaCoins } from 'react-icons/fa';
import styles from '../styles/SystemHealth.module.css';

const SystemHealth = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [tokenUsage, setTokenUsage] = useState(0);
  const [delay, setDelay] = useState(0);
  const [availableTokens, setAvailableTokens] = useState(1000); // Example value

  const handleToggle = () => {
    setIsRunning(!isRunning);
    // Here you would typically make an API call to start/stop the system
  };

  const handlePurchaseTokens = () => {
    // Here you would typically open a purchase modal or redirect to a purchase page
    console.log('Purchase tokens clicked');
  };

  return (
    <div className={styles.systemHealthBox}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={`${styles.controlButton} ${isRunning ? styles.stopButton : styles.startButton}`}
            onClick={handleToggle}
          >
            {isRunning ? <FaStop /> : <FaPlay />}
            {isRunning ? 'Oprește' : 'Pornește'}
          </button>
        </div>
        <h2>Starea Sistemului</h2>
        <div className={styles.headerRight}>
          <div className={styles.tokenInfo}>
            <span className={styles.tokenLabel}>Token-uri disponibile:</span>
            <span className={styles.tokenValue}>{availableTokens}</span>
          </div>
          <button 
            className={`${styles.controlButton} ${styles.purchaseButton}`}
            onClick={handlePurchaseTokens}
          >
            <FaCoins />
            Achiziționează
          </button>
        </div>
      </div>

      <div className={styles.healthMetrics}>
        <div className={styles.healthMetric}>
          <span className={styles.metricLabel}>Token-uri</span>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${tokenUsage}%` }}></div>
          </div>
          <span className={styles.metricValue}>{tokenUsage}%</span>
        </div>
        <div className={styles.healthMetric}>
          <span className={styles.metricLabel}>Delay</span>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${delay}%` }}></div>
          </div>
          <span className={styles.metricValue}>{delay}ms</span>
        </div>
      </div>
      <div className={styles.systemStatus}>
        <span className={`${styles.statusIndicator} ${isRunning ? styles.healthy : ''}`}></span>
        <span className={styles.statusText}>{isRunning ? 'Sistem Activ' : 'Sistem Inactiv'}</span>
      </div>
    </div>
  );
};

export default SystemHealth; 