/**
 * Sales Test Utilities
 * 
 * Utilities for testing the data flow from API → Design Patterns → Features
 * for sales functionality across different business types
 */

import salesTestData from './sales-test-data.json';

/**
 * Mock API Service for testing sales functionality
 */
export class MockSalesService {
  constructor() {
    this.data = salesTestData;
    this.salesHistory = [];
    this.cart = [];
  }

  /**
   * Simulate API call to get stocks data
   * @param {string} businessType - Business type (dental, gym, hotel)
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} Mock API response
   */
  async getStocks(businessType, params = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Validate parameters
    if (!['dental', 'gym', 'hotel'].includes(businessType)) {
      throw new Error('Invalid business type');
    }

    // Filter data based on business type and parameters
    let filteredData = { ...this.data };
    let stocks = [...this.data.response.data.stocks];
    
    // Filter by category if provided
    if (params.category && params.category !== 'all') {
      stocks = stocks.filter(stock => stock.category === params.category);
    }
    
    // Filter by low stock if provided
    if (params.lowStock) {
      stocks = stocks.filter(stock => stock.status === 'low-stock');
    }
    
    // Filter by search term if provided
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      stocks = stocks.filter(stock => 
        stock.productName.toLowerCase().includes(searchTerm) ||
        stock.productId.toLowerCase().includes(searchTerm)
      );
    }

    // Update statistics
    const statistics = {
      totalProducts: stocks.length,
      totalValue: stocks.reduce((sum, stock) => sum + (stock.price * stock.quantity), 0),
      lowStockItems: stocks.filter(stock => stock.status === 'low-stock').length,
      outOfStockItems: stocks.filter(stock => stock.quantity === 0).length,
      categories: stocks.reduce((acc, stock) => {
        acc[stock.category] = (acc[stock.category] || 0) + 1;
        return acc;
      }, {})
    };

    return {
      success: true,
      data: {
        stocks,
        statistics
      }
    };
  }

  /**
   * Simulate API call to create a sale
   * @param {Object} saleData - Sale data
   * @returns {Promise<Object>} Created sale
   */
  async createSale(saleData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newSale = {
      id: `sale-${Date.now()}`,
      ...saleData,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to sales history
    this.salesHistory.push(newSale);

    return {
      success: true,
      data: newSale,
      message: 'Sale created successfully'
    };
  }

  /**
   * Simulate API call to update stock quantity
   * @param {Object} stockUpdate - Stock update data
   * @returns {Promise<Object>} Updated stock
   */
  async updateStock(stockUpdate) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      data: { 
        id: stockUpdate.id, 
        quantity: stockUpdate.quantity,
        updatedAt: new Date().toISOString() 
      },
      message: 'Stock updated successfully'
    };
  }

  /**
   * Simulate API call to create invoice
   * @param {Object} invoiceData - Invoice data
   * @returns {Promise<Object>} Created invoice
   */
  async createInvoice(invoiceData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const newInvoice = {
      id: `invoice-${Date.now()}`,
      ...invoiceData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: newInvoice,
      message: 'Invoice created successfully'
    };
  }

  /**
   * Get sales history
   * @returns {Array} Sales history
   */
  getSalesHistory() {
    return this.salesHistory;
  }

  /**
   * Clear sales history (for testing)
   */
  clearSalesHistory() {
    this.salesHistory = [];
  }
}

/**
 * Test Data Processor
 * Simulates the design patterns data processing
 */
export class TestSalesDataProcessor {
  constructor() {
    this.businessType = 'dental';
  }

  /**
   * Process stocks data (simulates DataProcessor.processStocksData)
   * @param {Object} data - Raw API data
   * @returns {Object} Processed data
   */
  processStocksData(data) {
    if (!data || !data.stocks) {
      return data;
    }

    return {
      ...data,
      stocks: data.stocks.map(stock => ({
        ...stock,
        type: 'stock',
        businessType: this.businessType,
        processedAt: new Date().toISOString(),
        // Add computed fields
        isLowStock: stock.quantity <= stock.minQuantity,
        totalValue: stock.price * stock.quantity,
        formattedPrice: `${stock.price.toFixed(2)} RON`
      }))
    };
  }

