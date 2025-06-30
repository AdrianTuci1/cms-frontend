# Dental Timeline Test Data & Utilities

This directory contains comprehensive test data and utilities for testing the data flow from **API → Design Patterns → Features** for the dental timeline functionality.

## 📁 Files Overview

- **`dental-timeline-week.json`** - Complete test data for one week of dental appointments
- **`timeline-test-utils.js`** - Test utilities and mock services
- **`TimelineTestExample.jsx`** - React component demonstrating usage
- **`README.md`** - This documentation file

## 🦷 Test Data Structure

The test data simulates a real API response for a dental clinic timeline with the following characteristics:

### Data Overview
- **23 appointments** across 7 days (2024-01-15 to 2024-01-21)
- **2 medics**: Dr. Elena Ionescu (13 appointments) and Dr. Alexandru Dumitrescu (10 appointments)
- **12 different treatment types** including Control + Curățare, Extracție, Placă Dentară, etc.
- **Realistic Romanian names** and contact information
- **Various appointment statuses** and durations

### API Response Structure
```json
{
  "metadata": {
    "description": "Test data for dental clinic timeline",
    "businessType": "dental",
    "dateRange": {
      "startDate": "2024-01-15",
      "endDate": "2024-01-21"
    }
  },
  "request": {
    "method": "GET",
    "endpoint": "/api/dental/timeline",
    "params": {
      "startDate": "2024-01-15",
      "endDate": "2024-01-21"
    }
  },
  "response": {
    "success": true,
    "data": {
      "reservations": [...],
      "statistics": {...}
    }
  }
}
```

### Appointment Structure
Each appointment includes:
- **Basic info**: ID, client name, medic name, date, duration
- **Treatment details**: Treatment type, color, price
- **Contact info**: Phone, email
- **Medical notes**: Patient-specific information
- **Status**: scheduled, done, missed, etc.

## 🛠️ Test Utilities

### MockTimelineService
Simulates the API layer with realistic delays and validation:

```javascript
import { MockTimelineService } from './timeline-test-utils';

const apiService = new MockTimelineService();

// Get timeline data
const response = await apiService.getTimeline('dental', {
  startDate: '2024-01-15',
  endDate: '2024-01-21'
});

// Create appointment
const newAppointment = await apiService.createAppointment({
  clientName: 'Test Patient',
  medicName: 'Dr. Test',
  displayTreatment: 'Test Treatment',
  date: '2024-01-22T10:00:00',
  duration: 30
});
```

### TestDataProcessor
Simulates the design patterns data processing layer:

```javascript
import { TestDataProcessor } from './timeline-test-utils';

const dataProcessor = new TestDataProcessor();

// Process timeline data
const processedData = dataProcessor.processTimelineData(apiResponse.data);

// Filter for current day
const todayData = dataProcessor.filterForCurrentDay(processedData);
```

### TestTimelineStore
Simulates the features layer store integration:

```javascript
import { TestTimelineStore } from './timeline-test-utils';

const store = new TestTimelineStore();

// Load data
store.loadData(processedData);

// Get appointments with business logic
const appointmentsData = store.getAppointments();

// Test filtering
store.setSelectedMedicId(1);
store.setAllAppointments(false);
const filteredAppointments = store.getAppointments();
```

### TimelineDataFlowTest
Complete test runner for the entire data flow:

```javascript
import { TimelineDataFlowTest } from './timeline-test-utils';

const test = new TimelineDataFlowTest();

// Run complete test
const results = await test.runTest();

// Run specific scenarios
const scenarioResults = await test.runScenarioTests();
```

## 🧪 Testing Scenarios

The test utilities include several predefined scenarios:

### 1. Basic Timeline Display
- **Description**: Display all appointments for the week
- **Expected**: 23 appointments displayed in weekly view

### 2. Filter by Medic
- **Description**: Filter appointments by Dr. Elena Ionescu
- **Expected**: 13 appointments displayed

### 3. Filter by Date
- **Description**: Show appointments for 2024-01-16
- **Expected**: 4 appointments displayed

### 4. Appointment Creation
- **Description**: Create new appointment
- **Expected**: New appointment added to timeline

### 5. Appointment Update
- **Description**: Update appointment status
- **Expected**: Appointment status changed

### 6. Appointment Deletion
- **Description**: Delete appointment
- **Expected**: Appointment removed from timeline

### 7. Offline Mode
- **Description**: Test offline functionality
- **Expected**: Data available offline, changes queued

### 8. Data Sync
- **Description**: Test data synchronization
- **Expected**: Changes synced when online

## 🚀 Quick Start

### 1. Import the utilities
```javascript
import { 
  TimelineDataFlowTest, 
  MockTimelineService, 
  TestDataProcessor, 
  TestTimelineStore,
  dentalTimelineData 
} from './testData/timeline-test-utils';
```

