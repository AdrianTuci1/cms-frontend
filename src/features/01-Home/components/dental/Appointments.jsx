import { useEffect, lazy, Suspense, useState } from 'react';
import AppointmentHeader from './appointmentsSection/AppointmentHeader';
import WeekNavigator from './appointmentsSection/WeekNavigator';
import styles from './appointmentsSection/Appointments.module.css';
import AddAppointment from '../../components/drawer/AddAppointment/AddAppointment';
import useDrawerStore from '../../store/drawerStore';
import { useDentalTimelineWithAPI } from '../../store';

// Lazy load WeekView component
const WeekView = lazy(() => import('./appointmentsSection/WeekView'));

const Appointments = () => {
  const { openDrawer } = useDrawerStore();
  
  // Date range for timeline
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Use the new timeline integration hook
  const timeline = useDentalTimelineWithAPI({
    startDate,
    endDate,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    data,
    loading,
    error,
    refresh,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointments,
    selectedDate,
    currentWeek,
    setSelectedDate,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    isAllAppointments,
    setAllAppointments
  } = timeline;

  const { appointments, displayedAppointments, getAppointmentsCountForDate } = getAppointments();

  useEffect(() => {
    // Initialize the timeline when component mounts
    if (timeline.initialize) {
      timeline.initialize();
    }
  }, [timeline]);

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
          <p>{error.message || error}</p>
          <button onClick={refresh}>Încearcă din nou</button>
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
          isLoading={loading}
        />
      </Suspense>
    </div>
  );
};

export default Appointments; 