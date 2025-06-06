import { create } from 'zustand';
import roomsData from '../data/rooms.json';
import reservationsData from '../data/reservations.json';

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

const { startDate, endDate } = getDateRangeFromReservations(reservationsData.reservations);

const useCalendarStore = create((set, get) => ({
  rooms: roomsData.rooms,
  reservations: reservationsData.reservations,
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

  isRoomAvailable: (roomNumber, startDate, endDate) => {
    const { reservations } = get();
    return !reservations.some(res =>
      res.rooms.some(room =>
        room.roomNumber === roomNumber &&
        isDateRangeOverlapping(
          startDate,
          endDate,
          room.startDate,
          room.endDate
        )
      )
    );
  }
}));

export default useCalendarStore; 