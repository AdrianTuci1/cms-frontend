import React, { useState } from 'react';
import ResizablePanels from '../components/dashboard/gym/ResizablePanels';
import ProductsPanel from '../components/dashboard/sales/ProductsPanel';
import ReceiptPanel from '../components/dashboard/sales/ReceiptPanel';
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

  return (
    <div className={styles.salesContainer}>
      <ResizablePanels
        leftContent={<ProductsPanel onAddToCart={handleAddToCart} />}
        rightContent={
          <ReceiptPanel
            cart={cart}
            total={total}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onValidate={handleValidate}
            onCancel={handleCancel}
          />
        }
      />
    </div>
  );
};

export default SalesView; 