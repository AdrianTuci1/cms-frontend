import { create } from 'zustand';
import { getBusinessTypeKey } from '../config/businessTypes';

const useLocationsStore = create((set, get) => {
  const businessTypeKey = getBusinessTypeKey();
  
  // Mock data - should be replaced with API calls
  const mockLocations = {
    'DENTAL': [
      { id: 1, name: 'Dental Clinic Central', identifier: 'Strada Victoriei 10' },
      { id: 2, name: 'Dental Clinic Nord', identifier: 'Bulevardul Decebal 24' },
      { id: 3, name: 'Dental Clinic Vest', identifier: 'Calea Aradului 55' }
    ],
    'GYM': [
      { id: 1, name: 'Fitness Hub Central', identifier: 'Piața Unirii' },
      { id: 2, name: 'Fitness Hub Mall', identifier: 'Shopping City' }
    ],
    'HOTEL': [
      { id: 1, name: 'Hotel Royal', identifier: 'Centru' },
      { id: 2, name: 'Hotel Elite', identifier: 'Gara' },
      { id: 3, name: 'Hotel Seaside', identifier: 'Plaja' }
    ]
  };

  return {
    locations: mockLocations[businessTypeKey] || [],
    currentLocation: mockLocations[businessTypeKey]?.[0] || null,
    
    // Set current location
    setCurrentLocation: (locationId) => {
      const location = get().locations.find(loc => loc.id === locationId);
      if (location) {
        set({ currentLocation: location });
        return true;
      }
      return false;
    },
    
    // Add a new location
    addLocation: (location) => {
      if (!location.id) {
        location.id = Math.max(0, ...get().locations.map(l => l.id)) + 1;
      }
      set(state => ({ locations: [...state.locations, location] }));
    },
    
    // Update a location
    updateLocation: (locationId, updatedData) => {
      set(state => ({
        locations: state.locations.map(loc => 
          loc.id === locationId ? { ...loc, ...updatedData } : loc
        )
      }));
    },
    
    // Remove a location
    removeLocation: (locationId) => {
      set(state => ({
        locations: state.locations.filter(loc => loc.id !== locationId)
      }));
      
      // If we removed the current location, select the first available
      if (get().currentLocation?.id === locationId) {
        const firstLocation = get().locations[0];
        if (firstLocation) {
          set({ currentLocation: firstLocation });
        } else {
          set({ currentLocation: null });
        }
      }
    },
    
    // Fetch locations from API
    fetchLocations: async () => {
      try {
        // This would be replaced with an actual API call
        // const response = await fetch('/api/locations');
        // const data = await response.json();
        // set({ locations: data, currentLocation: data[0] || null });
        
        // For now, we're using mock data
        console.log('Fetched locations (mock)');
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }
  };
});

export default useLocationsStore; 