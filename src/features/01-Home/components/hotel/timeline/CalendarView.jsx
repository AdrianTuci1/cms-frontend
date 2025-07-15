import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useHotelTimelineWithAPI } from "../../../store/hotelTimeline";
import { useDataSync } from "../../../../../design-patterns/hooks";
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
  // Calculate date range: 5 days prior from today and 2 weeks from today
  const today = new Date();
  const fiveDaysPrior = new Date(today);
  fiveDaysPrior.setDate(today.getDate() - 5);
  const twoWeeksFromToday = new Date(today);
  twoWeeksFromToday.setDate(today.getDate() + 14);

  const defaultStartDate = fiveDaysPrior.toISOString().split('T')[0];
  const defaultEndDate = twoWeeksFromToday.toISOString().split('T')[0];

  // Use useDataSync hook directly for timeline data
  const timelineSync = useDataSync('timeline', {
    businessType: 'hotel',
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const timelineData = timelineSync.data;

  // Use the updated timeline integration hook with shared data
  const timeline = useHotelTimelineWithAPI(timelineData, {
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
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

  // Implement getRoomStatus function
  const getRoomStatus = useCallback((roomNumber, date) => {
    const dateString = date.toISOString().split("T")[0];
    
    // Check if room is booked for this date
    const booking = bookings.find(res =>
      res.rooms.some(room =>
        room.roomId === roomNumber &&
        dateString >= room.startDate.split("T")[0] &&
        dateString < room.endDate.split("T")[0]
      )
    );

    if (booking) {
      const room = booking.rooms.find(r => r.roomId === roomNumber);
      return room?.status || ROOM_STATUS.OCCUPIED;
    }

    return ROOM_STATUS.AVAILABLE;
  }, [bookings]);

  // Implement isInSelectedPeriod function
  const isInSelectedPeriod = useCallback((date, roomNumber) => {
    // For now, return false as we don't have a selected period implementation
    // This can be enhanced later with actual period selection logic
    return false;
  }, []);

  // Implement handleCellHover function
  const handleCellHover = useCallback((roomNumber, date) => {
    setPreviewDate({ roomNumber, date });
  }, []);

  // Implement handleCellLeave function
  const handleCellLeave = useCallback(() => {
    setPreviewDate(null);
  }, []);

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

  const handleDateRangeChange = useCallback((newStartDate, newEndDate) => {
    setDateRange(newStartDate, newEndDate);
  }, [setDateRange]);

  // Memoize rooms data to ensure proper structure
  const processedRooms = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      // Return default rooms if none available
      return [
        { id: 1, number: '101', type: 'Single', roomId: '101' },
        { id: 2, number: '102', type: 'Double', roomId: '102' },
        { id: 3, number: '103', type: 'Suite', roomId: '103' },
        { id: 4, number: '201', type: 'Single', roomId: '201' },
        { id: 5, number: '202', type: 'Double', roomId: '202' },
        { id: 6, number: '203', type: 'Suite', roomId: '203' }
      ];
    }
    
    // Map rooms to expected structure
    return rooms.map(room => ({
      id: room.id || room.roomId,
      number: room.roomNumber || room.number || room.roomId || room.id,
      type: room.roomType || room.type || 'standard',
      roomId: room.roomId || room.id
    }));
  }, [rooms]);

  // Show loading state if timeline data is loading
  if (timelineSync.loading) {
    return (
      <div className={styles.calendarContainer}>
        <div className={styles.loadingState}>
          <div className={styles.loadingStateContent}>
            <div className={styles.spinner}></div>
            <p>Se încarcă calendarul...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if timeline data has error
  if (timelineSync.error) {
    return (
      <div className={styles.calendarContainer}>
        <div className={styles.errorState}>
          <h3>Eroare la încărcarea calendarului</h3>
          <p>{timelineSync.error.message || timelineSync.error}</p>
          <button onClick={timelineSync.refresh}>Încearcă din nou</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.calendarContainer}>
      <DateSelector
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
      />

      <div
        className={styles.tableWrapper}
        ref={tableWrapperRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setTooltipData(null)}
        onMouseLeave={() => setTooltipData(null)}
      >
        <CalendarTable
          days={days}
          rooms={processedRooms}
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
    </div>
  );
};

export default CalendarView;