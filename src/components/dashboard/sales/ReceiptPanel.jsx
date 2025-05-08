import React from 'react';
import styles from './ReceiptPanel.module.css';

const ReceiptPanel = ({ 
  cart, 
  total, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onValidate, 
  onCancel 
}) => (
  <div className={styles.receiptPanel}>
    <div className={styles.receiptPanelContent}>
      <div className={styles.receiptHeader}>
        <h2>Bon Fiscal</h2>
        <span className={styles.receiptDate}>{new Date().toLocaleDateString()}</span>
      </div>
      <div className={styles.receiptItems}>
        {cart.map(item => (
          <div key={item.id} className={styles.receiptItem}>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemCode}>{item.code}</span>
            </div>
            <div className={styles.itemDetails}>
              <div className={styles.quantityControls}>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <span className={styles.itemPrice}>{item.currentPrice * item.quantity} RON</span>
              <button 
                className={styles.removeButton}
                onClick={() => onRemoveFromCart(item.id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.receiptTotal}>
        <div className={styles.totalRow}>
          <span>Subtotal</span>
          <span>{total} RON</span>
        </div>
        <div className={styles.totalRow}>
          <span>TVA (19%)</span>
          <span>{(total * 0.19).toFixed(2)} RON</span>
        </div>
        <div className={styles.totalRow}>
          <strong>Total</strong>
          <strong>{(total * 1.19).toFixed(2)} RON</strong>
        </div>
      </div>
      <div className={styles.receiptActions}>
        <button 
          className={styles.validateButton}
          onClick={onValidate}
          disabled={cart.length === 0}
        >
          Validează
        </button>
        <button 
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={cart.length === 0}
        >
          Anulează
        </button>
      </div>
    </div>
  </div>
);

export default ReceiptPanel; 