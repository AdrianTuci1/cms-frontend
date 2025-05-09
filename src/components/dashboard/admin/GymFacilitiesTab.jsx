import React, { useState } from 'react';
import styles from './GymFacilitiesTab.module.css';

const GymFacilitiesTab = () => {
  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: 'Sala de Fitness',
      description: 'Sala principală cu echipamente moderne',
      capacity: 50,
      schedule: 'Luni-Duminică 06:00-22:00',
      active: true
    },
    {
      id: 2,
      name: 'Piscină',
      description: 'Piscină olimpică cu 6 benzi',
      capacity: 30,
      schedule: 'Luni-Duminică 07:00-21:00',
      active: true
    }
  ]);

  const handleStatusChange = (facilityId) => {
    setFacilities(facilities.map(facility => 
      facility.id === facilityId ? { ...facility, active: !facility.active } : facility
    ));
  };

  return (
    <div className={styles.section}>
      <h2>Gestionare Facilități</h2>
      <div className={styles.facilitiesList}>
        {facilities.map(facility => (
          <div key={facility.id} className={styles.facilityCard}>
            <div className={styles.facilityHeader}>
              <h3>{facility.name}</h3>
              <div className={styles.facilityActions}>
                <button className={styles.editButton}>✏️</button>
                <button className={styles.deleteButton}>🗑️</button>
              </div>
            </div>
            <div className={styles.facilityDetails}>
              <p>{facility.description}</p>
              <p>Capacitate: {facility.capacity} persoane</p>
              <p>Program: {facility.schedule}</p>
              <div className={styles.statusToggle}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={facility.active}
                    onChange={() => handleStatusChange(facility.id)}
                  />
                  <span className={styles.slider}></span>
                </label>
                <span>{facility.active ? 'Activă' : 'Inactivă'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.addButton}>Adaugă Facilitate Nouă</button>
    </div>
  );
};

export default GymFacilitiesTab; 