/**
 * Timeline Test Utilities
 * 
 * Utilities for testing the data flow from API → Design Patterns → Features
 * for dental timeline functionality
 */

import dentalTimelineData from './dental-timeline-week.json';

/**
 * Mock API Service for testing
 */
export class MockTimelineService {
  constructor() {
    this.data = dentalTimelineData;
  }

  /**
   * Simulate API call to get timeline data
   * @param {string} businessType - Business type (dental, gym, hotel)
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} Mock API response
   */
  async getTimeline(businessType, params = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Validate parameters
    if (businessType !== 'dental') {
      throw new Error('Business type must be dental for this test');
    }

    // Filter data based on date range if provided
    let filteredData = { ...this.data };
    
    if (params.startDate && params.endDate) {
      const reservations = this.data.response.data.reservations.filter(appointment => {
        const appointmentDate = appointment.date.split('T')[0];
        return appointmentDate >= params.startDate && appointmentDate <= params.endDate;
      });
      
      filteredData.response.data.reservations = reservations;
      filteredData.response.data.statistics.totalAppointments = reservations.length;
    }

    return filteredData.response;
  }

  /**
   * Simulate API call to create appointment
   * @param {Object} appointment - Appointment data
   * @returns {Promise<Object>} Created appointment
   */
  async createAppointment(appointment) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newAppointment = {
      id: Date.now(),
      ...appointment,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      data: newAppointment,
      message: 'Appointment created successfully'
    };
  }

  /**
   * Simulate API call to update appointment
   * @param {number} id - Appointment ID
   * @param {Object} updates - Update data
   * @returns {Promise<Object>} Updated appointment
   */
  async updateAppointment(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      success: true,
      data: { id, ...updates, updatedAt: new Date().toISOString() },
      message: 'Appointment updated successfully'
    };
  }

  /**
   * Simulate API call to delete appointment
   * @param {number} id - Appointment ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteAppointment(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      message: 'Appointment deleted successfully'
    };
  }
}

/**
 * Test Data Processor
 * Simulates the design patterns data processing
 */
export class TestDataProcessor {
  constructor() {
    this.businessType = 'dental';
  }

  /**
   * Process timeline data (simulates DataProcessor.processTimelineData)
   * @param {Object} data - Raw API data
   * @returns {Object} Processed data
   */
  processTimelineData(data) {
    if (!data || !data.reservations) {
      return data;
    }

    return {
      ...data,
      reservations: data.reservations.map(reservation => ({
        ...reservation,
        type: 'timeline',
        businessType: this.businessType,
        processedAt: new Date().toISOString()
      }))
    };
  }

  /**
   * Filter data for current day only
   * @param {Object} data - Timeline data
   * @returns {Object} Filtered data
   */
  filterForCurrentDay(data) {
    if (!data || !data.reservations) {
      return data;
    }

    const today = new Date().toISOString().split('T')[0];
    const filteredReservations = data.reservations.filter(reservation => {
      const appointmentDate = reservation.date.split('T')[0];
      return appointmentDate === today;
    });

    return {
      ...data,
      reservations: filteredReservations,
      statistics: {
        ...data.statistics,
        totalAppointments: filteredReservations.length
      }
    };
  }
}

/**
 * Test Store Integration
 * Simulates the features layer store integration
 */
export class TestTimelineStore {
  constructor() {
    this.state = {
      data: null,
      loading: false,
      error: null,
      selectedDate: new Date(),
      currentWeek: [],
      isAllAppointments: true,
      selectedMedicId: null
    };
  }

