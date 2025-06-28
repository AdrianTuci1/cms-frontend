import { create } from 'zustand';
import { useDataSync } from '../../design-patterns/hooks/useDataSync';

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

  return {
    // API integration
    ...timelineSync,
    
    // Local state management
    ...timelineStore,
    
    // Business-specific data
    getGymData: () => {
      const { data } = timelineSync;
      return {
        checkedIn: data?.checkedIn || [],
        classes: data?.classes || [],
        occupancy: data?.occupancy || []
      };
    },
    
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

    // Helper functions
    getActiveMembers: () => {
      const { data } = timelineSync;
      return (data?.checkedIn || []).filter(member => !member.checkOutTime);
    },

    getClassesAfterTime: (time) => {
      const { data } = timelineSync;
      return (data?.classes || []).filter(cls => cls.startHour > time);
    },

    calculateTotalOccupancy: () => {
      const { data } = timelineSync;
      return (data?.occupancy || []).reduce((total, facility) => {
        const [current, max] = facility.occupancy.split('/').map(Number);
        return {
          current: total.current + current,
          max: total.max + max
        };
      }, { current: 0, max: 0 });
    }
  };
};

export default useTimelineStore; 