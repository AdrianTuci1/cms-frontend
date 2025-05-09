import React, { useState } from 'react';
import styles from './DentalTreatmentsTab.module.css';

const DentalTreatmentsTab = () => {
  const [treatments, setTreatments] = useState([
    {
      id: 1,
      name: 'Curățare Dentară',
      description: 'Curățare profesională și detartraj',
      duration: '60 minute',
      price: '200 RON',
      active: true
    },
    {
      id: 2,
      name: 'Plombă',
      description: 'Tratament pentru carii',
      duration: '45 minute',
      price: '150 RON',
      active: true
    }
  ]);

  const handleStatusChange = (treatmentId) => {
    setTreatments(treatments.map(treatment => 
      treatment.id === treatmentId ? { ...treatment, active: !treatment.active } : treatment
    ));
  };

  return (
    <div className={styles.section}>
      <h2>Gestionare Tratamente</h2>
      <div className={styles.treatmentsList}>
        {treatments.map(treatment => (
          <div key={treatment.id} className={styles.treatmentCard}>
            <div className={styles.treatmentHeader}>
              <h3>{treatment.name}</h3>
              <div className={styles.treatmentActions}>
                <button className={styles.editButton}>✏️</button>
                <button className={styles.deleteButton}>🗑️</button>
              </div>
            </div>
            <div className={styles.treatmentDetails}>
              <p>{treatment.description}</p>
              <p>Durată: {treatment.duration}</p>
              <p>Preț: {treatment.price}</p>
              <div className={styles.statusToggle}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={treatment.active}
                    onChange={() => handleStatusChange(treatment.id)}
                  />
                  <span className={styles.slider}></span>
                </label>
                <span>{treatment.active ? 'Activ' : 'Inactiv'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.addButton}>Adaugă Tratament Nou</button>
    </div>
  );
};

export default DentalTreatmentsTab; 