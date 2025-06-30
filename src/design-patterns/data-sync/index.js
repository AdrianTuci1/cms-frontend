/**
 * Data Sync Manager - Modular Architecture
 * Main entry point for the data synchronization system
 */

import DataSyncManager from './DataSyncManager.js';
import { createResourceRegistry } from './ResourceRegistry.js';
import { createDatabaseManager } from './DatabaseManager.js';
import { createApiSyncManager } from './ApiSyncManager.js';
import { createWebSocketManager } from './WebSocketManager.js';
import { createDataProcessor } from './DataProcessor.js';

// Create singleton instance with modular components
const dataSyncManager = new DataSyncManager({
  resourceRegistry: createResourceRegistry(),
  databaseManager: createDatabaseManager(),
  apiSyncManager: createApiSyncManager(),
  webSocketManager: createWebSocketManager(),
  dataProcessor: createDataProcessor()
});

export default dataSyncManager;
export { DataSyncManager }; 