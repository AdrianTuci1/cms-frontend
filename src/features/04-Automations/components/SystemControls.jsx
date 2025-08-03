import React, { useState } from 'react';
import { FaPlay, FaStop, FaCog } from 'react-icons/fa';
import styles from '../styles/SystemControls.module.css';

const SystemControls = ({ onSettingsClick }) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  return (
    <div className={styles.controlsContainer}>
      <div className={styles.controlButtons}>
        <button 
          className={`${styles.controlButton} ${isRunning ? styles.stopButton : styles.startButton}`}
          onClick={handleToggle}
        >
          {isRunning ? <FaStop /> : <FaPlay />}
          <span>{isRunning ? 'Oprește' : 'Pornește'}</span>
        </button>
        
        <button 
          className={`${styles.controlButton} ${styles.settingsButton}`}
          onClick={handleSettingsClick}
          title="Configurare Automatizări"
        >
          <FaCog />
          <span>Configurări</span>
        </button>
      </div>
    </div>
  );
};

export default SystemControls;