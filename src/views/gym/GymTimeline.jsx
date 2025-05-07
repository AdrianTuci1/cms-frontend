import React, { useState } from 'react';
import styles from './GymTimeline.module.css';
import SpecialNavbar from '../../components/navbar/SpecialNavbar';
import ResizablePanels from '../../components/dashboard/gym/ResizablePanels';
import Occupancy from '../../components/dashboard/gym/Occupancy';
import Timeline from './timeline/Timeline';

const GymTimeline = () => {
  const [viewMode, setViewMode] = useState('active');

  return (
    <div className={styles.container}>
      <SpecialNavbar viewMode={viewMode} setViewMode={setViewMode} />
      
      <ResizablePanels
        leftContent={
          <>
            <Timeline />
          </>
        }
        rightContent={
          <>
            <Occupancy />
          </>
        }
      />
    </div>
  );
};

export default GymTimeline; 