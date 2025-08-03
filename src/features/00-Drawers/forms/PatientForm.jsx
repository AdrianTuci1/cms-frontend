import React, { useState } from 'react';
import { getBusinessTypeKey, getBusinessTypeKeyForSync } from '../../../../src/config/businessTypes';
import BaseForm from './BaseForm';
import styles from './PatientForm.module.css';

const PatientForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const businessTypeKey = getBusinessTypeKey();
  const businessTypeForSync = getBusinessTypeKeyForSync(businessTypeKey);
  const [activeView, setActiveView] = useState('details'); // 'details', 'appointments', or 'dental-notes'
  
  // Only show for dental clinics
  if (businessTypeKey !== 'DENTAL') {
    return null;
  }
  
  // Patient-specific fields for dental clinics
  const getFields = () => {
    return [
      { name: 'name', type: 'text', label: 'Full Name', required: true },
      { name: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
      { name: 'email', type: 'email', label: 'Email Address' },
      { name: 'dateOfBirth', type: 'date', label: 'Date of Birth' },
      { 
        name: 'gender', 
        type: 'select', 
        label: 'Gender', 
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' }
        ]
      },
      { name: 'address', type: 'textarea', label: 'Address', placeholder: 'Enter patient address...' },
      { name: 'emergencyContact', type: 'text', label: 'Emergency Contact Name' },
      { name: 'emergencyPhone', type: 'tel', label: 'Emergency Contact Phone' },
      { name: 'medicalHistory', type: 'textarea', label: 'Medical History', placeholder: 'Enter relevant medical history...' },
      { name: 'allergies', type: 'textarea', label: 'Allergies', placeholder: 'Enter any allergies...' },
      { name: 'notes', type: 'textarea', label: 'Notes', placeholder: 'Additional notes about the patient...' }
    ];
  };

  const getRequiredFields = () => {
    const fields = getFields();
    return fields.filter(field => field.required).map(field => field.name);
  };

  const handleSubmit = async (formData, mode) => {
    const processedData = {
      ...formData,
      businessType: businessTypeKey,
      type: 'patient',
      status: 'active',
      createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
      updatedAt: new Date().toISOString()
    };

    if (onSubmit) {
      await onSubmit(processedData, mode);
    }
  };

  const handleDelete = async (formData) => {
    if (onDelete) {
      await onDelete(formData);
    }
  };

  const renderAppointmentHistory = () => {
    // Mock data - in real app this would come from props or API
    const appointments = [
      { 
        id: 1, 
        date: '2024-01-15', 
        time: '10:00 AM', 
        type: 'Dental Cleaning', 
        status: 'Completed',
        doctor: 'Dr. Smith',
        notes: 'Regular cleaning, no issues found'
      },
      { 
        id: 2, 
        date: '2024-01-22', 
        time: '2:30 PM', 
        type: 'Cavity Filling', 
        status: 'Scheduled',
        doctor: 'Dr. Johnson',
        notes: 'Tooth #14 needs filling'
      },
      { 
        id: 3, 
        date: '2024-01-29', 
        time: '9:00 AM', 
        type: 'Consultation', 
        status: 'Confirmed',
        doctor: 'Dr. Smith',
        notes: 'Follow-up consultation'
      }
    ];

    return (
      <div className={styles['appointments-view']}>
        <h3>Appointment History</h3>
        <div className={styles['appointments-list']}>
          {appointments.map(appointment => (
            <div key={appointment.id} className={styles['appointment-card']}>
              <div className={styles['appointment-header']}>
                <div className={styles['appointment-date']}>
                  <strong>{appointment.date}</strong> at {appointment.time}
                </div>
                <div className={`${styles['appointment-status']} ${styles[`status-${appointment.status.toLowerCase()}`]}`}>
                  {appointment.status}
                </div>
              </div>
              <div className={styles['appointment-type']}>{appointment.type}</div>
              <div className={styles['appointment-doctor']}>Dr. {appointment.doctor}</div>
              {appointment.notes && (
                <div className={styles['appointment-notes']}>{appointment.notes}</div>
              )}
            </div>
          ))}
        </div>
        {appointments.length === 0 && (
          <p className={styles['no-appointments']}>No appointment history</p>
        )}
      </div>
    );
  };

  const renderDentalNotes = () => {
    // Mock dental notes data - in real app this would come from props or API
    const dentalNotes = [
      {
        id: 1,
        date: '2024-01-15',
        doctor: 'Dr. Smith',
        category: 'Treatment Plan',
        content: 'Patient needs root canal treatment on tooth #14. Scheduled for next week.',
        attachments: ['xray_jan15.pdf']
      },
      {
        id: 2,
        date: '2024-01-10',
        doctor: 'Dr. Johnson',
        category: 'Diagnosis',
        content: 'Cavity detected on tooth #14. Patient reports sensitivity to cold.',
        attachments: []
      },
      {
        id: 3,
        date: '2024-01-05',
        doctor: 'Dr. Smith',
        category: 'Follow-up',
        content: 'Patient completed cleaning. No new issues found. Recommend 6-month follow-up.',
        attachments: ['cleaning_report.pdf']
      }
    ];

    return (
      <div className={styles['dental-notes-view']}>
        <div className={styles['dental-notes-header']}>
          <h3>Dental Notes</h3>
          <button className={styles['add-note-btn']}>
            + Add Note
          </button>
        </div>
        <div className={styles['dental-notes-list']}>
          {dentalNotes.map(note => (
            <div key={note.id} className={styles['dental-note-card']}>
              <div className={styles['note-header']}>
                <div className={styles['note-date']}>
                  <strong>{note.date}</strong>
                </div>
                <div className={`${styles['note-category']} ${styles[`category-${note.category.toLowerCase().replace(' ', '-')}`]}`}>
                  {note.category}
                </div>
              </div>
              <div className={styles['note-doctor']}>Dr. {note.doctor}</div>
              <div className={styles['note-content']}>{note.content}</div>
              {note.attachments.length > 0 && (
                <div className={styles['note-attachments']}>
                  <strong>Attachments:</strong>
                  {note.attachments.map((attachment, index) => (
                    <span key={index} className={styles['attachment-link']}>
                      {attachment}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {dentalNotes.length === 0 && (
          <p className={styles['no-notes']}>No dental notes available</p>
        )}
      </div>
    );
  };

  const renderViewToggle = () => {
    return (
      <div className={styles['view-toggle']}>
        <button
          className={`${styles['toggle-btn']} ${activeView === 'details' ? styles.active : ''}`}
          onClick={() => setActiveView('details')}
        >
         Details
        </button>
        <button
          className={`${styles['toggle-btn']} ${activeView === 'dental-notes' ? styles.active : ''}`}
          onClick={() => setActiveView('dental-notes')}
        >
         Notes
        </button>
        <button
          className={`${styles['toggle-btn']} ${activeView === 'appointments' ? styles.active : ''}`}
          onClick={() => setActiveView('appointments')}
        >
         History
        </button>
      </div>
    );
  };

  return (
    <div className={styles['patient-form-container']}>
      {renderViewToggle()}
      
      {activeView === 'details' ? (
        <BaseForm
          mode={mode}
          data={data}
          fields={getFields()}
          required={getRequiredFields()}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onCancel={onCancel}
          isLoading={isLoading}
          title={`Patient ${mode === 'create' ? 'New' : mode === 'edit' ? 'Edit' : 'View'}`}
          businessType={businessTypeKey}
        />
      ) : activeView === 'dental-notes' ? (
                <div className={styles['dental-notes-container']}>
                {renderDentalNotes()}
              </div>
      ) : (
        <div className={styles['appointments-container']}>
          {renderAppointmentHistory()}
        </div>
      )}
    </div>
  );
};

export default PatientForm; 