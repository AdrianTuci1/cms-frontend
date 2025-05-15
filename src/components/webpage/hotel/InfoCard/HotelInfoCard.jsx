import React from 'react';
import { MdExpandMore } from 'react-icons/md';
import { BsCalendarEvent, BsArrowRight, BsPerson } from 'react-icons/bs';
import styles from './HotelInfoCard.module.css';

const HotelInfoCard = ({ data }) => {
  const { roomPhoto, roomType, checkIn, checkOut, guests, roomNumber } = data;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Determine card style based on room type
  const getCardClass = () => {
    const roomTypeLower = roomType.toLowerCase();
    if (roomTypeLower.includes('deluxe')) return styles.deluxe;
    if (roomTypeLower.includes('standard')) return styles.standard;
    if (roomTypeLower.includes('suite') || roomTypeLower.includes('apartament')) return styles.suite;
    return '';
  };

  return (
    <div className={`${styles.card} ${getCardClass()}`}>
      <div className={styles.roomImage}>
        <div className={styles.imageContainer}>
          <img src={roomPhoto} alt={roomType} />
        </div>
      </div>
      <div className={styles.cardContent}>
        <h2 className={styles.roomTitle}>{roomType}</h2>
        
        <div className={styles.dateInfo}>
          <div className={styles.dateItem}>
            <BsCalendarEvent className={styles.icon} />
            <span>{formatDate(checkIn)}</span>
          </div>
          
          <div className={styles.dateItem}>
            <BsArrowRight className={styles.icon} />
            <span>{formatDate(checkOut)}</span>
          </div>
          
          <div className={styles.guestItem}>
            <BsPerson className={styles.icon} />
            <span>x{guests}</span>
          </div>
        </div>
        
        <div className={styles.detailsLink}>
          Detalii <span className={styles.arrow}>→</span>
        </div>
      </div>
    </div>
  );
};

export default HotelInfoCard; 