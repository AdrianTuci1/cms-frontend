/**
 * Index pentru Timeline Store - Exportă hook-urile individuale pentru fiecare business type
 */

// Export store-urile existente pentru compatibilitate
export { default as useDentalTimeline } from './dentalTimeline';
export { default as useHotelTimeline } from './hotelTimeline';
export { default as useGymTimeline } from './gymTimeline';

// Export hook-urile cu integrare API pentru fiecare business type
export { useDentalTimelineWithAPI } from './dentalTimeline';
export { useHotelTimelineWithAPI } from './hotelTimeline';
export { useGymTimelineWithAPI } from './gymTimeline';

// Export exemple și documentație
// export { default as TimelineIntegrationExample } from '../components/TimelineIntegrationExample';

// Export tipuri și constante
export const TIMELINE_BUSINESS_TYPES = {
  DENTAL: 'dental',
  HOTEL: 'hotel',
  GYM: 'gym'
};

export const TIMELINE_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  READ: 'read'
};

export const TIMELINE_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle'
};

// Export helper functions
export const timelineHelpers = {
  /**
   * Format date pentru API
   * @param {Date} date - Data de formatat
   * @returns {string} Data formatată YYYY-MM-DD
   */
  formatDateForAPI: (date) => {
    return date.toISOString().split('T')[0];
  },

  /**
   * Calculează săptămâna curentă
   * @param {Date} date - Data de referință
   * @returns {Array} Array cu datele săptămânii
   */
  calculateCurrentWeek: (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  },

  /**
   * Verifică dacă două intervale de date se suprapun
   * @param {string} start1 - Data de început primul interval
   * @param {string} end1 - Data de sfârșit primul interval
   * @param {string} start2 - Data de început al doilea interval
   * @param {string} end2 - Data de sfârșit al doilea interval
   * @returns {boolean} True dacă se suprapun
   */
  isDateRangeOverlapping: (start1, end1, start2, end2) => {
    const startDate1 = new Date(start1);
    const endDate1 = new Date(end1);
    const startDate2 = new Date(start2);
    const endDate2 = new Date(end2);

    return startDate1 < endDate2 && startDate2 < endDate1;
  },

  /**
   * Generează date range implicit (săptămâna curentă)
   * @returns {Object} Object cu startDate și endDate
   */
  getDefaultDateRange: () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay())); // End of current week (Saturday)

    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0]
    };
  },

  /**
   * Validează date range
   * @param {string} startDate - Data de început
   * @param {string} endDate - Data de sfârșit
   * @returns {Object} Object cu isValid și errors
   */
  validateDateRange: (startDate, endDate) => {
    const errors = [];
    
    if (!startDate) {
      errors.push('Start date is required');
    }
    
    if (!endDate) {
      errors.push('End date is required');
    }
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.push('Start date must be before end date');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Export business-specific helpers
export const businessHelpers = {
  /**
   * Helper pentru dental timeline
   */
  dental: {
    /**
     * Filtrează programările după medic
     * @param {Array} appointments - Lista de programări
     * @param {string} medicId - ID-ul medicului
     * @returns {Array} Programările filtrate
     */
    filterByMedic: (appointments, medicId) => {
      return appointments.filter(appointment => appointment.medicId === medicId);
    },

    /**
     * Calculează numărul de programări pentru o dată
     * @param {Array} appointments - Lista de programări
     * @param {Date} date - Data pentru care se calculează
     * @returns {number} Numărul de programări
     */
    getAppointmentsCountForDate: (appointments, date) => {
      return appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.getFullYear() === date.getFullYear() &&
               appointmentDate.getMonth() === date.getMonth() &&
               appointmentDate.getDate() === date.getDate();
      }).length;
    }
  },

  /**
   * Helper pentru hotel timeline
   */
  hotel: {
    /**
     * Verifică disponibilitatea unei camere
     * @param {Array} bookings - Lista de rezervări
     * @param {string} roomId - ID-ul camerei
     * @param {string} startDate - Data de check-in
     * @param {string} endDate - Data de check-out
     * @returns {boolean} True dacă camera este disponibilă
     */
    isRoomAvailable: (bookings, roomId, startDate, endDate) => {
      return !bookings.some(booking =>
        booking.rooms.some(room =>
          room.roomId === roomId &&
          timelineHelpers.isDateRangeOverlapping(
            startDate,
            endDate,
            room.startDate,
            room.endDate
          )
        )
      );
    },

    /**
     * Calculează durata unei rezervări în zile
     * @param {string} startDate - Data de check-in
     * @param {string} endDate - Data de check-out
     * @returns {number} Numărul de zile
     */
    calculateBookingDuration: (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  },

  /**
   * Helper pentru gym timeline
   */
  gym: {
    /**
     * Filtrează membrii care sunt check-in dar nu check-out
     * @param {Array} checkedIn - Lista de membri check-in
     * @returns {Array} Membrii activi
     */
    getActiveMembers: (checkedIn) => {
      return checkedIn.filter(member => !member.checkOutTime);
    },

    /**
     * Calculează ocuparea totală a facilităților
     * @param {Array} occupancy - Lista de ocupare
     * @returns {Object} Statistici de ocupare
     */
    calculateTotalOccupancy: (occupancy) => {
      return occupancy.reduce((total, facility) => {
        const [current, max] = facility.occupancy.split('/').map(Number);
        return {
          current: total.current + current,
          max: total.max + max
        };
      }, { current: 0, max: 0 });
    },

    /**
     * Filtrează clasele pentru o anumită oră
     * @param {Array} classes - Lista de clase
     * @param {string} time - Ora de referință (HH:MM)
     * @returns {Array} Clasele filtrate
     */
    getClassesAfterTime: (classes, time) => {
      return classes.filter(cls => cls.startHour > time);
    }
  }
};

