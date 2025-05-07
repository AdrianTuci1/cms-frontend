import React from 'react';
import { FaClock, FaSwimmingPool, FaDumbbell, FaRunning, FaEllipsisV, FaStar } from 'react-icons/fa';
import styles from '../Timeline.module.css';

const getLocationIcon = (location) => {
  switch (location) {
    case 'gym':
      return <FaDumbbell />;
    case 'pool':
      return <FaSwimmingPool />;
    case 'aerobic':
      return <FaRunning />;
    default:
      return <FaDumbbell />;
  }
};

const getLocationColor = (location) => {
  switch (location) {
    case 'gym':
      return '#2196F3'; // Blue for gym
    case 'pool':
      return '#00BCD4'; // Cyan for pool
    case 'aerobic':
      return '#9C27B0'; // Purple for aerobic
    default:
      return '#2196F3';
  }
};

const formatSubscriptionLabel = (subscription) => {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  return `${capitalize(subscription.type)}`;
};

const calculateDuration = (checkIn, checkOut) => {
  const now = new Date();
  const [checkInHours, checkInMinutes] = checkIn.split(':').map(Number);
  const [checkOutHours, checkOutMinutes] = checkOut.split(':').map(Number);
  
  const checkInTime = new Date();
  checkInTime.setHours(checkInHours, checkInMinutes, 0);
  
  const checkOutTime = new Date();
  checkOutTime.setHours(checkOutHours, checkOutMinutes, 0);
  
  if (checkOutTime < checkInTime) {
    checkOutTime.setDate(checkOutTime.getDate() + 1);
  }
  
  if (now < checkOutTime && now > checkInTime) {
    const duration = Math.floor((now - checkInTime) / (1000 * 60));
    const remaining = Math.floor((checkOutTime - now) / (1000 * 60));
    return {
      spent: `${Math.floor(duration / 60)}h ${duration % 60}m`,
      remaining: `${Math.floor(remaining / 60)}h ${remaining % 60}m`
    };
  }
  
  const duration = Math.floor((checkOutTime - checkInTime) / (1000 * 60));
  return {
    spent: `${Math.floor(duration / 60)}h ${duration % 60}m`,
    remaining: null
  };
};

const MemberCard = ({ member }) => {
  const duration = calculateDuration(member.checkIn, member.checkOut);
  const locationColor = getLocationColor(member.location);
  
  return (
    <div className={styles.memberCard}>
      <div 
        className={styles.locationIndicator}
        style={{ backgroundColor: locationColor }}
      />
      <div className={styles.cardContent}>
        <div className={styles.memberInfo}>
          <div className={`${styles.avatar} ${styles[`avatar${member.subscription.type.charAt(0).toUpperCase() + member.subscription.type.slice(1)}`]}`}>
            {member.avatar}
          </div>
          <div>
            <h3 className={styles.name}>{member.name}</h3>
            <div className={styles.subscription}>
              {member.subscription.type !== 'none' && <FaStar />}
              {formatSubscriptionLabel(member.subscription)}
            </div>
          </div>
        </div>

        <div className={styles.details}>
          <div className={`${styles.locationChip} ${styles[member.location]}`}>
            {getLocationIcon(member.location)}
            {member.location === 'gym' ? 'Sala de Forță' : 
             member.location === 'pool' ? 'Piscină' : 'Aerobic'}
          </div>
          <div className={styles.divider} />
          <div className={styles.durationChip}>
            <FaClock />
            {duration.spent}
            {duration.remaining && ` (${duration.remaining} rămași)`}
          </div>
          <div className={styles.spacer} />
          <button className={styles.moreButton}>
            <FaEllipsisV />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberCard; 