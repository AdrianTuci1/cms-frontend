import React from 'react';
import styles from './StaffMemberCard.module.css';

const StaffMemberCard = ({ member }) => {
  // Render weekday bubbles - will color active working days
  const renderWorkDays = () => {
    const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    return (
      <div className={styles.workDays}>
        {days.map((day, index) => (
          <div 
            key={index}
            className={`${styles.dayBubble} ${member.workDays.includes(index) ? styles.workDay : ''}`}
            title={`${index === 0 ? 'Luni' : 
                   index === 1 ? 'Marți' : 
                   index === 2 ? 'Miercuri' : 
                   index === 3 ? 'Joi' : 
                   index === 4 ? 'Vineri' : 
                   index === 5 ? 'Sâmbătă' : 'Duminică'}`}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <div className={styles.photo}>
          <img 
            src={member.photoUrl || 'https://via.placeholder.com/80x80?text=No+Photo'} 
            alt={`${member.name}'s profile`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/80x80?text=No+Photo';
            }}
          />
        </div>
      </div>
      
      <div className={styles.cardMiddle}>
        <div className={styles.identityInfo}>
          <h3 className={styles.name}>{member.name}</h3>
          <span className={styles.roleChip}>{member.role}</span>
        </div>
        <div className={styles.schedule}>
          <div className={styles.scheduleLabel}>Program:</div>
          {renderWorkDays()}
        </div>
      </div>
      
      <div className={styles.cardRight}>
        <div className={styles.contactItem}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{member.email}</span>
        </div>
        <div className={styles.contactItem}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{member.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default StaffMemberCard; 