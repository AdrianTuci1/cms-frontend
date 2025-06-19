import React from 'react';
import styles from '../AddAppointment.module.css';

const DentalAppointmentForm = ({ formData, onInputChange, errors = {} }) => {
  const getFieldError = (fieldName) => {
    return errors[fieldName] || errors.name; // Fallback to generic name error
  };

  const getInputClassName = (fieldName) => {
    const baseClass = styles.formInput;
    const errorClass = getFieldError(fieldName) ? styles.error : '';
    return `${baseClass} ${errorClass}`.trim();
  };

  const getSelectClassName = (fieldName) => {
    const baseClass = styles.formSelect;
    const errorClass = getFieldError(fieldName) ? styles.error : '';
    return `${baseClass} ${errorClass}`.trim();
  };

  return (
    <>
      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Patient Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Patient Name
            </label>
            <input
              type="text"
              className={getInputClassName('patientName')}
              value={formData.patientName || ''}
              onChange={(e) => onInputChange('patientName', e.target.value)}
              placeholder="Enter patient name"
              required
            />
            {getFieldError('patientName') && (
              <div className={styles.errorMessage}>
                {getFieldError('patientName')}
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Phone Number
            </label>
            <input
              type="tel"
              className={getInputClassName('phoneNumber')}
              value={formData.phoneNumber || ''}
              onChange={(e) => onInputChange('phoneNumber', e.target.value)}
              placeholder="Enter phone number"
              required
            />
            {getFieldError('phoneNumber') && (
              <div className={styles.errorMessage}>
                {getFieldError('phoneNumber')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Appointment Details</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Date
            </label>
            <input
              type="date"
              className={getInputClassName('date')}
              value={formData.date || ''}
              onChange={(e) => onInputChange('date', e.target.value)}
              required
            />
            {getFieldError('date') && (
              <div className={styles.errorMessage}>
                {getFieldError('date')}
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Time
            </label>
            <input
              type="time"
              className={getInputClassName('time')}
              value={formData.time || ''}
              onChange={(e) => onInputChange('time', e.target.value)}
              required
            />
            {getFieldError('time') && (
              <div className={styles.errorMessage}>
                {getFieldError('time')}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Treatment Type
            </label>
            <select
              className={getSelectClassName('treatmentType')}
              value={formData.treatmentType || ''}
              onChange={(e) => onInputChange('treatmentType', e.target.value)}
              required
            >
              <option value="">Select treatment type</option>
              <option value="checkup">Regular Checkup</option>
              <option value="cleaning">Teeth Cleaning</option>
              <option value="filling">Filling</option>
              <option value="extraction">Tooth Extraction</option>
              <option value="root_canal">Root Canal</option>
              <option value="crown">Crown</option>
              <option value="other">Other</option>
            </select>
            {getFieldError('treatmentType') && (
              <div className={styles.errorMessage}>
                {getFieldError('treatmentType')}
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Dentist
            </label>
            <select
              className={getSelectClassName('dentist')}
              value={formData.dentist || ''}
              onChange={(e) => onInputChange('dentist', e.target.value)}
              required
            >
              <option value="">Select dentist</option>
              <option value="dr_smith">Dr. Smith</option>
              <option value="dr_johnson">Dr. Johnson</option>
              <option value="dr_williams">Dr. Williams</option>
            </select>
            {getFieldError('dentist') && (
              <div className={styles.errorMessage}>
                {getFieldError('dentist')}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Notes
          </label>
          <textarea
            className={styles.formTextarea}
            value={formData.notes || ''}
            onChange={(e) => onInputChange('notes', e.target.value)}
            placeholder="Add any additional notes or special requirements"
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Insurance Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Insurance Provider
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.insuranceProvider || ''}
              onChange={(e) => onInputChange('insuranceProvider', e.target.value)}
              placeholder="Enter insurance provider"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Policy Number
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.policyNumber || ''}
              onChange={(e) => onInputChange('policyNumber', e.target.value)}
              placeholder="Enter policy number"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DentalAppointmentForm; 