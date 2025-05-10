import { useEffect, useState } from 'react';
import { mockAppointments } from '../../data/mockAppointments';
import AppointmentHeader from './appointmentsSection/AppointmentHeader';
import WeekNavigator from './appointmentsSection/WeekNavigator';
import WeekView from './appointmentsSection/WeekView';
import styles from './appointmentsSection/Appointments.module.css';

const calculateCurrentWeek = (date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    week.push(day);
  }
  return week;
};

const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const addWeeks = (date, weeks) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + (weeks * 7));
  return newDate;
};

const subWeeks = (date, weeks) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - (weeks * 7));
  return newDate;
};

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAllAppointments, setIsAllAppointments] = useState(true);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const weekDates = calculateCurrentWeek(selectedDate);
    setCurrentWeek(weekDates);
    
    // Simulăm încărcarea datelor
    setLoading(true);
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 500);
  }, [selectedDate]);

  const displayedAppointments = isAllAppointments
    ? appointments
    : appointments.filter(appointment => appointment.medicId === 1); // Replace 1 with actual medic ID

  const handlePreviousWeek = () => setSelectedDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setSelectedDate(prev => addWeeks(prev, 1));
  const handleTodayClick = () => setSelectedDate(new Date());

  const handleAddAppointment = () => {
    // To be implemented with drawer
    console.log('Add appointment clicked');
  };

  const handleAppointmentClick = (appointment) => {
    // To be implemented with drawer
    console.log('Appointment clicked:', appointment);
  };

  const handlePatientClick = (appointment) => {
    // To be implemented with drawer
    console.log('Patient clicked:', appointment);
  };

  const getAppointmentsCount = (date) => {
    return displayedAppointments.filter(appointment =>
      isSameDay(new Date(appointment.date), date)
    ).length;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AppointmentHeader
        onAddAppointment={handleAddAppointment}
        onTodayClick={handleTodayClick}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        isAllAppointments={isAllAppointments}
        onToggleAppointments={() => setIsAllAppointments(prev => !prev)}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <WeekNavigator
        currentWeek={currentWeek}
        selectedDate={selectedDate}
        getAppointmentsCount={getAppointmentsCount}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      <WeekView
        selectedWeek={currentWeek}
        appointments={displayedAppointments}
        onAppointmentClick={handleAppointmentClick}
        onPatientClick={handlePatientClick}
      />
    </div>
  );
};

export default Appointments; 