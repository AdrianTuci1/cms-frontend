import { create } from 'zustand';
import { useMemo, useCallback } from 'react';
// import roomsData from '../data/rooms.json';
// import reservationsData from '../data/reservations.json';

// Mock data temporar
const mockRoomsData = {
  rooms: [
    { id: 1, roomNumber: '101', type: 'Single', price: 100 },
    { id: 2, roomNumber: '102', type: 'Double', price: 150 },
    { id: 3, roomNumber: '103', type: 'Suite', price: 250 },
    { id: 4, roomNumber: '201', type: 'Single', price: 100 },
    { id: 5, roomNumber: '202', type: 'Double', price: 150 },
    { id: 6, roomNumber: '203', type: 'Suite', price: 250 }
  ]
};

// Calculate current date range for mock data
const today = new Date();
const fiveDaysPrior = new Date(today);
fiveDaysPrior.setDate(today.getDate() - 5);
const twoWeeksFromToday = new Date(today);
twoWeeksFromToday.setDate(today.getDate() + 14);

const mockReservationsData = {
  reservations: [
    {
      id: 1,
      rooms: [
        { 
          roomId: '101', 
          startDate: fiveDaysPrior.toISOString().split('T')[0], 
          endDate: new Date(fiveDaysPrior.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'occupied'
        }
      ],
      client: {
        clientId: 1,
        clientName: 'John Doe',
        phone: '+40 123 456 789',
        email: 'john@example.com'
      }
    },
    {
      id: 2,
      rooms: [
        { 
          roomId: '102', 
          startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
          endDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending'
        }
      ],
      client: {
        clientId: 2,
        clientName: 'Jane Smith',
        phone: '+40 987 654 321',
        email: 'jane@example.com'
      }
    }
  ]
};

// Helper function for date range overlap
const isDateRangeOverlapping = (start1, end1, start2, end2) => {
  const startDate1 = new Date(start1);
  const endDate1 = new Date(end1);
  const startDate2 = new Date(start2);
  const endDate2 = new Date(end2);

  return startDate1 < endDate2 && startDate2 < endDate1;
};

// Helper function to get date range from reservations
const getDateRangeFromReservations = (reservations) => {
  // Always use 5 days prior from today and 2 weeks from today
  const today = new Date();
  const fiveDaysPrior = new Date(today);
  fiveDaysPrior.setDate(today.getDate() - 5);
  const twoWeeksFromToday = new Date(today);
  twoWeeksFromToday.setDate(today.getDate() + 14);

  return { startDate: fiveDaysPrior, endDate: twoWeeksFromToday };
};

const { startDate, endDate } = getDateRangeFromReservations(mockReservationsData.reservations);

const useCalendarStore = create((set, get) => ({
  rooms: mockRoomsData.rooms,
  reservations: mockReservationsData.reservations,
  startDate,
  endDate,
  defaultDates: null,
  selectedRoom: null,
  highlightedRoom: null,

  setDateRange: (startDate, endDate) => {
    set({ startDate, endDate });
  },

  setDefaultDates: (startDate, endDate) => {
    set({ defaultDates: { startDate, endDate } });
  },

  setSelectedRoom: (roomNumber) => {
    set({ selectedRoom: roomNumber });
  },

  setHighlightedRoom: (roomNumber) => {
    set({ highlightedRoom: roomNumber });
  },

  isRoomAvailable: (roomNumber, startDate, endDate, bookings) => {
    return !bookings.some(booking =>
      booking.rooms.some(room =>
        room.roomId === roomNumber &&
        isDateRangeOverlapping(
          startDate,
          endDate,
          room.startDate,
          room.endDate
        )
      )
    );
  },

  // Initialize store
  initialize: () => {
    // Initialize with default state
    set({
      selectedRoom: null,
      highlightedRoom: null,
      defaultDates: null
    });
  },

  // Cleanup
  cleanup: () => {
    set({
      selectedRoom: null,
      highlightedRoom: null,
      defaultDates: null
    });
  }
}));

/**
 * Hook pentru hotel timeline cu integrare API
 * @param {Object} timelineData - Timeline data from shared context
 * @param {Object} options - Opțiuni pentru timeline
 */
export const useHotelTimelineWithAPI = (timelineData = null, options = {}) => {
  const {
    startDate = null,
    endDate = null,
    enableValidation = true,
    enableBusinessLogic = true
  } = options;

  // Folosește store-ul local pentru state management
  const calendarStore = useCalendarStore();

  // Memoizează datele derivate pentru a evita infinite re-renders
  const bookings = useMemo(() => timelineData?.bookings || [], [timelineData?.bookings]);
  const rooms = useMemo(() => timelineData?.packages?.rooms || [], [timelineData?.packages?.rooms]);

  const isRoomAvailable = useCallback((roomNumber, startDate, endDate) =>
    calendarStore.isRoomAvailable(roomNumber, startDate, endDate, bookings),
    [bookings]
  );

  return {
    // Local state management
    ...calendarStore,
    
    // Business-specific data - memoizat pentru a evita infinite re-renders
    getBookings: () => ({
      bookings,
      rooms,
      isRoomAvailable
    }),
    
    // Business-specific actions (these would need to be implemented with actual API calls)
    createBooking: async (booking) => {
      try {
        // This would need to be implemented with actual API integration
        console.log('Creating booking:', booking);
        throw new Error('Booking creation not implemented yet');
      } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
      }
    },

    updateBooking: async (id, updates) => {
      try {
        // This would need to be implemented with actual API integration
        console.log('Updating booking:', { id, updates });
        throw new Error('Booking update not implemented yet');
      } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
      }
    },

    deleteBooking: async (id) => {
      try {
        // This would need to be implemented with actual API integration
        console.log('Deleting booking:', id);
        throw new Error('Booking deletion not implemented yet');
      } catch (error) {
        console.error('Error deleting booking:', error);
        throw error;
      }
    }
  };
};

export default useCalendarStore; 