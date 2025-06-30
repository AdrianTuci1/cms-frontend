import React, { useState } from 'react';
import { FaPlay, FaStop, FaCoins, FaUser, FaRobot } from 'react-icons/fa';
import styles from '../styles/SystemHealth.module.css';

const SystemHealth = ({ systemHealth, isLoading }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [tokenUsage, setTokenUsage] = useState(0);
  const [delay, setDelay] = useState(0);
  const [availableTokens, setAvailableTokens] = useState(1000);
  const [timePeriod, setTimePeriod] = useState('daily'); // 'daily' or 'weekly'

  // Use systemHealth from store if available, otherwise use sample data
  const metrics = systemHealth ? {
    reservations: {
      human: 45,
      booking: 120,
      whatsapp: 85
    },
    profit: {
      percentage: 15,
      extraProfit: 2500
    }
  } : {
    reservations: {
      human: 45,
      booking: 120,
      whatsapp: 85
    },
    profit: {
      percentage: 15,
      extraProfit: 2500
    }
  };

  const totalReservations = metrics.reservations.human + metrics.reservations.booking + metrics.reservations.whatsapp;
  const humanPercentage = (metrics.reservations.human / totalReservations) * 100;
  const bookingPercentage = (metrics.reservations.booking / totalReservations) * 100;
  const whatsappPercentage = (metrics.reservations.whatsapp / totalReservations) * 100;

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handlePurchaseTokens = () => {
    console.log('Purchase tokens clicked');
  };

  if (isLoading) {
    return (
      <div className={styles.systemHealthBox}>
        <div className={styles.loading}>
          <p>Se încarcă starea sistemului...</p>
        </div>
      </div>
    );
  }

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

      <div className={styles.timePeriodSelector}>
        <button 
          className={`${styles.timePeriodButton} ${timePeriod === 'daily' ? styles.active : ''}`}
          onClick={() => setTimePeriod('daily')}
        >
          Zilnic
        </button>
        <button 
          className={`${styles.timePeriodButton} ${timePeriod === 'weekly' ? styles.active : ''}`}
          onClick={() => setTimePeriod('weekly')}
        >
          Săptămânal
        </button>
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

      <div className={styles.mainContent}>
        <div className={styles.metricsSection}>
          <h3 className={styles.sectionTitle}>Rezervări Preluate</h3>
          <div className={styles.reservationsProgress}>
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressSegment} 
                style={{ 
                  width: `${humanPercentage}%`,
                  backgroundColor: '#3b82f6'
                }}
                title={`Rezervări Umane: ${metrics.reservations.human}`}
              />
              <div 
                className={styles.progressSegment} 
                style={{ 
                  width: `${bookingPercentage}%`,
                  backgroundColor: '#10b981'
                }}
                title={`Booking.com: ${metrics.reservations.booking}`}
              />
              <div 
                className={styles.progressSegment} 
                style={{ 
                  width: `${whatsappPercentage}%`,
                  backgroundColor: '#f59e0b'
                }}
                title={`WhatsApp: ${metrics.reservations.whatsapp}`}
              />
            </div>
            <div className={styles.reservationsLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#3b82f6' }}></span>
                <span className={styles.legendLabel}>Umane</span>
                <span className={styles.legendValue}>{metrics.reservations.human}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#10b981' }}></span>
                <span className={styles.legendLabel}>Booking</span>
                <span className={styles.legendValue}>{metrics.reservations.booking}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#f59e0b' }}></span>
                <span className={styles.legendLabel}>WhatsApp</span>
                <span className={styles.legendValue}>{metrics.reservations.whatsapp}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricsSection}>
          <h3 className={styles.sectionTitle}>Profit Generat</h3>
          <div className={styles.profitGrid}>
            <div className={styles.profitItem}>
              <div className={styles.profitIcon}>
                <FaRobot />
              </div>
              <div className={styles.profitInfo}>
                <span className={styles.profitLabel}>Creștere Profit</span>
                <span className={styles.profitValue}>{metrics.profit.percentage}%</span>
              </div>
            </div>
            <div className={styles.profitItem}>
              <div className={styles.profitIcon} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <FaCoins />
              </div>
              <div className={styles.profitInfo}>
                <span className={styles.profitLabel}>Profit Extra</span>
                <span className={styles.profitValue}>{metrics.profit.extraProfit} RON</span>
              </div>
            </div>
          </div>
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