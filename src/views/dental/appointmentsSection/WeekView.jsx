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
  onPatientClick
}) => {
  const getAppointmentsForDay = (date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), date)
    );
  };

  const hasAnyAppointments = appointments.length > 0;

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
        
        return (
          <div key={index} className={styles.dayColumn}>
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