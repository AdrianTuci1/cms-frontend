# Stocks Feature - Enhanced with Store and API Integration

## Overview

The Stocks feature has been completely refactored to use a centralized store with API integration, following the design patterns established in the project. This provides a robust, scalable solution for inventory management.

## Architecture

### Store-Based Architecture

The stocks feature now uses a centralized store (`useStocksStore`) that encapsulates all business logic and API interactions:

```
src2/features/02-Stocks/
├── store/
│   └── stocksStore.js          # Main store with business logic
├── views/
│   ├── StocksView.jsx          # Main view using the store
│   └── StocksIntegrationExample.jsx  # Integration example
├── components/
│   ├── InventoryCard.jsx       # Enhanced with CRUD operations
│   ├── LowStockCard.jsx        # Enhanced with CRUD operations
│   ├── AddStockForm.jsx        # Enhanced with permissions
│   └── StockNavbar.jsx         # Enhanced with permissions
└── README.md                   # This file
```

### Key Features

1. **Centralized State Management**: All stocks data and operations are managed through `useStocksStore`
2. **API Integration**: Uses `useDataSync` for server-first data fetching with offline support
3. **Business Logic**: Integrates with Strategy Pattern for business-specific validation and processing
4. **Real-time Updates**: Observer pattern for cross-component communication
5. **Permission System**: Built-in permission checking for CRUD operations
6. **Search & Filtering**: Advanced filtering, sorting, and search capabilities

## Usage

### Basic Usage

```jsx
import StocksView from './features/02-Stocks/views/StocksView';

// Use with default gym business type
<StocksView />

// Or specify business type
<StocksView businessType="dental" />
```

### Using the Store Directly

```jsx
import useStocksStore from './features/02-Stocks/store/stocksStore';

const MyComponent = () => {
  const {
    stocksData,
    stocksLoading,
    stocksError,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    formatCurrency,
    canCreateStock,
    canUpdateStock,
    canDeleteStock
  } = useStocksStore('gym');

  // Use the store functions
  const addNewItem = async () => {
    await handleAddItem({
      code: 'NEW-001',
      name: 'New Product',
      currentPrice: 29.99,
      quantity: 100,
      category: 'Supplements'
    });
  };

  return (
    <div>
      {stocksLoading ? 'Loading...' : (
        <div>
          <p>Inventory Items: {stocksData.inventory.length}</p>
          <p>Low Stock Items: {stocksData.lowStock.length}</p>
          <button onClick={addNewItem} disabled={!canCreateStock}>
            Add Item
          </button>
        </div>
      )}
    </div>
  );
};
```

### Integration with IntegrationExample

The stocks resource can be used with the `IntegrationExample` component:

```jsx
import IntegrationExample from './design-patterns/examples/IntegrationExample';

// Select "stocks" from the resource dropdown to see stocks data
<IntegrationExample businessType="gym" />
```

## Store API

### State

| Property | Type | Description |
|----------|------|-------------|
| `stocksData` | Object | Processed stocks data with `inventory` and `lowStock` arrays |
| `stocksLoading` | Boolean | Loading state |
| `stocksError` | Error | Error state |
| `lastUpdated` | String | Last update timestamp |
| `isOnline` | Boolean | Online/offline status |
| `showAddForm` | Boolean | Form visibility state |
| `newItem` | Object | New item form data |
| `searchTerm` | String | Search term |
| `selectedCategory` | String | Selected category filter |
| `sortBy` | String | Sort field |
| `sortOrder` | String | Sort order ('asc' or 'desc') |

### Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `handleAddItem` | `(e)` | Add new stock item |
| `handleUpdateItem` | `(id, updates)` | Update existing stock item |
| `handleDeleteItem` | `(id)` | Delete stock item |
| `handlePrint` | `()` | Print inventory report |
| `refreshStocks` | `()` | Refresh data from server |
| `formatCurrency` | `(value)` | Format currency value |
| `setShowAddForm` | `(boolean)` | Show/hide add form |
| `setNewItem` | `(object)` | Update new item form data |
| `setSearchTerm` | `(string)` | Update search term |
| `setSelectedCategory` | `(string)` | Update category filter |
| `setSortBy` | `(string)` | Update sort field |
| `setSortOrder` | `(string)` | Update sort order |

### Permissions

| Property | Type | Description |
|----------|------|-------------|
| `canCreateStock` | Boolean | Can create new stock items |
| `canUpdateStock` | Boolean | Can update existing stock items |
| `canDeleteStock` | Boolean | Can delete stock items |

## Business Logic Integration

The store integrates with the Strategy Pattern for business-specific logic:

- **Validation**: Business-specific validation rules
- **Processing**: Business-specific data processing
- **Permissions**: Business-specific permission checking
- **Formatting**: Business-specific data formatting

## API Integration

The store uses `useDataSync` for API integration with the following features:

- **Server-First**: Always fetches from server, stores in IndexedDB
- **Offline Support**: Works offline with cached data
- **Real-time Updates**: Automatic updates when data changes
- **Error Handling**: Comprehensive error handling and retry logic
- **Optimistic Updates**: Immediate UI updates with rollback on error

## Components

### StocksView

Main view component that uses the store and provides:
- Loading and error states
- Search and filtering controls
- Inventory and low stock sections
- Print functionality
- Permission-based UI

### InventoryCard

Enhanced card component with:
- Inline editing capabilities
- Update and delete operations
- Permission-based actions
- Real-time value calculation

### LowStockCard

Enhanced card component with:
- Inline editing capabilities
- Restock functionality
- Update and delete operations
- Permission-based actions

### AddStockForm

Enhanced form component with:
- Permission-based form fields
- Validation integration
- Business logic integration

### StockNavbar

Enhanced navbar component with:
- Business type display
- Permission-based actions
- Print functionality

## Migration from Old Structure

The old structure used static data and local state. The new structure provides:

1. **API Integration**: Real data from server
2. **Centralized Logic**: All logic in the store
3. **Better UX**: Loading states, error handling, permissions
4. **Scalability**: Easy to extend and maintain
5. **Consistency**: Follows project design patterns

## Examples

### StocksIntegrationExample

A comprehensive example showing how to use the IntegrationExample component with stocks:

```jsx
import StocksIntegrationExample from './features/02-Stocks/views/StocksIntegrationExample';

<StocksIntegrationExample businessType="gym" />
```

This example demonstrates:
- How to use IntegrationExample with stocks resource
- Store information display
- Usage instructions
- Code examples

## Benefits

1. **Separation of Concerns**: UI components focus on presentation, store handles logic
2. **Reusability**: Store can be used across multiple components
3. **Testability**: Business logic is isolated and easily testable
4. **Maintainability**: Centralized logic is easier to maintain
5. **Scalability**: Easy to add new features and business types
6. **Consistency**: Follows established project patterns
7. **Performance**: Optimized data fetching and caching
8. **User Experience**: Better loading states, error handling, and permissions 