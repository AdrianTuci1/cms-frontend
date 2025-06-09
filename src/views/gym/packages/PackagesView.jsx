import React, { useState } from 'react';
import styles from './PackagesView.module.css';
import PackageCard from '../../../components/dashboard/gym/Packages/PackageCard';

const PackagesView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Basic Fitness',
      price: 49,
      description: 'Access to gym equipment and basic facilities',
      duration: 1,
      type: 'Standard',
      features: ['Gym Access', 'Locker Room', 'Basic Equipment']
    },
    {
      id: 2,
      name: 'Premium Wellness',
      price: 89,
      description: 'Full access to all facilities including pool and spa',
      duration: 3,
      type: 'Premium',
      features: ['Gym Access', 'Pool', 'Spa', 'Personal Trainer', 'Group Classes']
    },
    {
      id: 3,
      name: 'Elite Performance',
      price: 129,
      description: 'Complete wellness package with personal training and nutrition plan',
      duration: 6,
      type: 'Elite',
      features: ['Gym Access', 'Pool', 'Spa', 'Personal Trainer', 'Group Classes', 'Nutrition Plan', 'Recovery Room']
    }
  ]);

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles.packagesView}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.actions}>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className={styles.filterButton}>
              <svg className={styles.filterIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14 14V21C14 21.5523 13.5523 22 13 22H11C10.4477 22 10 21.5523 10 21V14L3.29289 7.29289C3.10536 7.10536 3 6.851 3 6.58579V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={styles.addButton}>
              <svg className={styles.plusIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <span className={styles.packageCount}>{filteredPackages.length} packages</span>
        </div>
      </div>
      <div className={styles.packagesContainer}>
        {filteredPackages.map(pkg => (
          <PackageCard key={pkg.id} packageData={pkg} />
        ))}
      </div>
    </div>
  );
};

export default PackagesView; 