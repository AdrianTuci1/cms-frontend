import { create } from 'zustand';
import { demoRooms, demoReservations } from '../data/demoData';

const useCalendarStore = create((set, get) => ({
  rooms: demoRooms,
  reservations: demoReservations,
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
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

// Helper function for date range overlap
const isDateRangeOverlapping = (start1, end1, start2, end2) => {
  const startDate1 = new Date(start1);
  const endDate1 = new Date(end1);
  const startDate2 = new Date(start2);
  const endDate2 = new Date(end2);

  return startDate1 < endDate2 && startDate2 < endDate1;
};

export default useCalendarStore; 