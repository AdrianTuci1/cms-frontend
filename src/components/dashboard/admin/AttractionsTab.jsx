import React from 'react';
import styles from './AdminView.module.css';

const AttractionsTab = () => {
  return (
    <div className={styles.section}>
      <h2>Gestionare Atracții</h2>
      <div className={styles.attractionsList}>
        <div className={styles.attractionCard}>
          <div className={styles.attractionHeader}>
            <h3>Piscină</h3>
            <div className={styles.attractionActions}>
              <button className={styles.editButton}>✏️</button>
              <button className={styles.deleteButton}>🗑️</button>
            </div>
          </div>
          <div className={styles.attractionDetails}>
            <p>Status: <span className={styles.active}>Activ</span></p>
            <p>Program: 08:00 - 22:00</p>
            <p>Preț: 50 RON/zi</p>
          </div>
        </div>
        <div className={styles.attractionCard}>
          <div className={styles.attractionHeader}>
            <h3>Spa</h3>
            <div className={styles.attractionActions}>
              <button className={styles.editButton}>✏️</button>
              <button className={styles.deleteButton}>🗑️</button>
            </div>
          </div>
          <div className={styles.attractionDetails}>
            <p>Status: <span className={styles.inactive}>Inactiv</span></p>
            <p>Program: 10:00 - 20:00</p>
            <p>Preț: 100 RON/zi</p>
          </div>
        </div>
        <button className={styles.addButton}>+ Adaugă atracție nouă</button>
      </div>
    </div>
  );
};

export default AttractionsTab; 