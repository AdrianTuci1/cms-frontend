import React from 'react';
import styles from '../TimelineView.module.css';
import Appointments from './Appointments';

const DentalTimeline = () => {
  return (
    <div className={styles.timelineContent}>
      <Appointments />
    </div>
  );
};

export default DentalTimeline; 