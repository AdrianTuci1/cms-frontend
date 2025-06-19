import React from 'react';
import styles from '../AddService.module.css';

const TreatmentForm = ({ formData, onInputChange, errors = {} }) => {
  const getFieldError = (fieldName) => {
    return errors[fieldName];
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

  const getTextareaClassName = (fieldName) => {
    const baseClass = styles.formTextarea;
    const errorClass = getFieldError(fieldName) ? styles.error : '';
    return `${baseClass} ${errorClass}`.trim();
  };

  return (
    <>
      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Treatment Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Treatment Name
            </label>
            <input
              type="text"
              className={getInputClassName('name')}
              value={formData.name || ''}
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder="Enter treatment name"
              required
            />
            {getFieldError('name') && (
              <div className={styles.errorMessage}>
                {getFieldError('name')}
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Price
            </label>
            <input
              type="number"
              className={getInputClassName('price')}
              min="0"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => onInputChange('price', e.target.value)}
              placeholder="Enter price"
              required
            />
            {getFieldError('price') && (
              <div className={styles.errorMessage}>
                {getFieldError('price')}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Duration (minutes)
            </label>
            <input
              type="number"
              className={getInputClassName('duration')}
              min="1"
              value={formData.duration || ''}
              onChange={(e) => onInputChange('duration', e.target.value)}
              placeholder="Enter duration"
              required
            />
            {getFieldError('duration') && (
              <div className={styles.errorMessage}>
                {getFieldError('duration')}
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Category
            </label>
            <select
              className={getSelectClassName('category')}
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
            {getFieldError('category') && (
              <div className={styles.errorMessage}>
                {getFieldError('category')}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
            Description
          </label>
          <textarea
            className={getTextareaClassName('description')}
            value={formData.description || ''}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Enter treatment description"
            required
          />
          {getFieldError('description') && (
            <div className={styles.errorMessage}>
              {getFieldError('description')}
            </div>
          )}
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Additional Details</h3>
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
    </>
  );
};

export default TreatmentForm; 