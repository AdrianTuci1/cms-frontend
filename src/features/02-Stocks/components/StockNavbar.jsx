import React from 'react';
import styles from './StockNavbar.module.css';

const StockNavbar = ({ onPrint, onAddStock, canCreateStock = true, businessType = 'gym' }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerInfo}>
        <h2>Inventory Management</h2>
        <span className={styles.businessType}>{businessType.toUpperCase()}</span>
      </div>
      <div className={styles.headerActions}>
        <button 
          className={styles.printButton}
          onClick={onPrint}
        >
          Print Stock
        </button>
        <button 
          className={styles.addButton}
          onClick={onAddStock}
          disabled={!canCreateStock}
        >
          {canCreateStock ? 'Add New Stock' : 'No Permission'}
        </button>
      </div>
    </div>
  );
};

export default StockNavbar; 