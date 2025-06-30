import React from 'react';
import { getBusinessType } from '../../../../config/businessTypes';
import styles from './TimelineView.module.css';
import DentalTimeline from '../../components/dental/Appointments.jsx';
import GymTimeline from '../../components/gym/GymTimeline.jsx';
import HotelTimeline from '../../components/hotel/timeline/CalendarView.jsx';

const TimelineView = () => {
  const businessType = getBusinessType();

  const renderBusinessSpecificContent = () => {
    switch (businessType.name) {
      case 'Dental Clinic':
        return <DentalTimeline />;
      case 'Gym':
        return <GymTimeline />;
      case 'Hotel':
        return <HotelTimeline />;
      default:
        return <p>No timeline data available</p>;
    }
  };

  return (
    <div className={styles.dashboardView}>
      {renderBusinessSpecificContent()}
    </div>
  );
};

export default TimelineView; 