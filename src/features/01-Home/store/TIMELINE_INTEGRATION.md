# Timeline Integration - Hook-uri Individuale pentru fiecare Business Type

## Overview

Am integrat prima resursă 'timeline' pentru toate cele 3 tipuri de business-uri (dental, hotel, gym) folosind hook-uri individuale care se integrează cu noua arhitectură API cu `useDataSync` și Strategy Pattern.

## Structura Integrării

### 1. Hook-uri Individuale pentru fiecare Business Type

În loc de un store unificat, am creat hook-uri individuale pentru fiecare business type:

```javascript
// Dental Timeline
export const useDentalTimelineWithAPI = (options = {}) => {
  // Integrează useDataSync cu store-ul local pentru dental
};

// Hotel Timeline  
export const useHotelTimelineWithAPI = (options = {}) => {
  // Integrează useDataSync cu store-ul local pentru hotel
};

// Gym Timeline
export const useGymTimelineWithAPI = (options = {}) => {
  // Integrează useDataSync cu store-ul local pentru gym
};
```

### 2. Store-uri Locale pentru State Management

Fiecare business type are propriul store local pentru state management:

```javascript
// Dental Store
const useAppointmentsStore = create((set, get) => ({
  selectedDate: new Date(),
  currentWeek: [],
  isAllAppointments: true,
  selectedMedicId: null,
  // Actions și computed values...
}));

// Hotel Store
const useCalendarStore = create((set, get) => ({
  selectedRoom: null,
  highlightedRoom: null,
  defaultDates: null,
  // Actions și computed values...
}));

// Gym Store
const useTimelineStore = create((set) => ({
  showFullDay: false,
  selectedMember: null,
  // Actions...
}));
```

## Business-Specific Data Models

### Dental Timeline
```javascript
timeline = {
  reservations: [
    {
      id: 1,
      treatmentId: 1,
      displayTreatment: 'Treatment',
      color: '#fff',
      clientId: 2,
      clientName: 'Gabi',
      medicId: 1,
      medicName: 'Stefan',
      treatments: [
        {
          treatmentId: 1,
          treatmentName: 'Treatment',
          color: '#fff',
          price: 50,
        }
      ]
    }
  ]
}
```

### Hotel Timeline
```javascript
timeline = {
  bookings: [
    {
      id: 1,
      rooms: [
        {
          roomId: 102,
          startDate: '2025-06-12',
          endDate: '2025-06-14',
        }
      ],
      client: {
        clientId: 2,
        clientName: 'Andrei',
        language: 'RO',
        email: '',
        phone: '',
        registered: 'false',
      },
      general: {
        status: 'scheduled',
        isPaid: 'false',
        isConfirmed: 'false',
        createdBy: '',
      }
    }
  ]
}
```

### Gym Timeline
```javascript
timeline = {
  checkedIn: [
    {
      memberId: 1,
      memberName: 'Lucky',
      serviceId: 1,
      serviceName: 'Black',
      serviceChecked: 1,
      checkInTime: '14:00',
      checkOutTime: '',
    }
  ],
  classes: [
    {
      classId: 1,
      className: 'Zumba',
      occupancy: '15/20',
      teacher: 'Ion',
      startHour: '10:00',
    }
  ],
  occupancy: [
    {
      facilityId: 1,
      facilityName: 'Fitness',
      occupancy: '30/50',
    }
  ]
}
```

## API Endpoints

Toate timeline-urile folosesc aceleași endpoint-uri cu business type dinamic:

```javascript
// Configurație automată în ResourceRegistry
{
  timeline: {
    enableOffline: true,
    requiresAuth: true,
    forceServerFetch: true,
    requiresDateRange: true,
    apiEndpoints: {
      get: `/${businessType}/timeline`,
      post: `/${businessType}/timeline`,
      put: `/${businessType}/timeline/:id`,
      delete: `/${businessType}/timeline/:id`
    }
  }
}
```

## Utilizarea Hook-urilor

