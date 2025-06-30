# Data Sync Manager - Modular Architecture

## Overview

The DataSyncManager has been refactored into a modular architecture for better maintainability, testability, and separation of concerns. Each module handles a specific aspect of data synchronization.

## Architecture

```
DataSyncManager/
├── index.js                 # Main entry point and singleton creation
├── DataSyncManager.js       # Main orchestrator class
├── ResourceRegistry.js      # Manages resource configurations
├── DatabaseManager.js       # Handles IndexedDB operations
├── ApiSyncManager.js        # Manages API synchronization
├── WebSocketManager.js      # Handles WebSocket connections
├── DataProcessor.js         # Processes and transforms data
└── README.md               # This documentation
```

## Modules

### 1. DataSyncManager.js (Main Orchestrator)
**Responsibility**: Coordinates all other modules and provides the main interface

**Key Features**:
- Initializes all components
- Manages sync queue processing
- Handles data change events
- Provides status information
- Orchestrates data flow between modules

**Main Methods**:
- `initialize()` - Sets up the entire system
- `handleDataChange(resource, data)` - Processes data changes
- `syncData(resource, data)` - Syncs data via API/WebSocket
- `getDataWithFallback(resource, options)` - Gets data with API fallback
- `getSyncStatus()` - Returns system status

### 2. ResourceRegistry.js
**Responsibility**: Manages resource configurations and business type

**Key Features**:
- Registers and manages resource configurations
- Handles business-specific resource setup
- Provides resource lookup and validation
- Manages business type and info

**Main Methods**:
- `initializeGeneralResources()` - Sets up general resources
- `setBusinessType(businessType)` - Configures business-specific resources
- `registerResource(name, config)` - Registers a new resource
- `getResource(name)` - Gets resource configuration

### 3. DatabaseManager.js
**Responsibility**: Handles all IndexedDB operations

**Key Features**:
- Database initialization and schema management
- Data storage and retrieval
- Sync queue management
- Data cleanup operations

**Main Methods**:
- `initializeDatabase()` - Creates database schema
- `storeData(resource, data)` - Stores data in IndexedDB
- `getData(resource, options)` - Retrieves data from IndexedDB
- `addToSyncQueue(resource, data)` - Adds data to sync queue
- `clearOldData(resource, maxAge)` - Cleans up old data

### 4. ApiSyncManager.js
**Responsibility**: Manages API synchronization

**Key Features**:
- Handles API requests using the new simplified structure
- Manages authentication requirements
- Processes API responses
- Handles business-specific endpoints

**Main Methods**:
- `syncViaAPI(resource, data, config, businessType)` - Syncs data via API
- `fetchFromAPI(resource, options, config, businessType)` - Fetches data from API
- `isInitialized()` - Checks if API manager is ready

### 5. WebSocketManager.js
**Responsibility**: Manages WebSocket connections and messages

**Key Features**:
- WebSocket connection management
- Message handling and processing
- Connection status monitoring
- Real-time data synchronization

**Main Methods**:
- `setupWebSocket(url)` - Establishes WebSocket connection
- `syncViaSocket(resource, data, config)` - Syncs data via WebSocket
- `handleSocketMessage(message)` - Processes incoming messages
- `isConnected()` - Checks connection status

### 6. DataProcessor.js
**Responsibility**: Processes and transforms data

**Key Features**:
- Data transformation based on resource type
- Metadata addition
- Data staleness checking
- Business type integration

**Main Methods**:
- `processResponse(resource, response)` - Processes API responses
- `isDataStale(data, config)` - Checks if data is outdated
- `addMetadata(data, resource)` - Adds sync metadata
- `setBusinessType(businessType)` - Sets business context

## Usage

### Basic Setup
```javascript
import dataSyncManager from './design-patterns/data-sync/index.js';

// The singleton is automatically created with all components
```

### Setting Business Type
```javascript
// This registers business-specific resources
dataSyncManager.setBusinessType('dental');
```

### Handling Data Changes
```javascript
// Data changes are automatically handled via event bus
eventBus.emit('timeline:updated', timelineData);
```

### Getting Data
```javascript
// Get data with automatic API fallback
const data = await dataSyncManager.getDataWithFallback('timeline', {
  params: { date: '2024-01-01' }
});
```

### Manual Data Sync
```javascript
// Manually sync data
await dataSyncManager.handleDataChange('clients', clientData);
```

### WebSocket Setup
```javascript
// Setup WebSocket for real-time updates
dataSyncManager.setupWebSocket('ws://localhost:3001/ws');
```

## Benefits of Modular Architecture

### 1. **Separation of Concerns**
Each module has a single, well-defined responsibility, making the code easier to understand and maintain.

### 2. **Testability**
Individual modules can be tested in isolation, making unit testing much simpler.

### 3. **Maintainability**
Changes to one aspect (e.g., API handling) don't affect other parts of the system.

### 4. **Reusability**
Modules can be reused in different contexts or projects.

### 5. **Scalability**
New features can be added by creating new modules or extending existing ones.

### 6. **Debugging**
Issues can be isolated to specific modules, making debugging more efficient.

## Event System

The system uses an event bus for communication between modules:

### Key Events
- `datasync:initialized` - System initialization complete
- `datasync:online/offline` - Network status changes
- `datasync:stored` - Data stored in IndexedDB
- `datasync:synced` - Data successfully synced
- `datasync:error` - Error occurred
- `datasync:queue-processing` - Sync queue processing started
- `datasync:socket-connected/disconnected` - WebSocket status

### Feature Events
- `timeline:updated` - Timeline data changed
- `aiAssistant:updated` - AI Assistant data changed
- `history:updated` - History data changed

## Configuration

### Resource Configuration
```javascript
{
  enableOffline: true,
  syncInterval: 30000,
  maxOfflineAge: 24 * 60 * 60 * 1000,
  priority: 'normal',
  socketEvents: ['update'],
  apiEndpoints: {
    get: '/resource',
    post: '/resource',
    put: '/resource/:id',
    delete: '/resource/:id'
  },
  requiresAuth: true
}
```

### Business-Specific Resources
When setting a business type, the system automatically registers:
- `timeline` - Business-specific timeline data
- `clients` - Business-specific client data
- `packages` - Business-specific package data
- `members` - Business-specific member data

## Migration from Monolithic Version

The modular version maintains the same public API as the original monolithic version, so existing code should work without changes. The main differences are:

1. **Better organization** - Code is split into logical modules
2. **Improved error handling** - Each module handles its own errors
3. **Enhanced debugging** - Issues can be isolated to specific modules
4. **Easier testing** - Each module can be tested independently
5. **Better documentation** - Each module has clear responsibilities

## Future Enhancements

The modular architecture makes it easy to add new features:

1. **New Sync Protocols** - Add new modules for different sync methods
2. **Enhanced Caching** - Create a dedicated cache manager
3. **Conflict Resolution** - Add a conflict resolution module
4. **Analytics** - Add analytics and monitoring capabilities
5. **Plugin System** - Allow custom modules to be added dynamically 