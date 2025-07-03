# Sales Test Data & Utilities

This directory contains comprehensive test data and utilities for testing the data flow from **API → Design Patterns → Features** for the sales functionality across different business types.

## 📁 Files Overview

- **`sales-test-data.json`** - Complete test data for sales functionality with stocks, products, and business logic
- **`sales-test-utils.js`** - Test utilities and mock services for sales testing
- **`sales-flow.test.js`** - Automated tests for the sales utilities
- **`index.js`** - Centralized exports for all sales testing functionality
- **`README.md`** - This documentation file

> **Note**: Component-specific tests are now located in `src/features/01-Home/views/02-Sales/SalesView.test.jsx`

## 🛒 Test Data Structure

The test data simulates a real API response for sales functionality with the following characteristics:

### Data Overview
- **10 products** across multiple categories (dental_supplies, supplements, equipment, drinks)
- **Multiple business types** support (dental, gym, hotel)
- **Realistic product data** with prices, stock quantities, and descriptions
- **Various stock statuses** including in-stock, low-stock, and out-of-stock
- **Complete product information** including suppliers, expiry dates, and categories

### API Response Structure
```json
{
  "metadata": {
    "description": "Test data for sales functionality across different business types",
    "businessTypes": ["dental", "gym", "hotel"],
    "dateRange": {
      "startDate": "2024-01-15",
      "endDate": "2024-01-21"
    }
  },
  "request": {
    "method": "GET",
    "endpoint": "/api/sales/stocks",
    "params": {
      "businessType": "dental",
      "category": "all",
      "lowStock": false
    }
  },
  "response": {
    "success": true,
    "data": {
      "stocks": [...],
      "statistics": {...}
    }
  }
}
```

### Product Structure
Each product includes:
- **Basic info**: ID, name, category, description
- **Pricing**: Price, current price, unit
- **Stock info**: Quantity, minimum quantity, status
- **Business info**: Supplier, expiry date
- **Metadata**: Creation and update timestamps

## 🛠️ Test Utilities

### MockSalesService
Simulates the API layer with realistic delays and validation:

```javascript
import { MockSalesService } from './sales-test-utils';

const apiService = new MockSalesService();

// Get stocks data
const response = await apiService.getStocks('dental', {
  category: 'dental_supplies',
  lowStock: false,
  search: 'pastă'
});

// Create sale
const sale = await apiService.createSale({
  items: [
    {
      productId: 'prod-001',
      productName: 'Pastă de dinți',
      quantity: 2,
      unitPrice: 15.50,
      totalPrice: 31.00
    }
  ],
  total: 31.00,
  paymentMethod: 'cash',
  customerInfo: { name: 'Test Customer' }
});

// Update stock
const stockUpdate = await apiService.updateStock({
  id: 'stock-001',
  quantity: 45
});
```

### TestSalesDataProcessor
Simulates the design patterns data processing layer:

```javascript
import { TestSalesDataProcessor } from './sales-test-utils';

const dataProcessor = new TestSalesDataProcessor();

// Process stocks data
const processedData = dataProcessor.processStocksData(apiResponse.data);

// Get available products
const availableProducts = dataProcessor.getAvailableProducts(processedData.stocks);

// Filter by category
const dentalSupplies = dataProcessor.filterByCategory(processedData.stocks, 'dental_supplies');

// Filter by search term
const searchResults = dataProcessor.filterBySearch(processedData.stocks, 'pastă');
```

### TestSalesStore
Simulates the features layer store integration:

```javascript
import { TestSalesStore } from './sales-test-utils';

const store = new TestSalesStore();

// Load data
store.loadStocksData(availableProducts);

// Add to cart
store.addToCart(product);

// Update quantity
store.updateQuantity(productId, 3);

// Validate cart
const validation = store.validateCart();

// Finalize sale
const sale = await store.finalizeSale('card', {
  name: 'Maria Popescu',
  email: 'maria@email.com',
  createInvoice: true
});
```

