import React, { useState, useCallback } from 'react';
import { stocksData } from '../data/stocksData';
import styles from './StocksView.module.css';
import ResizablePanels from '../components/dashboard/gym/ResizablePanels';
import StockNavbar from '../components/dashboard/stocks/StockNavbar';
import InventoryCard from '../components/dashboard/stocks/InventoryCard';
import LowStockCard from '../components/dashboard/stocks/LowStockCard';
import AddStockForm from '../components/dashboard/stocks/AddStockForm';

const StocksView = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    code: '',
    name: '',
    currentPrice: '',
    quantity: '',
    category: 'Drinks'
  });

  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }, []);

  const handleAddItem = useCallback((e) => {
    e.preventDefault();
    console.log('Adding new item:', newItem);
    setShowAddForm(false);
    setNewItem({
      code: '',
      name: '',
      currentPrice: '',
      quantity: '',
      category: 'Drinks'
    });
  }, [newItem]);

  const handlePrint = useCallback(() => {
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
            ${stocksData.inventory.map(item => `
              <tr>
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${formatCurrency(item.currentPrice)}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.value)}</td>
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
            ${stocksData.lowStock.map(item => `
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
  }, [formatCurrency]);

  const leftContent = (
    <div className={styles.inventorySection}>
      <div className={styles.sectionHeader}>
        <h3>Current Inventory</h3>
        <span className={styles.itemCount}>{stocksData.inventory.length} items</span>
      </div>
      <div className={styles.inventoryList}>
        {stocksData.inventory.map((item) => (
          <InventoryCard 
            key={item.id} 
            item={item} 
            formatCurrency={formatCurrency}
          />
        ))}
      </div>
    </div>
  );

  const rightContent = (
    <div className={styles.lowStockSection}>
      <div className={styles.sectionHeader}>
        <h3>Low Stock Alert</h3>
        <span className={styles.itemCount}>{stocksData.lowStock.length} items</span>
      </div>
      <div className={styles.lowStockList}>
        {stocksData.lowStock.map((item) => (
          <LowStockCard 
            key={item.id} 
            item={item} 
            formatCurrency={formatCurrency}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.stocksView}>
      <StockNavbar 
        onPrint={handlePrint}
        onAddStock={() => setShowAddForm(true)}
      />

      {showAddForm && (
        <AddStockForm
          newItem={newItem}
          setNewItem={setNewItem}
          onSubmit={handleAddItem}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <ResizablePanels
        leftContent={leftContent}
        rightContent={rightContent}
      />
    </div>
  );
};

export default StocksView; 