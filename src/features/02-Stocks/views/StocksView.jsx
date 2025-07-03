import React from 'react';
import styles from './StocksView.module.css';
import ResizablePanels from '../../01-Home/components/gym/timeline/ResizablePanels.jsx';
import StockNavbar from '../components/StockNavbar.jsx';
import InventoryCard from '../components/InventoryCard.jsx';
import LowStockCard from '../components/LowStockCard.jsx';
import AddStockForm from '../components/AddStockForm.jsx';
import useStocksStore from '../store/stocksStore';
import { useDataSync } from '../../../design-patterns/hooks';

const StocksView = ({ businessType = 'gym' }) => {
  // Use useDataSync hook directly for stocks data - same as SalesView
  const stocksSync = useDataSync('stocks', {
    businessType,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const { data: stocksData, loading: stocksLoading, error: stocksError, isOnline, lastUpdated } = stocksSync;

  // Extract the actual stock items from the stocks data - same as SalesView
  const stockItems = stocksData?.items || stocksData || [];

  // Folosește store-ul pentru toată logica de business
  const {
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
    refreshStocks,
    
    // Business logic
    businessLogic,
    
    // Permissions
    canCreateStock,
    canUpdateStock,
    canDeleteStock
  } = useStocksStore(businessType, stockItems); // Pass stockItems to store

  // Render loading state
  if (stocksLoading) {
    return (
      <div className={styles.stocksView}>
        <div className={styles.loadingContainer}>
          <h3>Loading inventory...</h3>
          <p>Fetching data from server...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (stocksError) {
    return (
      <div className={styles.stocksView}>
        <div className={styles.errorContainer}>
          <h3>Error loading inventory</h3>
          <p>{stocksError.message}</p>
          <button onClick={refreshStocks} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Process stocks data to match expected structure
  const processedStocksData = {
    inventory: stockItems.filter(item => item.quantity > 0),
    lowStock: stockItems.filter(item => item.quantity <= (item.minQuantity || 5))
  };

  const leftContent = (
    <div className={styles.inventorySection}>
      <div className={styles.sectionHeader}>
        <h3>Current Inventory</h3>
        <span className={styles.itemCount}>{processedStocksData.inventory.length} items</span>
        <div className={styles.statusInfo}>
          <span className={isOnline ? styles.online : styles.offline}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>
          {lastUpdated && (
            <span className={styles.lastUpdated}>
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      <div className={styles.inventoryList}>
        {processedStocksData.inventory.map((item) => (
          <InventoryCard 
            key={item.id} 
            item={item} 
            formatCurrency={formatCurrency}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
            canUpdate={canUpdateStock}
            canDelete={canDeleteStock}
          />
        ))}
      </div>
    </div>
  );

  const rightContent = (
    <div className={styles.lowStockSection}>
      <div className={styles.sectionHeader}>
        <h3>Low Stock Alert</h3>
        <span className={styles.itemCount}>{processedStocksData.lowStock.length} items</span>
      </div>
      <div className={styles.lowStockList}>
        {processedStocksData.lowStock.map((item) => (
          <LowStockCard 
            key={item.id} 
            item={item} 
            formatCurrency={formatCurrency}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
            canUpdate={canUpdateStock}
            canDelete={canDeleteStock}
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
        canCreateStock={canCreateStock}
        businessType={businessType}
      />

      {showAddForm && (
        <AddStockForm
          newItem={newItem}
          setNewItem={setNewItem}
          onSubmit={handleAddItem}
          onCancel={() => setShowAddForm(false)}
          canCreateStock={canCreateStock}
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