import React from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import styles from './GymClientCard.module.css';

const GymClientCard = ({ client }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      active: styles.statusActive,
      inactive: styles.statusInactive,
      pending: styles.statusPending
    };
    return `${styles.status} ${statusMap[status.toLowerCase()] || ''}`;
  };

  const getMembershipChipClass = (type) => {
    const typeMap = {
      premium: styles.membershipChipPremium,
      basic: styles.membershipChipBasic,
      vip: styles.membershipChipVIP
    };
    return `${styles.membershipChip} ${typeMap[type.toLowerCase()] || ''}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.memberInfo}>
        <div className={styles.photoContainer}>
          <img 
            src={client.photoUrl || 'https://via.placeholder.com/64x64?text=No+Photo'} 
            alt={`${client.name}'s profile`}
            className={styles.photo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/64x64?text=No+Photo';
            }}
          />
        </div>
        <div className={styles.details}>
          <h3 className={styles.name}>{client.name}</h3>
          <div className={styles.workDays}>
            <span className={styles.dayPill}>{client.membershipType}</span>
            <span className={styles.dayPill}>{client.membershipStatus}</span>
          </div>
          <span className={styles.role}>Expires: {client.expiresAt || 'N/A'}</span>
        </div>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <FaEnvelope className={styles.icon} />
            <span>{client.email}</span>
          </div>
          <div className={styles.contactItem}>
            <FaPhone className={styles.icon} />
            <span>{client.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymClientCard; 