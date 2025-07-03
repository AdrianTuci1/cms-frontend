import { create } from 'zustand';
import { useMemo, useCallback } from 'react';

const useTimelineStore = create((set) => ({
  showFullDay: false,
  selectedMember: null,

  setShowFullDay: (value) => set({ showFullDay: value }),
  setSelectedMember: (member) => set({ selectedMember: member }),
  clearSelectedMember: () => set({ selectedMember: null }),

  // Initialize store
  initialize: () => {
    set({
      showFullDay: false,
      selectedMember: null
    });
  },

  // Cleanup
  cleanup: () => {
    set({
      showFullDay: false,
      selectedMember: null
    });
  }
}));

/**
 * Hook pentru gym timeline cu integrare API
 * @param {Object} timelineData - Timeline data from shared context
 * @param {Object} options - Opțiuni pentru timeline
 */
export const useGymTimelineWithAPI = (timelineData = null, options = {}) => {
  const {
    startDate = null,
    endDate = null,
    enableValidation = true,
    enableBusinessLogic = true
  } = options;

  // Folosește store-ul local pentru state management
  const timelineStore = useTimelineStore();

  // Memoizează datele derivate pentru a evita infinite re-renders
  const checkedIn = useMemo(() => timelineData?.checkedIn || [], [timelineData?.checkedIn]);
  const classes = useMemo(() => timelineData?.classes || [], [timelineData?.classes]);
  const occupancy = useMemo(() => timelineData?.occupancy || [], [timelineData?.occupancy]);

  const activeMembers = useMemo(() => 
    checkedIn.filter(member => !member.checkOutTime),
    [checkedIn]
  );

  const getClassesAfterTime = useCallback((time) => 
    classes.filter(cls => cls.startHour > time),
    [classes]
  );

  const calculateTotalOccupancy = useCallback(() => 
    occupancy.reduce((total, facility) => {
      const [current, max] = facility.occupancy.split('/').map(Number);
      return {
        current: total.current + current,
        max: total.max + max
      };
    }, { current: 0, max: 0 }),
    [occupancy]
  );

  return {
    // Local state management
    ...timelineStore,
    
    // Business-specific data - memoizat pentru a evita infinite re-renders
    getGymData: () => ({
      checkedIn,
      classes,
      occupancy
    }),
    
    // Business-specific actions (these would need to be implemented with actual API calls)
    checkInMember: async (memberData) => {
      try {
        // This would need to be implemented with actual API integration
        console.log('Checking in member:', memberData);
        throw new Error('Member check-in not implemented yet');
      } catch (error) {
        console.error('Error checking in member:', error);
        throw error;
      }
    },

    checkOutMember: async (memberId) => {
      try {
        // This would need to be implemented with actual API integration
        console.log('Checking out member:', memberId);
        throw new Error('Member check-out not implemented yet');
      } catch (error) {
        console.error('Error checking out member:', error);
        throw error;
      }
    },

    // Helper functions - memoizate
    getActiveMembers: () => activeMembers,
    getClassesAfterTime,
    calculateTotalOccupancy
  };
};

export default useTimelineStore; 