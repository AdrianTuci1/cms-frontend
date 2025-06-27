import React from 'react';
import styles from '../Timeline.module.css';

function getOccupancyColor(percentage) {
  if (percentage < 30) return '#4caf50';
  if (percentage < 60) return '#ff9800';
  return '#f44336';
}

const OccupancyTimeline = ({ hourlyOccupancy, currentTime }) => {
  return (
    <div className={styles.occupancyTimeline}>
      <div className={styles.header}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#4caf50' }}></div>
            <span>Sub 30%</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#ff9800' }}></div>
            <span>30-60%</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#f44336' }}></div>
            <span>Peste 60%</span>
          </div>
        </div>
      </div>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {hourlyOccupancy.map((occupancy, hour) => {
            const isFuture = hour > currentTime.getHours() || 
                           (hour === currentTime.getHours() && currentTime.getMinutes() > 0);
            return (
              <div 
                key={hour}
                className={`${styles.bar} ${isFuture ? styles.future : ''}`}
                style={{ 
                  backgroundColor: getOccupancyColor(occupancy),
                  opacity: isFuture ? 0.4 : 0.8
                }}
                title={`${Math.round(occupancy)}% ocupare la ora ${hour}:00`}
              />
            );
          })}
          <div 
            className={styles.timeMarker}
            style={{ 
              left: `${(currentTime.getHours() * 60 + currentTime.getMinutes()) / 1440 * 100}%` 
            }}
            data-time={`${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`}
          />
        </div>
      </div>
    </div>
  );
};

export default OccupancyTimeline; 