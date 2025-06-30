# Design Patterns Integration Examples

This document shows practical examples of how to integrate the design patterns with your feature-based architecture.

## 1. Command Pattern Integration

### Example: Form Undo/Redo in Drawers

```javascript
// In src2/features/00-Drawers/components/forms/AddClientForm.jsx
import { useCommandHistory } from '../../../design-patterns/command';
import { UpdateFormFieldCommand } from '../../../design-patterns/command/implementations/FormCommands';

const AddClientForm = () => {
  const { executeCommand, undo, redo, canUndo, canRedo } = useCommandHistory();
  
  const handleFieldChange = (field, oldValue, newValue) => {
    const command = new UpdateFormFieldCommand(field, oldValue, newValue);
    executeCommand(command);
  };

  return (
    <div>
      <input 
        onChange={(e) => handleFieldChange('name', formData.name, e.target.value)}
        value={formData.name}
      />
      
      <div className="form-actions">
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
      </div>
    </div>
  );
};
```

### Example: Batch Operations in Stocks

```javascript
// In src2/features/02-Stocks/views/StocksView.jsx
import { useCommandHistory } from '../../../design-patterns/command';
import { BatchUpdateStockCommand } from '../../../design-patterns/command/implementations/CRUDCommands';

const StocksView = () => {
  const { executeCommand } = useCommandHistory();
  
  const handleBatchUpdate = (items, updates) => {
    const command = new BatchUpdateStockCommand(items, updates);
    executeCommand(command);
  };

  const handleBulkPriceUpdate = () => {
    const selectedItems = getSelectedItems();
    const priceIncrease = 0.1; // 10% increase
    
    handleBatchUpdate(selectedItems, {
      type: 'price',
      operation: 'multiply',
      value: 1 + priceIncrease
    });
  };
};
```

## 2. Observer Pattern Integration

### Example: Cross-Feature Communication

```javascript
// In src2/features/02-Stocks/views/StocksView.jsx
import eventBus from '../../../design-patterns/observer/base/EventBus';

const StocksView = () => {
  const handleStockUpdate = (item) => {
    // Update local state
    updateStockItem(item);
    
    // Notify other features
    eventBus.emit('stocks:updated', {
      itemId: item.id,
      quantity: item.quantity,
      price: item.price
    });
  };
};
```

```javascript
// In src2/features/03-Invoices/views/InvoicesSection.jsx
import eventBus from '../../../design-patterns/observer/base/EventBus';

const InvoicesSection = () => {
  useEffect(() => {
    // Listen for stock updates
    const unsubscribe = eventBus.on('stocks:updated', (data) => {
      // Update invoice calculations based on stock changes
      updateInvoiceCalculations(data);
    });

    return unsubscribe;
  }, []);
};
```

### Example: Real-time AI Assistant Updates

```javascript
// In src2/features/00-Drawers/agent/components/AIAssistantChat.jsx
import eventBus from '../../../design-patterns/observer/base/EventBus';

const AIAssistantChat = () => {
  useEffect(() => {
    // Listen for AI assistant events
    const unsubscribe = eventBus.on('ai:message', (message) => {
      addMessage(message);
    });

    const unsubscribeError = eventBus.on('ai:error', (error) => {
      showError(error);
    });

    return () => {
      unsubscribe();
      unsubscribeError();
    };
  }, []);
};
```

## 3. Strategy Pattern Integration

### Example: Business-Specific Timeline Rendering

```javascript
// In src2/features/01-Home/views/01-Timeline/TimelineView.jsx
import strategyRegistry from '../../../design-patterns/strategy/base/StrategyRegistry';

const TimelineView = () => {
  const businessType = getBusinessType();
  
  const renderTimeline = () => {
    const strategy = strategyRegistry.getStrategy('timeline', businessType.name);
    return strategy.renderTimeline(timelineData);
  };

  return (
    <div className="timeline-view">
      {renderTimeline()}
    </div>
  );
};
```

### Example: Business-Specific Validation

```javascript
// In src2/features/02-Stocks/components/AddStockForm.jsx
import strategyRegistry from '../../../design-patterns/strategy/base/StrategyRegistry';

const AddStockForm = () => {
  const businessType = getBusinessType();
  
  const validateForm = (formData) => {
    const validationStrategy = strategyRegistry.getStrategy('validation', businessType.name);
    return validationStrategy.validateStockItem(formData);
  };

  const handleSubmit = (formData) => {
    const validation = validateForm(formData);
    if (validation.isValid) {
      submitForm(formData);
    } else {
      showErrors(validation.errors);
    }
  };
};
```

## 4. Factory Pattern Integration

### Example: Business-Specific Component Creation

```javascript
// In src2/features/01-Home/views/01-Timeline/TimelineView.jsx
import componentFactory from '../../../design-patterns/factory/implementations/ComponentFactory';

const TimelineView = () => {
  const businessType = getBusinessType();
  
  const renderBusinessTimeline = () => {
    return componentFactory.create('timeline', {
      data: timelineData,
      businessType: businessType.name
    }, {
      businessType: businessType.name
    });
  };

  return (
    <div className="timeline-container">
      {renderBusinessTimeline()}
    </div>
  );
};
```

### Example: Dynamic Form Generation

```javascript
// In src2/features/00-Drawers/components/forms/DynamicForm.jsx
import componentFactory from '../../../design-patterns/factory/implementations/ComponentFactory';

const DynamicForm = ({ formType, businessType }) => {
  const renderForm = () => {
    return componentFactory.create('form', {
      type: formType,
      businessType: businessType
    }, {
      businessType: businessType
    });
  };

  return (
    <div className="dynamic-form">
      {renderForm()}
    </div>
  );
};
```

