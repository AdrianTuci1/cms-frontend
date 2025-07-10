import React from 'react';
import styles from './ReceiptPanel.module.css';

const ReceiptPanel = ({ 
  cart, 
  total, 
  paymentMethod = 'cash',
  onPaymentMethodChange,
  onUpdateQuantity, 
  onRemoveFromCart, 
  onValidate, 
  onCancel,
  canCreateSale = true,
}) => {
  // Calculează TVA și total
  const subtotal = total;
  const tva = subtotal * 0.19;
  const totalWithTva = subtotal + tva;

  return (
    <div className={styles.receiptPanel}>
      <div className={styles.receiptPanelContent}>
        <div className={styles.receiptHeader}>
          <h2>Receipt</h2>
          <span className={styles.receiptDate}>{new Date().toLocaleDateString()}</span>
        </div>

        {/* Cart Items */}
        <div className={styles.receiptItems}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Cart is empty</p>
              <p>Add products from the left panel</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.receiptItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemCode}>ID: {item.id}</span>
                  {item.category && (
                    <span className={styles.itemCategory}>{item.category}</span>
                  )}
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.quantityControls}>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <div className={styles.priceInfo}>
                    <span className={styles.unitPrice}>
                      {(item.currentPrice || item.price).toFixed(2)} RON/unit
                    </span>
                    <span className={styles.itemPrice}>
                      {((item.currentPrice || item.price) * item.quantity).toFixed(2)} RON
                    </span>
                  </div>
                  <button 
                    className={styles.removeButton}
                    onClick={() => onRemoveFromCart(item.id)}
                    title="Remove from cart"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Receipt Summary */}
        {cart.length > 0 && (
          <div className={styles.receiptTotal}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} RON</span>
            </div>
            <div className={styles.totalRow}>
              <span>VAT (19%)</span>
              <span>{tva.toFixed(2)} RON</span>
            </div>
            <div className={styles.totalRow}>
              <strong>Total</strong>
              <strong>{totalWithTva.toFixed(2)} RON</strong>
            </div>
          </div>
        )}

        {/* Payment Method Selection */}
        <div className={styles.paymentMethods}>
          <button 
            className={`${styles.paymentButton} ${paymentMethod === 'cash' ? styles.active : ''}`}
            onClick={() => onPaymentMethodChange('cash')}
          >
            Cash
          </button>
          <button 
            className={`${styles.paymentButton} ${paymentMethod === 'card' ? styles.active : ''}`}
            onClick={() => onPaymentMethodChange('card')}
          >
            Card
          </button>
          <button 
            className={`${styles.paymentButton} ${paymentMethod === 'voucher' ? styles.active : ''}`}
            onClick={() => onPaymentMethodChange('voucher')}
          >
            Voucher
          </button>
        </div>

        {/* Actions */}
        <div className={styles.receiptActions}>
          <button 
            className={styles.validateButton}
            onClick={onValidate}
            disabled={cart.length === 0 || !canCreateSale}
            title={!canCreateSale ? 'Insufficient permissions to create sale' : ''}
          >
            {canCreateSale ? 'Validate & Complete Sale' : 'Cannot Create Sale'}
          </button>
          <button 
            className={styles.clearButton}
            onClick={onCancel}
            disabled={cart.length === 0}
            title="Clear cart"
          >
            🗑️
          </button>
        </div>

        {/* Status Information */}
        <div className={styles.statusInfo}>
          <div className={styles.statusItem}>
            <span>Items in cart:</span>
            <span>{cart.length}</span>
          </div>
          <div className={styles.statusItem}>
            <span>Can create sale:</span>
            <span className={canCreateSale ? styles.success : styles.error}>
              {canCreateSale ? 'Yes' : 'No'}
            </span>
          </div>
          {cart.length > 0 && (
            <div className={styles.statusItem}>
              <span>Average item price:</span>
              <span>{(total / cart.reduce((sum, item) => sum + item.quantity, 0)).toFixed(2)} RON</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptPanel; 