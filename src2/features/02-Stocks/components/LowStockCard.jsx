import React, { memo } from 'react';
import styles from './LowStockCard.module.css';

const LowStockCard = memo(({ item, formatCurrency }) => (
  <div className={styles.lowStockCard}>
    <div className={styles.cardHeader}>
      <div className={styles.cardTitle}>
        <span className={styles.code}>{item.code}</span>
        <h4>{item.name}</h4>
      </div>
      <span className={styles.category}>{item.category}</span>
    </div>
    <div className={styles.cardContent}>
      <div className={styles.cardInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Price:</span>
          <span className={styles.infoValue}>{formatCurrency(item.currentPrice)}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Quantity:</span>
          <span className={`${styles.infoValue} ${styles.lowQuantity}`}>{item.quantity}</span>
        </div>
      </div>
      <div className={styles.cardActions}>
        <button className={styles.actionButton}>Restock</button>
      </div>
    </div>
  </div>
));

export default LowStockCard; 