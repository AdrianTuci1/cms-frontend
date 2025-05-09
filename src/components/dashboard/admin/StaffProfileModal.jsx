import React from 'react';
import styles from './AdminView.module.css';

const StaffProfileModal = ({ email, onClose }) => {
  const mockProfile = {
    name: email.split('@')[0].split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    role: email.split('@')[1].split('.')[0],
    status: 'Activ',
    joinDate: '01.01.2024',
    phone: '+40 712 345 678',
    schedule: 'Full-time'
  };

  return (
    <div className={styles.profileModal}>
      <div className={styles.profileHeader}>
        <h3>Profil Staff</h3>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
      </div>
      <div className={styles.profileContent}>
        <div className={styles.profileInfo}>
          <p><strong>Nume:</strong> {mockProfile.name}</p>
          <p><strong>Rol:</strong> {mockProfile.role}</p>
          <p><strong>Status:</strong> <span className={styles.active}>{mockProfile.status}</span></p>
          <p><strong>Data angajării:</strong> {mockProfile.joinDate}</p>
          <p><strong>Telefon:</strong> {mockProfile.phone}</p>
          <p><strong>Program:</strong> {mockProfile.schedule}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffProfileModal; 