import React, { memo } from 'react';
import styles from './LowStockCard.module.css';

const LowStockCard = memo(({ 
  item, 
  formatCurrency, 
  onUpdate, 
  onDelete, 
  canUpdate, 
  canDelete 
}) => {
  const handleEdit = () => {
    if (canUpdate && onUpdate) {
      onUpdate(item);
    }
  };

  const handleDelete = async () => {
    if (canDelete && onDelete) {
      if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
        try {
          await onDelete(item.id);
        } catch (error) {
          console.error('Failed to delete item:', error);
        }
      }
    }
  };

  const handleRestock = async () => {
    if (canUpdate && onUpdate) {
      const newQuantity = item.quantity + 50; // Add 50 units
      try {
        await onUpdate({ ...item, quantity: newQuantity });
      } catch (error) {
        console.error('Failed to restock item:', error);
      }
    }
  };

  return (
    <div 
      className={styles.lowStockCard}
      onClick={handleEdit}
    >
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
          {canUpdate && (
            <button 
              className={`${styles.actionButton} ${styles.restockButton}`}
              onClick={(e) => {
                e.stopPropagation();
                handleRestock();
              }}
            >
              Restock
            </button>
          )}
          {canDelete && (
            <button 
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default LowStockCard; 