/**
 * Component Factory for creating business type-specific components
 * Implements the Factory pattern for component creation
 */
import { getBusinessType } from '../../../config/businessTypes';

class ComponentFactory {
  constructor() {
    this.registry = new Map();
    this.businessTypeRegistry = new Map();
    this.defaultComponents = new Map();
  }

  /**
   * Register a component type
   * @param {string} componentType - Component type (e.g., 'timeline', 'inventory')
   * @param {Function} componentClass - Component class or function
   * @param {Object} options - Registration options
   */
  register(componentType, componentClass, options = {}) {
    const { businessType = null, isDefault = false } = options;

    if (!this.registry.has(componentType)) {
      this.registry.set(componentType, new Map());
    }

    const typeRegistry = this.registry.get(componentType);

    if (businessType) {
      // Business-specific component
      if (!this.businessTypeRegistry.has(businessType)) {
        this.businessTypeRegistry.set(businessType, new Map());
      }
      
      const businessRegistry = this.businessTypeRegistry.get(businessType);
      if (!businessRegistry.has(componentType)) {
        businessRegistry.set(componentType, new Map());
      }
      
      businessRegistry.get(componentType).set(componentClass.name, componentClass);
    } else {
      // Generic component
      typeRegistry.set(componentClass.name, componentClass);
    }

    if (isDefault) {
      this.defaultComponents.set(componentType, componentClass);
    }
  }

  /**
   * Create a component instance
   * @param {string} componentType - Component type
   * @param {Object} props - Component props
   * @param {Object} options - Creation options
   * @returns {React.Component} Component instance
   */
  create(componentType, props = {}, options = {}) {
    const { businessType = null, componentName = null } = options;
    
    let componentClass = null;

    // Try to get business-specific component first
    if (businessType && this.businessTypeRegistry.has(businessType)) {
      const businessRegistry = this.businessTypeRegistry.get(businessType);
      if (businessRegistry.has(componentType)) {
        const typeRegistry = businessRegistry.get(componentType);
        componentClass = componentName 
          ? typeRegistry.get(componentName)
          : Array.from(typeRegistry.values())[0];
      }
    }

    // Fall back to generic component
    if (!componentClass && this.registry.has(componentType)) {
      const typeRegistry = this.registry.get(componentType);
      componentClass = componentName 
        ? typeRegistry.get(componentName)
        : this.defaultComponents.get(componentType) || Array.from(typeRegistry.values())[0];
    }

    if (!componentClass) {
      throw new Error(`Component not found: ${componentType}${businessType ? ` for ${businessType}` : ''}`);
    }

    // Create component instance
    return React.createElement(componentClass, props);
  }

  /**
   * Create a component based on current business type
   * @param {string} componentType - Component type
   * @param {Object} props - Component props
   * @param {Object} options - Creation options
   * @returns {React.Component} Component instance
   */
  createForCurrentBusiness(componentType, props = {}, options = {}) {
    const businessType = getBusinessType();
    return this.create(componentType, props, { ...options, businessType: businessType.name });
  }

  /**
   * Get available components for a type
   * @param {string} componentType - Component type
   * @param {string} businessType - Business type (optional)
   * @returns {Array} Array of available component names
   */
  getAvailableComponents(componentType, businessType = null) {
    const components = [];

    if (businessType && this.businessTypeRegistry.has(businessType)) {
      const businessRegistry = this.businessTypeRegistry.get(businessType);
      if (businessRegistry.has(componentType)) {
        const typeRegistry = businessRegistry.get(componentType);
        components.push(...Array.from(typeRegistry.keys()));
      }
    }

    if (this.registry.has(componentType)) {
      const typeRegistry = this.registry.get(componentType);
      components.push(...Array.from(typeRegistry.keys()));
    }

    return components;
  }

  /**
   * Check if a component exists
   * @param {string} componentType - Component type
   * @param {string} componentName - Component name
   * @param {string} businessType - Business type (optional)
   * @returns {boolean} True if component exists
   */
  hasComponent(componentType, componentName, businessType = null) {
    if (businessType && this.businessTypeRegistry.has(businessType)) {
      const businessRegistry = this.businessTypeRegistry.get(businessType);
      if (businessRegistry.has(componentType)) {
        const typeRegistry = businessRegistry.get(componentType);
        if (typeRegistry.has(componentName)) {
          return true;
        }
      }
    }

    if (this.registry.has(componentType)) {
      const typeRegistry = this.registry.get(componentType);
      return typeRegistry.has(componentName);
    }

    return false;
  }

  /**
   * Register multiple components at once
   * @param {Object} components - Component definitions
   */
  registerMultiple(components) {
    for (const [componentType, typeComponents] of Object.entries(components)) {
      for (const [componentName, config] of Object.entries(typeComponents)) {
        const { class: componentClass, businessType = null, default: isDefault = false } = config;
        this.register(componentType, componentClass, { businessType, isDefault });
      }
    }
  }

  /**
   * Get factory statistics
   * @returns {Object} Factory statistics
   */
  getStats() {
    const stats = {
      totalTypes: this.registry.size,
      totalBusinessTypes: this.businessTypeRegistry.size,
      totalComponents: 0,
      types: {},
      businessTypes: {}
    };

    // Count generic components
    for (const [componentType, typeRegistry] of this.registry) {
      const count = typeRegistry.size;
      stats.types[componentType] = {
        count,
        components: Array.from(typeRegistry.keys()),
        default: this.defaultComponents.get(componentType)?.name
      };
      stats.totalComponents += count;
    }

    // Count business-specific components
    for (const [businessType, businessRegistry] of this.businessTypeRegistry) {
      stats.businessTypes[businessType] = {};
      for (const [componentType, typeRegistry] of businessRegistry) {
        const count = typeRegistry.size;
        stats.businessTypes[businessType][componentType] = {
          count,
          components: Array.from(typeRegistry.keys())
        };
        stats.totalComponents += count;
      }
    }

    return stats;
  }

  /**
   * Clear all registrations
   */
  clear() {
    this.registry.clear();
    this.businessTypeRegistry.clear();
    this.defaultComponents.clear();
  }
}

// Create singleton instance
const componentFactory = new ComponentFactory();

// Register common component types
componentFactory.register('timeline', null, { isDefault: true });
componentFactory.register('inventory', null, { isDefault: true });
componentFactory.register('invoice', null, { isDefault: true });
componentFactory.register('automation', null, { isDefault: true });
componentFactory.register('activity', null, { isDefault: true });
componentFactory.register('admin', null, { isDefault: true });

export default componentFactory; 