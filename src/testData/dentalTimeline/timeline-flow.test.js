import { describe, test, expect, beforeEach } from 'vitest';
import {
  TimelineDataFlowTest,
  TestDataProcessor,
  TestTimelineStore,
  dentalTimelineData,
  MockTimelineService
} from './timeline-test-utils';
import dataSyncManager from '../../design-patterns/data-sync/index.js';
import { getMockData } from '../../api/mockData/index.js';

// Main integration/data flow test
describe('Dental Timeline Data Flow', () => {
  let testRunner;

  beforeEach(() => {
    testRunner = new TimelineDataFlowTest();
  });

  test('should complete full data flow successfully', async () => {
    const results = await testRunner.runTest();
    expect(results.api.success).toBe(true);
    expect(results.designPatterns.success).toBe(true);
    expect(results.features.success).toBe(true);
    expect(results.api.appointmentsCount).toBe(23);
    expect(results.designPatterns.processedCount).toBe(23);
    expect(results.features.totalAppointments).toBe(23);
    expect(results.duration).toBeLessThan(2000);
  });

  test('should filter appointments by medic correctly', async () => {
    const scenarioResults = await testRunner.runScenarioTests();
    const medicFilterTest = scenarioResults.find(s => s.name === 'Filter by Medic');
    expect(medicFilterTest.passed).toBe(true);
    expect(medicFilterTest.result).toBe(12); // Dr. Elena Ionescu has 12 appointments
  });

  test('should filter appointments by date correctly', async () => {
    const scenarioResults = await testRunner.runScenarioTests();
    const dateFilterTest = scenarioResults.find(s => s.name === 'Filter by Date');
    expect(dateFilterTest.passed).toBe(true);
    expect(dateFilterTest.result).toBe(4); // 4 appointments on 2024-01-16
  });

  test('should create a new appointment', async () => {
    const scenarioResults = await testRunner.runScenarioTests();
    const createTest = scenarioResults.find(s => s.name === 'Create Appointment');
    expect(createTest.passed).toBe(true);
    expect(createTest.result).toBe(true);
  });
});

// Unit-like test for the processor

describe('TestDataProcessor', () => {
  test('should add type and businessType to each reservation', () => {
    const processor = new TestDataProcessor();
    const processed = processor.processTimelineData(dentalTimelineData.response.data);
    expect(processed.reservations.every(r => r.type === 'timeline')).toBe(true);
    expect(processed.reservations.every(r => r.businessType === 'dental')).toBe(true);
  });
});

// Unit-like test for the store

describe('TestTimelineStore', () => {
  test('should filter displayed appointments by medic', () => {
    const processor = new TestDataProcessor();
    const processed = processor.processTimelineData(dentalTimelineData.response.data);
    const store = new TestTimelineStore();
    store.loadData(processed);
    store.setSelectedMedicId(1);
    store.setAllAppointments(false);
    const { displayedAppointments } = store.getAppointments();
    expect(displayedAppointments.length).toBe(12); // Dr. Elena Ionescu has 12 appointments
  });

  test('should count appointments for a specific date', () => {
    const processor = new TestDataProcessor();
    const processed = processor.processTimelineData(dentalTimelineData.response.data);
    const store = new TestTimelineStore();
    store.loadData(processed);
    const { getAppointmentsCountForDate } = store.getAppointments();
    const count = getAppointmentsCountForDate(new Date('2024-01-16'));
    expect(count).toBe(4);
  });

  test('should filter appointments for Dr. Alexandru Dumitrescu', () => {
    const processor = new TestDataProcessor();
    const processed = processor.processTimelineData(dentalTimelineData.response.data);
    const store = new TestTimelineStore();
    store.loadData(processed);
    store.setSelectedMedicId(2);
    store.setAllAppointments(false);
    const { displayedAppointments } = store.getAppointments();
    expect(displayedAppointments.length).toBe(11); // Dr. Alexandru Dumitrescu has 11 appointments
  });
});

// Test the complete data flow from API → Design Patterns → Features
describe('Timeline Data Flow Tests', () => {
  let apiService;
  let dataProcessor;
  let store;

  beforeEach(() => {
    apiService = new MockTimelineService();
    dataProcessor = new TestDataProcessor();
    store = new TestTimelineStore();
  });

  describe('Complete Data Flow', () => {
    test('should flow data from DataSyncManager to useDentalTimelineWithAPI', async () => {
      // Set business type
      dataSyncManager.setBusinessType('dental');
      
      // Get mock data from DataSyncManager
      const mockData = getMockData('timeline', 'dental');
      console.log('Mock data structure:', {
        hasReservations: !!mockData.reservations,
        reservationsCount: mockData.reservations?.length || 0,
        isArray: Array.isArray(mockData)
      });
      
      // Get standardized data from DataSyncManager
      const standardizedData = dataSyncManager.standardizeTimelineData(mockData);
      console.log('Standardized data structure:', {
        isArray: Array.isArray(standardizedData),
        count: standardizedData.length,
        sampleItem: standardizedData[0]
      });
      
      // Simulate what useDataSync would do - wrap array in reservations
      const timelineDataForHook = { reservations: standardizedData };
      console.log('Timeline data for hook structure:', {
        hasReservations: !!timelineDataForHook.reservations,
        reservationsCount: timelineDataForHook.reservations?.length || 0
      });
      
      // Simulate what useDentalTimelineWithAPI would do
      const appointments = timelineDataForHook?.reservations || [];
      console.log('Appointments extracted:', {
        count: appointments.length,
        sampleAppointment: appointments[0]
      });
      
      // Verify the data flow
      expect(mockData).toHaveProperty('reservations');
      expect(Array.isArray(mockData.reservations)).toBe(true);
      expect(mockData.reservations.length).toBeGreaterThan(0);
      
      expect(Array.isArray(standardizedData)).toBe(true);
      expect(standardizedData.length).toBeGreaterThan(0);
      
      expect(timelineDataForHook).toHaveProperty('reservations');
      expect(Array.isArray(timelineDataForHook.reservations)).toBe(true);
      expect(timelineDataForHook.reservations.length).toBeGreaterThan(0);
      
      expect(Array.isArray(appointments)).toBe(true);
      expect(appointments.length).toBeGreaterThan(0);
      
      // Verify appointment structure
      const firstAppointment = appointments[0];
      expect(firstAppointment).toHaveProperty('id');
      expect(firstAppointment).toHaveProperty('clientName');
      expect(firstAppointment).toHaveProperty('medicName');
      expect(firstAppointment).toHaveProperty('displayTreatment');
      expect(firstAppointment).toHaveProperty('date');
      expect(firstAppointment).toHaveProperty('duration');
      expect(firstAppointment).toHaveProperty('status');
      expect(firstAppointment).toHaveProperty('color');
      expect(firstAppointment).toHaveProperty('treatments');
    });
  });
}); 