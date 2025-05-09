import React, { useState } from 'react';
import styles from './GymClassesTab.module.css';

const GymClassesTab = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: 'Yoga',
      instructor: 'Maria Popescu',
      schedule: 'Luni, Miercuri, Vineri 18:00',
      capacity: 20,
      active: true
    },
    {
      id: 2,
      name: 'Pilates',
      instructor: 'Ion Ionescu',
      schedule: 'Marți, Joi 19:00',
      capacity: 15,
      active: true
    }
  ]);

  const handleStatusChange = (classId) => {
    setClasses(classes.map(cls => 
      cls.id === classId ? { ...cls, active: !cls.active } : cls
    ));
  };

  return (
    <div className={styles.section}>
      <h2>Gestionare Clase</h2>
      <div className={styles.classesList}>
        {classes.map(cls => (
          <div key={cls.id} className={styles.classCard}>
            <div className={styles.classHeader}>
              <h3>{cls.name}</h3>
              <div className={styles.classActions}>
                <button className={styles.editButton}>✏️</button>
                <button className={styles.deleteButton}>🗑️</button>
              </div>
            </div>
            <div className={styles.classDetails}>
              <p>Instructor: {cls.instructor}</p>
              <p>Program: {cls.schedule}</p>
              <p>Capacitate: {cls.capacity} persoane</p>
              <div className={styles.statusToggle}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={cls.active}
                    onChange={() => handleStatusChange(cls.id)}
                  />
                  <span className={styles.slider}></span>
                </label>
                <span>{cls.active ? 'Activă' : 'Inactivă'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.addButton}>Adaugă Clasă Nouă</button>
    </div>
  );
};

export default GymClassesTab; 