import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './MembershipCard.module.css';

const MembershipCard = ({ membershipType, expiryDate, memberName, accessLevel }) => {
  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'vip':
        return {
          primary: '#FFD700',
          secondary: '#FFA500',
          gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
        };
      case 'premium':
        return {
          primary: '#C0C0C0',
          secondary: '#A9A9A9',
          gradient: 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)'
        };
      default:
        return {
          primary: '#CD7F32',
          secondary: '#8B4513',
          gradient: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)'
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO');
  };

  const colors = getAccessLevelColor(accessLevel);

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.expandIndicator}>
          <ExpandMoreIcon />
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardHeader}>
            <div className={styles.membershipType} style={{ background: colors.gradient }}>
              {membershipType}
            </div>
          </div>
          
          <div className={styles.memberDetails}>
            <h2 className={styles.memberName}>{memberName}</h2>
            <div className={styles.expiryDate}>
              <span className={styles.label}>Expires</span>
              <span className={styles.date}>{formatDate(expiryDate)}</span>
            </div>
          </div>

          <div className={styles.accessLevel} style={{ color: colors.primary }}>
            {accessLevel.toUpperCase()}
          </div>
        </div>

        <div className={styles.qrCodeContainer}>
          <div className={styles.qrCode}>
            <QRCodeSVG 
              value={`${memberName}-${membershipType}-${expiryDate}`}
              size={120}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className={styles.qrLabel}>Scaneaza</div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard; 