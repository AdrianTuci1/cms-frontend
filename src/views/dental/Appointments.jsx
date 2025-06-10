import { useEffect, useState, lazy, Suspense } from 'react';
import { mockAppointments } from '../../data/mockAppointments';
import AppointmentHeader from './appointmentsSection/AppointmentHeader';
import WeekNavigator from './appointmentsSection/WeekNavigator';
import styles from './appointmentsSection/Appointments.module.css';
import AddAppointment from '../../components/drawer/AddAppointment/AddAppointment';
import useDrawerStore from '../../store/drawerStore';

// Lazy load WeekView component
const WeekView = lazy(() => import('./appointmentsSection/WeekView'));

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
  const { openDrawer } = useDrawerStore();

  useEffect(() => {
    const weekDates = calculateCurrentWeek(selectedDate);
    setCurrentWeek(weekDates);
    
    // Filtrăm doar programările pentru săptămâna curentă
    const weekStart = weekDates[0];
    const weekEnd = weekDates[6];
    const filteredAppointments = mockAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= weekStart && appointmentDate <= weekEnd;
    });
    setAppointments(filteredAppointments);
  }, [selectedDate]);

  const displayedAppointments = isAllAppointments
    ? appointments
    : appointments.filter(appointment => appointment.medicId === 1); // Replace 1 with actual medic ID

  const handlePreviousWeek = () => setSelectedDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setSelectedDate(prev => addWeeks(prev, 1));
  const handleTodayClick = () => setSelectedDate(new Date());

  const handleAddAppointment = () => {
    // To be implemented with drawer
    openDrawer(<AddAppointment />, 'addAppointment');
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

      <Suspense fallback={null}>
        <WeekView
          selectedWeek={currentWeek}
          appointments={displayedAppointments}
          onAppointmentClick={handleAppointmentClick}
          onPatientClick={handlePatientClick}
        />
      </Suspense>
    </div>
  );
};

export default Appointments; 