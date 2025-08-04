import React, { useState, useMemo } from 'react';
import styles from './Upcoming.module.css';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaStethoscope,
  FaCheckCircle
} from 'react-icons/fa';

const Upcoming = ({ 
  upcomingAppointments, 
  selectedAppointmentId,
  selectedDate,
  onSelectAppointment, 
  onDateSelect,
  onMarkCompleted, 
  onSkipAppointment 
}) => {
  const [internalSelectedDate, setInternalSelectedDate] = useState(new Date());

  // Use selectedDate from props if provided, otherwise use internal state
  const currentSelectedDate = selectedDate || internalSelectedDate;


  // Generate week dates starting from Monday
  const weekDates = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Sunday = 0, so we need -6 to get to Monday
    
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

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const grouped = {};
    if (upcomingAppointments) {
      upcomingAppointments.forEach(appointment => {
        let dateKey;
        if (appointment.date) {
          // Handle different date formats
          const dateObj = new Date(appointment.date);
          if (isNaN(dateObj.getTime())) {
            console.warn('Invalid date format:', appointment.date);
            dateKey = 'TBD';
          } else {
            dateKey = dateObj.toDateString();
          }
        } else {
          dateKey = 'TBD';
        }
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(appointment);
      });
    }

    return grouped;
  }, [upcomingAppointments]);

  // Get appointments for selected date
  const selectedDateAppointments = useMemo(() => {
    const dateKey = currentSelectedDate.toDateString();
    return appointmentsByDate[dateKey] || [];
  }, [currentSelectedDate, appointmentsByDate]);

  const formatTime = (time) => {
    if (!time) return 'TBD';
    return time;
  };

  const formatDate = (date) => {
    if (!date) return 'TBD';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatWeekDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short'
    });
  };



  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === currentSelectedDate.toDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return styles.completed;
      case 'in-progress':
        return styles.inProgress;
      case 'scheduled':
        return styles.scheduled;
      default:
        return styles.scheduled;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className={styles.statusIcon} />;
      case 'in-progress':
        return <FaClock className={styles.statusIcon} />;
      default:
        return <FaCalendarAlt className={styles.statusIcon} />;
    }
  };

  const handleAppointmentClick = (appointment) => {
    onSelectAppointment?.(appointment);
  };

  const isAppointmentSelected = (appointment) => {
    return appointment.id === selectedAppointmentId;
  };



  const handleDateSelect = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    } else {
      setInternalSelectedDate(date);
    }
  };

  if (!upcomingAppointments || upcomingAppointments.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <p>No upcoming appointments</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Week View Header */}
      <div className={styles.weekHeader}>
        <div className={styles.weekDates}>
          {weekDates.map((date, index) => {
            const dateKey = date.toDateString();
            const appointmentCount = appointmentsByDate[dateKey]?.length || 0;
            
            return (
              <div
                key={index}
                className={`${styles.weekDate} ${
                  isToday(date) ? styles.today : ''
                } ${isSelected(date) ? styles.selected : ''}`}
                onClick={() => handleDateSelect(date)}
              >
                <div className={styles.weekDateText}>
                  {formatWeekDate(date)}
                </div>
                {appointmentCount > 0 && (
                  <div className={styles.appointmentCountCircle}>
                    {appointmentCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      
      {/* Appointments Content */}
      <div className={styles.content}>
        {selectedDateAppointments.length === 0 ? (
          <div className={styles.noAppointments}>
            <p>No appointments for {currentSelectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        ) : (
          <div className={styles.appointmentsRow}>
            {selectedDateAppointments.map((appointment, index) => (
              <div 
                key={appointment.id || index}
                className={`${styles.appointmentCard} ${getStatusColor(appointment.status)} ${
                  isAppointmentSelected(appointment) ? styles.selectedAppointment : ''
                }`}
                onClick={() => handleAppointmentClick(appointment)}
              >
                <div className={styles.appointmentHeader}>
                  <div className={styles.timeInfo}>
                    <div className={styles.time}>
                      <FaClock className={styles.timeIcon} />
                      {formatTime(appointment.time)}
                    </div>
                    <div className={styles.date}>
                      {formatDate(appointment.date)}
                    </div>
                  </div>
                  
                  <div className={styles.status}>
                    {getStatusIcon(appointment.status)}
                    <span className={styles.statusText}>
                      {appointment.status === 'completed' ? 'Completed' : 
                       appointment.status === 'in-progress' ? 'In Progress' : 'Scheduled'}
                    </span>
                  </div>
                </div>

                <div className={styles.appointmentDetails}>
                  <div className={styles.patientInfo}>
                    <FaUser className={styles.patientIcon} />
                    <div className={styles.patientName}>
                      {appointment.clientName || 'Unknown Patient'}
                    </div>
                  </div>
                  
                  <div className={styles.treatmentInfo}>
                    <FaStethoscope className={styles.treatmentIcon} />
                    <div className={styles.treatmentName}>
                      {appointment.displayTreatment || 'No treatment specified'}
                    </div>
                  </div>
                  
                  {appointment.medicName && (
                    <div className={styles.medicInfo}>
                      <span className={styles.medicLabel}>Medic:</span>
                      <span className={styles.medicName}>{appointment.medicName}</span>
                    </div>
                  )}
                </div>


              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upcoming; 