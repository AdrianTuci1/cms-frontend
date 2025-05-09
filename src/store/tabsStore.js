import { create } from 'zustand';
import { getBusinessType } from '../config/businessTypes';

const useTabsStore = create((set) => {
  const businessType = getBusinessType();

  // Common tabs for all business types
  const commonTabs = [
    { id: 'members', label: 'Membri', icon: '👥', section: 'admin' },
    { id: 'roles', label: 'Roluri și Permisiuni', icon: '🔑', section: 'admin' },
    { id: 'gallery', label: 'Galerie', icon: '🖼️', section: 'settings' },
  ];

  // Business type specific tabs
  const businessTypeTabs = {
    'Dental Clinic': [
      { id: 'dental-treatments', label: 'Tratamente', icon: '🦷', section: 'settings' },
    ],
    'Gym': [
      { id: 'gym-subscriptions', label: 'Abonamente', icon: '💳', section: 'settings' },
      { id: 'gym-classes', label: 'Clase', icon: '🏋️', section: 'settings' },
      { id: 'gym-facilities', label: 'Facilități', icon: '🏋️‍♀️', section: 'settings' },
    ],
    'Hotel': [
      { id: 'reservations', label: 'Gestionare Rezervări', icon: '🔒', section: 'settings' },
      { id: 'attractions', label: 'Atracții', icon: '🎡', section: 'settings' },
      { id: 'services', label: 'Servicii', icon: '🛍️', section: 'settings' },
    ],
  };

  const allTabs = [...commonTabs, ...(businessTypeTabs[businessType.name] || [])];

  // Set initial active tab based on section
  const getInitialTab = (section) => {
    if (section === 'admin') return 'members';
    if (section === 'settings') {
      switch (businessType.name) {
        case 'Gym':
          return 'gym-subscriptions';
        case 'Hotel':
          return 'reservations';
        case 'Dental Clinic':
          return 'dental-treatments';
        default:
          return 'gallery';
      }
    }
    return '';
  };

  return {
    // State
    activeTab: getInitialTab('admin'),
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
      set({
        activeSection: section,
        activeTab: getInitialTab(section)
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