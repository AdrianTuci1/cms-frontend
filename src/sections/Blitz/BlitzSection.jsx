import React from 'react';
import styles from './BlitzSection.module.css';

const BlitzSection = () => {
  return (
    <div className={styles.blitzContainer}>
      <div className={styles.content}>
        <div className={styles.column}>
          {/* Prima coloană - va fi populată ulterior */}
        </div>
        <div className={styles.column}>
          <div className={styles.patientInfo}>
            <h2>Informații Pacient</h2>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Nume complet</span>
              <span className={styles.infoValue}>Ion Popescu</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Data nașterii</span>
              <span className={styles.infoValue}>01.01.1980</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>CNP</span>
              <span className={styles.infoValue}>1800101123456</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Telefon</span>
              <span className={styles.infoValue}>0712 345 678</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>ion.popescu@email.com</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Adresă</span>
              <span className={styles.infoValue}>Strada Exemplu, Nr. 123, București</span>
            </div>
          </div>
          <div className={styles.reservations}>
            <h2>Rezervări</h2>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Ultima vizită</span>
              <span className={styles.infoValue}>15.03.2024</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Următoarea programare</span>
              <span className={styles.infoValue}>22.03.2024 - 14:00</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Status</span>
              <span className={styles.infoValue}>Confirmată</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlitzSection; 