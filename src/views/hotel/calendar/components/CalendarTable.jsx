import React from 'react';
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
  handleMouseMove,
  tooltipData,
  statusColors,
  statusLabels
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      ref={tableWrapperRef}
      className={`${styles.tableWrapper} ${isDragging ? styles.dragging : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <table className={styles.calendarTable}>
        <thead>
          <tr>
            <th className={styles.roomHeader}>Camera</th>
            {days.map((date, index) => (
              <th key={index} className={styles.dateHeader}>
                <div>{formatDate(date)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {date.toLocaleDateString('ro-RO', { weekday: 'short' })}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.number}>
              <td className={styles.roomCell}>
                <div style={{ fontWeight: '600' }}>Camera {room.number}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {room.type}
                </div>
              </td>
              {days.map((date, index) => {
                const status = getRoomStatus(room.number, date);
                const isHighlighted = isInSelectedPeriod(date, room.number);
                const isPreview = previewDate && 
                  previewDate.roomNumber === room.number && 
                  previewDate.date.getTime() === date.getTime();
                const isTooltip = tooltipData && tooltipData.roomNumber === room.number;

                return (
                  <td key={index}>
                    <div
                      className={`${styles.cell} ${styles[status]} ${
                        isHighlighted ? styles.highlighted : ''
                      } ${isPreview ? styles.preview : ''} ${isDragging ? styles.dragging : ''}`}
                      onClick={() => handleCellClick(room.number, date)}
                      onMouseEnter={() => handleCellHover(room.number, date)}
                      onMouseLeave={handleCellLeave}
                      style={{
                        backgroundColor: statusColors[status]
                      }}
                    >
                      {isTooltip && (
                        <div className={styles.tooltip}>
                          <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                            Camera {tooltipData.roomNumber}
                          </div>
                          <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                            <strong>Client:</strong> {tooltipData.reservation.guestName}
                          </div>
                          <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                            <strong>Telefon:</strong> {tooltipData.reservation.phone}
                          </div>
                          <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                            <strong>Check-in:</strong> {formatDate(tooltipData.reservation.checkIn)} {formatTime(tooltipData.reservation.checkIn)}
                          </div>
                          <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                            <strong>Check-out:</strong> {formatDate(tooltipData.reservation.checkOut)} {formatTime(tooltipData.reservation.checkOut)}
                          </div>
                          <div style={{ fontSize: '0.9rem' }}>
                            <strong>Status:</strong>{' '}
                            <span style={{ color: statusColors[tooltipData.reservation.status] }}>
                              {statusLabels[tooltipData.reservation.status]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
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