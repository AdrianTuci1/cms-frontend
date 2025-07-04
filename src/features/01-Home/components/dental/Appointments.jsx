import { useEffect, lazy, Suspense, useState, useMemo } from 'react';
import AppointmentHeader from './timeline/AppointmentHeader';
import WeekNavigator from './timeline/WeekNavigator';
import styles from './timeline/Appointments.module.css';
import { openDrawer, useDrawer, useDrawerStore, DRAWER_TYPES } from '../../../00-Drawers';
import { useDentalTimelineWithAPI } from '../../store/dentalTimeline';
import { useDataSync } from '../../../../design-patterns/hooks';

// Lazy load WeekView component
const WeekView = lazy(() => import('./timeline/WeekView'));

const Appointments = () => {
  const { isOpen, currentMode, currentDrawerType } = useDrawer();
  
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
    // Create new appointment with default values
    const newAppointment = {
      clientId: null,
      clientName: '',
      phoneNumber: '',
      email: '',
      treatmentId: null,
      displayTreatment: '',
      medicId: null,
      medicName: '',
      date: new Date().toISOString().slice(0, 16), // Current date and time
      duration: 60,
      status: 'scheduled',
      color: '#1976d2',
      notes: ''
    };

    openDrawer('create', DRAWER_TYPES.TIMELINE, newAppointment, {
      title: 'New Dental Appointment',
      onSave: async (data, mode) => {
        console.log('Saving appointment:', data);
        
        try {
          // Use optimistic update from useDataSync
          await timelineSync.create(data);
          console.log('Appointment saved successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to save appointment:', error);
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onCancel: () => {
        console.log('Appointment creation cancelled');
      }
    });
  };

  const handleAppointmentClick = (appointment) => {
    // Edit existing appointment
    const appointmentData = {
      id: appointment.id,
      clientId: appointment.clientId,
      clientName: appointment.clientName,
      phoneNumber: appointment.phoneNumber || '',
      email: appointment.email || '',
      treatmentId: appointment.treatmentId,
      displayTreatment: appointment.displayTreatment,
      medicId: appointment.medicId,
      medicName: appointment.medicName,
      date: appointment.date ? new Date(appointment.date).toISOString().slice(0, 16) : '',
      duration: appointment.duration,
      status: appointment.status,
      color: appointment.color,
      notes: appointment.notes || ''
    };

    openDrawer('edit', DRAWER_TYPES.TIMELINE, appointmentData, {
      title: 'Edit Dental Appointment',
      onSave: async (data, mode) => {
        console.log('Updating appointment:', data);
        
        try {
          // Use optimistic update from useDataSync
          await timelineSync.update(data);
          console.log('Appointment updated successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to update appointment:', error);
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onDelete: async (data) => {
        console.log('Deleting appointment:', data);
        
        try {
          // Use optimistic update from useDataSync
          await timelineSync.remove(data);
          console.log('Appointment deleted successfully with optimistic update!');
        } catch (error) {
          console.error('Failed to delete appointment:', error);
          // Error handling is automatic - optimistic update will be reverted
        }
      },
      onCancel: () => {
        console.log('Appointment edit cancelled');
      }
    });
  };

  const handlePatientClick = (appointment) => {
    // Open patient/member drawer for editing
    const patientData = {
      id: appointment.clientId,
      name: appointment.clientName,
      phoneNumber: appointment.phoneNumber || '',
      email: appointment.email || '',
      role: 'patient'
    };

    openDrawer('edit', DRAWER_TYPES.MEMBER, patientData, {
      title: 'Edit Patient Information',
      onSave: async (data, mode) => {
        console.log('Updating patient:', data);
        // Here you would typically update your API/database
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        console.log('Patient updated successfully!');
        
        // Refresh timeline data
        if (timelineSync.refresh) {
          timelineSync.refresh();
        }
      },
      onDelete: async (data) => {
        console.log('Deleting patient:', data);
        // Here you would typically delete from your API/database
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        console.log('Patient deleted successfully!');
        
        // Refresh timeline data
        if (timelineSync.refresh) {
          timelineSync.refresh();
        }
      },
      onCancel: () => {
        console.log('Patient edit cancelled');
      }
    });
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
      {/* Drawer status indicator */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(59, 130, 246, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.875rem',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          {currentMode} {currentDrawerType}
        </div>
      )}

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