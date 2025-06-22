import { API_ENDPOINTS } from '../types.js';

/**
 * Abstract Business Strategy using Strategy Pattern
 * Defines the interface for different business types
 */
class BusinessStrategy {
  constructor() {
    if (this.constructor === BusinessStrategy) {
      throw new Error('BusinessStrategy is an abstract class and cannot be instantiated');
    }
  }

  /**
   * Get business-specific endpoints
   * @returns {Object} Endpoints configuration
   */
  getEndpoints() {
    throw new Error('getEndpoints() must be implemented by subclass');
  }

  /**
   * Get business-specific data structure
   * @returns {Object} Data structure configuration
   */
  getDataStructure() {
    throw new Error('getDataStructure() must be implemented by subclass');
  }

  /**
   * Get calendar data type for this business
   * @returns {string} Calendar data type
   */
  getCalendarDataType() {
    throw new Error('getCalendarDataType() must be implemented by subclass');
  }

  /**
   * Get clients data type for this business
   * @returns {string} Clients data type
   */
  getClientsDataType() {
    throw new Error('getClientsDataType() must be implemented by subclass');
  }

  /**
   * Get services data type for this business
   * @returns {string} Services data type
   */
  getServicesDataType() {
    throw new Error('getServicesDataType() must be implemented by subclass');
  }

  /**
   * Get history data type for this business
   * @returns {string} History data type
   */

  /**
   * Transform API response to business-specific format
   * @param {*} data - Raw API data
   * @returns {*} Transformed data
   */
  transformResponse(data) {
    return data; // Default implementation returns data as-is
  }

  /**
   * Transform request data to API format
   * @param {*} data - Business data
   * @returns {*} API-formatted data
   */
  transformRequest(data) {
    return data; // Default implementation returns data as-is
  }

  /**
   * Get business-specific validation rules
   * @returns {Object} Validation rules
   */
  getValidationRules() {
    return {}; // Default empty validation rules
  }

  /**
   * Get business-specific default values
   * @returns {Object} Default values
   */
  getDefaultValues() {
    return {}; // Default empty default values
  }

  /**
   * Get demo data for this business type
   * @returns {Object} Demo data
   */
  getDemoData() {
    return {}; // Default empty demo data
  }
}

/**
 * Dental Clinic Business Strategy
 */
export class DentalClinicStrategy extends BusinessStrategy {
  getEndpoints() {
    return {
      calendar: `${API_ENDPOINTS.CALENDAR}`,
      clients: `${API_ENDPOINTS.CLIENTS}`,
      treatments: `${API_ENDPOINTS.TREATMENTS}`,
      employees: `${API_ENDPOINTS.EMPLOYEES}`,
      stocks: `${API_ENDPOINTS.STOCKS}`,
      invoices: `${API_ENDPOINTS.INVOICES}`,
      history: `${API_ENDPOINTS.HISTORY}`,
      reports: `${API_ENDPOINTS.REPORTS}`,
    };
  }

  getDataStructure() {
    return {
      calendar: {
        entityType: 'CalendarEvent',
        dataType: 'appointments',
        fields: ['id', 'patientId', 'patientName', 'medicId', 'medicName', 'date', 'duration', 'status', 'initialTreatment', 'color'],
        statuses: ['scheduled', 'done', 'missed', 'upcoming', 'notpaid'],
        defaultView: 'weekly'
      },
      clients: {
        entityType: 'Client',
        dataType: 'patients',
        fields: ['id', 'name', 'email', 'phone', 'avatar', 'previousAppointment', 'nextAppointment'],
        statuses: ['active', 'inactive'],
        pagination: true
      },
      treatments: {
        entityType: 'Treatment',
        dataType: 'treatments',
        fields: ['id', 'name', 'price', 'duration', 'category', 'color', 'components'],
        statuses: ['active', 'inactive']
      },
      history: {
        entityType: 'HistoryItem',
        dataType: 'appointments',
        fields: ['id', 'date', 'hour', 'initiatedBy', 'description', 'action', 'type', 'status', 'revertable'],
        types: ['check-out', 'problem', 'cleaning', 'deleted', 'created', 'updated', 'login', 'logout', 'other'],
        statuses: ['success', 'failed', 'pending'],
        pagination: true,
        filtering: true,
        sorting: true
      }
    };
  }

  getCalendarDataType() {
    return 'appointments';
  }

  getClientsDataType() {
    return 'patients';
  }

  getServicesDataType() {
    return 'treatments';
  }


  transformResponse(data) {
    // Transform calendar events (appointments)
    if (data.calendar && Array.isArray(data.calendar)) {
      data.calendar = data.calendar.map(event => ({
        ...event,
        date: new Date(event.date),
        duration: parseInt(event.duration) || 30
      }));
    }

    // Transform treatments
    if (data.treatments && Array.isArray(data.treatments)) {
      data.treatments = data.treatments.map(treatment => ({
        ...treatment,
        price: parseFloat(treatment.price) || 0,
        duration: parseInt(treatment.duration) || 30
      }));
    }

    return data;
  }