### Dental Timeline
```javascript
import { useDentalTimelineWithAPI } from '../store';

const DentalTimeline = () => {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const timeline = useDentalTimelineWithAPI({
    startDate,
    endDate,
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    data,
    loading,
    error,
    refresh,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointments,
    selectedDate,
    currentWeek,
    setSelectedDate,
    goToPreviousWeek,
    goToNextWeek,
    goToToday
  } = timeline;

  const { appointments, displayedAppointments } = getAppointments();

  // Component logic...
};
```

### Hotel Timeline
```javascript
import { useHotelTimelineWithAPI } from '../store';

const HotelTimeline = () => {
  const timeline = useHotelTimelineWithAPI({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    data,
    loading,
    error,
    refresh,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookings,
    selectedRoom,
    setSelectedRoom,
    isRoomAvailable
  } = timeline;

  const { bookings, rooms } = getBookings();

  // Component logic...
};
```

### Gym Timeline
```javascript
import { useGymTimelineWithAPI } from '../store';

const GymTimeline = () => {
  const timeline = useGymTimelineWithAPI({
    enableValidation: true,
    enableBusinessLogic: true
  });

  const {
    data,
    loading,
    error,
    refresh,
    checkInMember,
    checkOutMember,
    getGymData,
    getActiveMembers,
    getClassesAfterTime,
    calculateTotalOccupancy,
    showFullDay,
    setShowFullDay
  } = timeline;

  const { checkedIn, classes, occupancy } = getGymData();
  const activeMembers = getActiveMembers();

  // Component logic...
};
```

## Business-Specific Actions

### Dental Actions
```javascript
// Create appointment
const newAppointment = await createAppointment({
  clientName: 'John Doe',
  medicName: 'Dr. Smith',
  treatmentName: 'Cleaning',
  date: '2024-01-15',
  time: '10:00'
});

// Update appointment
await updateAppointment(appointmentId, { status: 'completed' });

// Delete appointment
await deleteAppointment(appointmentId);
```

### Hotel Actions
```javascript
// Create booking
const newBooking = await createBooking({
  clientName: 'Jane Doe',
  roomId: 102,
  startDate: '2024-01-15',
  endDate: '2024-01-17',
  email: 'jane@example.com',
  phone: '+1234567890'
});

// Update booking
await updateBooking(bookingId, { status: 'confirmed' });

// Delete booking
await deleteBooking(bookingId);
```

### Gym Actions
```javascript
// Check in member
const checkIn = await checkInMember({
  memberName: 'John Doe',
  serviceName: 'Premium',
  memberId: 123
});

// Check out member
await checkOutMember(memberId);
```

## Business-Specific Helpers

### Dental Helpers
```javascript
const { appointments, displayedAppointments, getAppointmentsCountForDate } = getAppointments();

// Filter appointments by medic
const medicAppointments = displayedAppointments;

// Get appointment count for specific date
const count = getAppointmentsCountForDate(new Date('2024-01-15'));
```

### Hotel Helpers
```javascript
const { bookings, rooms, isRoomAvailable } = getBookings();

// Check room availability
const available = isRoomAvailable(102, '2024-01-15', '2024-01-17');
```

### Gym Helpers
```javascript
const { checkedIn, classes, occupancy } = getGymData();

// Get current check-ins
const activeMembers = getActiveMembers();

// Get class schedule
const todayClasses = getClassesAfterTime('09:00');

// Get total occupancy
const totalOccupancy = calculateTotalOccupancy();
```

## Date Range Management

Toate timeline-urile suportă date range pentru filtrarea datelor:

```javascript
const timeline = useDentalTimelineWithAPI({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});

// Date range controls
<div className="date-controls">
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
  />
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
  />
  <button onClick={refresh}>Refresh Timeline</button>
</div>
```

## Week Navigation (Dental)

Navigarea săptămânală este disponibilă pentru dental timeline:

```javascript
const {
  selectedDate,
  currentWeek,
  goToPreviousWeek,
  goToNextWeek,
  goToToday
} = timeline;

<div className="week-navigation">
  <button onClick={goToPreviousWeek}>Previous Week</button>
  <button onClick={goToToday}>Today</button>
  <button onClick={goToNextWeek}>Next Week</button>
  <p>Current Week: {currentWeek[0]?.toLocaleDateString()} - {currentWeek[6]?.toLocaleDateString()}</p>
</div>
```

