import { useEffect, lazy, Suspense } from 'react';
import AppointmentHeader from './appointmentsSection/AppointmentHeader';
import WeekNavigator from './appointmentsSection/WeekNavigator';
import styles from './appointmentsSection/Appointments.module.css';
import AddAppointment from '../../components/drawer/AddAppointment/AddAppointment';
import useDrawerStore from '../../store/drawerStore';
import useAppointmentsStore from '../../store/appointmentsStore';

// Lazy load WeekView component
const WeekView = lazy(() => import('./appointmentsSection/WeekView'));

const Appointments = () => {
  const { openDrawer } = useDrawerStore();
  const {
    currentWeek,
    selectedDate,
    isLoading,
    error,
    isAllAppointments,
    displayedAppointments,
    setSelectedDate,
    setAllAppointments,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    getAppointmentsCountForDate,
    initialize
  } = useAppointmentsStore();

  useEffect(() => {
    // Initialize the store when component mounts
    initialize();
  }, [initialize]);

  const handleAddAppointment = () => {
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

  const handleToggleAppointments = () => {
    setAllAppointments(!isAllAppointments);
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h3>Eroare la încărcarea programărilor</h3>
          <p>{error}</p>
          <button onClick={initialize}>Încearcă din nou</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AppointmentHeader
        onAddAppointment={handleAddAppointment}
        onTodayClick={goToToday}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        isAllAppointments={isAllAppointments}
        onToggleAppointments={handleToggleAppointments}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <WeekNavigator
        currentWeek={currentWeek}
        selectedDate={selectedDate}
        getAppointmentsCount={getAppointmentsCountForDate}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
      />

      <Suspense fallback={
        <div className={styles.loadingState}>
          <p>Se încarcă programările...</p>
        </div>
      }>
        <WeekView
          selectedWeek={currentWeek}
          appointments={displayedAppointments}
          onAppointmentClick={handleAppointmentClick}
          onPatientClick={handlePatientClick}
          isLoading={isLoading}
        />
      </Suspense>
    </div>
  );
};

export default Appointments; 