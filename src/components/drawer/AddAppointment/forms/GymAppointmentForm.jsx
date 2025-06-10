import React from 'react';
import styles from '../AddAppointment.module.css';

const GymAppointmentForm = ({ formData, onInputChange }) => {
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
              className={styles.formInput}
              value={formData.clientName || ''}
              onChange={(e) => onInputChange('clientName', e.target.value)}
              placeholder="Enter client name"
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
        <h3 className={styles.formSectionTitle}>Training Session Details</h3>
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
              Training Type
            </label>
            <select
              className={styles.formSelect}
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
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Trainer
            </label>
            <select
              className={styles.formSelect}
              value={formData.trainer || ''}
              onChange={(e) => onInputChange('trainer', e.target.value)}
              required
            >
              <option value="">Select trainer</option>
              <option value="trainer1">John Smith</option>
              <option value="trainer2">Sarah Johnson</option>
              <option value="trainer3">Mike Williams</option>
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Duration
            </label>
            <select
              className={styles.formSelect}
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
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Equipment Needed
            </label>
            <select
              className={styles.formSelect}
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
              className={styles.formSelect}
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