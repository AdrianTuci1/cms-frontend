import React from 'react';
import styles from './StockNavbar.module.css';

const StockNavbar = ({ onPrint, onAddStock }) => {
  return (
    <div className={styles.header}>
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
        >
          Add New Stock
        </button>
      </div>
    </div>
  );
};

export default StockNavbar; 