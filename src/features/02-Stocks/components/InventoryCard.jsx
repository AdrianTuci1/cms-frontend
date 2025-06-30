import React, { memo, useState } from 'react';
import styles from './InventoryCard.module.css';

const InventoryCard = memo(({ 
  item, 
  formatCurrency, 
  onUpdate, 
  onDelete, 
  canUpdate, 
  canDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    currentPrice: item.currentPrice,
    quantity: item.quantity,
    category: item.category
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate(item.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: item.name,
      currentPrice: item.currentPrice,
      quantity: item.quantity,
      category: item.category
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await onDelete(item.id);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (isEditing) {
    return (
      <div className={styles.inventoryCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span className={styles.code}>{item.code}</span>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              className={styles.editInput}
            />
          </div>
          <select
            value={editData.category}
            onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
            className={styles.editSelect}
          >
            <option value="Drinks">Drinks</option>
            <option value="Supplements">Supplements</option>
          </select>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.cardInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Price:</span>
              <input
                type="number"
                step="0.01"
                value={editData.currentPrice}
                onChange={(e) => setEditData(prev => ({ ...prev, currentPrice: parseFloat(e.target.value) }))}
                className={styles.editInput}
              />
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Quantity:</span>
              <input
                type="number"
                value={editData.quantity}
                onChange={(e) => setEditData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                className={styles.editInput}
              />
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Total Value:</span>
              <span className={styles.infoValue}>
                {formatCurrency(editData.currentPrice * editData.quantity)}
              </span>
            </div>
          </div>
          <div className={styles.cardActions}>
            <button 
              className={`${styles.actionButton} ${styles.saveButton}`}
              onClick={handleSave}
            >
              Save
            </button>
            <button 
              className={`${styles.actionButton} ${styles.cancelButton}`}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.inventoryCard}>
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
            <span className={styles.infoValue}>{item.quantity}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Total Value:</span>
            <span className={styles.infoValue}>{formatCurrency(item.value || item.currentPrice * item.quantity)}</span>
          </div>
        </div>
        <div className={styles.cardActions}>
          {canUpdate && (
            <button 
              className={`${styles.actionButton} ${styles.editButton}`}
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button 
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default InventoryCard; 