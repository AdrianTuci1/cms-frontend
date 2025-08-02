import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';
import styles from '../CalendarView.module.css';

const DateSelector = ({ startDate, endDate, setDateRange }) => {
  const [tempStartDate, setTempStartDate] = useState(new Date(startDate));
  const [tempEndDate, setTempEndDate] = useState(new Date(endDate));

  // Update temp dates when props change
  useEffect(() => {
    setTempStartDate(new Date(startDate));
    setTempEndDate(new Date(endDate));
  }, [startDate, endDate]);

  const handleStartDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setTempStartDate(newDate);
    setDateRange(newDate.toISOString().split('T')[0], tempEndDate.toISOString().split('T')[0]);
  };

  const handleEndDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setTempEndDate(newDate);
    setDateRange(tempStartDate.toISOString().split('T')[0], newDate.toISOString().split('T')[0]);
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className={styles.dateSelector}>
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'center',
        background: '#ffffff',
        padding: '1rem 1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>From:</span>
          <input
            type="date"
            className={styles.dateInput}
            value={formatDateForInput(tempStartDate)}
            onChange={handleStartDateChange}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>To:</span>
          <input
            type="date"
            className={styles.dateInput}
            value={formatDateForInput(tempEndDate)}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DateSelector; 