## 5. Template Pattern Integration

### Example: Feature Initialization

```javascript
// In src2/features/01-Home/views/01-Timeline/TimelineView.jsx
import { FeatureTemplate } from '../../../design-patterns/template/implementations/features/FeatureTemplate';

class TimelineTemplate extends FeatureTemplate {
  initialize() {
    this.loadTimelineData();
    this.setupEventListeners();
    this.initializeComponents();
  }

  loadTimelineData() {
    // Load timeline data based on business type
    const businessType = getBusinessType();
    this.timelineData = this.loadBusinessSpecificData(businessType);
  }

  setupEventListeners() {
    // Setup timeline-specific event listeners
    eventBus.on('timeline:refresh', this.refreshTimeline);
  }

  initializeComponents() {
    // Initialize timeline components
    this.components = {
      timeline: componentFactory.create('timeline', this.timelineData),
      filters: componentFactory.create('filters', this.filterOptions)
    };
  }
}

const TimelineView = () => {
  useEffect(() => {
    const template = new TimelineTemplate();
    template.initialize();
    
    return () => template.cleanup();
  }, []);
};
```

## 6. State Management Integration

### Example: Zustand Store with Command Pattern

```javascript
// In src2/features/02-Stocks/store/stocksStore.js
import { create } from 'zustand';
import { CommandInvoker } from '../../../design-patterns/command/base/CommandInvoker';
import { UpdateStockCommand } from '../../../design-patterns/command/implementations/CRUDCommands';

const useStocksStore = create((set, get) => ({
  stocks: [],
  isLoading: false,
  
  updateStock: (stockId, updates) => {
    const oldStock = get().stocks.find(s => s.id === stockId);
    const command = new UpdateStockCommand(stockId, oldStock, updates);
    
    CommandInvoker.execute(command);
    
    set(state => ({
      stocks: state.stocks.map(stock => 
        stock.id === stockId ? { ...stock, ...updates } : stock
      )
    }));
  },
  
  undoLastAction: () => {
    CommandInvoker.undo();
    // Refresh state from command result
    const lastCommand = CommandInvoker.getLastCommand();
    if (lastCommand) {
      set({ stocks: lastCommand.getResult() });
    }
  }
}));
```

### Example: Zustand Store with Observer Pattern

```javascript
// In src2/features/05-Activities/store/historyStore.js
import { create } from 'zustand';
import eventBus from '../../../design-patterns/observer/base/EventBus';

const useHistoryStore = create((set, get) => ({
  activities: [],
  
  addActivity: (activity) => {
    set(state => ({
      activities: [activity, ...state.activities]
    }));
    
    // Notify other features
    eventBus.emit('activity:added', activity);
  },
  
  subscribeToActivities: () => {
    const unsubscribe = eventBus.on('activity:added', (activity) => {
      // React to activity additions from other features
      get().addActivity(activity);
    });
    
    return unsubscribe;
  }
}));
```

## 7. Cross-Pattern Integration

### Example: Complete Feature Integration

```javascript
// In src2/features/02-Stocks/views/StocksView.jsx
import { useCommandHistory } from '../../../design-patterns/command';
import eventBus from '../../../design-patterns/observer/base/EventBus';
import strategyRegistry from '../../../design-patterns/strategy/base/StrategyRegistry';
import componentFactory from '../../../design-patterns/factory/implementations/ComponentFactory';
import { StocksTemplate } from '../../../design-patterns/template/implementations/features/StocksTemplate';

const StocksView = () => {
  const { executeCommand, undo, redo } = useCommandHistory();
  const businessType = getBusinessType();
  
  useEffect(() => {
    // Initialize using template pattern
    const template = new StocksTemplate();
    template.initialize();
    
    // Subscribe to events
    const unsubscribe = eventBus.on('stocks:updated', handleStockUpdate);
    
    return () => {
      template.cleanup();
      unsubscribe();
    };
  }, []);
  
  const handleStockUpdate = (data) => {
    // Use strategy pattern for business-specific logic
    const strategy = strategyRegistry.getStrategy('stocks', businessType.name);
    const processedData = strategy.processStockUpdate(data);
    
    // Use command pattern for undo/redo
    const command = new UpdateStockCommand(processedData);
    executeCommand(command);
    
    // Notify other features
    eventBus.emit('stocks:processed', processedData);
  };
  
  const renderInventory = () => {
    // Use factory pattern for component creation
    return componentFactory.create('inventory', {
      data: stocksData,
      onUpdate: handleStockUpdate
    }, {
      businessType: businessType.name
    });
  };
  
  return (
    <div className="stocks-view">
      {renderInventory()}
      <div className="actions">
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>
    </div>
  );
};
```

## Best Practices for Integration

1. **Start Small**: Begin with one pattern per feature and gradually expand
2. **Keep Patterns Lightweight**: Don't over-engineer - use patterns only when beneficial
3. **Maintain Consistency**: Use the same pattern implementations across features
4. **Test Integration**: Ensure patterns work correctly with business type switching
5. **Document Usage**: Document how patterns are used in each feature
6. **Performance Monitoring**: Monitor the impact of patterns on performance
7. **Error Handling**: Implement proper error handling for pattern operations

This integration approach provides a solid foundation for using design patterns effectively within your feature-based architecture while maintaining code reusability and maintainability. 