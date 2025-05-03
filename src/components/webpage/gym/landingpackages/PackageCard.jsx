import React from 'react';
import styles from './PackageCard.module.css';

const PackageCard = ({ package: pkg, isPartial, position }) => {
  const getTierColor = (tier) => {
    switch (tier) {
      case 'gold':
        return styles.gold;
      case 'silver':
        return styles.silver;
      case 'black':
        return styles.black;
      case 'service':
        return styles.service;
      default:
        return styles.none;
    }
  };

  return (
    <div className={`${styles.packageCard} ${getTierColor(pkg.tier)} ${isPartial ? styles.partial : ''} ${styles[position]}`}>
      <div className={styles.packageHeader}>
        <h3 className={styles.packageName}>{pkg.name}</h3>
        <div className={styles.priceContainer}>
          <span className={styles.price}>{pkg.price}€</span>
          {pkg.entry_type === 'monthly' && <span className={styles.period}>/lună</span>}
        </div>
      </div>
      
      <div className={styles.packageDetails}>
        <ul className={styles.featuresList}>
          {pkg.features.map((feature, index) => (
            <li key={index} className={styles.feature}>
              {feature}
            </li>
          ))}
        </ul>
        
        <div className={styles.entryInfo}>
          {pkg.entry_limit ? (
            <span>{pkg.entry_limit} {pkg.entry_type === 'monthly' ? 'intrări/lună' : 'intrare'}</span>
          ) : (
            <span>Acces nelimitat</span>
          )}
        </div>
      </div>
      
      <button className={styles.selectButton}>
        Selectează
      </button>
    </div>
  );
};

export default PackageCard; 