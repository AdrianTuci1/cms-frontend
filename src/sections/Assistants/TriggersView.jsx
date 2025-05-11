import React from 'react';
import styles from './TriggersView.module.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const TriggersView = () => {
  return (
    <div className={styles.triggersView}>
      <div className={styles.triggersHeader}>
        <h2>Triggers</h2>
        <button className={styles.addButton}>
          <FaPlus className={styles.icon} />
          Adaugă Trigger
        </button>
      </div>

      <div className={styles.triggersGrid}>
        <div className={styles.triggerCard}>
          <div className={styles.triggerHeader}>
            <h3>Rezervare Nouă</h3>
            <div className={styles.triggerActions}>
              <button className={styles.actionButton}>
                <FaEdit className={styles.icon} />
              </button>
              <button className={styles.actionButton}>
                <FaTrash className={styles.icon} />
              </button>
            </div>
          </div>
          <div className={styles.triggerDetails}>
            <p className={styles.triggerDescription}>
              Se activează când un client face o nouă rezervare
            </p>
            <div className={styles.triggerStatus}>
              <span className={styles.statusBadge}>Activ</span>
            </div>
          </div>
        </div>

        <div className={styles.triggerCard}>
          <div className={styles.triggerHeader}>
            <h3>Anulare Rezervare</h3>
            <div className={styles.triggerActions}>
              <button className={styles.actionButton}>
                <FaEdit className={styles.icon} />
              </button>
              <button className={styles.actionButton}>
                <FaTrash className={styles.icon} />
              </button>
            </div>
          </div>
          <div className={styles.triggerDetails}>
            <p className={styles.triggerDescription}>
              Se activează când un client anulează o rezervare
            </p>
            <div className={styles.triggerStatus}>
              <span className={styles.statusBadge}>Activ</span>
            </div>
          </div>
        </div>

        <div className={styles.triggerCard}>
          <div className={styles.triggerHeader}>
            <h3>Rating Nou</h3>
            <div className={styles.triggerActions}>
              <button className={styles.actionButton}>
                <FaEdit className={styles.icon} />
              </button>
              <button className={styles.actionButton}>
                <FaTrash className={styles.icon} />
              </button>
            </div>
          </div>
          <div className={styles.triggerDetails}>
            <p className={styles.triggerDescription}>
              Se activează când un client adaugă un nou rating
            </p>
            <div className={styles.triggerStatus}>
              <span className={styles.statusBadge}>Inactiv</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriggersView; 