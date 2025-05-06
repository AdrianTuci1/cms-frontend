import React, { useState, useCallback, memo } from 'react';
import { stocksData } from '../data/stocksData';
import styles from './StocksView.module.css';
import ResizablePanels from '../components/dashboard/gym/ResizablePanels';

// Memoized Inventory Card Component
const InventoryCard = memo(({ item, formatCurrency }) => (
  <div className={styles.inventoryCard}>
    <div className={styles.cardHeader}>
      <div className={styles.cardTitle}>
        <span className={styles.code}>{item.code}</span>
        <h4>{item.name}</h4>
      </div>
      <span className={styles.category}>{item.category}</span>
    </div>
    <div className={styles.cardContent}>
      <div className={styles.cardInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Price:</span>
          <span className={styles.infoValue}>{formatCurrency(item.currentPrice)}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Quantity:</span>
          <span className={styles.infoValue}>{item.quantity}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Total Value:</span>
          <span className={styles.infoValue}>{formatCurrency(item.value)}</span>
        </div>
      </div>
      <div className={styles.cardActions}>
        <button className={styles.actionButton}>Edit</button>
        <button className={styles.actionButton}>Delete</button>
      </div>
    </div>
  </div>
));

// Memoized Low Stock Card Component
const LowStockCard = memo(({ item, formatCurrency }) => (
  <div className={styles.lowStockCard}>
    <div className={styles.cardHeader}>
      <div className={styles.cardTitle}>
        <span className={styles.code}>{item.code}</span>
        <h4>{item.name}</h4>
      </div>
      <span className={styles.category}>{item.category}</span>
    </div>
    <div className={styles.cardContent}>
      <div className={styles.cardInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Price:</span>
          <span className={styles.infoValue}>{formatCurrency(item.currentPrice)}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Quantity:</span>
          <span className={`${styles.infoValue} ${styles.lowQuantity}`}>{item.quantity}</span>
        </div>
      </div>
      <div className={styles.cardActions}>
        <button className={styles.actionButton}>Restock</button>
      </div>
    </div>
  </div>
));

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
      <div className={styles.header}>
        <h2>Inventory Management</h2>
        <div className={styles.headerActions}>
          <button 
            className={styles.printButton}
            onClick={handlePrint}
          >
            Print Stock
          </button>
          <button 
            className={styles.addButton}
            onClick={() => setShowAddForm(true)}
          >
            Add New Stock
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className={styles.addFormOverlay}>
          <div className={styles.addForm}>
            <h3>Add New Stock</h3>
            <form onSubmit={handleAddItem}>
              <div className={styles.formGroup}>
                <label>Code:</label>
                <input
                  type="text"
                  value={newItem.code}
                  onChange={(e) => setNewItem({...newItem, code: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Price:</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.currentPrice}
                  onChange={(e) => setNewItem({...newItem, currentPrice: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Quantity:</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category:</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                >
                  <option value="Drinks">Drinks</option>
                  <option value="Supplements">Supplements</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>Add Stock</button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ResizablePanels
        leftContent={leftContent}
        rightContent={rightContent}
      />
    </div>
  );
};

export default StocksView; 