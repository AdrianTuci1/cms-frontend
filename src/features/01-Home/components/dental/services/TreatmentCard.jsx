import React from 'react';
import styles from './TreatmentCard.module.css';

const TreatmentCard = ({ treatment, onClick }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getColorForTreatment = (name) => {
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
    <div className={styles.card} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={styles.initialsBox} style={{ backgroundColor: getColorForTreatment(treatment.name) }}>
        {getInitials(treatment.name)}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3>{treatment.name}</h3>
          <span className={styles.price}>${treatment.price}</span>
        </div>
        <p className={styles.description}>{treatment.description}</p>
        <div className={styles.details}>
          <span className={styles.duration}>{treatment.duration} min</span>
          <span className={styles.category}>{treatment.category}</span>
        </div>
      </div>
    </div>
  );
};

export default TreatmentCard; 