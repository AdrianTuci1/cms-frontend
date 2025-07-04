import React, { useState } from 'react';
import ResizablePanels from '../../components/gym/timeline/ResizablePanels.jsx';
import ProductsPanel from '../../components/sales/ProductsPanel.jsx';
import ReceiptPanel from '../../components/sales/ReceiptPanel.jsx';
import { useSalesStore } from '../../store';
import { useDataSync } from '../../../../design-patterns/hooks';
import styles from './SalesView.module.css';

const SalesView = ({ businessType = 'dental' }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Use useDataSync hook directly for stocks data
  const stocksSync = useDataSync('stocks', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const { data: stocksData, loading: stocksLoading, error: stocksError } = stocksSync;

  // Extract the actual stock items from the stocks data
  const stockItems = stocksData?.items || stocksData || [];

  // Folosește sales store cu integrare API și shared stocks data
  const {
    cart,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    validateCart,
    finalizeSale,
    cancelSale,
    canCreateSale
  } = useSalesStore(businessType, stockItems);

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

  const handleValidate = () => {
    try {
      const validation = validateCart();
      if (validation.isValid) {
        console.log('Cart is valid:', validation);
        // Proceed with sale
      } else {
        console.error('Cart validation failed:', validation.errors);
      }
    } catch (error) {
      console.error('Error validating cart:', error.message);
    }
  };

  const handleCancel = () => {
    cancelSale();
  };

  return (
    <div className={styles.salesContainer}>
      <ResizablePanels
        leftContent={
          <ProductsPanel 
            onAddToCart={handleAddToCart}
            products={stockItems}
            loading={stocksLoading}
            error={stocksError}
            businessType={businessType}
          />
        }
        rightContent={
          <ReceiptPanel
            cart={cart}
            total={total}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
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