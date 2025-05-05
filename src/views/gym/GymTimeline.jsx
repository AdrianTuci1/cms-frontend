import React, { useState } from 'react';
import styles from './GymTimeline.module.css';
import SpecialNavbar from '../../components/navbar/SpecialNavbar';
import ResizablePanels from '../../components/dashboard/gym/ResizablePanels';
import MemberCards from '../../components/dashboard/gym/MemberCards';
import Occupancy from '../../components/dashboard/gym/Occupancy';

const GymTimeline = () => {
  const [viewMode, setViewMode] = useState('active');

  return (
    <div className={styles.container}>
      <SpecialNavbar viewMode={viewMode} setViewMode={setViewMode} />
      
      <ResizablePanels
        leftContent={
          <>
            <h3>Membri</h3>
            <MemberCards />
          </>
        }
        rightContent={
          <>
            <h3>Ocupare</h3>
            <Occupancy />
          </>
        }
      />
    </div>
  );
};

export default GymTimeline; 