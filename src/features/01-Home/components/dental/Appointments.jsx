import { useEffect, lazy, Suspense, useState, useMemo } from 'react';
import AppointmentHeader from './timeline/AppointmentHeader';
import WeekNavigator from './timeline/WeekNavigator';
import styles from './timeline/Appointments.module.css';
import { useDrawer, useTimelineDrawerActions } from '../../../00-Drawers';
import { useDentalTimelineWithAPI } from '../../store/dentalTimeline';
import { useDataSync } from '../../../../design-patterns/hooks';
import { getBusinessTypeKey, getBusinessTypeKeyForSync } from '../../../../config/businessTypes';

// Lazy load WeekView component
const WeekView = lazy(() => import('./timeline/WeekView'));

// Helper function to get current week dates
const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  
  // Calculate start of week (Monday)
  const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
  startOfWeek.setDate(today.getDate() - daysToSubtract);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Calculate end of week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return {
    startDate: startOfWeek.toISOString().split('T')[0], // YYYY-MM-DD format
    endDate: endOfWeek.toISOString().split('T')[0]
  };
};

const Appointments = () => {
  const { isOpen, currentMode, currentDrawerType } = useDrawer();
  const businessTypeKey = getBusinessTypeKey();
  const businessTypeForSync = getBusinessTypeKeyForSync(businessTypeKey);
  
  // Get current week dates
  const { startDate: currentWeekStart, endDate: currentWeekEnd } = getCurrentWeekDates();
  
  // Date range for timeline - Use current week
  const [startDate, setStartDate] = useState(currentWeekStart);
  const [endDate, setEndDate] = useState(currentWeekEnd);

  // Use useDataSync hook directly for timeline data
  const timelineSync = useDataSync('timeline', {
    businessType: businessTypeForSync,
    startDate,
    endDate,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const { 
    data: timelineData,
    loading,
    error,
    refresh
  } = timelineSync;

  // Use timeline drawer actions hook from drawer directory
  const {
    handleAddAppointment,
    handleAppointmentClick,
    handlePatientClick
  } = useTimelineDrawerActions(timelineSync, businessTypeForSync);

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
    
    // Set selected date to today
    setSelectedDate(new Date());
  }, []); // Empty dependency array to run only once

  // Update date range when week navigation changes
  useEffect(() => {
    if (currentWeek && currentWeek.length > 0) {
      const weekStart = new Date(currentWeek[0]);
      const weekEnd = new Date(currentWeek[currentWeek.length - 1]);
      
      setStartDate(weekStart.toISOString().split('T')[0]);
      setEndDate(weekEnd.toISOString().split('T')[0]);
    }
  }, [currentWeek]);

  const handleToggleAppointments = () => {
    setAllAppointments(!isAllAppointments);
  };

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
          loading={loading}
          error={error}
          onRetry={refresh}
        />
      </Suspense>
    </div>
  );
};

export default Appointments; 