  /**
   * Process sale data
   * @param {Object} saleData - Sale data
   * @returns {Object} Processed sale data
   */
  processSaleData(saleData) {
    return {
      ...saleData,
      type: 'sale',
      businessType: this.businessType,
      processedAt: new Date().toISOString(),
      // Add computed fields
      totalItems: saleData.items?.length || 0,
      formattedTotal: `${saleData.total?.toFixed(2)} RON`,
      formattedDate: new Date(saleData.timestamp).toLocaleString()
    };
  }

  /**
   * Filter stocks by category
   * @param {Array} stocks - Stocks array
   * @param {string} category - Category to filter by
   * @returns {Array} Filtered stocks
   */
  filterByCategory(stocks, category) {
    if (!category || category === 'all') {
      return stocks;
    }
    return stocks.filter(stock => stock.category === category);
  }

  /**
   * Filter stocks by search term
   * @param {Array} stocks - Stocks array
   * @param {string} searchTerm - Search term
   * @returns {Array} Filtered stocks
   */
  filterBySearch(stocks, searchTerm) {
    if (!searchTerm) {
      return stocks;
    }
    const term = searchTerm.toLowerCase();
    return stocks.filter(stock => 
      (stock.productName && stock.productName.toLowerCase().includes(term)) ||
      (stock.productId && stock.productId.toLowerCase().includes(term)) ||
      (stock.description && stock.description.toLowerCase().includes(term))
    );
  }

  /**
   * Get available products for sale
   * @param {Array} stocks - Stocks array
   * @returns {Array} Available products
   */
  getAvailableProducts(stocks) {
    return stocks
      .filter(stock => stock.quantity > 0)
      .map(stock => ({
        id: stock.productId,
        name: stock.productName,
        price: stock.price,
        currentPrice: stock.currentPrice || stock.price,
        quantity: stock.quantity,
        category: stock.category,
        description: stock.description,
        stockId: stock.id
      }))
      .filter(product => product.id && product.name); // Ensure required fields exist
  }
}

/**
 * Test Store Integration
 * Simulates the features layer store integration
 */
export class TestSalesStore {
  constructor() {
    this.state = {
      cart: [],
      total: 0,
      stocksData: [],
      stocksLoading: false,
      stocksError: null,
      salesHistory: [],
      currentSale: null,
      searchTerm: '',
      selectedCategory: 'all'
    };
  }

  /**
   * Load stocks data
   * @param {Array} stocks - Stocks data
   */
  loadStocksData(stocks) {
    // Ensure we're loading the raw stock data, not processed products
    this.state.stocksData = stocks.map(stock => {
      // If it's already a stock object, use it as is
      if (stock.productId && stock.quantity !== undefined) {
        return stock;
      }
      // If it's a processed product, convert it back to stock format
      return {
        id: stock.stockId || stock.id,
        productId: stock.id,
        productName: stock.name,
        quantity: stock.quantity,
        price: stock.price,
        currentPrice: stock.currentPrice,
        category: stock.category,
        description: stock.description
      };
    });
    this.state.stocksLoading = false;
    this.state.stocksError = null;
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoading(loading) {
    this.state.stocksLoading = loading;
  }

  /**
   * Set error state
   * @param {Error} error - Error object
   */
  setError(error) {
    this.state.stocksError = error;
    this.state.stocksLoading = false;
  }

  /**
   * Add item to cart
   * @param {Object} product - Product to add
   */
  addToCart(product) {
    const existingItem = this.state.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Check stock availability
      const stockItem = this.state.stocksData.find(stock => stock.productId === product.id);
      if (stockItem && existingItem.quantity + 1 > stockItem.quantity) {
        throw new Error(`Cannot add more ${product.name}. Only ${stockItem.quantity} available`);
      }
      
      this.state.cart = this.state.cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Check if product is available in stock before adding
      const stockItem = this.state.stocksData.find(stock => stock.productId === product.id);
      if (!stockItem || stockItem.quantity < 1) {
        throw new Error(`Product ${product.name} is not available in stock`);
      }
      
      this.state.cart = [...this.state.cart, { ...product, quantity: 1 }];
    }
    
    this.calculateTotal();
  }

