import React, { useState, useEffect, useCallback } from "react";
import { useHotelTimelineWithAPI } from "../../../store";
import { generateDatesArray, isDateRangeOverlapping, isDateInRange } from "./utils/dateUtils";
import { useDragScroll } from "./hooks/useDragScroll";
import DateSelector from "./components/DateSelector";
import CalendarTable from "./components/CalendarTable";
import styles from "./CalendarView.module.css";

const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  PENDING: 'pending',
  MAINTENANCE: 'maintenance'
};

const STATUS_COLORS = {
  [ROOM_STATUS.AVAILABLE]: '#4caf50',
  [ROOM_STATUS.OCCUPIED]: '#f44336',
  [ROOM_STATUS.PENDING]: '#ff9800',
  [ROOM_STATUS.MAINTENANCE]: '#2196f3'
};

const STATUS_LABELS = {
  [ROOM_STATUS.AVAILABLE]: 'Disponibil',
  [ROOM_STATUS.OCCUPIED]: 'Ocupat',
  [ROOM_STATUS.PENDING]: 'În așteptare',
  [ROOM_STATUS.MAINTENANCE]: 'În mentenanță'
};

const CalendarView = () => {
  // Use the new timeline integration hook
  const timeline = useHotelTimelineWithAPI({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    data,
    loading,
    error,
    refresh,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookings,
    rooms,
    reservations,
    startDate,
    endDate,
    setDateRange,
    highlightedRoom,
    setHighlightedRoom
  } = timeline;

  const { bookings, isRoomAvailable } = getBookings();

  const [days, setDays] = useState([]);
  const [previewDate, setPreviewDate] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const { isDragging, tableWrapperRef, handleMouseDown, handleMouseMove, dragStartTimeRef } = useDragScroll();

  useEffect(() => {
    setDays(generateDatesArray(startDate, endDate));
  }, [startDate, endDate]);

  const handleCellClick = useCallback((roomNumber, date) => {
    const dragDuration = Date.now() - dragStartTimeRef.current;
    if (dragDuration > 200) return;

    const reservation = bookings.find(res =>
      res.rooms.some(room =>
        room.roomId === roomNumber &&
        date.toISOString().split("T")[0] >= room.startDate.split("T")[0] &&
        date.toISOString().split("T")[0] < room.endDate.split("T")[0]
      )
    );

    if (reservation) {
      const room = rooms.find(r => r.roomId === roomNumber);
      if (!room) return;

      const reservedRoom = reservation.rooms.find(r => r.roomId === roomNumber);
      if (!reservedRoom) return;

      setTooltipData({
        roomNumber,
        reservation: {
          guestName: reservation.client?.clientName || 'Unknown',
          phone: reservation.client?.phone || '',
          status: reservedRoom.status,
          checkIn: reservedRoom.startDate,
          checkOut: reservedRoom.endDate
        }
      });
    } else {
      setTooltipData(null);
    }
  }, [bookings, rooms, dragStartTimeRef]);

  const handleCellHover = useCallback((roomNumber, date) => {
    if (isDragging) return;
    setPreviewDate({ roomNumber, date });
  }, [isDragging]);

  const handleCellLeave = useCallback(() => {
    setPreviewDate(null);
  }, []);

  const isInSelectedPeriod = useCallback((date, roomNumber) => {
    if (!previewDate || previewDate.roomNumber !== roomNumber) {
      return false;
    }
    
    const dayStr = date.toISOString().split("T")[0];
    const previewDayStr = previewDate.date.toISOString().split("T")[0];
    
    if (dayStr !== previewDayStr) {
      return false;
    }

    const isReserved = bookings.some((res) => 
      res.rooms.some(room => 
        room.roomId === roomNumber &&
        dayStr >= room.startDate.split("T")[0] &&
        dayStr < room.endDate.split("T")[0]
      )
    );

    if (isReserved) {
      return false;
    }

    return true;
  }, [previewDate, bookings]);

  const getRoomStatus = useCallback((roomNumber, date) => {
    const dayStr = date.toISOString().split("T")[0];
    const reservation = bookings.find(res =>
      res.rooms.some(room =>
        room.roomId === roomNumber &&
        dayStr >= room.startDate.split("T")[0] &&
        dayStr < room.endDate.split("T")[0]
      )
    );

    if (reservation) {
      const room = reservation.rooms.find(r => r.roomId === roomNumber);
      return room.status || ROOM_STATUS.OCCUPIED;
    }
    return ROOM_STATUS.AVAILABLE;
  }, [bookings]);

  if (error) {
    return (
      <div className={styles.calendarContainer}>
        <div className={styles.errorState}>
          <h3>Eroare la încărcarea calendarului</h3>
          <p>{error.message || error}</p>
          <button onClick={refresh}>Încearcă din nou</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.calendarContainer}>
        <div className={styles.loadingState}>
          <p>Se încarcă calendarul...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.calendarContainer}>
      <DateSelector 
        startDate={startDate} 
        endDate={endDate} 
        setDateRange={setDateRange} 
      />
      <CalendarTable
        rooms={rooms}
        days={days}
        highlightedRoom={highlightedRoom}
        isInSelectedPeriod={isInSelectedPeriod}
        getRoomStatus={getRoomStatus}
        handleCellClick={handleCellClick}
        handleCellHover={handleCellHover}
        handleCellLeave={handleCellLeave}
        previewDate={previewDate}
        isDragging={isDragging}
        tableWrapperRef={tableWrapperRef}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        tooltipData={tooltipData}
        statusColors={STATUS_COLORS}
        statusLabels={STATUS_LABELS}
      />
    </div>
  );
};

export default CalendarView;