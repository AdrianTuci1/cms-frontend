import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';
import styles from '../CalendarView.module.css';

const DateSelector = ({ startDate, endDate, setDateRange }) => {
  const [showDateInputs, setShowDateInputs] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date(startDate));
  const [tempEndDate, setTempEndDate] = useState(new Date(endDate));

  // Update temp dates when props change
  useEffect(() => {
    setTempStartDate(new Date(startDate));
    setTempEndDate(new Date(endDate));
  }, [startDate, endDate]);

  const handlePreviousMonth = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setMonth(newStartDate.getMonth() - 1);
    const newEndDate = new Date(newStartDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);
    setDateRange(newStartDate.toISOString().split('T')[0], newEndDate.toISOString().split('T')[0]);
  };

  const handleNextMonth = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setMonth(newStartDate.getMonth() + 1);
    const newEndDate = new Date(newStartDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);
    setDateRange(newStartDate.toISOString().split('T')[0], newEndDate.toISOString().split('T')[0]);
  };

  const handleDateChange = () => {
    setDateRange(tempStartDate.toISOString().split('T')[0], tempEndDate.toISOString().split('T')[0]);
    setShowDateInputs(false);
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className={styles.dateSelector}>
      <button onClick={handlePreviousMonth} className={styles.navigationButton}>
        &lt;
      </button>
      
      {showDateInputs ? (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="date"
            className={styles.dateInput}
            value={formatDateForInput(tempStartDate)}
            onChange={(e) => setTempStartDate(new Date(e.target.value))}
          />
          <span>-</span>
          <input
            type="date"
            className={styles.dateInput}
            value={formatDateForInput(tempEndDate)}
            onChange={(e) => setTempEndDate(new Date(e.target.value))}
          />
          <button 
            onClick={handleDateChange}
            className={styles.navigationButton}
          >
            OK
          </button>
          <button 
            onClick={() => setShowDateInputs(false)}
            className={styles.navigationButton}
          >
            Anulează
          </button>
        </div>
      ) : (
        <div 
          className={styles.dateRange}
          onClick={() => setShowDateInputs(true)}
          style={{ cursor: 'pointer' }}
        >
          {formatDate(new Date(startDate))} - {formatDate(new Date(endDate))}
        </div>
      )}
      
      <button onClick={handleNextMonth} className={styles.navigationButton}>
        &gt;
      </button>
    </div>
  );
};

export default DateSelector; 