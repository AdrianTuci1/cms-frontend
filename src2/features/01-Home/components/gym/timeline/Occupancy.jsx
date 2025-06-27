import React, { useState } from 'react';
import styles from './Occupancy.module.css';

const Occupancy = () => {
  const [viewMode, setViewMode] = useState('classes'); // 'classes' or 'trainers'

  // Mock data - replace with actual data from your backend
  const classes = [
    { id: 1, name: 'Zumba', trainer: 'Maria Popescu', time: '10:00', capacity: '15/20' },
    { id: 2, name: 'Yoga', trainer: 'Ion Ionescu', time: '11:30', capacity: '8/15' },
    { id: 3, name: 'Pilates', trainer: 'Ana Dumitrescu', time: '13:00', capacity: '12/15' },
    { id: 4, name: 'CrossFit', trainer: 'Alexandru Marin', time: '14:30', capacity: '10/12' },
  ];

  const trainers = [
    { id: 1, name: 'Maria Popescu', specialization: 'Zumba, Aerobic', status: 'Active' },
    { id: 2, name: 'Ion Ionescu', specialization: 'Yoga, Pilates', status: 'Active' },
    { id: 3, name: 'Ana Dumitrescu', specialization: 'Pilates, Stretching', status: 'Break' },
    { id: 4, name: 'Alexandru Marin', specialization: 'CrossFit, Fitness', status: 'Active' },
  ];

  const areas = [
    { name: 'Sala Fitness', current: 30, max: 50 },
    { name: 'Bazin', current: 15, max: 30 },
    { name: 'Sala Zumba', current: 12, max: 20 },
    { name: 'Sala Yoga', current: 8, max: 15 },
  ];

  return (
    <div className={styles.container}>
      {/* View Mode Toggle */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleButton} ${viewMode === 'classes' ? styles.active : ''}`}
          onClick={() => setViewMode('classes')}
        >
          Clase
        </button>
        <button
          className={`${styles.toggleButton} ${viewMode === 'trainers' ? styles.active : ''}`}
          onClick={() => setViewMode('trainers')}
        >
          Antrenori
        </button>
      </div>

      {/* Scrollable List Section */}
      <div className={styles.scrollableSection}>
        {viewMode === 'classes' ? (
          classes.map((classItem) => (
            <div key={classItem.id} className={styles.listItem}>
              <div className={styles.itemHeader}>
                <span className={styles.itemName}>{classItem.name}</span>
                <span className={styles.itemTime}>{classItem.time}</span>
              </div>
              <div className={styles.itemDetails}>
                <span className={styles.trainerName}>{classItem.trainer}</span>
                <span className={styles.capacity}>{classItem.capacity}</span>
              </div>
            </div>
          ))
        ) : (
          trainers.map((trainer) => (
            <div key={trainer.id} className={styles.listItem}>
              <div className={styles.itemHeader}>
                <span className={styles.itemName}>{trainer.name}</span>
                <span className={`${styles.status} ${styles[trainer.status.toLowerCase()]}`}>
                  {trainer.status}
                </span>
              </div>
              <div className={styles.itemDetails}>
                <span className={styles.specialization}>{trainer.specialization}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Occupancy Section */}
      <div className={styles.occupancySection}>
        <h3 className={styles.sectionTitle}>Grad de Ocupare</h3>
        <div className={styles.occupancyList}>
          {areas.map((area, index) => (
            <div key={index} className={styles.occupancyItem}>
              <div className={styles.areaName}>{area.name}</div>
              <div className={styles.occupancyBar}>
                <div 
                  className={styles.occupancyFill}
                  style={{ width: `${(area.current / area.max) * 100}%` }}
                />
              </div>
              <div className={styles.occupancyCount}>{area.current}/{area.max}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Occupancy; 