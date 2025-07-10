import styles from './Appointments.module.css';
import AppointmentCard from './AppointmentCard';

const formatDay = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const WeekView = ({
  selectedWeek,
  appointments = [],
  onAppointmentClick,
  onPatientClick,
  isLoading = false
}) => {
  const getAppointmentsForDay = (date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), date)
    );
  };

  const hasAnyAppointments = appointments.length > 0;

  // Calculate height for each row separately
  const calculateRowHeight = (startIndex, endIndex) => {
    const rowDates = selectedWeek.slice(startIndex, endIndex);
    const maxAppointmentsCount = Math.max(
      ...rowDates.map(date => getAppointmentsForDay(date).length)
    );

    // Calculate the height needed for the row
    const appointmentCardHeight = 200; // height of each appointment card
    const appointmentGap = 8; // gap between appointments
    const columnPadding = 16; // padding of appointmentsList
    const headerHeight = 60; // approximate height of dayHeader
    
    return maxAppointmentsCount > 0 
      ? headerHeight + columnPadding + (maxAppointmentsCount * appointmentCardHeight) + ((maxAppointmentsCount - 1) * appointmentGap)
      : 200; // minimum height when no appointments
  };

  // Estimate how many columns fit per row based on minmax(220px, 1fr)
  // This is an approximation - in practice, the browser will determine this
  const getColumnsPerRow = () => {
    // For responsive design, we'll use a simple estimation
    // On larger screens: 7 columns per row
    // On medium screens: 3-4 columns per row  
    // On small screens: 2 columns per row
    // On very small screens: 1 column per row
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1200) return 7; // Large screens
      if (width >= 768) return 4;  // Medium screens
      if (width >= 480) return 2;  // Small screens
      return 1; // Very small screens
    }
    return 7; // Default fallback
  };

  const columnsPerRow = getColumnsPerRow();

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingStateContent}>
          <div className={styles.spinner}></div>
          <p>Se încarcă programările...</p>
        </div>
      </div>
    );
  }

  if (!hasAnyAppointments) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <h3>Nu aveți rezervări în această săptămână</h3>
          <p>Programările vor apărea aici când vor fi create</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.weekView}>
      {selectedWeek.map((date, index) => {
        const dayAppointments = getAppointmentsForDay(date);
        
        // Calculate which row this column belongs to
        const rowIndex = Math.floor(index / columnsPerRow);
        const rowStartIndex = rowIndex * columnsPerRow;
        const rowEndIndex = Math.min(rowStartIndex + columnsPerRow, selectedWeek.length);
        
        // Calculate height for this specific row
        const rowHeight = calculateRowHeight(rowStartIndex, rowEndIndex);
        
        return (
          <div 
            key={index} 
            className={styles.dayColumn}
            style={{ height: `${rowHeight}px` }}
          >
            <div className={styles.dayHeader}>
              <span>{formatDay(date)}</span>
              <span>{date.getDate()}</span>
            </div>
            <div className={styles.appointmentsList}>
              {dayAppointments.length > 0 ? (
                dayAppointments.map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onAppointmentClick={onAppointmentClick}
                    onPatientClick={onPatientClick}
                  />
                ))
              ) : (
                <div className={styles.noAppointments}>
                  Fără programări
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView; 