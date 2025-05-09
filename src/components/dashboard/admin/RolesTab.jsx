import React from 'react';
import styles from './AdminView.module.css';

const RolesTab = ({ staffEmails, onAddEmail, onRemoveEmail, onViewProfile }) => {
  return (
    <div className={styles.section}>
      <h2>Gestionare Roluri și Permisiuni</h2>
      <div className={styles.rolesGrid}>
        <div className={styles.roleCard}>
          <h3>Administrator</h3>
          <div className={styles.permissions}>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> Acces complet
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> Gestionare utilizatori
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> Gestionare sistem
            </label>
          </div>
        </div>

        <div className={styles.roleCard}>
          <h3>Manager</h3>
          <div className={styles.permissions}>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> Gestionare rezervări
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> Gestionare angajați
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> Rapoarte
            </label>
          </div>
          <div className={styles.emailSection}>
            <h4>Staff Manager</h4>
            <div className={styles.emailList}>
              {staffEmails.manager.map((email, index) => (
                <div key={index} className={styles.emailItem}>
                  <span>{email}</span>
                  <button 
                    className={styles.viewProfileButton}
                    onClick={() => onViewProfile(email)}
                  >
                    👤
                  </button>
                  <button 
                    className={styles.removeEmailButton}
                    onClick={() => onRemoveEmail('manager', email)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.addEmailForm}>
              <input
                type="email"
                placeholder="Adaugă email manager"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onAddEmail('manager', e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.roleCard}>
          <h3>Receptioner</h3>
          <div className={styles.permissions}>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> Gestionare rezervări
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> Acces la istoric
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" /> Gestionare angajați
            </label>
          </div>
          <div className={styles.emailSection}>
            <h4>Staff Receptioneri</h4>
            <div className={styles.emailList}>
              {staffEmails.receptioner.map((email, index) => (
                <div key={index} className={styles.emailItem}>
                  <span>{email}</span>
                  <button 
                    className={styles.viewProfileButton}
                    onClick={() => onViewProfile(email)}
                  >
                    👤
                  </button>
                  <button 
                    className={styles.removeEmailButton}
                    onClick={() => onRemoveEmail('receptioner', email)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.addEmailForm}>
              <input
                type="email"
                placeholder="Adaugă email receptioner"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onAddEmail('receptioner', e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.roleCard}>
          <h3>Cameristă</h3>
          <div className={styles.permissions}>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> Gestionare camere
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> Acces la program
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> Raportare starea camerelor
            </label>
          </div>
          <div className={styles.emailSection}>
            <h4>Staff Cameriste</h4>
            <div className={styles.emailList}>
              {staffEmails.camerista.map((email, index) => (
                <div key={index} className={styles.emailItem}>
                  <span>{email}</span>
                  <button 
                    className={styles.viewProfileButton}
                    onClick={() => onViewProfile(email)}
                  >
                    👤
                  </button>
                  <button 
                    className={styles.removeEmailButton}
                    onClick={() => onRemoveEmail('camerista', email)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.addEmailForm}>
              <input
                type="email"
                placeholder="Adaugă email cameristă"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onAddEmail('camerista', e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesTab; 