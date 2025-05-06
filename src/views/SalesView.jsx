import React, { useState } from 'react';
import ResizablePanels from '../components/dashboard/gym/ResizablePanels';
import { stocksData } from '../data/stocksData';
import styles from './SalesView.module.css';

const SalesView = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    updateTotal();
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    updateTotal();
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
    updateTotal();
  };

  const updateTotal = () => {
    const newTotal = cart.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
    setTotal(newTotal);
  };

  const handleValidate = () => {
    // TODO: Implement validation logic
    console.log('Validating receipt:', cart);
  };

  const handleCancel = () => {
    setCart([]);
    setTotal(0);
  };

  const ProductsPanel = () => (
    <div className={styles.productsPanel}>
      <div className={styles.productsHeader}>
        <h2>Produse</h2>
        <span className={styles.productCount}>{stocksData.inventory.length} produse disponibile</span>
      </div>
      <div className={styles.productsGrid}>
        {stocksData.inventory.map(product => (
          <div 
            key={product.id} 
            className={styles.productCard}
            onClick={() => handleAddToCart(product)}
          >
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <span className={styles.productCode}>{product.code}</span>
            </div>
            <div className={styles.productPrice}>
              <span>{product.currentPrice} RON</span>
              <span className={styles.stockInfo}>Stoc: {product.quantity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReceiptPanel = () => (
    <div className={styles.receiptPanel}>
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
                <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <span className={styles.itemPrice}>{item.currentPrice * item.quantity} RON</span>
              <button 
                className={styles.removeButton}
                onClick={() => handleRemoveFromCart(item.id)}
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
          onClick={handleValidate}
          disabled={cart.length === 0}
        >
          Validează
        </button>
        <button 
          className={styles.cancelButton}
          onClick={handleCancel}
          disabled={cart.length === 0}
        >
          Anulează
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.salesContainer}>
      <ResizablePanels
        leftContent={<ProductsPanel />}
        rightContent={<ReceiptPanel />}
      />
    </div>
  );
};

export default SalesView; 