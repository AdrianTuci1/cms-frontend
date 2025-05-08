import React from 'react';
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
    <div 
      className={styles.card}
      data-membership={client.membershipType.toLowerCase()}
    >
      <div className={styles.photo}>
        <img 
          src={client.photoUrl || 'https://via.placeholder.com/80x80?text=No+Photo'} 
          alt={`${client.name}'s profile`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/80x80?text=No+Photo';
          }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{client.name}</h3>
            <span className={getStatusClass(client.membershipStatus)}>
              {client.membershipStatus}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={getMembershipChipClass(client.membershipType)}>
              {client.membershipType}
            </span>
            <span className={styles.expiresAt}>
              Expires: {client.expiresAt || 'N/A'}
            </span>
          </div>
        </div>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {client.email}
          </div>
          <div className={styles.contactItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {client.phone}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymClientCard; 