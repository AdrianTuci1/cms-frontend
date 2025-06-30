import { create } from 'zustand';
import { getBusinessType } from '../config/businessTypes';

const useTabsStore = create((set) => {
  const businessType = getBusinessType();

  // Common tabs for all business types
  const commonTabs = [
    { id: 'members', label: 'Membri', icon: '👥', section: 'admin' },
    { id: 'roles', label: 'Roluri și Permisiuni', icon: '🔑', section: 'admin' }
  ];

  // Business type specific tabs
  const businessTypeTabs = {
    'Dental Clinic': [
      { id: 'dental-treatments', label: 'Tratamente', icon: '🦷', section: 'treatments' }
    ],
    'Gym': [
      { id: 'gym-subscriptions', label: 'Abonamente', icon: '💳', section: 'subscriptions' },
      { id: 'gym-classes', label: 'Clase', icon: '🏋️', section: 'classes' },
      { id: 'gym-facilities', label: 'Facilități', icon: '🏋️‍♀️', section: 'facilities' }
    ],
    'Hotel': [
      { id: 'reservations', label: 'Gestionare Rezervări', icon: '🔒', section: 'reservations' },
      { id: 'attractions', label: 'Atracții', icon: '🎡', section: 'attractions' },
      { id: 'services', label: 'Servicii', icon: '🛍️', section: 'services' }
    ]
  };

  const allTabs = [...commonTabs, ...(businessTypeTabs[businessType.name] || [])];

  return {
    // State
    activeTab: '',
    activeSection: 'admin',
    tabs: allTabs,

    // Actions
    setActiveTab: (tabId) => {
      const tab = allTabs.find(t => t.id === tabId);
      if (tab) {
        set({ 
          activeTab: tabId,
          activeSection: tab.section
        });
      }
    },

    setActiveSection: (section) => {
      const sectionTabs = allTabs.filter(tab => tab.section === section);
      set({
        activeSection: section,
        activeTab: sectionTabs.length > 0 ? sectionTabs[0].id : ''
      });
    },

    getTabsBySection: (section) => {
      return allTabs.filter(tab => tab.section === section);
    },

    getCurrentTab: () => {
      return allTabs.find(tab => tab.id === useTabsStore.getState().activeTab);
    }
  };
});

export default useTabsStore; 