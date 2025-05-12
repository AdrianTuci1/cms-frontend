import styles from './Appointments.module.css';

const formatDay = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

const formatDate = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const subDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
};

const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const WeekNavigator = ({
  currentWeek,
  getAppointmentsCount,
  onPreviousWeek,
  onNextWeek
}) => {
  const now = new Date();

  const renderDays = (weekDays, isCurrentWeek) => {
    return weekDays.map((day, index) => {
      const isNow = isSameDay(day, now);
      const appointmentsCount = getAppointmentsCount(day);

      return (
        <div 
          key={index} 
          className={`${styles.weekDay} ${isNow ? styles.currentDay : ''} ${isCurrentWeek ? styles.currentWeek : ''}`}
        >
          <div className={styles.dayInitial}>{formatDay(day).slice(0, 2).toUpperCase()}</div>
          <div className={styles.dayDate}>{formatDate(day)}</div>
          <div className={`${styles.appointmentCount} ${appointmentsCount > 0 ? styles.hasAppointments : ''}`}>
            {appointmentsCount}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.weekNavigator}>
      <div className={styles.weekContainer}>
        {/* Previous Week */}
        <div className={styles.previousWeek} onClick={onPreviousWeek}>
          {renderDays(currentWeek.map(day => subDays(day, 7)), false)}
        </div>

        {/* Current Week */}
        <div className={styles.currentWeekContainer}>
          {renderDays(currentWeek, true)}
        </div>

        {/* Next Week */}
        <div className={styles.nextWeek} onClick={onNextWeek}>
          {renderDays(currentWeek.map(day => addDays(day, 7)), false)}
        </div>
      </div>
    </div>
  );
};

export default WeekNavigator; 