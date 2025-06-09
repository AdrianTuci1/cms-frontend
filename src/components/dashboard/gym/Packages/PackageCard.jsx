import React from 'react';
import styles from './PackageCard.module.css';

const PackageCard = ({ packageData }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getColorForPackage = (name) => {
    const colors = [
      '#FF6B6B', // Coral
      '#4ECDC4', // Turquoise
      '#45B7D1', // Sky Blue
      '#96CEB4', // Sage
      '#FFEEAD', // Cream
      '#D4A5A5', // Dusty Rose
      '#9B59B6', // Purple
      '#3498DB', // Blue
      '#E67E22', // Orange
      '#2ECC71'  // Green
    ];
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div className={styles.card}>
      <div className={styles.initialsBox} style={{ backgroundColor: getColorForPackage(packageData.name) }}>
        {getInitials(packageData.name)}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3>{packageData.name}</h3>
          <span className={styles.price}>${packageData.price}/month</span>
        </div>
        <p className={styles.description}>{packageData.description}</p>
        <div className={styles.details}>
          <span className={styles.duration}>{packageData.duration} months</span>
          <span className={styles.type}>{packageData.type}</span>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
