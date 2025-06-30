/**
 * Sales Store - Store pentru gestionarea vânzărilor cu integrare API
 * Folosește useDataSync pentru sincronizarea cu serverul și Strategy Pattern pentru business logic
 * Integrează stocks pentru gestionarea produselor disponibile
 */

import { useState, useCallback, useEffect } from 'react';
import { useDataSync } from '../../../design-patterns/hooks/useDataSync';
import { useObserver } from '../../../design-patterns/hooks/useObserver';
import { useBusinessLogic } from '../../../design-patterns/hooks/useBusinessLogic';

/**
 * Hook principal pentru Sales Store
 * @param {string} businessType - Tipul de business (dental, gym, hotel)
 * @returns {Object} State-ul și funcțiile pentru gestionarea vânzărilor
 */
const useSalesStore = (businessType = 'dental') => {
  // State pentru cart și vânzări
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentSale, setCurrentSale] = useState(null);
  const [saleHistory, setSaleHistory] = useState([]);
  
  // Hook pentru observer pattern
  const { subscribe, emit } = useObserver();
  
  // Hook pentru business logic
  const businessLogic = useBusinessLogic(businessType);
  
  // Hook-uri pentru sincronizarea datelor cu API
  const stocksSync = useDataSync('stocks', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });
  
  const salesSync = useDataSync('sales', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });
  
  const invoicesSync = useDataSync('invoices', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  // Extrag datele și funcțiile din sync hooks
  const {
    data: stocksData,
    loading: stocksLoading,
    error: stocksError,
    refresh: refreshStocks,
    create: createStock,
    update: updateStock,
    remove: removeStock,
    validateData: validateStockData,
    isOperationAllowed: isStockOperationAllowed
  } = stocksSync;

  const {
    data: salesData,
    loading: salesLoading,
    error: salesError,
    refresh: refreshSales,
    create: createSale,
    update: updateSale,
    remove: removeSale,
    validateData: validateSaleData,
    isOperationAllowed: isSaleOperationAllowed
  } = salesSync;

  const {
    data: invoicesData,
    loading: invoicesLoading,
    error: invoicesError,
    refresh: refreshInvoices,
    create: createInvoice,
    update: updateInvoice,
    remove: removeInvoice,
    validateData: validateInvoiceData,
    isOperationAllowed: isInvoiceOperationAllowed
  } = invoicesSync;

  /**
   * Calculează totalul cartului
   */
  const calculateTotal = useCallback(() => {
    const newTotal = cart.reduce((sum, item) => {
      const price = item.currentPrice || item.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    setTotal(newTotal);
    return newTotal;
  }, [cart]);

  /**
   * Adaugă un produs în cart
   */
  const addToCart = useCallback((product) => {
    // Verifică dacă produsul este disponibil în stocks
    const stockItem = stocksData?.find(stock => stock.productId === product.id);
    
    if (!stockItem || stockItem.quantity <= 0) {
      throw new Error(`Product ${product.name} is out of stock`);
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Verifică dacă nu depășește stocul disponibil
      if (existingItem.quantity + 1 > stockItem.quantity) {
        throw new Error(`Cannot add more ${product.name}. Only ${stockItem.quantity} available`);
      }
      
      setCart(prevCart => prevCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
    }
    
    // Emite eveniment pentru observer
    emit('cart:itemAdded', { product, quantity: 1 });
  }, [cart, stocksData, emit]);

  /**
   * Elimină un produs din cart
   */
  const removeFromCart = useCallback((productId) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
      emit('cart:itemRemoved', { product: item });
    }
  }, [cart, emit]);

  /**
   * Actualizează cantitatea unui produs din cart
   */
  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    // Verifică stocul disponibil
    const item = cart.find(item => item.id === productId);
    const stockItem = stocksData?.find(stock => stock.productId === productId);
    
    if (stockItem && newQuantity > stockItem.quantity) {
      throw new Error(`Cannot add ${newQuantity} items. Only ${stockItem.quantity} available`);
    }

    setCart(prevCart => prevCart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
    
    emit('cart:quantityUpdated', { productId, newQuantity });
  }, [cart, stocksData, removeFromCart, emit]);

  /**
   * Validează cartul înainte de finalizarea vânzării
   */
  const validateCart = useCallback(() => {
    const errors = [];
    
    if (cart.length === 0) {
      errors.push('Cart is empty');
      return { isValid: false, errors };
    }

    // Verifică stocul pentru fiecare produs
    for (const item of cart) {
      const stockItem = stocksData?.find(stock => stock.productId === item.id);
      
      if (!stockItem) {
        errors.push(`Product ${item.name} is not available in stock`);
      } else if (stockItem.quantity < item.quantity) {
        errors.push(`Insufficient stock for ${item.name}. Available: ${stockItem.quantity}, Requested: ${item.quantity}`);
      }
    }

    // Validare folosind business logic
    const businessValidation = validateSaleData({
      items: cart,
      total,
      businessType
    }, 'create');

    if (!businessValidation.isValid) {
      errors.push(...businessValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [cart, total, stocksData, validateSaleData, businessType]);

  /**
   * Finalizează vânzarea
   */
  const finalizeSale = useCallback(async (paymentMethod = 'cash', customerInfo = {}) => {
    try {
      // Validează cartul
      const validation = validateCart();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Verifică permisiunile
      if (!isSaleOperationAllowed('createSale', { items: cart, total })) {
        throw new Error('Insufficient permissions to create sale');
      }

      // Creează obiectul vânzării
      const saleData = {
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.currentPrice || item.price,
          totalPrice: (item.currentPrice || item.price) * item.quantity
        })),
        total,
        paymentMethod,
        customerInfo,
        businessType,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      // Creează vânzarea în API
      const createdSale = await createSale(saleData);
      
      // Actualizează stocul pentru fiecare produs
      for (const item of cart) {
        const stockItem = stocksData?.find(stock => stock.productId === item.id);
        if (stockItem) {
          const newQuantity = stockItem.quantity - item.quantity;
          await updateStock({
            id: stockItem.id,
            quantity: newQuantity
          });
        }
      }

      // Creează factura dacă este necesar
      if (customerInfo.createInvoice) {
        const invoiceData = {
          saleId: createdSale.id,
          customerInfo,
          items: saleData.items,
          total,
          paymentMethod,
          businessType,
          status: 'pending'
        };
        
        await createInvoice(invoiceData);
      }

      // Actualizează state-ul local
      setSaleHistory(prev => [createdSale, ...prev]);
      setCurrentSale(createdSale);
      setCart([]);
      setTotal(0);

      // Emite evenimente
      emit('sale:completed', createdSale);
      emit('cart:cleared', { saleId: createdSale.id });

      // Refresh datele
      await Promise.all([
        refreshStocks(),
        refreshSales(),
        refreshInvoices()
      ]);

      return createdSale;

    } catch (error) {
      console.error('Error finalizing sale:', error);
      emit('sale:error', { error: error.message });
      throw error;
    }
  }, [
    cart, total, stocksData, validateCart, isSaleOperationAllowed, 
    createSale, updateStock, createInvoice, refreshStocks, refreshSales, 
    refreshInvoices, emit, businessType
  ]);

  /**
   * Anulează vânzarea curentă
   */
  const cancelSale = useCallback(() => {
    setCart([]);
    setTotal(0);
    setCurrentSale(null);
    emit('sale:cancelled', { timestamp: new Date().toISOString() });
  }, [emit]);

  /**
   * Caută produse în stocks
   */
  const searchProducts = useCallback((searchTerm) => {
    if (!stocksData) return [];
    
    return stocksData.filter(stock => 
      stock.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.productId?.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(stock => stock.quantity > 0);
  }, [stocksData]);

  /**
   * Obține produsele disponibile pentru vânzare
   */
  const getAvailableProducts = useCallback(() => {
    if (!stocksData) return [];
    
    return stocksData
      .filter(stock => stock.quantity > 0)
      .map(stock => ({
        id: stock.productId,
        name: stock.productName,
        price: stock.price,
        currentPrice: stock.currentPrice || stock.price,
        quantity: stock.quantity,
        category: stock.category,
        description: stock.description
      }));
  }, [stocksData]);

  /**
   * Setup event listeners
   */
  useEffect(() => {
    const listeners = [];

    // Listen pentru evenimente de la stocks
    listeners.push(
      subscribe('stocks:updated', (data) => {
        console.log('Stocks updated:', data);
        // Recalculăm totalul dacă s-au schimbat prețurile
        calculateTotal();
      }),
      
      subscribe('sales:created', (data) => {
        console.log('Sale created:', data);
        setSaleHistory(prev => [data, ...prev]);
      }),
      
      subscribe('invoices:created', (data) => {
        console.log('Invoice created:', data);
      })
    );

    return () => {
      listeners.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe, calculateTotal]);

  /**
   * Calculează totalul când se schimbă cartul
   */
  useEffect(() => {
    calculateTotal();
  }, [cart, calculateTotal]);

  return {
    // State
    cart,
    total,
    currentSale,
    saleHistory,
    
    // Stocks data
    stocksData: getAvailableProducts(),
    stocksLoading,
    stocksError,
    
    // Sales data
    salesData,
    salesLoading,
    salesError,
    
    // Invoices data
    invoicesData,
    invoicesLoading,
    invoicesError,
    
    // Cart operations
    addToCart,
    removeFromCart,
    updateQuantity,
    
    // Sale operations
    validateCart,
    finalizeSale,
    cancelSale,
    
    // Product operations
    searchProducts,
    getAvailableProducts,
    
    // Refresh operations
    refreshStocks,
    refreshSales,
    refreshInvoices,
    
    // Business logic
    businessLogic,
    
    // Permissions
    canCreateSale: isSaleOperationAllowed('createSale', { items: cart, total }),
    canUpdateStock: isStockOperationAllowed('updateStock', {}),
    canCreateInvoice: isInvoiceOperationAllowed('createInvoice', {})
  };
};

export default useSalesStore; 