// Export hook factory pentru a crea timeline hooks personalizate
export const createTimelineHook = (businessType, defaultOptions = {}) => {
  return (options = {}) => {
    const mergedOptions = { ...defaultOptions, ...options };
    
    switch (businessType) {
      case 'dental':
        return useDentalTimelineWithAPI(mergedOptions);
      case 'hotel':
        return useHotelTimelineWithAPI(mergedOptions);
      case 'gym':
        return useGymTimelineWithAPI(mergedOptions);
      default:
        throw new Error(`Unknown business type: ${businessType}`);
    }
  };
};

// Export pentru debugging și development
export const timelineDebug = {
  /**
   * Log timeline state pentru debugging
   * @param {Object} timeline - Timeline hook result
   * @param {string} label - Label pentru log
   */
  logTimelineState: (timeline, label = 'Timeline State') => {
    console.group(label);
    console.log('Data:', timeline.data);
    console.log('Loading:', timeline.loading);
    console.log('Error:', timeline.error);
    console.log('Last Updated:', timeline.lastUpdated);
    console.log('Is Online:', timeline.isOnline);
    console.log('Strategy:', timeline.strategy);
    console.groupEnd();
  },

  /**
   * Log business-specific data pentru debugging
   * @param {Object} timeline - Timeline hook result
   * @param {string} businessType - Business type
   */
  logBusinessData: (timeline, businessType) => {
    console.group(`${businessType} Business Data`);
    
    switch (businessType) {
      case 'dental':
        const appointments = timeline.getAppointments?.();
        console.log('Appointments:', appointments);
        break;
      case 'hotel':
        const bookings = timeline.getBookings?.();
        console.log('Bookings:', bookings);
        break;
      case 'gym':
        const gymData = timeline.getGymData?.();
        console.log('Gym Data:', gymData);
        break;
      default:
        console.log('Unknown business type');
    }
    
    console.groupEnd();
  }
};

// Export pentru testing
export const timelineTestUtils = {
  /**
   * Mock data pentru testing
   */
  mockData: {
    dental: {
      reservations: [
        {
          id: 1,
          clientName: 'John Doe',
          medicName: 'Dr. Smith',
          displayTreatment: 'Cleaning',
          date: '2024-01-15',
          time: '10:00'
        }
      ]
    },
    hotel: {
      bookings: [
        {
          id: 1,
          client: { clientName: 'Jane Doe' },
          rooms: [{ roomId: 102, startDate: '2024-01-15', endDate: '2024-01-17' }],
          general: { status: 'scheduled', isPaid: 'false', isConfirmed: 'false' }
        }
      ]
    },
    gym: {
      checkedIn: [
        {
          memberId: 1,
          memberName: 'Lucky',
          serviceName: 'Premium',
          checkInTime: '14:00',
          checkOutTime: null
        }
      ],
      classes: [
        {
          classId: 1,
          className: 'Zumba',
          occupancy: '15/20',
          teacher: 'Ion',
          startHour: '10:00'
        }
      ],
      occupancy: [
        {
          facilityId: 1,
          facilityName: 'Fitness',
          occupancy: '30/50'
        }
      ]
    }
  }
};

// Export Sales Store
export { default as useSalesStore } from './salesStore';

// Export Sales Integration Example
export { default as SalesIntegrationExample } from '../components/SalesIntegrationExample'; 