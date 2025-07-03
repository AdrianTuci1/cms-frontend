/**
 * Timeline Nesting Test - Vitest
 * 
 * Test to verify that timeline data is not nested and follows the correct structure
 */

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import dataSyncManager from '../../design-patterns/data-sync/index.js';
import { getMockData } from '../../api/mockData/index.js';

describe('Timeline Nesting Tests', () => {
  beforeAll(async () => {
    // Initialize DataSyncManager
    await dataSyncManager.waitForInitialization();
  });

  describe('Dental Timeline', () => {
    beforeEach(() => {
      dataSyncManager.setBusinessType('dental');
    });

    it('should return flat array structure for dental timeline', () => {
      // Get raw mock data
      const rawMockData = getMockData('timeline', 'dental');
      
      // Verify raw data has nested structure
      expect(rawMockData).toHaveProperty('reservations');
      expect(rawMockData).toHaveProperty('statistics');
      expect(Array.isArray(rawMockData.reservations)).toBe(true);
      expect(rawMockData.reservations.length).toBeGreaterThan(0);
      
      // Get standardized data
      const standardizedData = dataSyncManager.getMockData('timeline');
      
      // Verify standardized data is a flat array
      expect(Array.isArray(standardizedData)).toBe(true);
      expect(standardizedData.length).toBeGreaterThan(0);
      
      // Verify no nesting in standardized data
      const hasNesting = standardizedData.some(item => 
        item && typeof item === 'object' && (
          Array.isArray(item.reservations) ||
          Array.isArray(item.members) ||
          Array.isArray(item.classes) ||
          Array.isArray(item.data)
        )
      );
      
      expect(hasNesting).toBe(false);
      
      // Verify each item has proper structure
      standardizedData.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(typeof item.id).toBe('string').or(expect(typeof item.id).toBe('number'));
      });
    });

    it('should include both reservations and statistics in flat array', () => {
      const standardizedData = dataSyncManager.getMockData('timeline');
      
      // Should have reservations
      const reservations = standardizedData.filter(item => 
        item.treatmentId || item.displayTreatment
      );
      expect(reservations.length).toBeGreaterThan(0);
      
      // Should have statistics
      const statistics = standardizedData.filter(item => 
        item.type === 'statistics' || item.totalAppointments
      );
      expect(statistics.length).toBeGreaterThan(0);
    });
  });

  describe('Gym Timeline', () => {
    beforeEach(() => {
      dataSyncManager.setBusinessType('gym');
    });

    it('should return flat array structure for gym timeline', () => {
      // Get raw mock data
      const rawMockData = getMockData('timeline', 'gym');
      
      // Verify raw data has nested structure
      expect(rawMockData).toHaveProperty('members');
      expect(rawMockData).toHaveProperty('classes');
      expect(rawMockData).toHaveProperty('occupancy');
      expect(Array.isArray(rawMockData.members)).toBe(true);
      expect(Array.isArray(rawMockData.classes)).toBe(true);
      
      // Get standardized data
      const standardizedData = dataSyncManager.getMockData('timeline');
      
      // Verify standardized data is a flat array
      expect(Array.isArray(standardizedData)).toBe(true);
      expect(standardizedData.length).toBeGreaterThan(0);
      
      // Verify no nesting in standardized data
      const hasNesting = standardizedData.some(item => 
        item && typeof item === 'object' && (
          Array.isArray(item.reservations) ||
          Array.isArray(item.members) ||
          Array.isArray(item.classes) ||
          Array.isArray(item.data)
        )
      );
      
      expect(hasNesting).toBe(false);
    });

    it('should include members, classes, and occupancy in flat array', () => {
      const standardizedData = dataSyncManager.getMockData('timeline');
      
      // Should have members
      const members = standardizedData.filter(item => 
        item.type === 'member' || item.membershipType
      );
      expect(members.length).toBeGreaterThan(0);
      
      // Should have classes
      const classes = standardizedData.filter(item => 
        item.type === 'class' || item.teacher
      );
      expect(classes.length).toBeGreaterThan(0);
      
      // Should have occupancy
      const occupancy = standardizedData.filter(item => 
        item.type === 'occupancy' || item.current !== undefined
      );
      expect(occupancy.length).toBeGreaterThan(0);
    });
  });

  describe('Hotel Timeline', () => {
    beforeEach(() => {
      dataSyncManager.setBusinessType('hotel');
    });

    it('should return flat array structure for hotel timeline', () => {
      // Get raw mock data
      const rawMockData = getMockData('timeline', 'hotel');
      
      // Verify raw data has nested structure
      expect(rawMockData).toHaveProperty('reservations');
      expect(rawMockData).toHaveProperty('occupancy');
      expect(Array.isArray(rawMockData.reservations)).toBe(true);
      expect(rawMockData.reservations.length).toBeGreaterThan(0);
      
      // Get standardized data
      const standardizedData = dataSyncManager.getMockData('timeline');
      
      // Verify standardized data is a flat array
      expect(Array.isArray(standardizedData)).toBe(true);
      expect(standardizedData.length).toBeGreaterThan(0);
      
      // Verify no nesting in standardized data
      const hasNesting = standardizedData.some(item => 
        item && typeof item === 'object' && (
          Array.isArray(item.reservations) ||
          Array.isArray(item.members) ||
          Array.isArray(item.classes) ||
          Array.isArray(item.data)
        )
      );
      
      expect(hasNesting).toBe(false);
    });

    it('should include reservations and occupancy in flat array', () => {
      const standardizedData = dataSyncManager.getMockData('timeline');
      
      // Should have reservations
      const reservations = standardizedData.filter(item => 
        item.type === 'reservation' || item.guestName
      );
      expect(reservations.length).toBeGreaterThan(0);
      
      // Should have occupancy
      const occupancy = standardizedData.filter(item => 
        item.type === 'occupancy' || item.occupied !== undefined
      );
      expect(occupancy.length).toBeGreaterThan(0);
    });
  });

  describe('Data Processing Consistency', () => {
    it('should process timeline data consistently across all business types', () => {
      const businessTypes = ['dental', 'gym', 'hotel'];
      
      businessTypes.forEach(businessType => {
        dataSyncManager.setBusinessType(businessType);
        const standardizedData = dataSyncManager.getMockData('timeline');
        
        // All should be arrays
        expect(Array.isArray(standardizedData)).toBe(true);
        
        // All should have items
        expect(standardizedData.length).toBeGreaterThan(0);
        
        // All should be flat (no nesting)
        const hasNesting = standardizedData.some(item => 
          item && typeof item === 'object' && (
            Array.isArray(item.reservations) ||
            Array.isArray(item.members) ||
            Array.isArray(item.classes) ||
            Array.isArray(item.data)
          )
        );
        
        expect(hasNesting).toBe(false);
      });
    });

    it('should add proper metadata to timeline items', () => {
      dataSyncManager.setBusinessType('dental');
      const standardizedData = dataSyncManager.getMockData('timeline');
      
      // Check that items have proper metadata
      standardizedData.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(typeof item.id).toBe('string').or(expect(typeof item.id).toBe('number'));
        
        // Should have type information
        if (item.type === 'statistics') {
          expect(item).toHaveProperty('timelineType');
          expect(item.timelineType).toBe('statistics');
        } else {
          // Regular timeline items should have treatment info
          expect(item).toHaveProperty('treatmentId');
          expect(item).toHaveProperty('displayTreatment');
        }
      });
    });
  });

  describe('Database Storage Compatibility', () => {
    it('should store timeline data without nesting in IndexedDB', async () => {
      dataSyncManager.setBusinessType('dental');
      const standardizedData = dataSyncManager.getMockData('timeline');
      
      // Process data through DataProcessor
      const dataProcessor = dataSyncManager.getDataProcessor();
      const processedData = dataProcessor.processTimelineData(standardizedData);
      
      // Verify processed data is still flat
      expect(Array.isArray(processedData)).toBe(true);
      
      // Verify no nesting
      const hasNesting = processedData.some(item => 
        item && typeof item === 'object' && (
          Array.isArray(item.reservations) ||
          Array.isArray(item.members) ||
          Array.isArray(item.classes) ||
          Array.isArray(item.data)
        )
      );
      
      expect(hasNesting).toBe(false);
      
      // Verify metadata was added
      processedData.forEach(item => {
        expect(item).toHaveProperty('type');
        expect(item.type).toBe('timeline');
        expect(item).toHaveProperty('businessType');
        expect(item.businessType).toBe('dental');
        expect(item).toHaveProperty('processedAt');
      });
    });
  });
}); 