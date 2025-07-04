import React from 'react';
import { FaPlus, FaPrint } from 'react-icons/fa';
import styles from './StockNavbar.module.css';

const StockNavbar = ({ onPrint, onAddStock, canCreateStock = true, businessType = 'gym' }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerActions}>
        <button 
          className={styles.printButton}
          onClick={onPrint}
        >
          <FaPrint className={styles.icon} />
          Print
        </button>
        <button 
          className={styles.addButton}
          onClick={onAddStock}
          disabled={!canCreateStock}
        >
          <FaPlus className={styles.icon} />
          {canCreateStock ? 'Add Stock' : 'No Permission'}
        </button>
      </div>
    </div>
  );
};

export default StockNavbar; 