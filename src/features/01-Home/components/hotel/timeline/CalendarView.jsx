import React, { useState, useEffect, useCallback } from "react";
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
  // Use useDataSync hook directly for timeline data
  const timelineSync = useDataSync('timeline', {
    businessType: 'hotel',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    enableValidation: true,
    enableBusinessLogic: true
  });

  const timelineData = timelineSync.data;

  // Use the updated timeline integration hook with shared data
  const timeline = useHotelTimelineWithAPI(timelineData, {
    startDate: '2024-01-01',
    endDate: '2024-01-31',
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

  // Show loading state if timeline data is loading
  if (timelineSync.loading) {
    return (
      <div className={styles.container}>
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
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h3>Eroare la încărcarea calendarului</h3>
          <p>{timelineSync.error.message || timelineSync.error}</p>
          <button onClick={timelineSync.refresh}>Încearcă din nou</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
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
          rooms={rooms}
          bookings={bookings}
          isRoomAvailable={isRoomAvailable}
          onCellClick={handleCellClick}
          highlightedRoom={highlightedRoom}
          setHighlightedRoom={setHighlightedRoom}
          tooltipData={tooltipData}
          isDragging={isDragging}
        />
      </div>
    </div>
  );
};

export default CalendarView;