  /**
   * Load timeline data
   * @param {Object} data - Timeline data
   */
  loadData(data) {
    this.state.data = data;
    this.state.loading = false;
    this.state.error = null;
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoading(loading) {
    this.state.loading = loading;
  }

  /**
   * Set error state
   * @param {Error} error - Error object
   */
  setError(error) {
    this.state.error = error;
    this.state.loading = false;
  }

  /**
   * Get appointments with business logic
   * @returns {Object} Processed appointments data
   */
  getAppointments() {
    const reservations = this.state.data?.reservations || [];
    
    return {
      appointments: reservations,
      displayedAppointments: this.getDisplayedAppointments(reservations),
      getAppointmentsCountForDate: (date) => this.getAppointmentsCountForDate(reservations, date)
    };
  }

  /**
   * Get displayed appointments based on filters
   * @param {Array} appointments - All appointments
   * @returns {Array} Filtered appointments
   */
  getDisplayedAppointments(appointments) {
    if (this.state.isAllAppointments) {
      return appointments;
    }
    
    return appointments.filter(appointment => 
      appointment.medicId === this.state.selectedMedicId
    );
  }

  /**
   * Get appointment count for specific date
   * @param {Array} appointments - All appointments
   * @param {Date} date - Target date
   * @returns {number} Appointment count
   */
  getAppointmentsCountForDate(appointments, date) {
    const displayedAppointments = this.getDisplayedAppointments(appointments);
    
    return displayedAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getFullYear() === date.getFullYear() &&
             appointmentDate.getMonth() === date.getMonth() &&
             appointmentDate.getDate() === date.getDate();
    }).length;
  }

  /**
   * Set selected medic filter
   * @param {number} medicId - Medic ID
   */
  setSelectedMedicId(medicId) {
    this.state.selectedMedicId = medicId;
  }

  /**
   * Toggle all appointments filter
   * @param {boolean} isAll - Show all appointments
   */
  setAllAppointments(isAll) {
    this.state.isAllAppointments = isAll;
  }
}

/**
 * Complete Data Flow Test
 * Tests the entire flow from API → Design Patterns → Features
 */
export class TimelineDataFlowTest {
  constructor() {
    this.apiService = new MockTimelineService();
    this.dataProcessor = new TestDataProcessor();
    this.store = new TestTimelineStore();
  }

  /**
   * Run complete data flow test
   * @param {Object} params - Test parameters
   * @returns {Promise<Object>} Test results
   */
  async runTest(params = {}) {
    const testResults = {
      api: null,
      designPatterns: null,
      features: null,
      errors: [],
      duration: 0
    };

    const startTime = Date.now();

    try {
      // Step 1: API Call
      console.log('🔄 Testing API Layer...');
      this.store.setLoading(true);
      
      const apiResponse = await this.apiService.getTimeline('dental', {
        startDate: '2024-01-15',
        endDate: '2024-01-21',
        ...params
      });

      testResults.api = {
        success: true,
        data: apiResponse,
        appointmentsCount: apiResponse.data.reservations.length
      };

      console.log(`✅ API Test: ${apiResponse.data.reservations.length} appointments retrieved`);

      // Step 2: Design Patterns Processing
      console.log('🔄 Testing Design Patterns Layer...');
      
      const processedData = this.dataProcessor.processTimelineData(apiResponse.data);
      
      testResults.designPatterns = {
        success: true,
        data: processedData,
        processedCount: processedData.reservations.length,
        hasMetadata: processedData.reservations.every(r => r.type === 'timeline')
      };

      console.log(`✅ Design Patterns Test: ${processedData.reservations.length} appointments processed`);

      // Step 3: Features Layer
      console.log('🔄 Testing Features Layer...');
      
      this.store.loadData(processedData);
      const appointmentsData = this.store.getAppointments();
      
      testResults.features = {
        success: true,
        data: appointmentsData,
        totalAppointments: appointmentsData.appointments.length,
        displayedAppointments: appointmentsData.displayedAppointments.length
      };

      console.log(`✅ Features Test: ${appointmentsData.appointments.length} appointments in store`);

    } catch (error) {
      testResults.errors.push({
        step: 'unknown',
        error: error.message,
        stack: error.stack
      });
      console.error('❌ Test failed:', error);
    }

    testResults.duration = Date.now() - startTime;
    return testResults;
  }

