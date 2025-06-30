import React, { useState } from 'react';
import ResizablePanels from '../components/dashboard/gym/ResizablePanels';
import ProductsPanel from '../components/sales/ProductsPanel';
import ReceiptPanel from '../components/sales/ReceiptPanel';
import { useSalesStore } from '../../store';
import styles from './SalesView.module.css';

const SalesView = ({ businessType = 'dental' }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Folosește sales store cu integrare API
  const {
    cart,
    total,
    stocksData,
    stocksLoading,
    stocksError,
    addToCart,
    removeFromCart,
    updateQuantity,
    validateCart,
    finalizeSale,
    cancelSale,
    canCreateSale
  } = useSalesStore(businessType);

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error.message);
    }
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    try {
      updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error.message);
    }
  };

  const handleValidate = async () => {
    try {
      const validation = validateCart();
      
      if (!validation.isValid) {
        console.error('Cart validation failed:', validation.errors);
        return false;
      }

      if (!canCreateSale) {
        console.error('Insufficient permissions to create sale');
        return false;
      }

      // Finalizează vânzarea direct
      await handleFinalizeSale();
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const handleFinalizeSale = async () => {
    try {
      const sale = await finalizeSale(paymentMethod, {});
      console.log('Sale completed successfully:', sale);
    } catch (error) {
      console.error('Error finalizing sale:', error);
    }
  };

  const handleCancel = () => {
    cancelSale();
  };

  return (
    <div className={styles.salesContainer}>
      {/* Payment Method Selection */}
      <div className={styles.paymentMethod}>
        <label>Payment Method:</label>
        <select 
          value={paymentMethod} 
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="transfer">Bank Transfer</option>
          <option value="voucher">Voucher</option>
        </select>
      </div>

      <ResizablePanels
        leftContent={
          <ProductsPanel 
            onAddToCart={handleAddToCart}
            products={stocksData}
            loading={stocksLoading}
            error={stocksError}
            businessType={businessType}
          />
        }
        rightContent={
          <ReceiptPanel
            cart={cart}
            total={total}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onValidate={handleValidate}
            onCancel={handleCancel}
            canCreateSale={canCreateSale}
            businessType={businessType}
          />
        }
      />
    </div>
  );
};

export default SalesView; 