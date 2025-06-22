import BaseApiService from './BaseApiService.js';
import { homeSectionClinic } from '../../../data/dataModel/homeSectionData.js';
import { gymMembersData, gymClassesData, gymOccupancyData } from '../../../data/dataModel/gymData.js';
import { hotelReservationsData } from '../../../data/dataModel/hotelData.js';

/**
 * Calendar Service
 * Handles calendar-related API operations with business-specific data types
 */
class CalendarService extends BaseApiService {
  constructor(apiClient, tenantId, locationId) {
    super(apiClient, tenantId, locationId);
    this.calendarDataType = apiClient.getStrategy().getCalendarDataType();
  }

  /**
   * Get calendar data based on business type
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Calendar data
   */
  async getCalendarData(options = {}) {
    switch (this.calendarDataType) {
      case 'appointments':
        return this.getAppointments(options);
      case 'today':
        return this.getTodayData(options);
      case 'reservations':
        return this.getReservations(options);
      default:
        throw new Error(`Unknown calendar data type: ${this.calendarDataType}`);
    }
  }

  /**
   * Get appointments (Dental Clinic)
   * @param {Object} dateRange - Date range parameters
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Appointments
   */
  async getAppointments(dateRange = {}, options = {}) {
    // Default to weekly view for dental clinic
    if (!dateRange.startDate || !dateRange.endDate) {
      const weekRange = this.getWeekRange();
      dateRange = { ...dateRange, ...weekRange };
    }
    
    return this.getWithDateRange('calendar', dateRange, options);
  }

  /**
   * Get today's data (Gym) - includes members, classes, occupancy
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Today's data with multiple components
   */
  async getTodayData(options = {}) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    // For gym, we need multiple components
    const [members, classes, occupancy] = await Promise.all([
      this.getMembers({ date: dateStr, ...options }),
      this.getClasses({ date: dateStr, ...options }),
      this.getOccupancy({ date: dateStr, ...options })
    ]);

