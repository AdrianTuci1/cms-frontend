import { create } from 'zustand';
import { useDataSync } from '../../../design-patterns/hooks';
import { useMemo, useCallback } from 'react';
// import roomsData from '../data/rooms.json';
// import reservationsData from '../data/reservations.json';

// Mock data temporar
const mockRoomsData = {
  rooms: [
    { id: 1, roomNumber: '101', type: 'single', price: 100 },
    { id: 2, roomNumber: '102', type: 'double', price: 150 },
    { id: 3, roomNumber: '103', type: 'suite', price: 250 }
  ]
};

const mockReservationsData = {
  reservations: [
    {
      id: 1,
      rooms: [
        { roomId: '101', startDate: '2024-01-01', endDate: '2024-01-05' }
      ]
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
  if (!reservations || reservations.length === 0) {
    const today = new Date();
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);
    return { startDate: today, endDate: twoWeeksLater };
  }

  let minDate = new Date(reservations[0].rooms[0].startDate);
  let maxDate = new Date(reservations[0].rooms[0].endDate);

  reservations.forEach(res => {
    res.rooms.forEach(room => {
      const startDate = new Date(room.startDate);
      const endDate = new Date(room.endDate);
      
      if (startDate < minDate) minDate = startDate;
      if (endDate > maxDate) maxDate = endDate;
    });
  });

  // Ensure at least 2 weeks range
  const rangeInDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
  if (rangeInDays < 21) {
    const additionalDays = 21 - rangeInDays;
    maxDate.setDate(maxDate.getDate() + additionalDays);
  }

  return { startDate: minDate, endDate: maxDate };
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
 * @param {Object} options - Opțiuni pentru useDataSync
 */
export const useHotelTimelineWithAPI = (options = {}) => {
  const {
    startDate = null,
    endDate = null,
    enableValidation = true,
    enableBusinessLogic = true
  } = options;

  // Folosește useDataSync pentru integrarea cu API
  const timelineSync = useDataSync('timeline', {
    businessType: 'hotel',
    startDate,
    endDate,
    enableValidation,
    enableBusinessLogic
  });

  // Folosește store-ul local pentru state management
  const calendarStore = useCalendarStore();

  // Memoizează datele derivate pentru a evita infinite re-renders
  const bookings = useMemo(() => timelineSync.data?.bookings || [], [timelineSync.data?.bookings]);
  const rooms = useMemo(() => timelineSync.data?.packages?.rooms || [], [timelineSync.data?.packages?.rooms]);

  const isRoomAvailable = useCallback((roomNumber, startDate, endDate) =>
    calendarStore.isRoomAvailable(roomNumber, startDate, endDate, bookings),
    [bookings]
  );

  return {
    // API integration
    ...timelineSync,
    
    // Local state management
    ...calendarStore,
    
    // Business-specific data - memoizat pentru a evita infinite re-renders
    getBookings: () => ({
      bookings,
      rooms,
      isRoomAvailable
    }),
    
    // Business-specific actions
    createBooking: async (booking) => {
      try {
        const newBooking = await timelineSync.create(booking);
        return newBooking;
      } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
      }
    },

    updateBooking: async (id, updates) => {
      try {
        const updatedBooking = await timelineSync.update({ id, ...updates });
        return updatedBooking;
      } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
      }
    },

    deleteBooking: async (id) => {
      try {
        await timelineSync.remove({ id });
      } catch (error) {
        console.error('Error deleting booking:', error);
        throw error;
      }
    }
  };
};

export default useCalendarStore; 