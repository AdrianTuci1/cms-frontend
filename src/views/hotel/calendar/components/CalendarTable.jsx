import React from 'react';
import { formatDate } from '../utils/dateUtils';
import styles from '../CalendarView.module.css';

const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  PENDING: 'pending',
  MAINTENANCE: 'maintenance'
};

const CalendarTable = ({
  rooms,
  days,
  highlightedRoom,
  isInSelectedPeriod,
  getRoomStatus,
  handleCellClick,
  handleCellHover,
  handleCellLeave,
  previewDate,
  isDragging,
  tableWrapperRef,
  handleMouseDown,
  handleMouseMove
}) => {
  return (
    <div 
      className={styles.tableWrapper}
      ref={tableWrapperRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <table className={styles.calendarTable}>
        <thead>
          <tr>
            <th className={styles.roomHeader}>Camera</th>
            {days.map((date, index) => (
              <th key={index} className={styles.dateHeader}>
                {formatDate(date)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.number}>
              <td className={styles.roomCell}>
                {room.number} - {room.type}
              </td>
              {days.map((date, index) => {
                const status = getRoomStatus(room.number, date);
                const isHighlighted = isInSelectedPeriod(date, room.number);
                const isPreview = previewDate && date.getTime() === previewDate.getTime();
                
                return (
                  <td
                    key={index}
                    className={`${styles.cell} ${styles[status]} ${
                      isHighlighted ? styles.highlighted : ''
                    } ${isPreview ? styles.preview : ''} ${
                      isDragging ? styles.dragging : ''
                    }`}
                    onClick={() => handleCellClick(room.number, date)}
                    onMouseEnter={() => handleCellHover(room.number, date)}
                    onMouseLeave={handleCellLeave}
                    title={`${room.number} - ${formatDate(date)}`}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalendarTable; 