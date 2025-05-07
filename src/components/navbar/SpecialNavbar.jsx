import React from 'react';
import { FaClock } from 'react-icons/fa';
import styles from './SpecialNavbar.module.css';
import useTimelineStore from '../../store/timelineStore';

const SpecialNavbar = () => {
  const { showFullDay, setShowFullDay } = useTimelineStore();

  return (
    <div className={styles.navbar}>
      <button
        className={`${styles.button} ${showFullDay ? styles.active : ''}`}
        onClick={() => setShowFullDay(!showFullDay)}
      >
        <FaClock />
        <span>{showFullDay ? 'Toate' : 'Active'}</span>
      </button>
    </div>
  );
};

export default SpecialNavbar; 