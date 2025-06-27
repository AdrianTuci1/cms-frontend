import { create } from 'zustand';
import { mockAppointments } from '../data/mockAppointments';
import { dataSyncManager } from '../services/dataSync/DataSyncManager.js';

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
  appointments: [],
  currentWeek: [],
  selectedDate: new Date(),
  isLoading: false,
  error: null,
  isAllAppointments: true,
  selectedMedicId: null,

  // Actions
  setSelectedDate: (date) => {
    const weekDates = calculateCurrentWeek(date);
    set({ 
      selectedDate: date, 
      currentWeek: weekDates 
    });
    get().fetchAppointmentsForWeek(weekDates[0], weekDates[6]);
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

  // Data fetching with DataSyncManager
  fetchAppointmentsForWeek: async (startDate, endDate) => {
    set({ isLoading: true, error: null });

    try {
      // Use DataSyncManager to get appointments
      const dateRange = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
      
      const appointments = await dataSyncManager.getAppointments(dateRange);
      
      set({ 
        appointments,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      
      // Fallback to mock data on error
      try {
        const weekStart = startDate;
        const weekEnd = endDate;
        const filteredAppointments = mockAppointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= weekStart && appointmentDate <= weekEnd;
        });

        set({ 
          appointments: filteredAppointments,
          error: 'Eroare la conectarea la server. Se afișează date demo.',
          isLoading: false 
        });
      } catch (fallbackError) {
        set({ 
          error: error.message || 'Failed to fetch appointments',
          isLoading: false 
        });
      }
    }
  },

  // Create appointment using DataSyncManager
  createAppointment: async (appointment) => {
    try {
      const newAppointment = await dataSyncManager.createAppointment(appointment);
      
      // The store will be updated automatically via observer
      // But we can also update optimistically here
      set(state => ({
        appointments: [...state.appointments, newAppointment]
      }));

      return newAppointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Update appointment
  updateAppointment: async (id, updates) => {
    try {
      // This would be implemented in DataSyncManager
      // For now, just update locally
      set(state => ({
        appointments: state.appointments.map(appointment =>
          appointment.id === id ? { ...appointment, ...updates } : appointment
        )
      }));
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    try {
      // This would be implemented in DataSyncManager
      // For now, just remove locally
      set(state => ({
        appointments: state.appointments.filter(appointment => appointment.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  // Computed values
  getDisplayedAppointments: () => {
    const { appointments, isAllAppointments, selectedMedicId } = get();
    
    if (isAllAppointments) {
      return appointments;
    }
    
    return appointments.filter(appointment => 
      appointment.medicId === selectedMedicId
    );
  },

  getAppointmentsCountForDate: (date) => {
    const { getDisplayedAppointments } = get();
    const displayedAppointments = getDisplayedAppointments();
    
    return displayedAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getFullYear() === date.getFullYear() &&
             appointmentDate.getMonth() === date.getMonth() &&
             appointmentDate.getDate() === date.getDate();
    }).length;
  },

  // Initialize store and subscribe to DataSyncManager
  initialize: () => {
    const today = new Date();
    const weekDates = calculateCurrentWeek(today);
    set({ 
      selectedDate: today, 
      currentWeek: weekDates 
    });
    get().fetchAppointmentsForWeek(weekDates[0], weekDates[6]);

    // Subscribe to DataSyncManager events
    const unsubscribeAppointmentCreated = dataSyncManager.subscribe(
      'APPOINTMENT_CREATED',
      (data) => {
        console.log('AppointmentsStore: Received APPOINTMENT_CREATED event', data);
        set(state => ({
          appointments: [...state.appointments, data]
        }));
      },
      'AppointmentsStore'
    );

    const unsubscribeAppointmentUpdated = dataSyncManager.subscribe(
      'APPOINTMENT_UPDATED',
      (data) => {
        console.log('AppointmentsStore: Received APPOINTMENT_UPDATED event', data);
        set(state => ({
          appointments: state.appointments.map(appointment =>
            appointment.id === data.id ? { ...appointment, ...data } : appointment
          )
        }));
      },
      'AppointmentsStore'
    );

    const unsubscribeAppointmentDeleted = dataSyncManager.subscribe(
      'APPOINTMENT_DELETED',
      (data) => {
        console.log('AppointmentsStore: Received APPOINTMENT_DELETED event', data);
        set(state => ({
          appointments: state.appointments.filter(appointment => appointment.id !== data.id)
        }));
      },
      'AppointmentsStore'
    );

    const unsubscribeDataChanged = dataSyncManager.subscribe(
      'DATA_CHANGED',
      (data) => {
        console.log('AppointmentsStore: Received DATA_CHANGED event', data);
        
        // Handle general data changes
        if (data.type === 'appointments') {
          switch (data.action) {
            case 'created':
              set(state => ({
                appointments: [...state.appointments, data.data]
              }));
              break;
            case 'updated':
              set(state => ({
                appointments: state.appointments.map(appointment =>
                  appointment.id === data.data.id ? { ...appointment, ...data.data } : appointment
                )
              }));
              break;
            case 'deleted':
              set(state => ({
                appointments: state.appointments.filter(appointment => appointment.id !== data.data.id)
              }));
              break;
          }
        }
      },
      'AppointmentsStore'
    );

    // Store unsubscribe functions for cleanup
    set({ 
      _unsubscribeFunctions: [
        unsubscribeAppointmentCreated,
        unsubscribeAppointmentUpdated,
        unsubscribeAppointmentDeleted,
        unsubscribeDataChanged
      ]
    });
  },

  // Cleanup subscriptions
  cleanup: () => {
    const { _unsubscribeFunctions } = get();
    if (_unsubscribeFunctions) {
      _unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    }
    set({ _unsubscribeFunctions: [] });
  }
}));

export default useAppointmentsStore; 