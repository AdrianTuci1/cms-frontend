import { create } from 'zustand';

const useTimelineStore = create((set) => ({
  showFullDay: false,
  selectedMember: null,

  setShowFullDay: (value) => set({ showFullDay: value }),
  setSelectedMember: (member) => set({ selectedMember: member }),
  clearSelectedMember: () => set({ selectedMember: null }),
}));

export default useTimelineStore; 