import { create } from 'zustand';
import { useDataSync } from '../../../design-patterns/hooks';
import { useMemo, useCallback } from 'react';

// Helper functions for date calculations
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

const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

const useAppointmentsStore = create((set, get) => ({
  // State
  selectedDate: new Date(),
  currentWeek: [],
  isAllAppointments: true,
  selectedMedicId: null,

  // Actions
  setSelectedDate: (date) => {
    const weekDates = calculateCurrentWeek(date);
    set({ 
      selectedDate: date, 
      currentWeek: weekDates 
    });
  },

  setAllAppointments: (isAll) => {
    set({ isAllAppointments: isAll });
  },

  setSelectedMedicId: (medicId) => {
    set({ selectedMedicId: medicId });
  },

  goToPreviousWeek: () => {
    const { selectedDate } = get();
    const newDate = subWeeks(selectedDate, 1);
    get().setSelectedDate(newDate);
  },

  goToNextWeek: () => {
    const { selectedDate } = get();
    const newDate = addWeeks(selectedDate, 1);
    get().setSelectedDate(newDate);
  },

  goToToday: () => {
    get().setSelectedDate(new Date());
  },

  // Computed values
  getDisplayedAppointments: (appointments) => {
    const { isAllAppointments, selectedMedicId } = get();
    
    if (isAllAppointments) {
      return appointments;
    }
    
    return appointments.filter(appointment => 
      appointment.medicId === selectedMedicId
    );
  },

  getAppointmentsCountForDate: (appointments, date) => {
    const displayedAppointments = get().getDisplayedAppointments(appointments);
    
    return displayedAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getFullYear() === date.getFullYear() &&
             appointmentDate.getMonth() === date.getMonth() &&
             appointmentDate.getDate() === date.getDate();
    }).length;
  },

  // Initialize store
  initialize: () => {
    const today = new Date();
    const weekDates = calculateCurrentWeek(today);
    set({ 
      selectedDate: today, 
      currentWeek: weekDates 
    });
  },

  // Cleanup
  cleanup: () => {
    set({ 
      selectedDate: new Date(),
      currentWeek: [],
      isAllAppointments: true,
      selectedMedicId: null
    });
  }
}));

/**
 * Hook pentru dental timeline cu integrare API
 * @param {Object} options - Opțiuni pentru useDataSync
 */
export const useDentalTimelineWithAPI = (options = {}) => {
  const {
    startDate = null,
    endDate = null,
    enableValidation = true,
    enableBusinessLogic = true
  } = options;

  // Folosește useDataSync pentru integrarea cu API
  const timelineSync = useDataSync('timeline', {
    businessType: 'dental',
    startDate,
    endDate,
    enableValidation,
    enableBusinessLogic
  });

  // Folosește store-ul local pentru state management
  const appointmentsStore = useAppointmentsStore();

  // Memoizează datele derivate pentru a evita infinite re-renders
  const appointments = useMemo(() => timelineSync.data?.reservations || [], [timelineSync.data?.reservations]);
  
  const displayedAppointments = useMemo(() => 
    appointmentsStore.getDisplayedAppointments(appointments),
    [appointments, appointmentsStore.isAllAppointments, appointmentsStore.selectedMedicId]
  );

  const getAppointmentsCountForDate = useCallback((date) => 
    appointmentsStore.getAppointmentsCountForDate(appointments, date),
    [appointments, appointmentsStore.isAllAppointments, appointmentsStore.selectedMedicId]
  );

  return {
    // API integration
    ...timelineSync,
    
    // Local state management
    ...appointmentsStore,
    
    // Business-specific data - memoizat pentru a evita infinite re-renders
    getAppointments: () => ({
      appointments,
      displayedAppointments,
      getAppointmentsCountForDate
    }),
    
    // Business-specific actions
    createAppointment: async (appointment) => {
      try {
        const newAppointment = await timelineSync.create(appointment);
        return newAppointment;
      } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }
    },

    updateAppointment: async (id, updates) => {
      try {
        const updatedAppointment = await timelineSync.update({ id, ...updates });
        return updatedAppointment;
      } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
      }
    },

    deleteAppointment: async (id) => {
      try {
        await timelineSync.remove({ id });
      } catch (error) {
        console.error('Error deleting appointment:', error);
        throw error;
      }
    }
  };
};

export default useAppointmentsStore; 