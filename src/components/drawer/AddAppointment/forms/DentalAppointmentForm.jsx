import React from 'react';
import styles from '../AddAppointment.module.css';

const DentalAppointmentForm = ({ formData, onInputChange }) => {
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
              className={styles.formInput}
              value={formData.patientName || ''}
              onChange={(e) => onInputChange('patientName', e.target.value)}
              placeholder="Enter patient name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Phone Number
            </label>
            <input
              type="tel"
              className={styles.formInput}
              value={formData.phoneNumber || ''}
              onChange={(e) => onInputChange('phoneNumber', e.target.value)}
              placeholder="Enter phone number"
              required
            />
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
              className={styles.formInput}
              value={formData.date || ''}
              onChange={(e) => onInputChange('date', e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Time
            </label>
            <input
              type="time"
              className={styles.formInput}
              value={formData.time || ''}
              onChange={(e) => onInputChange('time', e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Treatment Type
            </label>
            <select
              className={styles.formSelect}
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
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Dentist
            </label>
            <select
              className={styles.formSelect}
              value={formData.dentist || ''}
              onChange={(e) => onInputChange('dentist', e.target.value)}
              required
            >
              <option value="">Select dentist</option>
              <option value="dr_smith">Dr. Smith</option>
              <option value="dr_johnson">Dr. Johnson</option>
              <option value="dr_williams">Dr. Williams</option>
            </select>
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