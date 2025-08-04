import React, { useState } from 'react';
import styles from './Info.module.css';
import { 
  FaCalendarAlt, 
  FaUserMd, 
  FaStethoscope, 
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaCalendarPlus
} from 'react-icons/fa';

const Info = ({ 
  appointmentData, 
  onStatusChange, 
  onPostOpNotesChange, 
  onFollowUpChange,
  onNextAppointment,
  onPreviousAppointment,
  navigationState
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState(appointmentData?.postOpNotes || '');

  if (!appointmentData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Appointment Details</h3>
        </div>
        <div className={styles.noData}>
          <p>No appointment data available</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (date, time) => {
    if (!date) return 'N/A';
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return `${formattedDate} at ${time || 'TBD'}`;
  };

  const handleStatusToggle = () => {
    const newStatus = appointmentData.status === 'completed' ? 'scheduled' : 'completed';
    onStatusChange?.(appointmentData.id, newStatus);
  };

  const handleNextAppointment = () => {
    onNextAppointment?.();
  };

  const handlePreviousAppointment = () => {
    onPreviousAppointment?.();
  };

  const handleFollowUp = () => {
    // Logic to add follow-up
    console.log('Add follow-up');
  };

  const handleSaveNotes = () => {
    onPostOpNotesChange?.(appointmentData.id, tempNotes);
    setIsEditingNotes(false);
  };

  const handleCancelNotes = () => {
    setTempNotes(appointmentData.postOpNotes || '');
    setIsEditingNotes(false);
  };

  const handleNotesClick = () => {
    if (!isEditingNotes) {
      setIsEditingNotes(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Appointment Details</h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.columns}>
          {/* Prima coloană */}
          <div className={styles.column}>
            <div className={styles.field}>
              <label>Date & Time</label>
              <div className={styles.value}>
                <FaCalendarAlt className={styles.fieldIcon} />
                {formatDateTime(appointmentData.date, appointmentData.time)}
              </div>
            </div>
            
            <div className={styles.field}>
              <label>Medic</label>
              <div className={styles.value}>
                <FaUserMd className={styles.fieldIcon} />
                {appointmentData.medicName || 'N/A'}
              </div>
            </div>
            
            <div className={styles.field}>
              <label>Treatment</label>
              <div className={styles.value}>
                <FaStethoscope className={styles.fieldIcon} />
                {appointmentData.displayTreatment || 'N/A'}
              </div>
            </div>
          </div>

          {/* A doua coloană - doar Post-Op Notes */}
          <div className={styles.column}>
            <div className={styles.field}>
              <label>Post-Op Notes</label>
              {isEditingNotes ? (
                <div className={styles.editContainer}>
                  <textarea
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    className={styles.editTextarea}
                    placeholder="Enter post-operative notes..."
                    autoFocus
                  />
                  <div className={styles.editActions}>
                    <button className={styles.saveButton} onClick={handleSaveNotes}>
                      <FaSave />
                      Save
                    </button>
                    <button className={styles.cancelButton} onClick={handleCancelNotes}>
                      <FaTimes />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className={styles.notesContainer}
                  onClick={handleNotesClick}
                >
                  <div className={styles.notes}>
                    {appointmentData.postOpNotes || 'Click to add notes...'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Butoanele pe rândul de jos */}
        <div className={styles.actions}>
          <button 
            className={`${styles.actionButton} ${!navigationState?.canGoPrevious ? styles.disabled : ''}`}
            onClick={handlePreviousAppointment}
            disabled={!navigationState?.canGoPrevious}
          >
            <FaArrowLeft />
            Previous
          </button>
          
          <button 
            className={`${styles.actionButton} ${styles.primaryButton} ${appointmentData.status === 'completed' ? styles.completed : ''}`}
            onClick={handleStatusToggle}
          >
            <FaCheckCircle />
            {appointmentData.status === 'completed' ? 'Completed' : 'Mark as Completed'}
          </button>
          
          <button className={styles.actionButton} onClick={handleFollowUp}>
            <FaCalendarPlus />
            Follow-up
          </button>
          
          <button 
            className={`${styles.actionButton} ${!navigationState?.canGoNext ? styles.disabled : ''}`}
            onClick={handleNextAppointment}
            disabled={!navigationState?.canGoNext}
          >
            Next
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Info; 