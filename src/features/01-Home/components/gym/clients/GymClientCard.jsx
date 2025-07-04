import React from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import styles from './GymClientCard.module.css';

// Simple placeholder image as data URI
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMjQiIHI9IjgiIGZpbGw9IiNEN0Q3RDciLz4KPHBhdGggZD0iTTggNTJDMCA0OCA0IDQwIDEyIDQwSDUyQzYwIDQwIDY0IDQ4IDU2IDUySDhaIiBmaWxsPSIjRDdEN0Q3Ii8+Cjx0ZXh0IHg9IjMyIiB5PSI1OCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIFBob3RvPC90ZXh0Pgo8L3N2Zz4K';

const GymClientCard = ({ client, onClick }) => {
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
    <div className={styles.card} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={styles.memberInfo}>
        <div className={styles.photoContainer}>
          <img 
            src={client.photoUrl || PLACEHOLDER_IMAGE} 
            alt={`${client.name}'s profile`}
            className={styles.photo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
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