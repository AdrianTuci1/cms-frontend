import React from 'react';
import styles from './RoomCard.module.css';

const RoomCard = ({ room, onClick }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getColorForRoom = (name) => {
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
      <div className={styles.initialsBox} style={{ backgroundColor: getColorForRoom(room.name) }}>
        {getInitials(room.name)}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3>{room.name}</h3>
          <span className={styles.price}>${room.price}/night</span>
        </div>
        <p className={styles.description}>{room.description}</p>
        <div className={styles.details}>
          <span className={styles.capacity}>{room.capacity} persons</span>
          <span className={styles.type}>{room.type}</span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
