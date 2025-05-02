import React, { useState } from 'react';
import styles from './Packages.module.css';
import PackageCard from './PackageCard';

const packages = [
  { 
    id: 'pkg_gold_001', 
    name: 'Gold Membership', 
    price: 150, 
    entry_limit: null, 
    entry_type: 'unlimited', 
    is_single_use: false, 
    tier: 'gold',
    features: [
      'Acces nelimitat la toate facilitățile',
      'Acces la piscină',
      'Acces la saună',
      'Antrenor personal inclus',
      'Reduceri la suplimente'
    ]
  },
  { 
    id: 'pkg_silver_002', 
    name: 'Silver Access', 
    price: 100, 
    entry_limit: 12, 
    entry_type: 'monthly', 
    is_single_use: false, 
    tier: 'silver',
    features: [
      '12 intrări pe lună',
      'Acces la sala de fitness',
      'Acces la grupuri de fitness',
      'Consultanță nutrițională'
    ]
  },
  { 
    id: 'pkg_black_003', 
    name: 'Black VIP', 
    price: 250, 
    entry_limit: null, 
    entry_type: 'unlimited', 
    is_single_use: false, 
    tier: 'black',
    features: [
      'Acces nelimitat 24/7',
      'Acces VIP la toate facilitățile',
      'Antrenor personal dedicat',
      'Acces la spa și masaje',
      'Programări prioritare',
      'Reduceri exclusive'
    ]
  },
  { 
    id: 'pkg_daypass_004', 
    name: 'Day Pass', 
    price: 20, 
    entry_limit: 1, 
    entry_type: 'total', 
    is_single_use: true, 
    tier: 'none',
    features: [
      'Acces pentru o zi',
      'Acces la sala de fitness',
      'Acces la grupuri de fitness'
    ]
  },
  { 
    id: 'srv_pt_005', 
    name: 'Personal Training Session', 
    price: 80, 
    entry_limit: 1, 
    entry_type: 'total', 
    is_single_use: true, 
    tier: 'service',
    features: [
      'Sesiune de 60 minute',
      'Program personalizat',
      'Evaluare fitness',
      'Plan de nutriție'
    ]
  }
];

const Packages = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const visiblePackages = 3;

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 <= packages.length - visiblePackages ? prevIndex + 1 : 0
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 >= 0 ? prevIndex - 1 : packages.length - visiblePackages
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const getVisiblePackages = () => {
    const visible = [];
    const totalPackages = packages.length;
    
    // Add current packages
    for (let i = 0; i < visiblePackages; i++) {
      const index = (currentIndex + i) % totalPackages;
      visible.push({
        ...packages[index],
        isPartial: false,
        position: 'center'
      });
    }

    // Add preview package
    const previewIndex = (currentIndex + visiblePackages) % totalPackages;
    visible.push({
      ...packages[previewIndex],
      isPartial: true,
      position: 'right'
    });

    return visible;
  };

  return (
    <div className={styles.packagesContainer}>
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>PACHETE</h2>
        <div className={styles.arrowsContainer}>
          <button className={styles.arrowButton} onClick={prevSlide}>
            <span className={styles.arrow}>←</span>
          </button>
          <button className={styles.arrowButton} onClick={nextSlide}>
            <span className={styles.arrow}>→</span>
          </button>
        </div>
      </div>
      <div className={styles.carouselContainer}>
        <div 
          className={`${styles.packagesWrapper} ${isTransitioning ? styles.transitioning : ''}`}
          style={{
            transform: `translateX(calc(-${currentIndex * (100 / visiblePackages)}%))`
          }}
        >
          {getVisiblePackages().map((pkg, index) => (
            <PackageCard 
              key={pkg.id}
              package={pkg}
              isPartial={pkg.isPartial}
              position={pkg.position}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Packages; 