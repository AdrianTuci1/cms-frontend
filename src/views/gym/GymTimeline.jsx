import React from 'react';
import styles from '../TimelineView.module.css';

const GymTimeline = () => {
  return (
    <div className={styles.timelineContent}>
      <h3>Classes & Sessions</h3>
      <div className={styles.timelineItems}>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>Today, 9:00 AM</div>
          <div className={styles.timelineTitle}>Yoga Class</div>
          <div className={styles.timelineDescription}>Instructor: Sarah Wilson</div>
          <div className={styles.timelineStatus} data-status="In Progress">In Progress</div>
        </div>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>Today, 6:00 PM</div>
          <div className={styles.timelineTitle}>Personal Training</div>
          <div className={styles.timelineDescription}>Trainer: Mike Johnson</div>
          <div className={styles.timelineStatus} data-status="Scheduled">Scheduled</div>
        </div>
      </div>
    </div>
  );
};

export default GymTimeline; 