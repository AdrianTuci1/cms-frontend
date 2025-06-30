import { create } from 'zustand';
import { useDataSync } from '../../../design-patterns/hooks';
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
 * @param {Object} options - Opțiuni pentru useDataSync
 */
export const useGymTimelineWithAPI = (options = {}) => {
  const {
    startDate = null,
    endDate = null,
    enableValidation = true,
    enableBusinessLogic = true
  } = options;

  // Folosește useDataSync pentru integrarea cu API
  const timelineSync = useDataSync('timeline', {
    businessType: 'gym',
    startDate,
    endDate,
    enableValidation,
    enableBusinessLogic
  });

  // Folosește store-ul local pentru state management
  const timelineStore = useTimelineStore();

  // Memoizează datele derivate pentru a evita infinite re-renders
  const checkedIn = useMemo(() => timelineSync.data?.checkedIn || [], [timelineSync.data?.checkedIn]);
  const classes = useMemo(() => timelineSync.data?.classes || [], [timelineSync.data?.classes]);
  const occupancy = useMemo(() => timelineSync.data?.occupancy || [], [timelineSync.data?.occupancy]);

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
    // API integration
    ...timelineSync,
    
    // Local state management
    ...timelineStore,
    
    // Business-specific data - memoizat pentru a evita infinite re-renders
    getGymData: () => ({
      checkedIn,
      classes,
      occupancy
    }),
    
    // Business-specific actions
    checkInMember: async (memberData) => {
      try {
        const checkIn = await timelineSync.create({
          ...memberData,
          checkInTime: new Date().toISOString(),
          type: 'checkIn'
        });
        return checkIn;
      } catch (error) {
        console.error('Error checking in member:', error);
        throw error;
      }
    },

    checkOutMember: async (memberId) => {
      try {
        const checkOut = await timelineSync.update({
          id: memberId,
          checkOutTime: new Date().toISOString(),
          type: 'checkOut'
        });
        return checkOut;
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