import React from 'react';
import styles from './AddStockForm.module.css';

const AddStockForm = ({ newItem, setNewItem, onSubmit, onCancel, canCreateStock = true }) => {
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
              disabled={!canCreateStock}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              required
              disabled={!canCreateStock}
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
              disabled={!canCreateStock}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Quantity:</label>
            <input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
              required
              disabled={!canCreateStock}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Category:</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              disabled={!canCreateStock}
            >
              <option value="Drinks">Drinks</option>
              <option value="Supplements">Supplements</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!canCreateStock}
            >
              {canCreateStock ? 'Add Stock' : 'No Permission'}
            </button>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
          {!canCreateStock && (
            <div className={styles.permissionWarning}>
              <p>⚠️ You don't have permission to create stock items.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddStockForm; 