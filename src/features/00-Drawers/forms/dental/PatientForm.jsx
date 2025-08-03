import React, { useState, useEffect } from 'react';
import { FaUser, FaStickyNote, FaHistory, FaSpinner, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { getBusinessTypeKey, getBusinessTypeKeyForSync } from '../../../../../src/config/businessTypes';
import styles from './PatientForm.module.css';

const PatientForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const businessTypeKey = getBusinessTypeKey();
  const [activeView, setActiveView] = useState('details'); // 'details', 'notes', or 'history'
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Only show for dental clinics
  if (businessTypeKey !== 'DENTAL') {
    return null;
  }

  useEffect(() => {
    setFormData(data);
  }, [data]);

  // Simplified patient fields
  const getFields = () => {
    return [
      { name: 'fullName', type: 'text', label: 'Full Name', required: true },
      { name: 'birthYear', type: 'number', label: 'Birth Year', required: true, min: 1900, max: new Date().getFullYear() },
      { 
        name: 'gender', 
        type: 'select', 
        label: 'Gender', 
        required: true,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' }
        ]
      },
      { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
      { name: 'email', type: 'email', label: 'Email Address' },
      { name: 'address', type: 'textarea', label: 'Address', placeholder: 'Enter patient address...' },
      { name: 'notes', type: 'textarea', label: 'Notes', placeholder: 'Additional notes about the patient...' },
      { name: 'tags', type: 'text', label: 'Tags', placeholder: 'Enter tags separated by commas...' }
    ];
  };

  const getRequiredFields = () => {
    const fields = getFields();
    return fields.filter(field => field.required).map(field => field.name);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = getRequiredFields();
    
    requiredFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Validate birth year
    if (formData.birthYear) {
      const year = parseInt(formData.birthYear);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        newErrors.birthYear = 'Birth year must be between 1900 and current year';
      }
    }

    // Validate phone number
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
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
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsSubmitting(true);
    try {
      await onDelete(formData);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  const getInputClassName = (fieldName) => {
    const baseClass = styles.formInput;
    const errorClass = getFieldError(fieldName) ? styles.error : '';
    const successClass = formData[fieldName] && !getFieldError(fieldName) ? styles.success : '';
    return `${baseClass} ${errorClass} ${successClass}`.trim();
  };

  const getSelectClassName = (fieldName) => {
    const baseClass = styles.formSelect;
    const errorClass = getFieldError(fieldName) ? styles.error : '';
    const successClass = formData[fieldName] && !getFieldError(fieldName) ? styles.success : '';
    return `${baseClass} ${errorClass} ${successClass}`.trim();
  };

  const getTextareaClassName = (fieldName) => {
    const baseClass = styles.formTextarea;
    const errorClass = getFieldError(fieldName) ? styles.error : '';
    const successClass = formData[fieldName] && !getFieldError(fieldName) ? styles.success : '';
    return `${baseClass} ${errorClass} ${successClass}`.trim();
  };

  const renderField = (field) => {
    const { name, type, label, placeholder, required, options = [], ...props } = field;
    const isRequired = required;
    const error = getFieldError(name);

    switch (type) {
      case 'select':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label}
            </label>
            <select
              className={getSelectClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              disabled={mode === 'view' || isLoading}
              {...props}
            >
              <option value="">Select {label}</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label}
            </label>
            <textarea
              className={getTextareaClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              placeholder={placeholder || `Enter ${label}`}
              disabled={mode === 'view' || isLoading}
              {...props}
            />
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className={styles.formGroup} key={name}>
            <label className={`${styles.formLabel} ${isRequired ? styles.requiredLabel : ''}`}>
              {label}
            </label>
            <input
              type={type}
              className={getInputClassName(name)}
              value={formData[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              placeholder={placeholder || `Enter ${label}`}
              disabled={mode === 'view' || isLoading}
              {...props}
            />
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
          </div>
        );
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
    const isCreateMode = mode === 'create';
    
    return (
      <div className={styles['view-toggle']}>
        <button
          className={`${styles['toggle-btn']} ${activeView === 'details' ? styles.active : ''}`}
          onClick={() => setActiveView('details')}
        >
          <FaUser className={styles['toggle-icon']} />
        </button>
        <button
          className={`${styles['toggle-btn']} ${activeView === 'notes' ? styles.active : ''}`}
          onClick={() => setActiveView('notes')}
        >
          <FaStickyNote className={styles['toggle-icon']} />
        </button>
        <button
          className={`${styles['toggle-btn']} ${activeView === 'history' ? styles.active : ''} ${isCreateMode ? styles.disabled : ''}`}
          onClick={() => !isCreateMode && setActiveView('history')}
          disabled={isCreateMode}
        >
          <FaHistory className={styles['toggle-icon']} />
        </button>
      </div>
    );
  };

  const renderFormActions = () => {
    if (mode === 'view') {
      return (
        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton} 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <FaTimes />
            Close
          </button>
        </div>
      );
    }

    return (
      <div className={styles.formActions}>
        <button 
          type="button" 
          className={styles.cancelButton} 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <FaTimes />
          Cancel
        </button>
        
        {mode === 'edit' && onDelete && (
          <button 
            type="button" 
            className={styles.deleteButton} 
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className={styles.spinner} />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash />
                Delete
              </>
            )}
          </button>
        )}
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className={styles.spinner} />
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : (
            <>
              <FaSave />
              {mode === 'create' ? 'Create' : 'Save'}
            </>
          )}
        </button>
      </div>
    );
  };

  const renderFormContent = () => {
    if (activeView === 'details') {
      return (
        <div className={styles['form-content']}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formFields}>
              {getFields().map(field => renderField(field))}
            </div>
            {renderFormActions()}
          </form>
        </div>
      );
    } else if (activeView === 'notes') {
      return (
        <div className={styles['notes-content']}>
          {renderDentalNotes()}
        </div>
      );
    } else {
      return (
        <div className={styles['history-content']}>
          {renderAppointmentHistory()}
        </div>
      );
    }
  };

  return (
    <div className={styles['patient-form-container']}>
      {renderViewToggle()}
      {renderFormContent()}
    </div>
  );
};

export default PatientForm; 