### SalesDataFlowTest
Complete test runner for the entire sales data flow:

```javascript
import { SalesDataFlowTest } from './sales-test-utils';

const test = new SalesDataFlowTest();

// Run complete test
const results = await test.runTest();

// Run specific scenarios
const scenarioResults = await test.runScenarioTests();
```

## 🧪 Testing Scenarios

The test utilities include several predefined scenarios:

### 1. Basic Sales Flow
- **Description**: Complete sales process from product selection to finalization
- **Expected**: Sale completed successfully with proper stock updates

### 2. Stock Management
- **Description**: Test stock validation and updates
- **Expected**: Stock quantities updated correctly, low stock detection works

### 3. Cart Validation
- **Description**: Test cart validation logic
- **Expected**: Empty cart validation fails, valid cart validation passes

### 4. Payment Methods
- **Description**: Test different payment methods
- **Expected**: All payment methods work correctly

### 5. Customer Information
- **Description**: Test customer info and invoice creation
- **Expected**: Customer data processed correctly, invoice created

### 6. Product Filtering
- **Description**: Test search and category filtering
- **Expected**: Products filtered correctly by search term and category

### 7. Stock Validation
- **Description**: Test stock availability validation
- **Expected**: Cannot add more items than available stock

### 8. Error Handling
- **Description**: Test error scenarios
- **Expected**: Proper error messages and validation

## 🚀 Quick Start

### 1. Import the utilities
```javascript
import { 
  SalesDataFlowTest, 
  MockSalesService, 
  TestSalesDataProcessor, 
  TestSalesStore,
  salesTestData 
} from './testData/sales/sales-test-utils';
```

### 2. Run automated test
```javascript
const test = new SalesDataFlowTest();
const results = await test.runTest();
console.log('Test results:', results);
```

### 3. Test specific scenarios
```javascript
const scenarioResults = await test.runScenarioTests();
console.log('Scenario results:', scenarioResults);
```

### 4. Use in your components
```javascript
// Replace real API service with mock for testing
const apiService = new MockSalesService();
const stocksData = await apiService.getStocks('dental', {
  category: 'dental_supplies'
});
```

## 📊 Data Flow Testing

The test utilities help you verify the complete sales data flow:

### API Layer Testing
- ✅ Validates request parameters
- ✅ Simulates network delays
- ✅ Returns realistic response structure
- ✅ Handles filtering and search
- ✅ Manages sales history

### Design Patterns Testing
- ✅ Processes raw API data
- ✅ Adds business type metadata
- ✅ Applies data transformations
- ✅ Handles filtering and validation
- ✅ Computes derived fields

### Features Layer Testing
- ✅ Integrates with store management
- ✅ Tests cart operations (add, remove, update)
- ✅ Validates business logic (stock validation)
- ✅ Tests sale finalization
- ✅ Tests customer information handling

## 🔧 Integration with Real Code

### Replace API Service
```javascript
// In your component or service
import { MockSalesService } from './testData/sales/sales-test-utils';

// Replace this:
// const salesService = new SalesService();

// With this (for testing):
const salesService = new MockSalesService();
```

### Test Data Processing
```javascript
// In your design patterns layer
import { TestSalesDataProcessor } from './testData/sales/sales-test-utils';

const dataProcessor = new TestSalesDataProcessor();
const processedData = dataProcessor.processStocksData(apiData);
```

### Test Store Integration
```javascript
// In your features layer
import { TestSalesStore } from './testData/sales/sales-test-utils';

const store = new TestSalesStore();
store.loadStocksData(processedData);
```

## 🎯 Business Logic Testing

### Stock Validation
```javascript
// Test stock availability
const stockItem = stocksData.find(stock => stock.productId === product.id);
if (stockItem && newQuantity > stockItem.quantity) {
  throw new Error(`Cannot add ${newQuantity} items. Only ${stockItem.quantity} available`);
}
```