## Validation și Business Logic

Toate operațiile folosesc Strategy Pattern pentru validare și business logic:

```javascript
const { validateData, isOperationAllowed } = timeline;

// Validate form data
const validation = validateData(formData, 'create');
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}

// Check permissions
const canCreate = isOperationAllowed('createAppointment', formData);
const canUpdate = isOperationAllowed('updateAppointment', {});
const canDelete = isOperationAllowed('deleteAppointment', {});
```

## Error Handling și Loading States

```javascript
const { loading, error, isOnline, lastUpdated } = timeline;

if (loading) {
  return <div>Loading timeline...</div>;
}

if (error) {
  return (
    <div className="error">
      <h3>Error loading timeline:</h3>
      <p>{error.message}</p>
      <button onClick={refresh}>Retry</button>
    </div>
  );
}

if (!isOnline) {
  return <div>Offline mode - using cached data</div>;
}
```

## Integrarea cu Componentele Existente

### TimelineView.jsx
```javascript
import React from 'react';
import { getBusinessType } from '../config/businessTypes';
import DentalTimeline from './dental/DentalTimeline';
import GymTimeline from './gym/GymTimeline';
import HotelTimeline from './hotel/HotelTimeline';

const TimelineView = () => {
  const businessType = getBusinessType();

  const renderBusinessSpecificContent = () => {
    switch (businessType.name) {
      case 'Dental Clinic':
        return <DentalTimeline />;
      case 'Gym':
        return <GymTimeline />;
      case 'Hotel':
        return <HotelTimeline />;
      default:
        return <p>No timeline data available</p>;
    }
  };

  return (
    <div className={styles.dashboardView}>
      {renderBusinessSpecificContent()}
    </div>
  );
};
```

### DentalTimeline.jsx
```javascript
import React from 'react';
import { useDentalTimelineWithAPI } from '../store';
import Appointments from './Appointments';

const DentalTimeline = () => {
  const timeline = useDentalTimelineWithAPI({
    enableValidation: true,
    enableBusinessLogic: true
  });

  return (
    <div className={styles.timelineContent}>
      <Appointments timeline={timeline} />
    </div>
  );
};
```

## Beneficii ale Integrării

### ✅ Hook-uri Individuale
- Fiecare business type are propriul hook specializat
- API și state management integrat pentru fiecare tip
- Business-specific actions și helpers
- Validare și business logic integrat

### ✅ Business-Specific Features
- **Dental**: Appointments cu filtrare medic, week navigation
- **Hotel**: Bookings cu verificare disponibilitate camere
- **Gym**: Check-ins, clase, ocupare facilități

### ✅ Enhanced User Experience
- Actualizări în timp real
- Suport offline cu date cache
- Gestionarea erorilor și mecanisme de retry
- Loading states și feedback

### ✅ Maintainability
- Cod separat pentru fiecare business type
- Logica centralizată în hook-uri
- Ușor de extins pentru noi business-uri
- Testing simplificat

## Migrarea de la Store-urile Existente

Store-urile existente pot fi migrate treptat:

1. **Faza 1**: Folosește hook-urile cu API pentru componentele noi
2. **Faza 2**: Migrează componentele existente unul câte unul
3. **Faza 3**: Elimină store-urile vechi după migrarea completă

```javascript
// În loc de:
import useAppointmentsStore from '../store/dentalTimeline';

// Folosește:
import { useDentalTimelineWithAPI } from '../store';

const timeline = useDentalTimelineWithAPI(options);
```

## Următorii Pași

1. **Integrarea celorlalte resurse**: clients, packages, members, etc.
2. **Optimizări de performanță**: caching, lazy loading
3. **Funcționalități avansate**: real-time updates, conflict resolution
4. **Testing**: unit tests, integration tests
5. **Documentație**: API documentation, usage examples 