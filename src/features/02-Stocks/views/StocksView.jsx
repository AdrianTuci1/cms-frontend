import React from 'react';
import styles from './StocksView.module.css';
import ResizablePanels from '../../01-Home/components/gym/timeline/ResizablePanels.jsx';
import StockNavbar from '../components/StockNavbar.jsx';
import InventoryCard from '../components/InventoryCard.jsx';
import LowStockCard from '../components/LowStockCard.jsx';
import useStocksStore from '../store/stocksStore';
import { useDataSync } from '../../../design-patterns/hooks';
import useDrawerStore, { DRAWER_TYPES } from '../../00-Drawers/store/drawerStore';

const StocksView = ({ businessType = 'gym' }) => {
  const { openDrawer } = useDrawerStore();
  
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

  const handleAddStock = () => {
    console.log('Add stock button clicked from StocksView!');
    
    // Create new stock item with default values
    const newStockItem = {
      name: '',
      quantity: 0,
      minQuantity: 5,
      price: 0,
      category: 'supplies',
      supplier: '',
      description: ''
    };

    openDrawer('create', DRAWER_TYPES.STOCK, newStockItem, {
      title: 'New Stock Item',
      size: 'medium',
      onSave: async (data, mode) => {
        console.log('Creating stock item:', data);
        
        try {
          // Use optimistic update from useDataSync
          await stocksSync.create(data);
          console.log('Stock item created successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to create stock item:', error);
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onCancel: () => {
        console.log('Stock item creation cancelled');
      }
    });
  };

  const handleEditStock = (item) => {
    console.log('Edit stock item clicked:', item);
    
    openDrawer('edit', DRAWER_TYPES.STOCK, item, {
      title: `Edit Stock Item - ${item.name}`,
      size: 'medium',
      onSave: async (data, mode) => {
        console.log('Updating stock item:', data);
        
        try {
          // Use optimistic update from useDataSync
          await stocksSync.update(data);
          console.log('Stock item updated successfully!');
        } catch (error) {
          console.error('Failed to update stock item:', error);
        }
      },
      onDelete: async (data) => {
        console.log('Deleting stock item:', data);
        
        try {
          // Use optimistic update from useDataSync
          await stocksSync.delete(data.id);
          console.log('Stock item deleted successfully!');
        } catch (error) {
          console.error('Failed to delete stock item:', error);
        }
      },
      onCancel: () => {
        console.log('Stock item editing cancelled');
      }
    });
  };

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
      <div className={styles.inventoryList}>
        {processedStocksData.inventory.map((item) => (
          <InventoryCard 
            key={item.id} 
            item={item} 
            formatCurrency={formatCurrency}
            onUpdate={handleEditStock}
            onDelete={handleDeleteItem}
            canUpdate={canUpdateStock}
            canDelete={canDeleteStock}
          />
        ))}
        {processedStocksData.inventory.length === 0 && (
          <div className={styles.emptyState}>
            <p>No inventory items found.</p>
          </div>
        )}
      </div>
    </div>
  );

  const rightContent = (
    <div className={styles.lowStockSection}>
      <div className={styles.lowStockList}>
        {processedStocksData.lowStock.map((item) => (
          <LowStockCard 
            key={item.id} 
            item={item} 
            formatCurrency={formatCurrency}
            onUpdate={handleEditStock}
            onDelete={handleDeleteItem}
            canUpdate={canUpdateStock}
            canDelete={canDeleteStock}
          />
        ))}
        {processedStocksData.lowStock.length === 0 && (
          <div className={styles.emptyState}>
            <p>No low stock items found.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.stocksView}>
      <StockNavbar 
        onPrint={handlePrint}
        onAddStock={handleAddStock}
        canCreateStock={canCreateStock}
        businessType={businessType}
      />

      <ResizablePanels
        leftContent={leftContent}
        rightContent={rightContent}
      />
    </div>
  );
};

export default StocksView; 