  getValidationRules() {
    return {
      calendar: {
        patientName: { required: true, minLength: 2 },
        date: { required: true, type: 'date' },
        duration: { required: true, min: 15, max: 480 }
      },
      treatments: {
        name: { required: true, minLength: 2 },
        price: { required: true, min: 0 },
        duration: { required: true, min: 15 }
      }
    };
  }

  getDefaultValues() {
    return {
      calendar: {
        duration: 30,
        status: 'scheduled',
        color: '#1976d2'
      },
      treatments: {
        duration: 30,
        status: 'active',
        color: '#4CAF50'
      }
    };
  }

  getDemoData() {
    return {
      calendar: 'homeSectionClinic',
      clients: 'clientsSectionClinic',
      treatments: 'treatmentsSectionClinic'
    };
  }
}

/**
 * Gym Business Strategy
 */
export class GymStrategy extends BusinessStrategy {
  getEndpoints() {
    return {
      calendar: `${API_ENDPOINTS.CALENDAR}`,
      clients: `${API_ENDPOINTS.CLIENTS}`,
      packages: `${API_ENDPOINTS.PACKAGES}`,
      employees: `${API_ENDPOINTS.EMPLOYEES}`,
      stocks: `${API_ENDPOINTS.STOCKS}`,
      invoices: `${API_ENDPOINTS.INVOICES}`,
      history: `${API_ENDPOINTS.HISTORY}`,
      reports: `${API_ENDPOINTS.REPORTS}`,
    };
  }

  getDataStructure() {
    return {
      calendar: {
        entityType: 'CalendarEvent',
        dataType: 'today',
        fields: ['id', 'memberId', 'memberName', 'trainerId', 'trainerName', 'date', 'duration', 'status', 'sessionType', 'color'],
        statuses: ['scheduled', 'done', 'missed', 'upcoming', 'cancelled'],
        defaultView: 'today',
        components: ['members', 'classes', 'occupancy']
      },
      clients: {
        entityType: 'Client',
        dataType: 'members',
        fields: ['id', 'name', 'email', 'phone', 'avatar', 'membershipType', 'membershipExpiry', 'trainerId', 'trainerName'],
        statuses: ['active', 'inactive', 'expired'],
        pagination: true
      },
      packages: {
        entityType: 'Package',
        dataType: 'packages',
        fields: ['id', 'name', 'price', 'duration', 'category', 'color', 'features'],
        statuses: ['active', 'inactive']
      },
      history: {
        entityType: 'HistoryItem',
        dataType: 'memberships',
        fields: ['id', 'date', 'hour', 'initiatedBy', 'description', 'action', 'type', 'status', 'revertable'],
        types: ['membership_created', 'membership_renewed', 'membership_expired', 'membership_cancelled', 'check_in', 'check_out', 'training_session', 'payment', 'other'],
        statuses: ['success', 'failed', 'pending'],
        pagination: true,
        filtering: true,
        sorting: true
      }
    };
  }

  getCalendarDataType() {
    return 'today';
  }

  getClientsDataType() {
    return 'members';
  }

  getServicesDataType() {
    return 'packages';
  }


  transformResponse(data) {
    // Transform calendar events for gym (today view with multiple components)
    if (data.calendar && Array.isArray(data.calendar)) {
      data.calendar = data.calendar.map(event => ({
        ...event,
        date: new Date(event.date),
        duration: parseInt(event.duration) || 60,
        sessionType: event.sessionType || 'training'
      }));
    }

    // Transform members
    if (data.members && Array.isArray(data.members)) {
      data.members = data.members.map(member => ({
        ...member,
        membershipExpiry: new Date(member.membershipExpiry),
        joinDate: new Date(member.joinDate),
        lastVisit: member.lastVisit ? new Date(member.lastVisit) : null
      }));
    }

    // Transform classes
    if (data.classes && Array.isArray(data.classes)) {
      data.classes = data.classes.map(cls => ({
        ...cls,
        date: new Date(cls.date),
        duration: parseInt(cls.duration) || 60
      }));
    }

    // Transform occupancy
    if (data.occupancy && Array.isArray(data.occupancy)) {
      data.occupancy = data.occupancy.map(occ => ({
        ...occ,
        date: new Date(occ.date),
        percentage: parseFloat(occ.percentage) || 0
      }));
    }

    // Transform packages
    if (data.packages && Array.isArray(data.packages)) {
      data.packages = data.packages.map(pkg => ({
        ...pkg,
        price: parseFloat(pkg.price) || 0,
        duration: parseInt(pkg.duration) || 30
      }));
    }

    return data;
  }

  getValidationRules() {
    return {
      calendar: {
        memberName: { required: true, minLength: 2 },
        date: { required: true, type: 'date' },
        duration: { required: true, min: 30, max: 180 }
      },
      packages: {
        name: { required: true, minLength: 2 },
        price: { required: true, min: 0 },
        features: { required: true, minLength: 1 }
      }
    };
  }

