import styles from './Appointments.module.css';
import { FaPlus, FaCalendarDay, FaChevronLeft, FaChevronRight, FaList } from 'react-icons/fa';

const formatDate = (date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const AppointmentHeader = ({
  onAddAppointment,
  onTodayClick,
  onPreviousWeek,
  onNextWeek,
  isAllAppointments,
  onToggleAppointments,
  selectedDate,
  onSelectDate
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerActions}>
        <button className={styles.button} onClick={onAddAppointment} title="Add Appointment">
          <FaPlus />
        </button>
        <button className={styles.button} onClick={onTodayClick} title="Today">
          <FaCalendarDay />
        </button>
        <button className={styles.button} onClick={onPreviousWeek} title="Previous Week">
          <FaChevronLeft />
        </button>
        <button className={styles.button} onClick={onNextWeek} title="Next Week">
          <FaChevronRight />
        </button>
      </div>
      
      <div className={styles.headerInfo}>
        <h2 className={styles.monthYear}>{formatDate(selectedDate)}</h2>
        <button 
          className={styles.toggleButton}
          onClick={onToggleAppointments}
          title={isAllAppointments ? 'Show My Appointments' : 'Show All Appointments'}
        >
          <FaList />
        </button>
      </div>
    </div>
  );
};

export default AppointmentHeader; 