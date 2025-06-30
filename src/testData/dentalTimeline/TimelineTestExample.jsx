import React, { useState, useEffect } from 'react';
import { 
  TimelineDataFlowTest, 
  MockTimelineService, 
  TestDataProcessor, 
  TestTimelineStore,
  dentalTimelineData 
} from './timeline-test-utils';

/**
 * Example component demonstrating how to test the data flow
 * from API → Design Patterns → Features
 */
const TimelineTestExample = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [manualTestData, setManualTestData] = useState(null);

  // Run the complete automated test
  const runAutomatedTest = async () => {
    setIsRunning(true);
    setCurrentStep('Running automated test...');
    
    try {
      const test = new TimelineDataFlowTest();
      const results = await test.runTest();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({ error: error.message });
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  // Manual step-by-step test
  const runManualTest = async () => {
    setIsRunning(true);
    setCurrentStep('Step 1: Testing API Layer...');
    
    try {
      // Step 1: API Layer
      const apiService = new MockTimelineService();
      const apiResponse = await apiService.getTimeline('dental', {
        startDate: '2024-01-15',
        endDate: '2024-01-21'
      });
      
      setCurrentStep('Step 2: Testing Design Patterns...');
      
      // Step 2: Design Patterns
      const dataProcessor = new TestDataProcessor();
      const processedData = dataProcessor.processTimelineData(apiResponse.data);
      
      setCurrentStep('Step 3: Testing Features Layer...');
      
      // Step 3: Features Layer
      const store = new TestTimelineStore();
      store.loadData(processedData);
      const appointmentsData = store.getAppointments();
      
      // Test business logic
      store.setSelectedMedicId(1);
      store.setAllAppointments(false);
      const filteredAppointments = store.getAppointments();
      
      const manualResults = {
        api: {
          success: true,
          appointmentsCount: apiResponse.data.reservations.length,
          sampleData: apiResponse.data.reservations[0]
        },
        designPatterns: {
          success: true,
          processedCount: processedData.reservations.length,
          hasMetadata: processedData.reservations.every(r => r.type === 'timeline')
        },
        features: {
          success: true,
          totalAppointments: appointmentsData.appointments.length,
          filteredAppointments: filteredAppointments.displayedAppointments.length,
          medicFilterTest: filteredAppointments.displayedAppointments.length === 13
        }
      };
      
      setManualTestData(manualResults);
      
    } catch (error) {
      console.error('Manual test failed:', error);
      setManualTestData({ error: error.message });
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  // Test specific scenarios
  const testScenarios = async () => {
    setIsRunning(true);
    setCurrentStep('Testing scenarios...');
    
    try {
      const test = new TimelineDataFlowTest();
      const scenarioResults = await test.runScenarioTests();
      setTestResults(prev => ({
        ...prev,
        scenarios: scenarioResults
      }));
    } catch (error) {
      console.error('Scenario test failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🦷 Dental Timeline Data Flow Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p>
          This example demonstrates how to test the complete data flow from API → Design Patterns → Features
          for the dental timeline functionality.
        </p>
      </div>

      {/* Test Controls */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Test Controls</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button 
            onClick={runAutomatedTest}
            disabled={isRunning}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isRunning ? 'not-allowed' : 'pointer'
            }}
          >
            🚀 Run Automated Test
          </button>
          
          <button 
            onClick={runManualTest}
            disabled={isRunning}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isRunning ? 'not-allowed' : 'pointer'
            }}
          >
            🔧 Run Manual Test
          </button>
          
          <button 
            onClick={testScenarios}
            disabled={isRunning}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isRunning ? 'not-allowed' : 'pointer'
            }}
          >
            🧪 Test Scenarios
          </button>
        </div>
        
        {isRunning && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#FFF3E0', 
            border: '1px solid #FF9800',
            borderRadius: '4px'
          }}>
            ⏳ {currentStep}
          </div>
        )}
      </div>

      {/* Test Data Overview */}
      <div style={{ marginBottom: '30px' }}>
        <h2>📊 Test Data Overview</h2>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#F5F5F5', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <p><strong>Total Appointments:</strong> {dentalTimelineData.response.data.reservations.length}</p>
          <p><strong>Date Range:</strong> {dentalTimelineData.metadata.dateRange.startDate} to {dentalTimelineData.metadata.dateRange.endDate}</p>
          <p><strong>Medics:</strong> Dr. Elena Ionescu (13 appointments), Dr. Alexandru Dumitrescu (10 appointments)</p>
          <p><strong>Treatments:</strong> Control + Curățare, Extracție, Placă Dentară, Umplere Carie, etc.</p>
        </div>
      </div>

      {/* Manual Test Results */}
      {manualTestData && (
        <div style={{ marginBottom: '30px' }}>
          <h2>🔧 Manual Test Results</h2>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#E8F5E8', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {manualTestData.error ? (
              <div style={{ color: '#D32F2F' }}>❌ Error: {manualTestData.error}</div>
            ) : (
              <div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>API Layer:</strong> {manualTestData.api.success ? '✅' : '❌'} 
                  {manualTestData.api.appointmentsCount} appointments retrieved
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Design Patterns:</strong> {manualTestData.designPatterns.success ? '✅' : '❌'} 
                  {manualTestData.designPatterns.processedCount} appointments processed
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Features Layer:</strong> {manualTestData.features.success ? '✅' : '❌'} 
                  {manualTestData.features.totalAppointments} appointments in store
                </div>
                <div>
                  <strong>Medic Filter Test:</strong> {manualTestData.features.medicFilterTest ? '✅' : '❌'} 
                  Filtered to {manualTestData.features.filteredAppointments} appointments
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Automated Test Results */}
      {testResults && !testResults.error && (
        <div style={{ marginBottom: '30px' }}>
          <h2>🚀 Automated Test Results</h2>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#E3F2FD', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>API Layer:</strong> {testResults.api?.success ? '✅' : '❌'} 
              {testResults.api?.appointmentsCount} appointments
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Design Patterns:</strong> {testResults.designPatterns?.success ? '✅' : '❌'} 
              {testResults.designPatterns?.processedCount} appointments processed
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Features Layer:</strong> {testResults.features?.success ? '✅' : '❌'} 
              {testResults.features?.totalAppointments} appointments in store
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Duration:</strong> {testResults.duration}ms
            </div>
            
            {testResults.scenarios && (
              <div style={{ marginTop: '15px' }}>
                <strong>Scenario Tests:</strong>
                <div style={{ marginTop: '5px' }}>
                  {testResults.scenarios.map((scenario, index) => (
                    <div key={index} style={{ marginBottom: '5px' }}>
                      {scenario.passed ? '✅' : '❌'} {scenario.name}: {scenario.result} (expected: {scenario.expected})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sample Data Display */}
      <div style={{ marginBottom: '30px' }}>
        <h2>📋 Sample Appointment Data</h2>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#F5F5F5', 
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          overflow: 'auto',
          maxHeight: '300px'
        }}>
          <pre>
            {JSON.stringify(dentalTimelineData.response.data.reservations[0], null, 2)}
          </pre>
        </div>
      </div>

      {/* Usage Instructions */}
      <div style={{ marginBottom: '30px' }}>
        <h2>📖 How to Use</h2>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#FFF8E1', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <h3>1. Import the test utilities:</h3>
          <pre style={{ backgroundColor: '#F5F5F5', padding: '10px', borderRadius: '4px' }}>
{`import { 
  TimelineDataFlowTest, 
  MockTimelineService, 
  TestDataProcessor, 
  TestTimelineStore 
} from './testData/timeline-test-utils';`}
          </pre>
          
          <h3>2. Run automated test:</h3>
          <pre style={{ backgroundColor: '#F5F5F5', padding: '10px', borderRadius: '4px' }}>
{`const test = new TimelineDataFlowTest();
const results = await test.runTest();`}
          </pre>
          
          <h3>3. Test specific scenarios:</h3>
          <pre style={{ backgroundColor: '#F5F5F5', padding: '10px', borderRadius: '4px' }}>
{`const scenarioResults = await test.runScenarioTests();`}
          </pre>
          
          <h3>4. Use in your components:</h3>
          <pre style={{ backgroundColor: '#F5F5F5', padding: '10px', borderRadius: '4px' }}>
{`// Replace real API service with mock for testing
const apiService = new MockTimelineService();
const timelineData = await apiService.getTimeline('dental', {
  startDate: '2024-01-15',
  endDate: '2024-01-21'
});`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TimelineTestExample; 