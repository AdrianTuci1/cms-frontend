import React from 'react';
import styles from './AdminView.module.css';

const ServicesTab = () => {
  return (
    <div className={styles.section}>
      <h2>Gestionare Servicii</h2>
      <div className={styles.servicesList}>
        <div className={styles.serviceCard}>
          <div className={styles.serviceHeader}>
            <h3>Room Service</h3>
            <div className={styles.serviceActions}>
              <button className={styles.editButton}>✏️</button>
              <button className={styles.deleteButton}>🗑️</button>
            </div>
          </div>
          <div className={styles.serviceDetails}>
            <p>Status: <span className={styles.active}>Activ</span></p>
            <p>Program: 24/7</p>
            <p>Taxă serviciu: 10%</p>
          </div>
        </div>
        <div className={styles.serviceCard}>
          <div className={styles.serviceHeader}>
            <h3>Lavandărie</h3>
            <div className={styles.serviceActions}>
              <button className={styles.editButton}>✏️</button>
              <button className={styles.deleteButton}>🗑️</button>
            </div>
          </div>
          <div className={styles.serviceDetails}>
            <p>Status: <span className={styles.active}>Activ</span></p>
            <p>Program: 08:00 - 18:00</p>
            <p>Preț minim: 50 RON</p>
          </div>
        </div>
        <button className={styles.addButton}>+ Adaugă serviciu nou</button>
      </div>
    </div>
  );
};

export default ServicesTab; 