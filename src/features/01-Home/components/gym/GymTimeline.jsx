import React, { useState, useEffect } from 'react';
import styles from './GymTimeline.module.css';
import SpecialNavbar from '../../../../layout/navbar/SpecialNavbar.jsx';
import ResizablePanels from './timeline/ResizablePanels';
import Occupancy from './timeline/Occupancy';
import Timeline from './timeline/Timeline';
import { useGymTimelineWithAPI } from '../../store/gymTimeline';
import { useDataSync } from '../../../../design-patterns/hooks';

const GymTimeline = () => {
  const [viewMode, setViewMode] = useState('active');

  // Use useDataSync hook directly for timeline data
  const timelineSync = useDataSync('timeline', {
    businessType: 'gym',
    enableValidation: true,
    enableBusinessLogic: true
  });

  const timelineData = timelineSync.data;

  // Use the updated timeline integration hook with shared data
  const timeline = useGymTimelineWithAPI(timelineData, {
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    getGymData,
    getActiveMembers,
    getClassesAfterTime,
    calculateTotalOccupancy,
    showFullDay,
    setShowFullDay,
    initialize
  } = timeline;

  const { checkedIn, classes, occupancy } = getGymData();
  const activeMembers = getActiveMembers();

  useEffect(() => {
    // Initialize the timeline when component mounts
    if (initialize) {
      initialize();
    }
  }, []); // Empty dependency array to run only once

  // Show loading state if timeline data is loading
  if (timelineSync.loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingStateContent}>
            <div className={styles.spinner}></div>
            <p>Se încarcă datele gym...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if timeline data has error
  if (timelineSync.error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h3>Eroare la încărcarea datelor gym</h3>
          <p>{timelineSync.error.message || timelineSync.error}</p>
          <button onClick={timelineSync.refresh}>Încearcă din nou</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SpecialNavbar
        title="Gym Timeline"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showFullDay={showFullDay}
        onToggleFullDay={setShowFullDay}
      />

      <ResizablePanels
        leftContent={
          <Occupancy
            occupancy={occupancy}
            activeMembers={activeMembers}
            calculateTotalOccupancy={calculateTotalOccupancy}
          />
        }
        rightContent={
          <Timeline
            checkedIn={checkedIn}
            classes={classes}
            activeMembers={activeMembers}
            getClassesAfterTime={getClassesAfterTime}
            viewMode={viewMode}
            showFullDay={showFullDay}
          />
        }
      />
    </div>
  );
};

export default GymTimeline; 