  /**
   * Test specific scenarios
   * @returns {Promise<Object>} Scenario test results
   */
  async runScenarioTests() {
    // First, ensure we have data loaded in the store
    if (!this.store.state.data) {
      const apiResponse = await this.apiService.getTimeline('dental', {
        startDate: '2024-01-15',
        endDate: '2024-01-21'
      });
      const processedData = this.dataProcessor.processTimelineData(apiResponse.data);
      this.store.loadData(processedData);
    }

    const scenarios = [
      {
        name: 'Filter by Medic',
        test: async () => {
          this.store.setSelectedMedicId(1);
          this.store.setAllAppointments(false);
          const appointments = this.store.getAppointments();
          return appointments.displayedAppointments.length;
        },
        expected: 12 // Dr. Elena Ionescu has 12 appointments
      },
      {
        name: 'Filter by Date',
        test: async () => {
          this.store.setAllAppointments(true); // Show all appointments, not just for a medic
          const appointments = this.store.getAppointments();
          const count = appointments.getAppointmentsCountForDate(new Date('2024-01-16'));
          return count;
        },
        expected: 4 // 4 appointments on 2024-01-16
      },
      {
        name: 'Create Appointment',
        test: async () => {
          const newAppointment = {
            clientName: 'Test Patient',
            medicName: 'Dr. Test',
            displayTreatment: 'Test Treatment',
            date: '2024-01-22T10:00:00',
            duration: 30
          };
          
          const result = await this.apiService.createAppointment(newAppointment);
          return result.success;
        },
        expected: true
      }
    ];

    const results = [];
    
    for (const scenario of scenarios) {
      try {
        const result = await scenario.test();
        const passed = result === scenario.expected;
        
        results.push({
          name: scenario.name,
          passed,
          result,
          expected: scenario.expected
        });

        console.log(`${passed ? '✅' : '❌'} ${scenario.name}: ${result} (expected: ${scenario.expected})`);
      } catch (error) {
        results.push({
          name: scenario.name,
          passed: false,
          error: error.message
        });
        console.error(`❌ ${scenario.name}: ${error.message}`);
      }
    }

    return results;
  }
}

/**
 * Quick test runner
 */
export async function runQuickTest() {
  console.log('🚀 Starting Timeline Data Flow Test...\n');
  
  const test = new TimelineDataFlowTest();
  
  // Run main test
  const mainResults = await test.runTest();
  
  console.log('\n📊 Main Test Results:');
  console.log(`- API Layer: ${mainResults.api?.success ? '✅' : '❌'}`);
  console.log(`- Design Patterns: ${mainResults.designPatterns?.success ? '✅' : '❌'}`);
  console.log(`- Features Layer: ${mainResults.features?.success ? '✅' : '❌'}`);
  console.log(`- Duration: ${mainResults.duration}ms`);
  
  if (mainResults.errors.length > 0) {
    console.log('\n❌ Errors:');
    mainResults.errors.forEach(error => {
      console.log(`- ${error.step}: ${error.error}`);
    });
  }
  
  // Run scenario tests
  console.log('\n🧪 Running Scenario Tests...\n');
  const scenarioResults = await test.runScenarioTests();
  
  const passedScenarios = scenarioResults.filter(r => r.passed).length;
  const totalScenarios = scenarioResults.length;
  
  console.log(`\n📈 Scenario Results: ${passedScenarios}/${totalScenarios} passed`);
  
  return {
    main: mainResults,
    scenarios: scenarioResults
  };
}

// Export test data for direct use
export { dentalTimelineData };

// Auto-run test if this file is executed directly
if (typeof window !== 'undefined' && window.location?.href?.includes('test')) {
  runQuickTest().then(results => {
    console.log('🎉 Test completed!', results);
  });
} 