  getDefaultValues() {
    return {
      calendar: {
        duration: 60,
        status: 'scheduled',
        sessionType: 'training',
        color: '#FF9800'
      },
      packages: {
        duration: 30,
        status: 'active',
        color: '#9C27B0'
      }
    };
  }

  getDemoData() {
    return {
      calendar: 'gymMembersData',
      clients: 'gymMembersData',
      packages: 'gymPackagesData',
      classes: 'gymClassesData',
      occupancy: 'gymOccupancyData'
    };
  }
}

/**
 * Hotel Business Strategy
 */
export class HotelStrategy extends BusinessStrategy {
  getEndpoints() {
    return {
      calendar: `${API_ENDPOINTS.CALENDAR}`,
      clients: `${API_ENDPOINTS.CLIENTS}`,
      rooms: `${API_ENDPOINTS.ROOMS}`,
      employees: `${API_ENDPOINTS.EMPLOYEES}`,
      stocks: `${API_ENDPOINTS.STOCKS}`,
      invoices: `${API_ENDPOINTS.INVOICES}`,
      history: `${API_ENDPOINTS.HISTORY}`,
      reports: `${API_ENDPOINTS.REPORTS}`,
    };
  }

  getDataStructure() {
    return {
      calendar: {
        entityType: 'CalendarEvent',
        dataType: 'reservations',
        fields: ['id', 'guestId', 'guestName', 'roomId', 'roomNumber', 'checkIn', 'checkOut', 'status', 'roomType', 'color'],
        statuses: ['confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'],
        defaultView: 'monthly'
      },
      clients: {
        entityType: 'Client',
        dataType: 'guests',
        fields: ['id', 'name', 'email', 'phone', 'avatar', 'loyaltyLevel', 'preferences', 'lastStay'],
        statuses: ['active', 'inactive'],
        pagination: true
      },
      rooms: {
        entityType: 'Room',
        dataType: 'rooms',
        fields: ['id', 'number', 'type', 'capacity', 'price', 'status', 'amenities'],
        statuses: ['available', 'occupied', 'maintenance', 'reserved']
      },
      history: {
        entityType: 'HistoryItem',
        dataType: 'reservations',
        fields: ['id', 'date', 'hour', 'initiatedBy', 'description', 'action', 'type', 'status', 'revertable'],
        types: ['check_in', 'check_out', 'reservation_created', 'reservation_cancelled', 'room_cleaning', 'maintenance', 'payment', 'problem', 'other'],
        statuses: ['success', 'failed', 'pending'],
        pagination: true,
        filtering: true,
        sorting: true
      }
    };
  }

  getCalendarDataType() {
    return 'reservations';
  }

  getClientsDataType() {
    return 'guests';
  }

  getServicesDataType() {
    return 'rooms';
  }


  transformResponse(data) {
    // Transform calendar events for hotel (reservations)
    if (data.calendar && Array.isArray(data.calendar)) {
      data.calendar = data.calendar.map(event => ({
        ...event,
        date: new Date(event.date),
        duration: parseInt(event.duration) || 1440, // 24 hours in minutes
        reservationType: event.reservationType || 'overnight'
      }));
    }

    // Transform guests
    if (data.guests && Array.isArray(data.guests)) {
      data.guests = data.guests.map(guest => ({
        ...guest,
        lastStay: guest.lastStay ? new Date(guest.lastStay) : null,
        currentReservation: guest.currentReservation ? {
          ...guest.currentReservation,
          checkIn: new Date(guest.currentReservation.checkIn),
          checkOut: new Date(guest.currentReservation.checkOut)
        } : null
      }));
    }

    // Transform rooms
    if (data.rooms && Array.isArray(data.rooms)) {
      data.rooms = data.rooms.map(room => ({
        ...room,
        price: parseFloat(room.price) || 0,
        capacity: parseInt(room.capacity) || 1,
        lastCleaned: room.lastCleaned ? new Date(room.lastCleaned) : null,
        nextCleaning: room.nextCleaning ? new Date(room.nextCleaning) : null
      }));
    }

    return data;
  }

  getValidationRules() {
    return {
      calendar: {
        guestName: { required: true, minLength: 2 },
        date: { required: true, type: 'date' },
        roomNumber: { required: true }
      },
      rooms: {
        number: { required: true, minLength: 1 },
        type: { required: true },
        price: { required: true, min: 0 }
      }
    };
  }

  getDefaultValues() {
    return {
      calendar: {
        duration: 1440, // 24 hours
        status: 'confirmed',
        reservationType: 'overnight',
        color: '#2196F3'
      },
      rooms: {
        capacity: 1,
        status: 'available',
        amenities: []
      }
    };
  }

  getDemoData() {
    return {
      calendar: 'hotelReservationsData',
      clients: 'hotelGuestsData',
      rooms: 'hotelRoomsData'
    };
  }
}

export default BusinessStrategy; 