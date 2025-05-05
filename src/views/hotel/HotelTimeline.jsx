import React from 'react';
import styles from '../TimelineView.module.css';

const HotelTimeline = () => {
  return (
    <div className={styles.timelineContent}>
      <h3>Check-ins & Events</h3>
      <div className={styles.timelineItems}>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>Today, 2:00 PM</div>
          <div className={styles.timelineTitle}>Room Check-in</div>
          <div className={styles.timelineDescription}>Room: 301, Guest: John Smith</div>
          <div className={styles.timelineStatus} data-status="Completed">Completed</div>
        </div>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>Today, 7:00 PM</div>
          <div className={styles.timelineTitle}>Restaurant Reservation</div>
          <div className={styles.timelineDescription}>Table: 5, Guests: 4</div>
          <div className={styles.timelineStatus} data-status="Scheduled">Scheduled</div>
        </div>
      </div>
    </div>
  );
};

export default HotelTimeline; 