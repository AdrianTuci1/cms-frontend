import React from 'react';
import styles from './AddStockForm.module.css';

const AddStockForm = ({ newItem, setNewItem, onSubmit, onCancel }) => {
  return (
    <div className={styles.addFormOverlay}>
      <div className={styles.addForm}>
        <h3>Add New Stock</h3>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label>Code:</label>
            <input
              type="text"
              value={newItem.code}
              onChange={(e) => setNewItem({...newItem, code: e.target.value})}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Price:</label>
            <input
              type="number"
              step="0.01"
              value={newItem.currentPrice}
              onChange={(e) => setNewItem({...newItem, currentPrice: e.target.value})}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Quantity:</label>
            <input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Category:</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            >
              <option value="Drinks">Drinks</option>
              <option value="Supplements">Supplements</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>Add Stock</button>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockForm; 