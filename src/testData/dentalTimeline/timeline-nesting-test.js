/**
 * Timeline Nesting Test
 * 
 * Test to verify that timeline data is not nested and follows the correct structure
 */

import dataSyncManager from '../../design-patterns/data-sync/index.js';
import { getMockData } from '../../api/mockData/index.js';

/**
 * Test timeline data structure
 */
export class TimelineNestingTest {
  constructor() {
    this.results = {
      dental: null,
      gym: null,
      hotel: null,
      errors: []
    };
  }

  /**
   * Test dental timeline data structure
   */
  testDentalTimeline() {
    try {
      console.log('🧪 Testing Dental Timeline Structure...');
      
      // Set business type
      dataSyncManager.setBusinessType('dental');
      
      // Get mock data
      const rawMockData = getMockData('timeline', 'dental');
      console.log('Raw dental mock data structure:', {
        hasReservations: !!rawMockData.reservations,
        reservationsCount: rawMockData.reservations?.length || 0,
        hasStatistics: !!rawMockData.statistics,
        isArray: Array.isArray(rawMockData)
      });
      
      // Get standardized data
      const standardizedData = dataSyncManager.getMockData('timeline');
      console.log('Standardized dental data structure:', {
        isArray: Array.isArray(standardizedData),
        count: standardizedData.length,
        hasNesting: this.checkForNesting(standardizedData),
        sampleItem: standardizedData[0]
      });
      
      this.results.dental = {
        success: true,
        rawStructure: {
          hasReservations: !!rawMockData.reservations,
          reservationsCount: rawMockData.reservations?.length || 0,
          hasStatistics: !!rawMockData.statistics
        },
        standardizedStructure: {
          isArray: Array.isArray(standardizedData),
          count: standardizedData.length,
          hasNesting: this.checkForNesting(standardizedData)
        }
      };
      
      console.log('✅ Dental timeline test completed');
      
    } catch (error) {
      console.error('❌ Dental timeline test failed:', error);
      this.results.dental = { success: false, error: error.message };
      this.results.errors.push({ test: 'dental', error: error.message });
    }
  }

  /**
   * Test gym timeline data structure
   */
  testGymTimeline() {
    try {
      console.log('🧪 Testing Gym Timeline Structure...');
      
      // Set business type
      dataSyncManager.setBusinessType('gym');
      
      // Get mock data
      const rawMockData = getMockData('timeline', 'gym');
      console.log('Raw gym mock data structure:', {
        hasMembers: !!rawMockData.members,
        membersCount: rawMockData.members?.length || 0,
        hasClasses: !!rawMockData.classes,
        classesCount: rawMockData.classes?.length || 0,
        hasOccupancy: !!rawMockData.occupancy,
        isArray: Array.isArray(rawMockData)
      });
      
      // Get standardized data
      const standardizedData = dataSyncManager.getMockData('timeline');
      console.log('Standardized gym data structure:', {
        isArray: Array.isArray(standardizedData),
        count: standardizedData.length,
        hasNesting: this.checkForNesting(standardizedData),
        sampleItem: standardizedData[0]
      });
      
      this.results.gym = {
        success: true,
        rawStructure: {
          hasMembers: !!rawMockData.members,
          membersCount: rawMockData.members?.length || 0,
          hasClasses: !!rawMockData.classes,
          classesCount: rawMockData.classes?.length || 0,
          hasOccupancy: !!rawMockData.occupancy
        },
        standardizedStructure: {
          isArray: Array.isArray(standardizedData),
          count: standardizedData.length,
          hasNesting: this.checkForNesting(standardizedData)
        }
      };
      
      console.log('✅ Gym timeline test completed');
      
    } catch (error) {
      console.error('❌ Gym timeline test failed:', error);
      this.results.gym = { success: false, error: error.message };
      this.results.errors.push({ test: 'gym', error: error.message });
    }
  }

  /**
   * Test hotel timeline data structure
   */
  testHotelTimeline() {
    try {
      console.log('🧪 Testing Hotel Timeline Structure...');
      
      // Set business type
      dataSyncManager.setBusinessType('hotel');
      
      // Get mock data
      const rawMockData = getMockData('timeline', 'hotel');
      console.log('Raw hotel mock data structure:', {
        hasReservations: !!rawMockData.reservations,
        reservationsCount: rawMockData.reservations?.length || 0,
        hasOccupancy: !!rawMockData.occupancy,
        isArray: Array.isArray(rawMockData)
      });
      
      // Get standardized data
      const standardizedData = dataSyncManager.getMockData('timeline');
      console.log('Standardized hotel data structure:', {
        isArray: Array.isArray(standardizedData),
        count: standardizedData.length,
        hasNesting: this.checkForNesting(standardizedData),
        sampleItem: standardizedData[0]
      });
      
      this.results.hotel = {
        success: true,
        rawStructure: {
          hasReservations: !!rawMockData.reservations,
          reservationsCount: rawMockData.reservations?.length || 0,
          hasOccupancy: !!rawMockData.occupancy
        },
        standardizedStructure: {
          isArray: Array.isArray(standardizedData),
          count: standardizedData.length,
          hasNesting: this.checkForNesting(standardizedData)
        }
      };
      
      console.log('✅ Hotel timeline test completed');
      
    } catch (error) {
      console.error('❌ Hotel timeline test failed:', error);
      this.results.hotel = { success: false, error: error.message };
      this.results.errors.push({ test: 'hotel', error: error.message });
    }
  }

  /**
   * Check if data has nesting issues
   */
  checkForNesting(data) {
    if (!Array.isArray(data)) {
      return { hasNesting: true, reason: 'Data is not an array' };
    }
    
    for (const item of data) {
      if (item && typeof item === 'object') {
        // Check for nested arrays that shouldn't be there
        if (item.reservations && Array.isArray(item.reservations)) {
          return { hasNesting: true, reason: 'Found nested reservations array' };
        }
        if (item.members && Array.isArray(item.members)) {
          return { hasNesting: true, reason: 'Found nested members array' };
        }
        if (item.classes && Array.isArray(item.classes)) {
          return { hasNesting: true, reason: 'Found nested classes array' };
        }
        if (item.data && Array.isArray(item.data)) {
          return { hasNesting: true, reason: 'Found nested data array' };
        }
      }
    }
    
    return { hasNesting: false, reason: 'No nesting detected' };
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting Timeline Nesting Tests...\n');
    
    // Initialize DataSyncManager
    await dataSyncManager.waitForInitialization();
    
    // Run tests
    this.testDentalTimeline();
    this.testGymTimeline();
    this.testHotelTimeline();
    
    // Print summary
    this.printSummary();
    
    return this.results;
  }

  /**
   * Print test summary
   */
  printSummary() {
    console.log('\n📊 Timeline Nesting Test Summary:');
    console.log('=====================================');
    
    const businessTypes = ['dental', 'gym', 'hotel'];
    
    businessTypes.forEach(type => {
      const result = this.results[type];
      if (result && result.success) {
        const nesting = result.standardizedStructure.hasNesting;
        console.log(`${type.toUpperCase()}: ${nesting ? '❌ HAS NESTING' : '✅ NO NESTING'} (${result.standardizedStructure.count} items)`);
      } else {
        console.log(`${type.toUpperCase()}: ❌ TEST FAILED`);
      }
    });
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.results.errors.forEach(error => {
        console.log(`  - ${error.test}: ${error.error}`);
      });
    }
    
    console.log('\n🎯 Test completed!');
  }
}

// Export for use in other files
export default TimelineNestingTest; 