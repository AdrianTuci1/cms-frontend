import React, { useState } from 'react';
import styles from './Facilities.module.css';
import FacilityCarousel from './FacilityCarousel';

const facilities = [
  {
    id: 1,
    name: 'Sala de Fitness',
    images: [
      '/images/facilities/gym1.jpg',
      '/images/facilities/gym2.jpg',
      '/images/facilities/gym3.jpg',
      null, // This will show as "Fotografie lipsa"
      null  // This will show as "Fotografie lipsa"
    ]
  },
  {
    id: 2,
    name: 'Piscina',
    images: [
      '/images/facilities/pool1.jpg',
      null, // This will show as "Fotografie lipsa"
      '/images/facilities/pool3.jpg'
    ]
  },
  {
    id: 3,
    name: 'Sala de Yoga',
    images: [
      null, // This will show as "Fotografie lipsa"
      '/images/facilities/yoga2.jpg',
      '/images/facilities/yoga3.jpg'
    ]
  }
];

const Facilities = () => {
  const [selectedFacility, setSelectedFacility] = useState(facilities[0]);

  return (
    <div className={styles.facilitiesContainer}>
      <h2 className={styles.title}>FACILITATI</h2>
      <div className={styles.facilitiesList}>
        {facilities.map((facility) => (
          <div 
            key={facility.id}
            className={`${styles.facilityItem} ${selectedFacility.id === facility.id ? styles.active : ''}`}
            onClick={() => setSelectedFacility(facility)}
          >
            {facility.name}
          </div>
        ))}
      </div>
      <div className={styles.carouselContainer}>
        <FacilityCarousel 
          images={selectedFacility.images} 
          title={selectedFacility.name}
        />
      </div>
    </div>
  );
};

export default Facilities; 