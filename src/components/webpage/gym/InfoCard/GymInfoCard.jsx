import React from 'react';
import { BsPerson, BsStopwatch } from 'react-icons/bs';
import { PiDiamond, PiDiamondsFour } from 'react-icons/pi';
import { QRCodeSVG } from 'qrcode.react';
import styles from './GymInfoCard.module.css';

const GymInfoCard = ({ data }) => {
  const { expiryDate, accessLevel, visits, lastVisit, visitsLeft } = data;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Determine card style based on access level
  const getCardClass = () => {
    switch (accessLevel.toLowerCase()) {
      case 'vip':
        return styles.vip;
      case 'premium':
        return styles.premium;
      default:
        return styles.standard;
    }
  };

  // Get the right diamond icon based on access level
  const getDiamondIcon = () => {
    switch (accessLevel.toLowerCase()) {
      case 'vip':
        return <PiDiamondsFour className={styles.diamondIcon} />;
      default:
        return <PiDiamond className={styles.diamondIcon} />;
    }
  };

  // Generate a unique identifier for the QR code
  const qrValue = `gym-${accessLevel}-${expiryDate}-${Math.random().toString(36).substring(2, 10)}`;

  return (
    <div className={`${styles.card} ${getCardClass()}`}>
      <div className={styles.qrContainer}>
        <div className={styles.imageContainer}>
          <QRCodeSVG 
            value={qrValue}
            size={160}
            level="H"
            includeMargin={true}
            className={styles.qrCode}
          />
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.accessLevelContainer}>
          {getDiamondIcon()}
          <span className={styles.accessLevelText}>{accessLevel.toUpperCase()}</span>
        </div>
        
        <div className={styles.membershipInfo}>
          <div className={styles.infoItem}>
            <BsStopwatch className={styles.icon} />
            <span>Last visit: {formatDate(lastVisit)}</span>
          </div>
          
          <div className={styles.infoItem}>
            <BsPerson className={styles.icon} />
            <span>{visitsLeft ? `Visits left: ${visitsLeft}` : `Total visits: ${visits}`}</span>
          </div>
        </div>
        
        <div className={styles.validUntil}>
          Valid until {formatDate(expiryDate)}
        </div>
      </div>
    </div>
  );
};

export default GymInfoCard; 