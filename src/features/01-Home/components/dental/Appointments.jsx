import { useEffect, lazy, Suspense, useState, useMemo } from 'react';
import AppointmentHeader from './timeline/AppointmentHeader';
import WeekNavigator from './timeline/WeekNavigator';
import styles from './timeline/Appointments.module.css';
// import AddAppointment from '../../components/drawer/AddAppointment/AddAppointment';
// import useDrawerStore from '../../store/drawerStore';
import { useDentalTimelineWithAPI } from '../../store/dentalTimeline';
import { useDataSync } from '../../../../design-patterns/hooks';

// Lazy load WeekView component
const WeekView = lazy(() => import('./timeline/WeekView'));

const Appointments = () => {
  // const { openDrawer } = useDrawerStore();
  
  // Date range for timeline - Updated to match test data
  const [startDate, setStartDate] = useState('2024-01-15');
  const [endDate, setEndDate] = useState('2024-01-21');

  // Use useDataSync hook directly for timeline data
  const timelineSync = useDataSync('timeline', {
    businessType: 'dental',
    startDate,
    endDate,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const timelineData = timelineSync.data;

  // Use the updated timeline integration hook with shared data
  const timeline = useDentalTimelineWithAPI(timelineData, {
    startDate,
    endDate,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    getAppointments,
    selectedDate,
    currentWeek,
    setSelectedDate,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    isAllAppointments,
    setAllAppointments,
    initialize
  } = timeline;

  // Extragem appointments și displayedAppointments din hook
  const { appointments, displayedAppointments, getAppointmentsCountForDate } = getAppointments();

  // Folosim useMemo pentru displayedAppointments dacă este derivat
  const memoizedDisplayedAppointments = useMemo(() => displayedAppointments, [displayedAppointments]);

  useEffect(() => {
    // Initialize the timeline when component mounts
    if (initialize) {
      initialize();
    }
    
    // Set selected date to match test data period
    setSelectedDate(new Date('2024-01-16'));
  }, []); // Empty dependency array to run only once

  const handleAddAppointment = () => {
    // openDrawer(<AddAppointment />, 'addAppointment');
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

  // Show loading state if timeline data is loading
  if (timelineSync.loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingStateContent}>
            <div className={styles.spinner}></div>
            <p>Se încarcă programările...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if timeline data has error
  if (timelineSync.error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h3>Eroare la încărcarea programărilor</h3>
          <p>{timelineSync.error.message || timelineSync.error}</p>
          <button onClick={timelineSync.refresh}>Încearcă din nou</button>
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
          appointments={memoizedDisplayedAppointments}
          onAppointmentClick={handleAppointmentClick}
          onPatientClick={handlePatientClick}
          isLoading={false} // We handle loading state above
        />
      </Suspense>
    </div>
  );
};

export default Appointments; 