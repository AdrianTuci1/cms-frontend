import React from 'react';
import styles from './AdminView.module.css';

const ReservationsTab = () => {
  return (
    <div className={styles.section}>
      <h2>Gestionare Rezervări</h2>
      <div className={styles.reservationsSettings}>
        <div className={styles.settingCard}>
          <h3>Setări Generale</h3>
          <div className={styles.setting}>
            <label>Perioada minimă de rezervare (zile)</label>
            <input type="number" min="1" defaultValue="1" />
          </div>
          <div className={styles.setting}>
            <label>Perioada maximă de rezervare (zile)</label>
            <input type="number" min="1" defaultValue="30" />
          </div>
          <div className={styles.setting}>
            <label>Depozit necesar (%)</label>
            <input type="number" min="0" max="100" defaultValue="20" />
          </div>
        </div>
        <div className={styles.settingCard}>
          <h3>Restricții</h3>
          <label className={styles.checkbox}>
            <input type="checkbox" defaultChecked /> Permite rezervări online
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" defaultChecked /> Necesită verificare manuală
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" /> Permite rezervări în weekend
          </label>
        </div>
      </div>
    </div>
  );
};

export default ReservationsTab; 