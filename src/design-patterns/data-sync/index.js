/**
 * Data Sync Manager - Modular Architecture
 * Main entry point for the data synchronization system
 * Updated to include ConnectivityManager
 */

import DataSyncManager from './DataSyncManager.js';
import { createResourceRegistry } from './ResourceRegistry.js';
import { createDatabaseManager } from './DatabaseManager.js';
import { createApiSyncManager } from './ApiSyncManager.js';
import { createWebSocketManager } from './WebSocketManager.js';
import { createDataProcessor } from './DataProcessor.js';
import { createConnectivityManager } from './ConnectivityManager.js';

// Create connectivity manager first
const connectivityManager = createConnectivityManager();

// Create singleton instance with modular components
const dataSyncManager = new DataSyncManager({
  resourceRegistry: createResourceRegistry(),
  databaseManager: createDatabaseManager(),
  apiSyncManager: createApiSyncManager(connectivityManager),
  webSocketManager: createWebSocketManager(),
  dataProcessor: createDataProcessor(),
  connectivityManager: connectivityManager
});

export default dataSyncManager;
export { DataSyncManager }; 