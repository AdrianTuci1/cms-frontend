import styles from './Appointments.module.css';
import { FaUser } from 'react-icons/fa';
import { MdMedicalServices } from 'react-icons/md';

const generateInitials = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const statusColors = {
  done: '#4caf50',        // Green for completed appointments
  upcoming: '#1976d2',    // Blue for upcoming appointments
  scheduled: '#1976d2',   // Blue for scheduled appointments (same as upcoming)
  missed: '#f44336',      // Red for missed appointments
  notpaid: '#ff9800',     // Orange for unpaid appointments
};

const AppointmentCard = ({
  appointment,
  onAppointmentClick,
  onPatientClick,
}) => {
  const {
    status = 'scheduled',
    displayTreatment = 'No Treatment',
    clientName,
    medicName,
    date,
    duration,
    color = '#1976d2'
  } = appointment;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const calculateEndTime = (dateString, duration) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + duration);
    return formatTime(date);
  };

  return (
    <div 
      className={styles.appointmentCard}
      style={{ borderTop: `5px solid ${statusColors[status] || '#1976d2'}` }}
      onClick={() => onAppointmentClick(appointment)}
    >
      {/* Status */}
      <div className={styles.appointmentStatus}>
        {status.toUpperCase()}
      </div>

      <div className={styles.divider}></div>

      {/* Treatment Name with Initials */}
      <div className={styles.treatmentInfo}>
        <div 
          className={styles.treatmentInitials}
          style={{ backgroundColor: color }}
        >
          {generateInitials(displayTreatment)}
        </div>
        <div className={styles.treatmentName}>
          {displayTreatment}
        </div>
      </div>

      {/* Time */}
      <div className={styles.appointmentTime}>
        {formatTime(date)} - {calculateEndTime(date, duration)}
      </div>

      {/* Patient Info */}
      <div 
        className={styles.patientInfo}
        onClick={(e) => {
          e.stopPropagation();
          onPatientClick(appointment);
        }}
      >
        <FaUser className={styles.patientAvatar} />
        <span className={styles.patientName}>
          {clientName}
        </span>
      </div>

      {/* Medic Info */}
      <div className={styles.medicInfo}>
        <MdMedicalServices className={styles.medicAvatar} />
        <span className={styles.medicName}>
          {medicName}
        </span>
      </div>
    </div>
  );
};

export default AppointmentCard; 