    return {
      date: dateStr,
      members,
      classes,
      occupancy,
      type: 'today'
    };
  }

  /**
   * Get reservations (Hotel)
   * @param {Object} dateRange - Date range parameters
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Reservations
   */
  async getReservations(dateRange = {}, options = {}) {
    // Default to this week for hotel
    if (!dateRange.startDate || !dateRange.endDate) {
      const weekRange = this.getWeekRange();
      dateRange = { ...dateRange, ...weekRange };
    }
    
    return this.getWithDateRange('calendar', dateRange, options);
  }

  /**
   * Get members for gym
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Members
   */
  async getMembers(options = {}) {
    return this.get('members', options);
  }

  /**
   * Get classes for gym
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Classes
   */
  async getClasses(options = {}) {
    return this.get('classes', options);
  }

  /**
   * Get occupancy for gym
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Occupancy data
   */
  async getOccupancy(options = {}) {
    return this.get('occupancy', options);
  }

  /**
   * Get calendar events for a date range (generic)
   * @param {Object} dateRange - Date range parameters
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Calendar events
   */
  async getEvents(dateRange, options = {}) {
    return this.getWithDateRange('calendar', dateRange, options);
  }

  /**
   * Get calendar events for today
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Today's events
   */
  async getTodayEvents(options = {}) {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = startDate;
    
    return this.getEvents({ startDate, endDate }, options);
  }

  /**
   * Get calendar events for this week
   * @param {Object} options - Request options
   * @returns {Promise<Array>} This week's events
   */
  async getWeekEvents(options = {}) {
    const weekRange = this.getWeekRange();
    return this.getEvents(weekRange, options);
  }

  /**
   * Get calendar events for this month
   * @param {Object} options - Request options
   * @returns {Promise<Array>} This month's events
   */
  async getMonthEvents(options = {}) {
    const monthRange = this.getMonthRange();
    return this.getEvents(monthRange, options);
  }

  /**
   * Create a new calendar event
   * @param {Object} eventData - Event data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Created event
   */
  async createEvent(eventData, options = {}) {
    return this.create('calendar', eventData, options);
  }

  /**
   * Update an existing calendar event
   * @param {number} eventId - Event ID
   * @param {Object} eventData - Updated event data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Updated event
   */
  async updateEvent(eventId, eventData, options = {}) {
    return this.update('calendar', eventId, eventData, options);
  }

  /**
   * Delete a calendar event
   * @param {number} eventId - Event ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Deletion result
   */
  async deleteEvent(eventId, options = {}) {
    return this.remove('calendar', eventId, options);
  }

  /**
   * Get event by ID
   * @param {number} eventId - Event ID
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Event data
   */
  async getEvent(eventId, options = {}) {
    return this.getById('calendar', eventId, options);
  }

  /**
   * Search events
   * @param {string} searchTerm - Search term
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Search results
   */
  async searchEvents(searchTerm, options = {}) {
    return this.search('calendar', searchTerm, options);
  }

  /**
   * Get events by status
   * @param {string} status - Event status
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Events with specified status
   */
  async getEventsByStatus(status, options = {}) {
    const params = { status, ...options.params };
    return this.get('calendar', { ...options, params });
  }

  /**
   * Get events by employee
   * @param {number} employeeId - Employee ID
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Events for specified employee
   */
  async getEventsByEmployee(employeeId, options = {}) {
    const params = { employeeId, ...options.params };
    return this.get('calendar', { ...options, params });
  }

  /**
   * Get events by client
   * @param {number} clientId - Client ID
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Events for specified client
   */
  async getEventsByClient(clientId, options = {}) {
    const params = { clientId, ...options.params };
    return this.get('calendar', { ...options, params });
  }

  /**
   * Bulk update events
   * @param {Array} eventUpdates - Array of event updates
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Update results
   */
  async bulkUpdateEvents(eventUpdates, options = {}) {
    return this.post('calendar/bulk-update', { 
      ...options, 
      body: { events: eventUpdates } 
    });
  }

  /**
   * Get calendar statistics
   * @param {Object} dateRange - Date range parameters
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Calendar statistics
   */
  async getStatistics(dateRange, options = {}) {
    const params = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      ...options.params
    };
    
    return this.get('calendar/statistics', { ...options, params });
  }

  /**
   * Get week date range
   * @returns {Object} Week date range
   */
  getWeekRange() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0]
    };
  }

  /**
   * Get month date range
   * @returns {Object} Month date range
   */
  getMonthRange() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0]
    };
  }

  /**
   * Get calendar data type
   * @returns {string} Calendar data type
   */
  getCalendarDataType() {
    return this.calendarDataType;
  }

  /**
   * Get demo data for calendar
   * @param {string} endpointKey - Endpoint key
   * @returns {Object} Demo data
   */
  getDemoData(endpointKey) {
    const demoDataMap = this.apiClient.getStrategy().getDemoData();
    
    switch (endpointKey) {
      case 'calendar':
        switch (this.calendarDataType) {
          case 'appointments':
            return homeSectionClinic;
          case 'today':
            return {
              members: gymMembersData,
              classes: gymClassesData,
              occupancy: gymOccupancyData
            };
          case 'reservations':
            return hotelReservationsData;
          default:
            return super.getDemoData(endpointKey);
        }
      case 'members':
        return gymMembersData;
      case 'classes':
        return gymClassesData;
      case 'occupancy':
        return gymOccupancyData;
      default:
        return super.getDemoData(endpointKey);
    }
  }

  /**
   * Get validation rules for calendar events
   * @returns {Object} Validation rules
   */
  getEventValidationRules() {
    return this.getValidationRules('calendar');
  }

  /**
   * Get default values for calendar events
   * @returns {Object} Default values
   */
  getEventDefaultValues() {
    return this.getDefaultValues('calendar');
  }

  /**
   * Get data structure for calendar events
   * @returns {Object} Data structure
   */
  getEventDataStructure() {
    return this.getDataStructure('calendar');
  }
}

export default CalendarService; 