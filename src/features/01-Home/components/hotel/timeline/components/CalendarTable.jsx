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
  isInSelectedPeriod,
  getRoomStatus,
  handleCellClick,
  handleCellHover,
  handleCellLeave,
  previewDate,
  isDragging,
  tooltipData,
  statusColors,
  statusLabels
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <table className={styles.calendarTable}>
      <thead>
        <tr>
          <th className={styles.roomHeader}>
            <div style={{ fontSize: '0.75rem', marginBottom: '0.125rem' }}>🏨</div>
            <div style={{ fontSize: '0.625rem' }}>Room</div>
          </th>
          {days.map((date, index) => (
            <th key={index} className={styles.dateHeader}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.125rem' }}>
                {formatDate(date)}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#64748b',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr key={room.number}>
            <td className={styles.roomCell}>
              <div style={{ 
                fontWeight: '600', 
                fontSize: '0.75rem',
                marginBottom: '0.125rem',
                color: '#334155',
                lineHeight: '1'
              }}>
                {room.number}
              </div>
              <div style={{ 
                fontSize: '0.625rem', 
                color: '#64748b',
                fontWeight: '500',
                textTransform: 'capitalize',
                padding: '0.125rem 0.25rem',
                background: '#f1f5f9',
                borderRadius: '3px',
                display: 'inline-block',
                lineHeight: '1'
              }}>
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
              const isReserved = status !== ROOM_STATUS.AVAILABLE;
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <td key={index}>
                  <div
                    className={`${styles.cell} ${styles[status]} ${
                      isHighlighted ? styles.highlighted : ''
                    } ${isPreview ? styles.preview : ''} ${isDragging ? styles.dragging : ''}`}
                    onClick={() => handleCellClick(room.number, date)}
                    onMouseEnter={() => handleCellHover(room.number, date)}
                    onMouseLeave={handleCellLeave}
                  >
                    {/* Only show indicator for reserved slots */}
                    {isReserved && (
                      <div style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: status === ROOM_STATUS.OCCUPIED ? '#ef4444' :
                                       status === ROOM_STATUS.PENDING ? '#f59e0b' : '#3b82f6'
                      }} />
                    )}

                    {/* Today indicator as vertical line */}
                    {isToday && (
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '2px',
                        height: '100%',
                        background: 'rgba(59, 130, 246, 0.6)',
                        zIndex: 1
                      }} />
                    )}

                    {isTooltip && (
                      <div className={styles.tooltip}>
                        <div style={{ 
                          fontWeight: '600', 
                          marginBottom: '0.75rem',
                          fontSize: '0.875rem',
                          color: '#334155',
                          borderBottom: '1px solid #e2e8f0',
                          paddingBottom: '0.5rem'
                        }}>
                          🏨 Room {tooltipData.roomNumber}
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem'
                        }}>
                          <span style={{ color: '#64748b' }}>👤</span>
                          <strong>Guest:</strong> {tooltipData.reservation.guestName}
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem'
                        }}>
                          <span style={{ color: '#64748b' }}>📞</span>
                          <strong>Phone:</strong> {tooltipData.reservation.phone}
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem'
                        }}>
                          <span style={{ color: '#64748b' }}>📅</span>
                          <strong>Check-in:</strong> {formatDate(tooltipData.reservation.checkIn)} {formatTime(tooltipData.reservation.checkIn)}
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem'
                        }}>
                          <span style={{ color: '#64748b' }}>📅</span>
                          <strong>Check-out:</strong> {formatDate(tooltipData.reservation.checkOut)} {formatTime(tooltipData.reservation.checkOut)}
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem'
                        }}>
                          <span style={{ color: '#64748b' }}>📊</span>
                          <strong>Status:</strong>{' '}
                          <span style={{ 
                            color: statusColors[tooltipData.reservation.status],
                            fontWeight: '500',
                            padding: '0.125rem 0.5rem',
                            background: '#f8fafc',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                          }}>
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
  );
};

export default CalendarTable; 