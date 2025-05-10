import React from 'react';
import styles from '../TimelineView.module.css';
import CalendarView from './calendar/CalendarView';

const HotelTimeline = () => {
  return (
    <div className={styles.timelineContent}>
      <CalendarView />
    </div>
  );
};

export default HotelTimeline; 