  /**
   * Remove item from cart
   * @param {string} productId - Product ID to remove
   */
  removeFromCart(productId) {
    this.state.cart = this.state.cart.filter(item => item.id !== productId);
    this.calculateTotal();
  }

  /**
   * Update item quantity in cart
   * @param {string} productId - Product ID
   * @param {number} newQuantity - New quantity
   */
  updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
      this.removeFromCart(productId);
      return;
    }

    // Check stock availability
    const item = this.state.cart.find(item => item.id === productId);
    const stockItem = this.state.stocksData.find(stock => stock.productId === productId);
    
    if (stockItem && newQuantity > stockItem.quantity) {
      throw new Error(`Cannot add ${newQuantity} items. Only ${stockItem.quantity} available`);
    }

    this.state.cart = this.state.cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    this.calculateTotal();
  }

  /**
   * Calculate cart total
   */
  calculateTotal() {
    this.state.total = this.state.cart.reduce((sum, item) => {
      const price = item.currentPrice || item.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  /**
   * Validate cart
   * @returns {Object} Validation result
   */
  validateCart() {
    const errors = [];
    
    if (this.state.cart.length === 0) {
      errors.push('Cart is empty');
      return { isValid: false, errors };
    }

    // Check stock for each item
    for (const item of this.state.cart) {
      const stockItem = this.state.stocksData.find(stock => stock.productId === item.id);
      
      if (!stockItem) {
        errors.push(`Product ${item.name || item.id} is not available in stock`);
      } else if (stockItem.quantity < item.quantity) {
        errors.push(`Insufficient stock for ${item.name || item.id}. Available: ${stockItem.quantity}, Requested: ${item.quantity}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Finalize sale
   * @param {string} paymentMethod - Payment method
   * @param {Object} customerInfo - Customer information
   * @returns {Object} Created sale
   */
  async finalizeSale(paymentMethod = 'cash', customerInfo = {}) {
    const validation = this.validateCart();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const saleData = {
      id: `sale-${Date.now()}`,
      items: this.state.cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.currentPrice || item.price,
        totalPrice: (item.currentPrice || item.price) * item.quantity
      })),
      total: this.state.total,
      paymentMethod,
      customerInfo,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    // Add to sales history
    this.state.salesHistory.unshift(saleData);
    this.state.currentSale = saleData;
    
    // Clear cart
    this.state.cart = [];
    this.state.total = 0;

    return saleData;
  }

  /**
   * Cancel sale
   */
  cancelSale() {
    this.state.cart = [];
    this.state.total = 0;
    this.state.currentSale = null;
  }

  /**
   * Get filtered products
   * @returns {Array} Filtered products
   */
  getFilteredProducts() {
    let products = this.state.stocksData
      .filter(stock => stock.quantity > 0)
      .map(stock => ({
        id: stock.productId,
        name: stock.productName,
        price: stock.price,
        currentPrice: stock.currentPrice || stock.price,
        quantity: stock.quantity,
        category: stock.category,
        description: stock.description
      }));

    // Filter by category
    if (this.state.selectedCategory !== 'all') {
      products = products.filter(product => product.category === this.state.selectedCategory);
    }

    // Filter by search term
    if (this.state.searchTerm) {
      const term = this.state.searchTerm.toLowerCase();
      products = products.filter(product => 
        (product.name && product.name.toLowerCase().includes(term)) ||
        (product.id && product.id.toLowerCase().includes(term))
      );
    }

    return products;
  }

  /**
   * Set search term
   * @param {string} searchTerm - Search term
   */
  setSearchTerm(searchTerm) {
    this.state.searchTerm = searchTerm;
  }

  /**
   * Set selected category
   * @param {string} category - Selected category
   */
  setSelectedCategory(category) {
    this.state.selectedCategory = category;
  }

  /**
   * Get cart
   * @returns {Array} Cart items
   */
  getCart() {
    return this.state.cart;
  }

  /**
   * Get total
   * @returns {number} Cart total
   */
  getTotal() {
    return this.state.total;
  }

  /**
   * Get sales history
   * @returns {Array} Sales history
   */
  getSalesHistory() {
    return this.state.salesHistory;
  }
}

/**
 * Sales Data Flow Test
 * Complete test runner for the entire sales data flow
 */
export class SalesDataFlowTest {
  constructor() {
    this.apiService = new MockSalesService();
    this.dataProcessor = new TestSalesDataProcessor();
    this.store = new TestSalesStore();
    this.results = {
      passed: 0,
      failed: 0,
      errors: [],
      scenarios: {}
    };
  }

  /**
   * Run complete sales test
   * @param {Object} params - Test parameters
   * @returns {Object} Test results
   */
  async runTest(params = {}) {
    console.log('🚀 Starting Sales Data Flow Test...');
    
    try {
      // Test API Layer
      await this.testApiLayer(params);
      
      // Test Data Processing Layer
      await this.testDataProcessingLayer(params);
      
      // Test Store Integration Layer
      await this.testStoreIntegrationLayer(params);
      
      // Test Complete Flow
      await this.testCompleteFlow(params);
      
      // Test Error Scenarios
      await this.testErrorScenarios(params);
      
    } catch (error) {
      this.results.errors.push(`Test execution failed: ${error.message}`);
      this.results.failed++;
    }

    console.log(`✅ Sales Data Flow Test completed: ${this.results.passed} passed, ${this.results.failed} failed`);
    return this.results;
  }

  /**
   * Test API Layer
   * @param {Object} params - Test parameters
   */
  async testApiLayer(params) {
    console.log('📡 Testing API Layer...');
    
    try {
      // Test get stocks
      const stocksResponse = await this.apiService.getStocks('dental', {
        category: 'all',
        lowStock: false
      });
      
      if (stocksResponse.success && stocksResponse.data.stocks.length > 0) {
        this.results.passed++;
        this.results.scenarios.apiGetStocks = 'PASSED';
      } else {
        this.results.failed++;
        this.results.scenarios.apiGetStocks = 'FAILED';
      }

      // Test create sale
      const saleData = {
        items: [
          {
            productId: 'prod-001',
            productName: 'Test Product',
            quantity: 2,
            unitPrice: 15.50,
            totalPrice: 31.00
          }
        ],
        total: 31.00,
        paymentMethod: 'cash',
        customerInfo: { name: 'Test Customer' }
      };
      
      const saleResponse = await this.apiService.createSale(saleData);
      
      if (saleResponse.success && saleResponse.data.id) {
        this.results.passed++;
        this.results.scenarios.apiCreateSale = 'PASSED';
      } else {
        this.results.failed++;
        this.results.scenarios.apiCreateSale = 'FAILED';
      }

    } catch (error) {
      this.results.failed++;
      this.results.scenarios.apiLayer = 'FAILED';
      this.results.errors.push(`API Layer test failed: ${error.message}`);
    }
  }

  /**
   * Test Data Processing Layer
   * @param {Object} params - Test parameters
   */
  async testDataProcessingLayer(params) {
    console.log('⚙️ Testing Data Processing Layer...');
    
    try {
      // Get raw data from API
      const apiResponse = await this.apiService.getStocks('dental');
      const rawData = apiResponse.data;
      
      // Process data
      const processedData = this.dataProcessor.processStocksData(rawData);
      
      if (processedData.stocks && processedData.stocks.length > 0) {
        // Check if processing added required fields
        const firstStock = processedData.stocks[0];
        if (firstStock.type && firstStock.businessType && firstStock.processedAt) {
          this.results.passed++;
          this.results.scenarios.dataProcessing = 'PASSED';
        } else {
          this.results.failed++;
          this.results.scenarios.dataProcessing = 'FAILED';
        }
      } else {
        this.results.failed++;
        this.results.scenarios.dataProcessing = 'FAILED';
      }

      // Test filtering
      const filteredByCategory = this.dataProcessor.filterByCategory(processedData.stocks, 'dental_supplies');
      if (filteredByCategory.length > 0) {
        this.results.passed++;
        this.results.scenarios.dataFiltering = 'PASSED';
      } else {
        this.results.failed++;
        this.results.scenarios.dataFiltering = 'FAILED';
      }

    } catch (error) {
      this.results.failed++;
      this.results.scenarios.dataProcessingLayer = 'FAILED';
      this.results.errors.push(`Data Processing Layer test failed: ${error.message}`);
    }
  }

  /**
   * Test Store Integration Layer
   * @param {Object} params - Test parameters
   */
  async testStoreIntegrationLayer(params) {
    console.log('🏪 Testing Store Integration Layer...');
    
    try {
      // Load data into store
      const apiResponse = await this.apiService.getStocks('dental');
      const processedData = this.dataProcessor.processStocksData(apiResponse.data);
      const availableProducts = this.dataProcessor.getAvailableProducts(processedData.stocks);
      
      this.store.loadStocksData(availableProducts);
      
      if (this.store.getFilteredProducts().length > 0) {
        this.results.passed++;
        this.results.scenarios.storeIntegration = 'PASSED';
      } else {
        this.results.failed++;
        this.results.scenarios.storeIntegration = 'FAILED';
      }

      // Test cart operations
      const firstProduct = availableProducts[0];
      this.store.addToCart(firstProduct);
      
      if (this.store.getCart().length === 1 && this.store.getTotal() > 0) {
        this.results.passed++;
        this.results.scenarios.cartOperations = 'PASSED';
      } else {
        this.results.failed++;
        this.results.scenarios.cartOperations = 'FAILED';
      }

    } catch (error) {
      this.results.failed++;
      this.results.scenarios.storeIntegrationLayer = 'FAILED';
      this.results.errors.push(`Store Integration Layer test failed: ${error.message}`);
    }
  }

  /**
   * Test Complete Flow
   * @param {Object} params - Test parameters
   */
  async testCompleteFlow(params) {
    console.log('🔄 Testing Complete Flow...');
    
    try {
      // 1. Get stocks from API
      const stocksResponse = await this.apiService.getStocks('dental');
      
      // 2. Process data
      const processedData = this.dataProcessor.processStocksData(stocksResponse.data);
      const availableProducts = this.dataProcessor.getAvailableProducts(processedData.stocks);
      
      // 3. Load into store
      this.store.loadStocksData(availableProducts);
      
      // 4. Add items to cart
      const productsToAdd = availableProducts.slice(0, 2);
      for (const product of productsToAdd) {
        this.store.addToCart(product);
      }
      
      // 5. Validate cart
      const validation = this.store.validateCart();
      
      // 6. Finalize sale
      if (validation.isValid) {
        const sale = await this.store.finalizeSale('cash', { name: 'Test Customer' });
        
        if (sale && sale.id && this.store.getCart().length === 0) {
          this.results.passed++;
          this.results.scenarios.completeFlow = 'PASSED';
        } else {
          this.results.failed++;
          this.results.scenarios.completeFlow = 'FAILED';
        }
      } else {
        this.results.failed++;
        this.results.scenarios.completeFlow = 'FAILED';
      }

    } catch (error) {
      this.results.failed++;
      this.results.scenarios.completeFlow = 'FAILED';
      this.results.errors.push(`Complete Flow test failed: ${error.message}`);
    }
  }

  /**
   * Test Error Scenarios
   * @param {Object} params - Test parameters
   */
  async testErrorScenarios(params) {
    console.log('⚠️ Testing Error Scenarios...');
    
    try {
      // Test invalid business type
      try {
        await this.apiService.getStocks('invalid');
        this.results.failed++;
        this.results.scenarios.errorHandling = 'FAILED';
      } catch (error) {
        this.results.passed++;
        this.results.scenarios.errorHandling = 'PASSED';
      }

      // Test adding more items than available stock
      const apiResponse = await this.apiService.getStocks('dental');
      const processedData = this.dataProcessor.processStocksData(apiResponse.data);
      const availableProducts = this.dataProcessor.getAvailableProducts(processedData.stocks);
      
      this.store.loadStocksData(availableProducts);
      
      const lowStockProduct = availableProducts.find(p => p.quantity <= 5);
      if (lowStockProduct) {
        try {
          // Try to add more than available
          this.store.updateQuantity(lowStockProduct.id, lowStockProduct.quantity + 10);
          this.results.failed++;
          this.results.scenarios.stockValidation = 'FAILED';
        } catch (error) {
          this.results.passed++;
          this.results.scenarios.stockValidation = 'PASSED';
        }
      }

    } catch (error) {
      this.results.failed++;
      this.results.scenarios.errorScenarios = 'FAILED';
      this.results.errors.push(`Error Scenarios test failed: ${error.message}`);
    }
  }

  /**
   * Run specific scenario tests
   * @returns {Object} Scenario test results
   */
  async runScenarioTests() {
    console.log('🎯 Running Scenario Tests...');
    
    const scenarios = {
      basicSalesFlow: await this.testBasicSalesFlow(),
      stockManagement: await this.testStockManagement(),
      cartValidation: await this.testCartValidation(),
      paymentMethods: await this.testPaymentMethods(),
      customerInfo: await this.testCustomerInfo()
    };

    return scenarios;
  }

  /**
   * Test basic sales flow
   */
  async testBasicSalesFlow() {
    try {
      // Get products
      const stocksResponse = await this.apiService.getStocks('dental');
      const processedData = this.dataProcessor.processStocksData(stocksResponse.data);
      const availableProducts = this.dataProcessor.getAvailableProducts(processedData.stocks);
      
      // Add to cart
      this.store.loadStocksData(availableProducts);
      this.store.addToCart(availableProducts[0]);
      
      // Finalize sale
      const sale = await this.store.finalizeSale('cash');
      
      return {
        success: true,
        message: 'Basic sales flow completed successfully',
        sale
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Test stock management
   */
  async testStockManagement() {
    try {
      const stocksResponse = await this.apiService.getStocks('dental');
      const stocks = stocksResponse.data.stocks;
      
      // Test low stock detection
      const lowStockItems = stocks.filter(stock => stock.status === 'low-stock');
      
      // Test stock update
      const stockUpdate = await this.apiService.updateStock({
        id: 'stock-001',
        quantity: 45
      });
      
      return {
        success: true,
        message: 'Stock management test completed',
        lowStockCount: lowStockItems.length,
        stockUpdate
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Test cart validation
   */
  async testCartValidation() {
    try {
      const stocksResponse = await this.apiService.getStocks('dental');
      const processedData = this.dataProcessor.processStocksData(stocksResponse.data);
      const availableProducts = this.dataProcessor.getAvailableProducts(processedData.stocks);
      
      this.store.loadStocksData(availableProducts);
      
      // Test empty cart validation
      const emptyValidation = this.store.validateCart();
      
      // Add item and test valid cart
      this.store.addToCart(availableProducts[0]);
      const validValidation = this.store.validateCart();
      
      return {
        success: true,
        message: 'Cart validation test completed',
        emptyCartValid: !emptyValidation.isValid,
        validCartValid: validValidation.isValid
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Test payment methods
   */
  async testPaymentMethods() {
    try {
      const paymentMethods = ['cash', 'card', 'transfer', 'voucher'];
      const results = [];
      
      for (const method of paymentMethods) {
        try {
          const sale = await this.store.finalizeSale(method, { name: 'Test Customer' });
          results.push({ method, success: true, sale });
        } catch (error) {
          results.push({ method, success: false, error: error.message });
        }
      }
      
      return {
        success: true,
        message: 'Payment methods test completed',
        results
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Test customer info
   */
  async testCustomerInfo() {
    try {
      const customerInfo = {
        name: 'Maria Popescu',
        email: 'maria.popescu@email.com',
        phone: '+40 123 456 789',
        createInvoice: true
      };
      
      const sale = await this.store.finalizeSale('card', customerInfo);
      
      // Test invoice creation
      const invoice = await this.apiService.createInvoice({
        saleId: sale.id,
        customerInfo,
        items: sale.items,
        total: sale.total,
        paymentMethod: 'card'
      });
      
      return {
        success: true,
        message: 'Customer info test completed',
        sale,
        invoice
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

/**
 * Quick test function for immediate testing
 */
export async function runQuickSalesTest() {
  console.log('⚡ Running Quick Sales Test...');
  
  const test = new SalesDataFlowTest();
  const results = await test.runTest();
  
  console.log('📊 Quick Test Results:', results);
  return results;
}

// Export test data for direct use
export { salesTestData }; 