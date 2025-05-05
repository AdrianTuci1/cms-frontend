import React from 'react';
import styles from '../TimelineView.module.css';

const DentalTimeline = () => {
  return (
    <div className={styles.timelineContent}>
      <h3>Appointments & Treatments</h3>
      <div className={styles.timelineItems}>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>Today, 10:00 AM</div>
          <div className={styles.timelineTitle}>Regular Check-up</div>
          <div className={styles.timelineDescription}>Patient: John Doe</div>
          <div className={styles.timelineStatus} data-status="Scheduled">Scheduled</div>
        </div>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>Today, 2:00 PM</div>
          <div className={styles.timelineTitle}>Teeth Cleaning</div>
          <div className={styles.timelineDescription}>Patient: Jane Smith</div>
          <div className={styles.timelineStatus} data-status="In Progress">In Progress</div>
        </div>
      </div>
    </div>
  );
};

export default DentalTimeline; 