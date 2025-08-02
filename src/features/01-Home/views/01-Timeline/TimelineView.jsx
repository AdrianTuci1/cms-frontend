import React from 'react';
import { tenantUtils } from '../../../../config/tenant.js';
import styles from './TimelineView.module.css';
import DentalTimeline from '../../components/dental/Appointments.jsx';
import GymTimeline from '../../components/gym/GymTimeline.jsx';
import HotelTimeline from '../../components/hotel/timeline/CalendarView.jsx';

const TimelineView = () => {
  const currentBusinessType = tenantUtils.getCurrentBusinessType();

  const renderBusinessSpecificContent = () => {
    switch (currentBusinessType) {
      case 'dental':
        return <DentalTimeline />;
      case 'gym':
        return <GymTimeline />;
      case 'hotel':
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