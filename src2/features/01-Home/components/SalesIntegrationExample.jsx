/**
 * SalesIntegrationExample - Exemplu complet de integrare pentru SalesView
 * Demonstrează folosirea salesStore cu API integration și Strategy Pattern
 * Similar cu IntegrationExample dar specializat pentru vânzări
 */

import React, { useState, useEffect } from 'react';
import { useSalesStore } from '../store';
import { useObserver } from '../../../design-patterns/hooks/useObserver';
import styles from './SalesIntegrationExample.module.css';

const SalesIntegrationExample = ({ businessType = 'dental' }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    createInvoice: false
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Hook pentru observer pattern
  const { subscribe, emit } = useObserver();

  // Folosește sales store cu integrare API
  const {
    cart,
    total,
    currentSale,
    saleHistory,
    stocksData,
    stocksLoading,
    stocksError,
    salesData,
    salesLoading,
    salesError,
    invoicesData,
    invoicesLoading,
    invoicesError,
    addToCart,
    removeFromCart,
    updateQuantity,
    validateCart,
    finalizeSale,
    cancelSale,
    searchProducts,
    getAvailableProducts,
    refreshStocks,
    refreshSales,
    refreshInvoices,
    canCreateSale,
    canUpdateStock,
    canCreateInvoice,
    businessLogic
  } = useSalesStore(businessType);

  // Filtrează produsele după căutare și categorie
  const filteredProducts = stocksData.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obține categoriile unice
  const categories = ['all', ...new Set(stocksData.map(p => p.category).filter(Boolean))];

  // Setup event listeners
  useEffect(() => {
    const listeners = [];

    listeners.push(
      subscribe('cart:itemAdded', (data) => {
        console.log('Item added to cart:', data);
      }),
      
      subscribe('cart:itemRemoved', (data) => {
        console.log('Item removed from cart:', data);
      }),
      
      subscribe('cart:quantityUpdated', (data) => {
        console.log('Quantity updated:', data);
      }),
      
      subscribe('sale:completed', (data) => {
        console.log('Sale completed:', data);
      }),
      
      subscribe('sale:error', (data) => {
        console.error('Sale error:', data);
      }),
      
      subscribe('cart:cleared', (data) => {
        console.log('Cart cleared:', data);
      })
    );

    return () => {
      listeners.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe]);

  // Handlers
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

      // Dacă avem informații despre client, finalizează vânzarea
      if (customerInfo.name || customerInfo.email || customerInfo.phone) {
        await handleFinalizeSale();
      } else {
        // Arată formularul pentru client
        setShowCustomerForm(true);
      }

      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const handleFinalizeSale = async () => {
    try {
      const sale = await finalizeSale(selectedPaymentMethod, customerInfo);
      console.log('Sale completed successfully:', sale);
      
      // Reset form
      setCustomerInfo({
        name: '',
        email: '',
        phone: '',
        createInvoice: false
      });
      setShowCustomerForm(false);
      
    } catch (error) {
      console.error('Error finalizing sale:', error);
    }
  };

  const handleCancel = () => {
    cancelSale();
    setCustomerInfo({
      name: '',
      email: '',
      phone: '',
      createInvoice: false
    });
    setShowCustomerForm(false);
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Render customer form
  const renderCustomerForm = () => {
    if (!showCustomerForm) return null;

    return (
      <div className={styles.customerForm}>
        <h3>Customer Information</h3>
        <div className={styles.formFields}>
          <div className={styles.formField}>
            <label>Name:</label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
              placeholder="Customer name"
            />
          </div>
          <div className={styles.formField}>
            <label>Email:</label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
              placeholder="customer@example.com"
            />
          </div>
          <div className={styles.formField}>
            <label>Phone:</label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
              placeholder="+1234567890"
            />
          </div>
          <div className={styles.formField}>
            <label>
              <input
                type="checkbox"
                checked={customerInfo.createInvoice}
                onChange={(e) => handleCustomerInfoChange('createInvoice', e.target.checked)}
              />
              Create Invoice
            </label>
          </div>
        </div>
        <div className={styles.formActions}>
          <button onClick={handleFinalizeSale} disabled={!canCreateSale}>
            Complete Sale
          </button>
          <button onClick={() => setShowCustomerForm(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Render products panel
  const renderProductsPanel = () => {
    if (stocksLoading) {
      return <div className={styles.loading}>Loading products...</div>;
    }

    if (stocksError) {
      return <div className={styles.error}>Error loading products: {stocksError.message}</div>;
    }

    return (
      <div className={styles.productsPanel}>
        <h3>Products ({businessType})</h3>
        
        {/* Search and Filter Controls */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.categoryFilter}>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {filteredProducts.length === 0 ? (
            <div className={styles.noProducts}>
              <p>No products found</p>
              {searchTerm && <p>Try adjusting your search terms</p>}
            </div>
          ) : (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className={styles.productCard}
                onClick={() => handleAddToCart(product)}
              >
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <span className={styles.productCode}>ID: {product.id}</span>
                  {product.category && (
                    <span className={styles.productCategory}>{product.category}</span>
                  )}
                  {product.description && (
                    <p className={styles.productDescription}>{product.description}</p>
                  )}
                </div>
                <div className={styles.productPrice}>
                  <span className={styles.price}>{product.currentPrice || product.price} RON</span>
                  <span className={styles.stockInfo}>
                    Stock: {product.quantity}
                    {product.quantity <= 5 && (
                      <span className={styles.lowStock}> (Low Stock)</span>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Render receipt panel
  const renderReceiptPanel = () => {
    const subtotal = total;
    const tva = subtotal * 0.19;
    const totalWithTva = subtotal + tva;

    return (
      <div className={styles.receiptPanel}>
        <h3>Receipt ({businessType})</h3>
        <div className={styles.receiptDate}>
          {new Date().toLocaleDateString()}
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
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
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
                    onClick={() => handleRemoveFromCart(item.id)}
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

        {/* Payment Method */}
        <div className={styles.paymentMethod}>
          <label>Payment Method:</label>
          <select 
            value={selectedPaymentMethod} 
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="transfer">Bank Transfer</option>
            <option value="voucher">Voucher</option>
          </select>
        </div>

        {/* Actions */}
        <div className={styles.receiptActions}>
          <button 
            className={styles.validateButton}
            onClick={handleValidate}
            disabled={cart.length === 0 || !canCreateSale}
            title={!canCreateSale ? 'Insufficient permissions to create sale' : ''}
          >
            {canCreateSale ? 'Validate & Complete Sale' : 'Cannot Create Sale'}
          </button>
          <button 
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={cart.length === 0}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Render status information
  const renderStatusInfo = () => {
    return (
      <div className={styles.statusInfo}>
        <h3>Sales Integration Status</h3>
        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <span>Stocks Status:</span>
            {stocksLoading ? 'Loading...' : stocksError ? 'Error' : 'Ready'}
          </div>
          <div className={styles.statusItem}>
            <span>Sales Status:</span>
            {salesLoading ? 'Loading...' : salesError ? 'Error' : 'Ready'}
          </div>
          <div className={styles.statusItem}>
            <span>Invoices Status:</span>
            {invoicesLoading ? 'Loading...' : invoicesError ? 'Error' : 'Ready'}
          </div>
          <div className={styles.statusItem}>
            <span>Permissions:</span>
            {canCreateSale ? 'Can Create Sale' : 'Cannot Create Sale'}
          </div>
          <div className={styles.statusItem}>
            <span>Business Type:</span>
            {businessType}
          </div>
          <div className={styles.statusItem}>
            <span>Items in Cart:</span>
            {cart.length}
          </div>
          <div className={styles.statusItem}>
            <span>Total:</span>
            {total.toFixed(2)} RON
          </div>
          {currentSale && (
            <div className={styles.statusItem}>
              <span>Last Sale:</span>
              {new Date(currentSale.timestamp).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render sale history
  const renderSaleHistory = () => {
    if (saleHistory.length === 0) return null;

    return (
      <div className={styles.saleHistory}>
        <h3>Recent Sales</h3>
        <div className={styles.historyList}>
          {saleHistory.slice(0, 5).map((sale, index) => (
            <div key={sale.id || index} className={styles.historyItem}>
              <div className={styles.historyInfo}>
                <span className={styles.historyDate}>
                  {new Date(sale.timestamp).toLocaleString()}
                </span>
                <span className={styles.historyTotal}>
                  {sale.total.toFixed(2)} RON
                </span>
                <span className={styles.historyItems}>
                  {sale.items?.length || 0} items
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.salesIntegrationExample}>
      <h2>Sales Integration Example - {businessType}</h2>
      
      {/* Status Information */}
      {renderStatusInfo()}
      
      {/* Customer Form */}
      {renderCustomerForm()}
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          {renderProductsPanel()}
        </div>
        <div className={styles.rightPanel}>
          {renderReceiptPanel()}
        </div>
      </div>

      {/* Sale History */}
      {renderSaleHistory()}

      {/* Integration Benefits */}
      <div className={styles.integrationBenefits}>
        <h3>Sales Store Integration Benefits</h3>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefit}>
            <h4>API Integration:</h4>
            <ul>
              <li>✅ Real-time stock synchronization</li>
              <li>✅ Automatic stock updates after sales</li>
              <li>✅ Invoice generation</li>
              <li>✅ Sales history tracking</li>
            </ul>
          </div>
          <div className={styles.benefit}>
            <h4>Business Logic:</h4>
            <ul>
              <li>✅ Stock validation</li>
              <li>✅ Permission checking</li>
              <li>✅ Business-specific rules</li>
              <li>✅ Data validation</li>
            </ul>
          </div>
          <div className={styles.benefit}>
            <h4>Observer Pattern:</h4>
            <ul>
              <li>✅ Real-time updates</li>
              <li>✅ Event-driven architecture</li>
              <li>✅ Cross-component communication</li>
              <li>✅ State synchronization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesIntegrationExample; 