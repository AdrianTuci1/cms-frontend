import React from 'react';
import styles from '../AddService.module.css';

const TreatmentForm = ({ formData, onInputChange }) => {
  return (
    <>
      <div className={styles.formSection}>
        <h3>Treatment Information</h3>
        <div className={styles.formGroup}>
          <label htmlFor="name">
            Treatment Name<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name || ''}
            onChange={(e) => onInputChange('name', e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">
            Description<span className={styles.required}>*</span>
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => onInputChange('description', e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="duration">
            Duration (minutes)<span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="duration"
            min="1"
            value={formData.duration || ''}
            onChange={(e) => onInputChange('duration', e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">
            Price<span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="price"
            min="0"
            step="0.01"
            value={formData.price || ''}
            onChange={(e) => onInputChange('price', e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Additional Details</h3>
        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={formData.category || ''}
            onChange={(e) => onInputChange('category', e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="cleaning">Cleaning</option>
            <option value="whitening">Whitening</option>
            <option value="filling">Filling</option>
            <option value="extraction">Extraction</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => onInputChange('notes', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default TreatmentForm; 