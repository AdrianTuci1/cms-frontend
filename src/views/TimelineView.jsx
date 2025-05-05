import React from 'react';
import { getBusinessType } from '../config/businessTypes';
import styles from './TimelineView.module.css';
import DentalTimeline from './dental/DentalTimeline';
import GymTimeline from './gym/GymTimeline';
import HotelTimeline from './hotel/HotelTimeline';

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
      <h2>{businessType.name} Timeline</h2>
      {renderBusinessSpecificContent()}
    </div>
  );
};

export default TimelineView; 