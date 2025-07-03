/**
 * Timeline Mock Data - Date mock pentru timeline-uri (dental, gym, hotel)
 */

// Import comprehensive test data from testData
import dentalTimelineData from '../../testData/dentalTimeline/dental-timeline-week.json';

// Mock data pentru timeline (dental) - Using comprehensive test data
export const dentalTimelineMock = dentalTimelineData;

// Mock data pentru timeline (gym)
export const gymTimelineMock = {
  id: 'gym-timeline-001',
  businessType: 'gym',
  members: [
    {
      id: 'member-001',
      name: 'Alexandru Vasilescu',
      membershipType: 'Premium',
      checkIn: '2024-01-15T08:30:00Z',
      checkOut: null,
      status: 'active',
      type: 'member',
      timelineType: 'checkin'
    },
    {
      id: 'member-002',
      name: 'Elena Dumitrescu',
      membershipType: 'Basic',
      checkIn: '2024-01-15T09:15:00Z',
      checkOut: '2024-01-15T10:45:00Z',
      status: 'completed',
      type: 'member',
      timelineType: 'checkin'
    }
  ],
  classes: [
    {
      id: 'class-001',
      name: 'Zumba',
      teacher: 'Maria Popescu',
      startTime: '2024-01-15T10:00:00Z',
      duration: 60,
      maxParticipants: 20,
      currentParticipants: 15,
      type: 'class',
      timelineType: 'class'
    }
  ],
  occupancy: {
    id: 'occupancy-001',
    current: 12,
    maxCapacity: 50,
    percentage: 24,
    type: 'occupancy',
    timelineType: 'occupancy'
  }
};

// Mock data pentru timeline (hotel)
export const hotelTimelineMock = {
  id: 'hotel-timeline-001',
  businessType: 'hotel',
  reservations: [
    {
      id: 'res-001',
      guestName: 'Petru Marin',
      roomNumber: '101',
      checkIn: '2024-01-15',
      checkOut: '2024-01-17',
      status: 'confirmed',
      guests: 2,
      type: 'reservation',
      timelineType: 'booking'
    },
    {
      id: 'res-002',
      guestName: 'Ana Stoica',
      roomNumber: '205',
      checkIn: '2024-01-15',
      checkOut: '2024-01-16',
      status: 'checked-in',
      guests: 1,
      type: 'reservation',
      timelineType: 'booking'
    }
  ],
  occupancy: {
    id: 'hotel-occupancy-001',
    occupied: 15,
    total: 30,
    percentage: 50,
    type: 'occupancy',
    timelineType: 'occupancy'
  }
};

/**
 * Funcție pentru obținerea datelor timeline în funcție de tipul de business
 */
export function getTimelineMock(businessType = 'dental') {
  switch (businessType) {
    case 'dental':
      return dentalTimelineMock;
    case 'gym':
      return gymTimelineMock;
    case 'hotel':
      return hotelTimelineMock;
    default:
      return dentalTimelineMock; // default
  }
}

export default {
  dentalTimelineMock,
  gymTimelineMock,
  hotelTimelineMock,
  getTimelineMock
}; 