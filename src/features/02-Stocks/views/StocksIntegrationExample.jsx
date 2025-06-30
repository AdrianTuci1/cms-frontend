/**
 * StocksIntegrationExample - Exemplu de integrare pentru Stocks folosind IntegrationExample
 * Demonstrează cum să folosim IntegrationExample pentru a prelua resursa 'stocks'
 * și să integrăm cu noul store de stocks
 */

import React, { useState } from 'react';
import IntegrationExample from '../../../design-patterns/examples/IntegrationExample';
import useStocksStore from '../store/stocksStore';
import styles from './StocksView.module.css';

const StocksIntegrationExample = ({ businessType = 'gym' }) => {
  const [showIntegration, setShowIntegration] = useState(false);
  
  // Folosește store-ul pentru stocks
  const {
    stocksData,
    stocksLoading,
    stocksError,
    formatCurrency,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    canCreateStock,
    canUpdateStock,
    canDeleteStock
  } = useStocksStore(businessType);

  return (
    <div className={styles.stocksView}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h2>Stocks Integration Example</h2>
          <p>Demonstrating how to use IntegrationExample with stocks resource</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.addButton}
            onClick={() => setShowIntegration(!showIntegration)}
          >
            {showIntegration ? 'Hide Integration' : 'Show Integration Example'}
          </button>
        </div>
      </div>

      {showIntegration && (
        <div className={styles.integrationContainer}>
          <h3>IntegrationExample with 'stocks' resource</h3>
          <p>This demonstrates how to use the IntegrationExample component to fetch and manage stocks data:</p>
          
          <IntegrationExample businessType={businessType} />
        </div>
      )}

      <div className={styles.storeInfo}>
        <h3>Stocks Store Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h4>Store Status</h4>
            <p>Loading: {stocksLoading ? 'Yes' : 'No'}</p>
            <p>Error: {stocksError ? stocksError.message : 'None'}</p>
            <p>Items Count: {stocksData.inventory.length + stocksData.lowStock.length}</p>
          </div>
          
          <div className={styles.infoCard}>
            <h4>Permissions</h4>
            <p>Can Create: {canCreateStock ? 'Yes' : 'No'}</p>
            <p>Can Update: {canUpdateStock ? 'Yes' : 'No'}</p>
            <p>Can Delete: {canDeleteStock ? 'Yes' : 'No'}</p>
          </div>
          
          <div className={styles.infoCard}>
            <h4>Data Summary</h4>
            <p>Inventory Items: {stocksData.inventory.length}</p>
            <p>Low Stock Items: {stocksData.lowStock.length}</p>
            <p>Total Value: {formatCurrency(
              stocksData.inventory.reduce((sum, item) => sum + (item.value || item.currentPrice * item.quantity), 0)
            )}</p>
          </div>
        </div>
      </div>

      <div className={styles.usageInstructions}>
        <h3>How to Use IntegrationExample with Stocks</h3>
        <div className={styles.instructions}>
          <h4>1. Basic Usage</h4>
          <pre className={styles.codeBlock}>
{`// In your component
import IntegrationExample from '../design-patterns/examples/IntegrationExample';

// Use with stocks resource
<IntegrationExample businessType="gym" />`}
          </pre>

          <h4>2. Select Stocks Resource</h4>
          <p>In the IntegrationExample component, select "stocks" from the resource dropdown to see stocks data.</p>

          <h4>3. API Integration</h4>
          <p>The IntegrationExample automatically:</p>
          <ul>
            <li>Fetches stocks data from the API</li>
            <li>Applies business logic validation</li>
            <li>Handles CRUD operations</li>
            <li>Manages offline/online state</li>
            <li>Provides real-time updates</li>
          </ul>

          <h4>4. Store Integration</h4>
          <p>You can also use the stocks store directly:</p>
          <pre className={styles.codeBlock}>
{`import useStocksStore from '../store/stocksStore';

const MyComponent = () => {
  const {
    stocksData,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem
  } = useStocksStore('gym');
  
  // Use the store functions
};`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default StocksIntegrationExample; 