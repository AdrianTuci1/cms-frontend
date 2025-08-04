import React, { useState, useMemo } from 'react';
import styles from './BlitzOverview.module.css';
import General from '../components/General';
import Info from '../components/Info';
import Upcoming from '../components/Upcoming';

const BlitzOverview = () => {
  // Generate current week dates
  const currentWeekDates = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date);
    }
    return week;
  }, []);

  // Mock data - în viitor acestea vor fi înlocuite cu date reale din API/store
  const [currentPatient, setCurrentPatient] = useState({
    fullName: 'John Doe',
    birthYear: 1985,
    gender: 'male',
    phone: '+40 123 456 789',
    email: 'john.doe@example.com',
    address: 'Strada Exemplu, Nr. 123, București',
    tags: 'VIP, Regular, Allergic',
    notes: 'Patient has mild allergy to penicillin. Prefers morning appointments.'
  });

  const [currentAppointment, setCurrentAppointment] = useState({
    id: '1',
    clientName: 'John Doe',
    medicName: 'Dr. Maria Popescu',
    displayTreatment: 'Dental Cleaning & Check-up',
    date: currentWeekDates[0].toISOString().split('T')[0], // Monday
    time: '10:00',
    status: 'scheduled',
    postOpNotes: '',
    followUp: ''
  });

  const [selectedAppointmentId, setSelectedAppointmentId] = useState('1');
  const [selectedDate, setSelectedDate] = useState(new Date(currentWeekDates[0]));

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: '1',
      clientName: 'John Doe',
      medicName: 'Dr. Maria Popescu',
      displayTreatment: 'Dental Cleaning & Check-up',
      date: currentWeekDates[0].toISOString().split('T')[0], // Monday
      time: '10:00',
      status: 'scheduled'
    },
    {
      id: '2',
      clientName: 'Jane Smith',
      medicName: 'Dr. Ion Vasilescu',
      displayTreatment: 'Root Canal Treatment',
      date: currentWeekDates[0].toISOString().split('T')[0], // Monday
      time: '11:30',
      status: 'scheduled'
    },
    {
      id: '3',
      clientName: 'Mike Johnson',
      medicName: 'Dr. Ana Dumitrescu',
      displayTreatment: 'Tooth Extraction',
      date: currentWeekDates[1].toISOString().split('T')[0], // Tuesday
      time: '14:00',
      status: 'scheduled'
    },
    {
      id: '4',
      clientName: 'Sarah Wilson',
      medicName: 'Dr. George Ionescu',
      displayTreatment: 'Dental Implant',
      date: currentWeekDates[1].toISOString().split('T')[0], // Tuesday
      time: '15:30',
      status: 'scheduled'
    },
    {
      id: '5',
      clientName: 'Alex Brown',
      medicName: 'Dr. Elena Popa',
      displayTreatment: 'Crown Placement',
      date: currentWeekDates[2].toISOString().split('T')[0], // Wednesday
      time: '09:00',
      status: 'scheduled'
    },
    {
      id: '6',
      clientName: 'Maria Garcia',
      medicName: 'Dr. Stefan Munteanu',
      displayTreatment: 'Teeth Whitening',
      date: currentWeekDates[2].toISOString().split('T')[0], // Wednesday
      time: '10:30',
      status: 'scheduled'
    },
    {
      id: '7',
      clientName: 'David Lee',
      medicName: 'Dr. Cristina Radu',
      displayTreatment: 'Braces Consultation',
      date: currentWeekDates[3].toISOString().split('T')[0], // Thursday
      time: '13:00',
      status: 'scheduled'
    },
    {
      id: '8',
      clientName: 'Emma Davis',
      medicName: 'Dr. Andrei Ionescu',
      displayTreatment: 'Regular Check-up',
      date: currentWeekDates[4].toISOString().split('T')[0], // Friday
      time: '16:00',
      status: 'scheduled'
    },
    {
      id: '9',
      clientName: 'Robert Wilson',
      medicName: 'Dr. Laura Dumitru',
      displayTreatment: 'Gum Treatment',
      date: currentWeekDates[4].toISOString().split('T')[0], // Friday
      time: '17:30',
      status: 'scheduled'
    },
    {
      id: '10',
      clientName: 'Lisa Anderson',
      medicName: 'Dr. Victor Popescu',
      displayTreatment: 'Emergency Treatment',
      date: currentWeekDates[5].toISOString().split('T')[0], // Saturday
      time: '11:00',
      status: 'scheduled'
    }
  ]);

  // Sort appointments by date and time for proper navigation
  const sortedAppointments = useMemo(() => {
    return [...upcomingAppointments].sort((a, b) => {
      const dateA = new Date(a.date + ' ' + (a.time || '00:00'));
      const dateB = new Date(b.date + ' ' + (b.time || '00:00'));
      return dateA - dateB;
    });
  }, [upcomingAppointments]);

  // Get navigation state
  const navigationState = useMemo(() => {
    const currentIndex = sortedAppointments.findIndex(app => app.id === selectedAppointmentId);
    return {
      canGoPrevious: sortedAppointments.length > 1, // Can always go previous (jumps to last)
      canGoNext: sortedAppointments.length > 1, // Can always go next (jumps to first)
      currentIndex,
      totalAppointments: sortedAppointments.length
    };
  }, [sortedAppointments, selectedAppointmentId]);

  const handlePreviousAppointment = () => {
    const currentIndex = sortedAppointments.findIndex(app => app.id === selectedAppointmentId);
    if (currentIndex > 0) {
      const previousAppointment = sortedAppointments[currentIndex - 1];
      setSelectedAppointmentId(previousAppointment.id);
      setCurrentAppointment(previousAppointment);
      setSelectedDate(new Date(previousAppointment.date));
    } else if (sortedAppointments.length > 0) {
      // Jump to the last appointment if we're at the first one
      const lastAppointment = sortedAppointments[sortedAppointments.length - 1];
      setSelectedAppointmentId(lastAppointment.id);
      setCurrentAppointment(lastAppointment);
      setSelectedDate(new Date(lastAppointment.date));
    }
  };

  const handleNextAppointment = () => {
    const currentIndex = sortedAppointments.findIndex(app => app.id === selectedAppointmentId);
    if (currentIndex < sortedAppointments.length - 1) {
      const nextAppointment = sortedAppointments[currentIndex + 1];
      setSelectedAppointmentId(nextAppointment.id);
      setCurrentAppointment(nextAppointment);
      setSelectedDate(new Date(nextAppointment.date));
    } else if (sortedAppointments.length > 0) {
      // Jump to the first appointment if we're at the last one
      const firstAppointment = sortedAppointments[0];
      setSelectedAppointmentId(firstAppointment.id);
      setCurrentAppointment(firstAppointment);
      setSelectedDate(new Date(firstAppointment.date));
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    // Find the first appointment for the selected date
    const dateKey = date.toDateString();
    const appointmentsForDate = upcomingAppointments.filter(app => {
      if (!app.date) return false;
      const appDate = new Date(app.date);
      return appDate.toDateString() === dateKey;
    });

    if (appointmentsForDate.length > 0) {
      // Sort appointments for this date by time and select the first one
      const sortedAppointmentsForDate = appointmentsForDate.sort((a, b) => {
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        return timeA.localeCompare(timeB);
      });
      
      const firstAppointmentForDate = sortedAppointmentsForDate[0];
      setSelectedAppointmentId(firstAppointmentForDate.id);
      setCurrentAppointment(firstAppointmentForDate);
    } else {
      // If no appointments for this date, keep the current appointment but update the date view
      // This allows users to see the date even if there are no appointments
      console.log('No appointments found for selected date:', dateKey);
    }
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setCurrentAppointment(prev => ({
      ...prev,
      status: newStatus
    }));
    
    setUpcomingAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId 
          ? { ...app, status: newStatus }
          : app
      )
    );
  };

  const handlePostOpNotesChange = (appointmentId, notes) => {
    setCurrentAppointment(prev => ({
      ...prev,
      postOpNotes: notes
    }));
  };

  const handleFollowUpChange = (appointmentId, followUp) => {
    setCurrentAppointment(prev => ({
      ...prev,
      followUp: followUp
    }));
  };

  const handleSelectAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setSelectedAppointmentId(appointment.id);
    // Don't automatically set selectedDate here to allow manual date selection
    // setSelectedDate(new Date(appointment.date));
    // Aici ar trebui să încărcăm și datele pacientului pentru această programare
    // setCurrentPatient(patientData);
  };

  const handleMarkCompleted = (appointmentId) => {
    setUpcomingAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId 
          ? { ...app, status: 'completed' }
          : app
      )
    );
  };

  const handleSkipAppointment = (appointmentId) => {
    setUpcomingAppointments(prev => 
      prev.filter(app => app.id !== appointmentId)
    );
  };

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.firstColumn}>
        <General patientData={currentPatient} />
      </div>
      <div className={styles.secondColumn}>
        <div className={styles.firstRow}>
          <Info 
            appointmentData={currentAppointment}
            onStatusChange={handleStatusChange}
            onPostOpNotesChange={handlePostOpNotesChange}
            onFollowUpChange={handleFollowUpChange}
            onNextAppointment={handleNextAppointment}
            onPreviousAppointment={handlePreviousAppointment}
            navigationState={navigationState}
          />
        </div>
        <div className={styles.secondRow}>
          <Upcoming 
            upcomingAppointments={upcomingAppointments}
            selectedAppointmentId={selectedAppointmentId}
            selectedDate={selectedDate}
            onSelectAppointment={handleSelectAppointment}
            onDateSelect={handleDateSelect}
            onMarkCompleted={handleMarkCompleted}
            onSkipAppointment={handleSkipAppointment}
          />
        </div>
      </div>
    </div>
  );
};

export default BlitzOverview;