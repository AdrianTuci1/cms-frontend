/**
 * TimelineService Test Example
 * Demonstrates how to use the TimelineService with proper business and location context
 */

import TimelineService from '../../api/services/TimelineService.js';

/**
 * Example function that shows how to use the TimelineService
 */
export async function testTimelineService() {
  console.log('=== TimelineService Test ===');
  
  // Create a new TimelineService instance
  const timelineService = new TimelineService();
  
  // Business ID și Location ID sunt în localStorage (setate în LocationsPage)
  // Set up test data
  localStorage.setItem('businessId', 'b1');
  localStorage.setItem('locationId', 'loc1');
  console.log('Using localStorage pattern: businessId=b1, locationId=loc1');
  
  try {
    // Test 1: Fetch timeline data
    console.log('1. Fetching timeline data...');
    const timelineData = await timelineService.getTimeline({
      startDate: '2025-08-18',
      endDate: '2025-08-26',
      status: 'scheduled'
    });
    console.log('Timeline data:', timelineData);
    
    // Test 2: Create a new timeline entry
    console.log('\n2. Creating new timeline entry...');
    const newEntry = {
      clientId: 'client-123',
      medicId: 'medic-456',
      serviceId: 'service-789',
      appointmentDate: '2025-08-20T10:00:00Z',
      duration: 60,
      notes: 'Consultație de rutină',
      status: 'scheduled'
    };
    
    const createdEntry = await timelineService.createTimelineEntry(newEntry);
    console.log('Created entry:', createdEntry);
    
    // Test 3: Update a timeline entry
    console.log('\n3. Updating timeline entry...');
    const entryId = createdEntry.id || 'example-entry-id';
    const updatedData = {
      status: 'completed',
      notes: 'Consultație finalizată cu succes'
    };
    
    const updatedEntry = await timelineService.updateTimelineEntry(entryId, updatedData);
    console.log('Updated entry:', updatedEntry);
    
    // Test 4: Delete a timeline entry
    console.log('\n4. Deleting timeline entry...');
    const deleteResult = await timelineService.deleteTimelineEntry(entryId);
    console.log('Delete result:', deleteResult);
    
    console.log('\n=== All tests completed successfully! ===');
    
  } catch (error) {
    console.error('TimelineService test failed:', error.message);
    console.error('Full error:', error);
  }
}

/**
 * Example of how to integrate TimelineService with React components
 */
export function useTimelineServiceExample() {
  // This is an example of how you might use TimelineService in a React component
  
  const fetchTimelineData = async (startDate, endDate) => {
    const timelineService = new TimelineService();
    
    try {
      const data = await timelineService.getTimeline({
        startDate,
        endDate,
        status: 'scheduled'
      });
      
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  const createAppointment = async (appointmentData) => {
    const timelineService = new TimelineService();
    
    try {
      const result = await timelineService.createTimelineEntry(appointmentData);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  return {
    fetchTimelineData,
    createAppointment
  };
}

/**
 * Example of the actual HTTP requests that will be made
 */
export function showRequestExamples() {
  console.log('=== HTTP Request Examples ===');
  
  console.log('\n1. GET Timeline Request:');
  console.log('URL: GET /api/resources/b1-loc1/date-range/');
  console.log('Query Parameters: ?startDate=2025-08-18&endDate=2025-08-26&status=scheduled');
  console.log('Headers:');
  console.log('  X-Resource-Type: timeline');
  console.log('  Authorization: Bearer <token>');
  console.log('  Content-Type: application/json');
  console.log('Note: Business ID (b1) și Location ID (loc1) sunt în URL, nu ca headers');
  
  console.log('\n2. POST Create Timeline Entry:');
  console.log('URL: POST /api/resources/b1-loc1');
  console.log('Headers:');
  console.log('  X-Resource-Type: timeline');
  console.log('  Authorization: Bearer <token>');
  console.log('  Content-Type: application/json');
  console.log('Note: Business ID (b1) și Location ID (loc1) sunt în URL, nu ca headers');
  console.log('Body:');
  console.log(JSON.stringify({
    resourceType: 'timeline',
    operation: 'create',
    data: {
      clientId: 'client-123',
      medicId: 'medic-456',
      serviceId: 'service-789',
      appointmentDate: '2025-08-20T10:00:00Z',
      duration: 60,
      notes: 'Consultație de rutină',
      status: 'scheduled'
    }
  }, null, 2));
  
  console.log('\n3. PUT Update Timeline Entry:');
  console.log('URL: PUT /api/resources/b1-loc1');
  console.log('Headers:');
  console.log('  X-Resource-Type: timeline');
  console.log('  Authorization: Bearer <token>');
  console.log('  Content-Type: application/json');
  console.log('Note: Business ID (b1) și Location ID (loc1) sunt în URL, nu ca headers');
  console.log('Body:');
  console.log(JSON.stringify({
    resourceType: 'timeline',
    operation: 'update',
    resourceId: 'entry-id',
    data: {
      status: 'completed',
      notes: 'Consultație finalizată cu succes'
    }
  }, null, 2));
  
  console.log('\n4. DELETE Timeline Entry:');
  console.log('URL: DELETE /api/resources/b1-loc1');
  console.log('Headers:');
  console.log('  X-Resource-Type: timeline');
  console.log('  Authorization: Bearer <token>');
  console.log('  Content-Type: application/json');
  console.log('Note: Business ID (b1) și Location ID (loc1) sunt în URL, nu ca headers');
  console.log('Body:');
  console.log(JSON.stringify({
    resourceType: 'timeline',
    operation: 'delete',
    resourceId: 'entry-id'
  }, null, 2));
}

// Export for use in other files
export default {
  testTimelineService,
  useTimelineServiceExample,
  showRequestExamples
};
