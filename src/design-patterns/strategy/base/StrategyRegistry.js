/**
 * Strategy Registry for managing different strategy implementations
 * Provides a centralized way to register and retrieve strategies
 */
class StrategyRegistry {
  constructor() {
    this.strategies = new Map();
    this.defaultStrategies = new Map();
  }

  /**
   * Register a strategy
   * @param {string} category - Strategy category (e.g., 'business', 'data', 'ui')
   * @param {string} name - Strategy name
   * @param {Class} strategyClass - Strategy class
   * @param {boolean} isDefault - Whether this is the default strategy for the category
   */
  register(category, name, strategyClass, isDefault = false) {
    if (!this.strategies.has(category)) {
      this.strategies.set(category, new Map());
    }

    const categoryStrategies = this.strategies.get(category);
    categoryStrategies.set(name, strategyClass);

    if (isDefault) {
      this.defaultStrategies.set(category, name);
    }

    // Emit registration event
    this.emitRegistrationEvent(category, name, strategyClass);
  }

  /**
   * Get a strategy instance
   * @param {string} category - Strategy category
   * @param {string} name - Strategy name
   * @param {Object} config - Strategy configuration
   * @returns {Object} Strategy instance
   */
  getStrategy(category, name = null, config = {}) {
    if (!this.strategies.has(category)) {
      throw new Error(`No strategies registered for category: ${category}`);
    }

    const categoryStrategies = this.strategies.get(category);
    const strategyName = name || this.defaultStrategies.get(category);

    if (!strategyName) {
      throw new Error(`No default strategy found for category: ${category}`);
    }

    if (!categoryStrategies.has(strategyName)) {
      throw new Error(`Strategy not found: ${category}/${strategyName}`);
    }

    const StrategyClass = categoryStrategies.get(strategyName);
    return new StrategyClass(config);
  }

  /**
   * Get all available strategies for a category
   * @param {string} category - Strategy category
   * @returns {Array} Array of strategy names
   */
  getAvailableStrategies(category) {
    if (!this.strategies.has(category)) {
      return [];
    }

    return Array.from(this.strategies.get(category).keys());
  }

  /**
   * Check if a strategy exists
   * @param {string} category - Strategy category
   * @param {string} name - Strategy name
   * @returns {boolean} True if strategy exists
   */
  hasStrategy(category, name) {
    return this.strategies.has(category) && 
           this.strategies.get(category).has(name);
  }

  /**
   * Get default strategy name for a category
   * @param {string} category - Strategy category
   * @returns {string|null} Default strategy name
   */
  getDefaultStrategy(category) {
    return this.defaultStrategies.get(category) || null;
  }

  /**
   * Set default strategy for a category
   * @param {string} category - Strategy category
   * @param {string} name - Strategy name
   */
  setDefaultStrategy(category, name) {
    if (!this.hasStrategy(category, name)) {
      throw new Error(`Cannot set default strategy: ${category}/${name} does not exist`);
    }

    this.defaultStrategies.set(category, name);
  }

  /**
   * Unregister a strategy
   * @param {string} category - Strategy category
   * @param {string} name - Strategy name
   */
  unregister(category, name) {
    if (!this.strategies.has(category)) {
      return;
    }

    const categoryStrategies = this.strategies.get(category);
    categoryStrategies.delete(name);

    // If this was the default strategy, clear the default
    if (this.defaultStrategies.get(category) === name) {
      this.defaultStrategies.delete(category);
    }

    // Clean up empty categories
    if (categoryStrategies.size === 0) {
      this.strategies.delete(category);
    }
  }

  /**
   * Clear all strategies for a category
   * @param {string} category - Strategy category
   */
  clearCategory(category) {
    this.strategies.delete(category);
    this.defaultStrategies.delete(category);
  }

  /**
   * Clear all strategies
   */
  clear() {
    this.strategies.clear();
    this.defaultStrategies.clear();
  }

  /**
   * Get registry statistics
   * @returns {Object} Registry statistics
   */
  getStats() {
    const stats = {
      totalCategories: this.strategies.size,
      totalStrategies: 0,
      categories: {}
    };

    for (const [category, strategies] of this.strategies) {
      const strategyCount = strategies.size;
      stats.categories[category] = {
        count: strategyCount,
        default: this.defaultStrategies.get(category),
        strategies: Array.from(strategies.keys())
      };
      stats.totalStrategies += strategyCount;
    }

    return stats;
  }

  /**
   * Emit registration event for debugging/monitoring
   * @param {string} category - Strategy category
   * @param {string} name - Strategy name
   * @param {Class} strategyClass - Strategy class
   */
  emitRegistrationEvent(category, name, strategyClass) {
    if (import.meta.env.DEV) {
      console.log(`[StrategyRegistry] Registered: ${category}/${name}`, strategyClass);
    }
  }

  /**
   * Validate strategy implementation
   * @param {Class} strategyClass - Strategy class to validate
   * @returns {boolean} True if valid
   */
  validateStrategy(strategyClass) {
    // Basic validation - check if class has required methods
    const requiredMethods = ['execute', 'getName'];
    const hasRequiredMethods = requiredMethods.every(method => 
      typeof strategyClass.prototype[method] === 'function'
    );

    if (!hasRequiredMethods) {
      console.warn(`Strategy validation failed: Missing required methods: ${requiredMethods.join(', ')}`);
      return false;
    }

    return true;
  }

  /**
   * Register multiple strategies at once
   * @param {Object} strategies - Object with category/name/class mappings
   */
  registerMultiple(strategies) {
    for (const [category, categoryStrategies] of Object.entries(strategies)) {
      for (const [name, config] of Object.entries(categoryStrategies)) {
        const { class: strategyClass, default: isDefault = false } = config;
        this.register(category, name, strategyClass, isDefault);
      }
    }
  }
}

// Create singleton instance
const strategyRegistry = new StrategyRegistry();

export default strategyRegistry; 