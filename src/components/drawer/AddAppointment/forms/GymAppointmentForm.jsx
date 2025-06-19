import React from 'react';
import styles from '../AddAppointment.module.css';

const GymAppointmentForm = ({ formData, onInputChange, errors = {} }) => {
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
        <h3 className={styles.formSectionTitle}>Client Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Client Name
            </label>
            <input
              type="text"
              className={getInputClassName('clientName')}
              value={formData.clientName || ''}
              onChange={(e) => onInputChange('clientName', e.target.value)}
              placeholder="Enter client name"
              required
            />
            {getFieldError('clientName') && (
              <div className={styles.errorMessage}>
                {getFieldError('clientName')}
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
        <h3 className={styles.formSectionTitle}>Training Session Details</h3>
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
              Training Type
            </label>
            <select
              className={getSelectClassName('trainingType')}
              value={formData.trainingType || ''}
              onChange={(e) => onInputChange('trainingType', e.target.value)}
              required
            >
              <option value="">Select training type</option>
              <option value="personal">Personal Training</option>
              <option value="group">Group Training</option>
              <option value="cardio">Cardio Session</option>
              <option value="strength">Strength Training</option>
              <option value="yoga">Yoga</option>
              <option value="pilates">Pilates</option>
              <option value="crossfit">CrossFit</option>
            </select>
            {getFieldError('trainingType') && (
              <div className={styles.errorMessage}>
                {getFieldError('trainingType')}
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Trainer
            </label>
            <select
              className={getSelectClassName('trainer')}
              value={formData.trainer || ''}
              onChange={(e) => onInputChange('trainer', e.target.value)}
              required
            >
              <option value="">Select trainer</option>
              <option value="trainer1">John Smith</option>
              <option value="trainer2">Sarah Johnson</option>
              <option value="trainer3">Mike Williams</option>
            </select>
            {getFieldError('trainer') && (
              <div className={styles.errorMessage}>
                {getFieldError('trainer')}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Duration
            </label>
            <select
              className={getSelectClassName('duration')}
              value={formData.duration || ''}
              onChange={(e) => onInputChange('duration', e.target.value)}
              required
            >
              <option value="">Select duration</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
            {getFieldError('duration') && (
              <div className={styles.errorMessage}>
                {getFieldError('duration')}
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Equipment Needed
            </label>
            <select
              className={getSelectClassName('equipment')}
              value={formData.equipment || ''}
              onChange={(e) => onInputChange('equipment', e.target.value)}
              required
            >
              <option value="">Select equipment</option>
              <option value="none">No special equipment</option>
              <option value="weights">Free weights</option>
              <option value="machines">Exercise machines</option>
              <option value="cardio">Cardio equipment</option>
              <option value="yoga">Yoga equipment</option>
            </select>
            {getFieldError('equipment') && (
              <div className={styles.errorMessage}>
                {getFieldError('equipment')}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Special Requirements
          </label>
          <textarea
            className={styles.formTextarea}
            value={formData.requirements || ''}
            onChange={(e) => onInputChange('requirements', e.target.value)}
            placeholder="Add any special requirements or notes"
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Membership Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Membership Type
            </label>
            <select
              className={getSelectClassName('membershipType')}
              value={formData.membershipType || ''}
              onChange={(e) => onInputChange('membershipType', e.target.value)}
              required
            >
              <option value="">Select membership type</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
              <option value="trial">Trial</option>
            </select>
            {getFieldError('membershipType') && (
              <div className={styles.errorMessage}>
                {getFieldError('membershipType')}
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Membership Number
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.membershipNumber || ''}
              onChange={(e) => onInputChange('membershipNumber', e.target.value)}
              placeholder="Enter membership number"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GymAppointmentForm; 