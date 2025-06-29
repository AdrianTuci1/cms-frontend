import React from 'react';
import styles from './StocksView.module.css';
import ResizablePanels from '../../components/dashboard/gym/ResizablePanels';
import StockNavbar from '../../components/dashboard/stocks/StockNavbar';
import InventoryCard from '../../components/dashboard/stocks/InventoryCard';
import LowStockCard from '../../components/dashboard/stocks/LowStockCard';
import AddStockForm from '../../components/dashboard/stocks/AddStockForm';
import useStocksStore from '../store/stocksStore';

const StocksView = ({ businessType = 'gym' }) => {
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
    
    // Data
    stocksData,
    stocksLoading,
    stocksError,
    lastUpdated,
    isOnline,
    
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
  } = useStocksStore(businessType);

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

  const leftContent = (
    <div className={styles.inventorySection}>
      <div className={styles.sectionHeader}>
        <h3>Current Inventory</h3>
        <span className={styles.itemCount}>{stocksData.inventory.length} items</span>
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
        {stocksData.inventory.map((item) => (
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
        <span className={styles.itemCount}>{stocksData.lowStock.length} items</span>
      </div>
      <div className={styles.lowStockList}>
        {stocksData.lowStock.map((item) => (
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