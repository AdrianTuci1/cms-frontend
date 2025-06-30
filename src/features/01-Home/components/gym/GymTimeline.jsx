import React, { useState, useEffect } from 'react';
import styles from './GymTimeline.module.css';
import SpecialNavbar from '../../../../layout/navbar/SpecialNavbar.jsx';
import ResizablePanels from './timeline/ResizablePanels';
import Occupancy from './timeline/Occupancy';
import Timeline from './timeline/Timeline';
import { useGymTimelineWithAPI } from '../../store';

const GymTimeline = () => {
  const [viewMode, setViewMode] = useState('active');

  // Use the new timeline integration hook
  const timeline = useGymTimelineWithAPI({
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    data,
    loading,
    error,
    refresh,
    checkInMember,
    checkOutMember,
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

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h3>Eroare la încărcarea datelor gym</h3>
          <p>{error.message || error}</p>
          <button onClick={refresh}>Încearcă din nou</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SpecialNavbar viewMode={viewMode} setViewMode={setViewMode} />
      
      <ResizablePanels
        leftContent={
          <>
            <Timeline 
              timeline={timeline}
              checkedIn={checkedIn}
              classes={classes}
              activeMembers={activeMembers}
              loading={loading}
            />
          </>
        }
        rightContent={
          <>
            <Occupancy 
              occupancy={occupancy}
              totalOccupancy={calculateTotalOccupancy()}
              loading={loading}
            />
          </>
        }
      />
    </div>
  );
};

export default GymTimeline; 