### 2. Run automated test
```javascript
const test = new TimelineDataFlowTest();
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
const apiService = new MockTimelineService();
const timelineData = await apiService.getTimeline('dental', {
  startDate: '2024-01-15',
  endDate: '2024-01-21'
});
```

## 📊 Data Flow Testing

The test utilities help you verify the complete data flow:

### API Layer Testing
- ✅ Validates request parameters
- ✅ Simulates network delays
- ✅ Returns realistic response structure
- ✅ Handles date range filtering

### Design Patterns Testing
- ✅ Processes raw API data
- ✅ Adds business type metadata
- ✅ Applies data transformations
- ✅ Handles filtering and validation

### Features Layer Testing
- ✅ Integrates with store management
- ✅ Tests business logic (filtering, counting)
- ✅ Validates UI component data
- ✅ Tests user interactions

## 🔧 Integration with Real Code

### Replace API Service
```javascript
// In your component or service
import { MockTimelineService } from './testData/timeline-test-utils';

// Replace this:
// const timelineService = new TimelineService();

// With this (for testing):
const timelineService = new MockTimelineService();
```

### Test Data Processing
```javascript
// In your design patterns layer
import { TestDataProcessor } from './testData/timeline-test-utils';

const dataProcessor = new TestDataProcessor();
const processedData = dataProcessor.processTimelineData(apiData);
```

### Test Store Integration
```javascript
// In your features layer
import { TestTimelineStore } from './testData/timeline-test-utils';

const store = new TestTimelineStore();
store.loadData(processedData);
const appointments = store.getAppointments();
```

## 📈 Performance Testing

The test utilities include performance metrics:

```javascript
const results = await test.runTest();
console.log(`Test completed in ${results.duration}ms`);

// Performance breakdown:
// - API Layer: ~100ms (simulated network delay)
// - Design Patterns: ~10ms (data processing)
// - Features Layer: ~5ms (store operations)
```

## 🐛 Debugging

### Enable Debug Logging
```javascript
// Add to your test
console.log('API Response:', apiResponse);
console.log('Processed Data:', processedData);
console.log('Store State:', store.state);
```

### Check Data Integrity
```javascript
// Verify data structure
const isValid = processedData.reservations.every(appointment => 
  appointment.id && 
  appointment.clientName && 
  appointment.medicName &&
  appointment.date
);
console.log('Data integrity check:', isValid);
```

## 📝 Example Usage in React Component

```jsx
import React, { useState, useEffect } from 'react';
import { TimelineDataFlowTest } from './testData/timeline-test-utils';

const TimelineTestComponent = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async () => {
    setIsRunning(true);
    try {
      const test = new TimelineDataFlowTest();
      const results = await test.runTest();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div>
      <button onClick={runTest} disabled={isRunning}>
        {isRunning ? 'Running Test...' : 'Run Timeline Test'}
      </button>
      
      {testResults && (
        <div>
          <h3>Test Results:</h3>
          <p>API Layer: {testResults.api?.success ? '✅' : '❌'}</p>
          <p>Design Patterns: {testResults.designPatterns?.success ? '✅' : '❌'}</p>
          <p>Features Layer: {testResults.features?.success ? '✅' : '❌'}</p>
          <p>Duration: {testResults.duration}ms</p>
        </div>
      )}
    </div>
  );
};
```

## 🎯 Best Practices

1. **Use Mock Services**: Replace real API calls with mocks during testing
2. **Test Each Layer**: Verify API, design patterns, and features separately
3. **Validate Data Structure**: Ensure data integrity at each step
4. **Test Edge Cases**: Include error scenarios and edge cases
5. **Measure Performance**: Track timing for performance optimization
6. **Document Results**: Keep track of test results and failures

## 🔄 Continuous Integration

Add these tests to your CI/CD pipeline:

```javascript
// In your test suite
describe('Timeline Data Flow', () => {
  test('Complete data flow test', async () => {
    const test = new TimelineDataFlowTest();
    const results = await test.runTest();
    
    expect(results.api.success).toBe(true);
    expect(results.designPatterns.success).toBe(true);
    expect(results.features.success).toBe(true);
    expect(results.duration).toBeLessThan(1000); // Should complete within 1 second
  });

  test('Scenario tests', async () => {
    const test = new TimelineDataFlowTest();
    const scenarioResults = await test.runScenarioTests();
    
    const passedScenarios = scenarioResults.filter(r => r.passed).length;
    expect(passedScenarios).toBe(scenarioResults.length);
  });
});
```

This comprehensive test setup will help you ensure that your dental timeline data flows correctly from the API through design patterns to the features layer, with proper validation and error handling at each step. 