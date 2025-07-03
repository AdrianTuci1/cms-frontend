/**
 * Stocks Store - Store pentru gestionarea stocurilor cu integrare API
 * Folosește useDataSync pentru sincronizarea cu serverul și Strategy Pattern pentru business logic
 * Integrează funcționalități complete pentru gestionarea inventarului
 */

import { useState, useCallback, useEffect } from 'react';
import { useObserver } from '../../../design-patterns/hooks/useObserver';
import { useBusinessLogic } from '../../../design-patterns/hooks/useBusinessLogic';

/**
 * Hook principal pentru Stocks Store
 * @param {string} businessType - Tipul de business (dental, gym, hotel)
 * @param {Array} stockItems - Datele de stocks din useDataSync
 * @returns {Object} State-ul și funcțiile pentru gestionarea stocurilor
 */
const useStocksStore = (businessType = 'gym', stockItems = []) => {
  // State pentru UI și formular
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    code: '',
    name: '',
    currentPrice: '',
    quantity: '',
    category: 'Drinks'
  });
  
  // State pentru filtrare și căutare
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Hook pentru observer pattern
  const { subscribe, emit } = useObserver();
  
  // Hook pentru business logic
  const businessLogic = useBusinessLogic(businessType);

  /**
   * Formatează valoarea monetară
   */
  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }, []);

  /**
   * Procesează datele stocurilor pentru afișare
   */
  const processedStocksData = useCallback(() => {
    if (!stockItems || stockItems.length === 0) return { inventory: [], lowStock: [] };

    // Separă inventarul de stocul scăzut
    const inventory = stockItems.filter(item => item.quantity > 10);
    const lowStock = stockItems.filter(item => item.quantity <= 10);
    
    return { inventory, lowStock };
  }, [stockItems]);

  /**
   * Filtrează și sortează datele
   */
  const filteredAndSortedData = useCallback(() => {
    const { inventory, lowStock } = processedStocksData();
    
    // Filtrează după termenul de căutare
    const filterBySearch = (items) => {
      if (!searchTerm) return items;
      return items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    // Filtrează după categorie
    const filterByCategory = (items) => {
      if (selectedCategory === 'all') return items;
      return items.filter(item => item.category === selectedCategory);
    };

    // Sortează datele
    const sortItems = (items) => {
      return [...items].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    };

    const filteredInventory = sortItems(filterByCategory(filterBySearch(inventory)));
    const filteredLowStock = sortItems(filterByCategory(filterBySearch(lowStock)));

    return { inventory: filteredInventory, lowStock: filteredLowStock };
  }, [processedStocksData, searchTerm, selectedCategory, sortBy, sortOrder]);

  /**
   * Adaugă un nou item în stoc
   */
  const handleAddItem = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      // Validează datele folosind business logic
      const validation = businessLogic.validateData(newItem, 'stocks');
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        return;
      }

      // Verifică permisiunile
      if (!businessLogic.isOperationAllowed('createStock', newItem)) {
        console.error('Operation not allowed');
        return;
      }

      // Procesează datele folosind business logic
      const processedData = businessLogic.processData(newItem, 'stocks');
      
      // Emite eveniment pentru crearea item-ului
      emit('stocks:create', processedData);
      
      console.log('✅ Stock item created successfully');
      
      // Resetează formularul
      setShowAddForm(false);
      setNewItem({
        code: '',
        name: '',
        currentPrice: '',
        quantity: '',
        category: 'Drinks'
      });

    } catch (error) {
      console.error('❌ Failed to create stock item:', error.message);
    }
  }, [newItem, businessLogic, emit]);

  /**
   * Actualizează un item din stoc
   */
  const handleUpdateItem = useCallback(async (id, updates) => {
    try {
      // Validează datele folosind business logic
      const validation = businessLogic.validateData(updates, 'stocks');
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        return;
      }

      // Verifică permisiunile
      if (!businessLogic.isOperationAllowed('updateStock', updates)) {
        console.error('Operation not allowed');
        return;
      }

      // Procesează datele folosind business logic
      const processedData = businessLogic.processData({ id, ...updates }, 'stocks');
      
      // Emite eveniment pentru actualizarea item-ului
      emit('stocks:update', processedData);
      
      console.log('✅ Stock item updated successfully');

    } catch (error) {
      console.error('❌ Failed to update stock item:', error.message);
    }
  }, [businessLogic, emit]);

  /**
   * Șterge un item din stoc
   */
  const handleDeleteItem = useCallback(async (id) => {
    try {
      // Verifică permisiunile
      if (!businessLogic.isOperationAllowed('deleteStock', { id })) {
        console.error('Operation not allowed');
        return;
      }

      // Emite eveniment pentru ștergerea item-ului
      emit('stocks:delete', { id });
      
      console.log('✅ Stock item deleted successfully');

    } catch (error) {
      console.error('❌ Failed to delete stock item:', error.message);
    }
  }, [businessLogic, emit]);

  /**
   * Gestionează printarea raportului
   */
  const handlePrint = useCallback(() => {
    const { inventory, lowStock } = filteredAndSortedData();
    
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <style>
        body { font-family: Arial, sans-serif; }
        .print-header { text-align: center; margin-bottom: 20px; }
        .print-section { margin-bottom: 30px; }
        .print-table { width: 100%; border-collapse: collapse; }
        .print-table th, .print-table td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left; 
        }
        .print-table th { background-color: #f5f5f5; }
        .low-stock { color: #e74c3c; }
        @media print {
          .no-print { display: none; }
        }
      </style>
      <div class="print-header">
        <h1>Inventory Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Business Type: ${businessType}</p>
      </div>
      <div class="print-section">
        <h2>Current Inventory</h2>
        <table class="print-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            ${inventory.map(item => `
              <tr>
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${formatCurrency(item.currentPrice)}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.value || item.currentPrice * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="print-section">
        <h2>Low Stock Items</h2>
        <table class="print-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${lowStock.map(item => `
              <tr>
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${formatCurrency(item.currentPrice)}</td>
                <td class="low-stock">${item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
  }, [filteredAndSortedData, formatCurrency, businessType]);

  /**
   * Setup event listeners
   */
  useEffect(() => {
    const listeners = [];

    // Listen pentru evenimente de la stocks
    listeners.push(
      subscribe('stocks:created', (data) => {
        console.log('Stock created:', data);
        emit('stocks:inventoryUpdated', { type: 'created', data });
      }),
      
      subscribe('stocks:updated', (data) => {
        console.log('Stock updated:', data);
        emit('stocks:inventoryUpdated', { type: 'updated', data });
      }),
      
      subscribe('stocks:deleted', (data) => {
        console.log('Stock deleted:', data);
        emit('stocks:inventoryUpdated', { type: 'deleted', data });
      })
    );

    return () => {
      listeners.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe, emit]);

  return {
    // State
    showAddForm,
    setShowAddForm,
    newItem,
    setNewItem,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    
    // Functions
    formatCurrency,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handlePrint,
    refreshStocks: () => emit('stocks:refresh'),
    
    // Business logic
    businessLogic,
    
    // Permissions
    canCreateStock: businessLogic.isOperationAllowed('createStock', newItem),
    canUpdateStock: businessLogic.isOperationAllowed('updateStock', {}),
    canDeleteStock: businessLogic.isOperationAllowed('deleteStock', {}),
    
    // Validation
    validateStockData: (data, operation) => businessLogic.validateData(data, 'stocks')
  };
};

export default useStocksStore; 