### Cart Validation
```javascript
// Test cart validation
const validation = store.validateCart();
if (!validation.isValid) {
  console.error('Cart validation failed:', validation.errors);
}
```

### Sale Finalization
```javascript
// Test complete sale process
const sale = await store.finalizeSale('card', {
  name: 'Customer Name',
  email: 'customer@email.com',
  createInvoice: true
});
```

## 📈 Performance Testing

### Load Testing
```javascript
// Test with large datasets
const largeStocksData = Array.from({ length: 1000 }, (_, i) => ({
  id: `stock-${i}`,
  productId: `prod-${i}`,
  productName: `Product ${i}`,
  quantity: Math.floor(Math.random() * 100),
  price: Math.random() * 100
}));

store.loadStocksData(largeStocksData);
const filteredProducts = store.getFilteredProducts();
```

### Stress Testing
```javascript
// Test concurrent operations
const concurrentOperations = Array.from({ length: 10 }, async () => {
  const sale = await store.finalizeSale('cash', { name: 'Test' });
  return sale;
});

const results = await Promise.all(concurrentOperations);
```

## 🔍 Debugging

### Enable Debug Logging
```javascript
// Add debug logging to test utilities
const apiService = new MockSalesService();
apiService.debug = true; // Enable debug logging

const response = await apiService.getStocks('dental');
// Will log detailed information about the request/response
```

### Test Data Inspection
```javascript
// Inspect test data structure
import salesTestData from './sales-test-data.json';

console.log('Test data structure:', salesTestData);
console.log('Available products:', salesTestData.response.data.stocks.length);
console.log('Categories:', Object.keys(salesTestData.response.data.statistics.categories));
```

## 🚨 Error Handling

### Common Error Scenarios
```javascript
// Test invalid business type
try {
  await apiService.getStocks('invalid');
} catch (error) {
  console.log('Expected error:', error.message);
}

// Test insufficient stock
try {
  store.updateQuantity(productId, 1000); // More than available
} catch (error) {
  console.log('Stock validation error:', error.message);
}

// Test empty cart validation
const validation = store.validateCart();
if (!validation.isValid) {
  console.log('Cart validation errors:', validation.errors);
}
```

## 📋 Test Checklist

### API Layer
- [ ] Get stocks with different business types
- [ ] Filter stocks by category
- [ ] Search stocks by name/ID
- [ ] Create sales with different payment methods
- [ ] Update stock quantities
- [ ] Create invoices
- [ ] Handle invalid requests

### Data Processing Layer
- [ ] Process stocks data correctly
- [ ] Add business type metadata
- [ ] Compute derived fields
- [ ] Filter by category
- [ ] Filter by search term
- [ ] Get available products

### Store Integration Layer
- [ ] Load stocks data
- [ ] Add items to cart
- [ ] Remove items from cart
- [ ] Update item quantities
- [ ] Validate cart
- [ ] Finalize sales
- [ ] Handle customer information
- [ ] Manage sales history

### Business Logic
- [ ] Stock availability validation
- [ ] Cart validation
- [ ] Payment method handling
- [ ] Customer information processing
- [ ] Invoice creation
- [ ] Error handling

## 🎉 Success Criteria

A successful test run should show:
- ✅ All API layer tests pass
- ✅ All data processing tests pass
- ✅ All store integration tests pass
- ✅ All business logic tests pass
- ✅ Error scenarios handled correctly
- ✅ Performance within acceptable limits
- ✅ No memory leaks or resource issues

## 📚 Additional Resources

- [Dental Timeline Test Documentation](../dentalTimeline/README.md)
- [API Request Examples](../../API_REQUEST_EXAMPLES.md)
- [Design Patterns Documentation](../../design-patterns/README.md)
- [Sales Integration Documentation](../../features/01-Home/store/SALES_INTEGRATION.md) 