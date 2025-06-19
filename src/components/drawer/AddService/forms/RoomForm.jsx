import React from 'react';
import styles from '../AddService.module.css';

const RoomForm = ({ formData, onInputChange, errors = {} }) => {
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
        <h3 className={styles.formSectionTitle}>Room Information</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Room Name/Number
            </label>
            <input
              type="text"
              className={getInputClassName('name')}
              value={formData.name || ''}
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder="Enter room name or number"
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
              Room Type
            </label>
            <select
              className={getSelectClassName('type')}
              value={formData.type || ''}
              onChange={(e) => onInputChange('type', e.target.value)}
              required
            >
              <option value="">Select room type</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="executive">Executive</option>
              <option value="presidential">Presidential</option>
            </select>
            {getFieldError('type') && (
              <div className={styles.errorMessage}>
                {getFieldError('type')}
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
            placeholder="Enter room description"
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
        <h3 className={styles.formSectionTitle}>Room Details</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Capacity (persons)
            </label>
            <input
              type="number"
              className={getInputClassName('capacity')}
              min="1"
              value={formData.capacity || ''}
              onChange={(e) => onInputChange('capacity', e.target.value)}
              placeholder="Enter capacity"
              required
            />
            {getFieldError('capacity') && (
              <div className={styles.errorMessage}>
                {getFieldError('capacity')}
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Price per Night
            </label>
            <input
              type="number"
              className={getInputClassName('price')}
              min="0"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => onInputChange('price', e.target.value)}
              placeholder="Enter price per night"
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
            <label className={styles.formLabel}>
              Floor
            </label>
            <input
              type="number"
              className={styles.formInput}
              value={formData.floor || ''}
              onChange={(e) => onInputChange('floor', e.target.value)}
              placeholder="Enter floor number"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.requiredLabel}`}>
              Bed Type
            </label>
            <select
              className={getSelectClassName('bedType')}
              value={formData.bedType || ''}
              onChange={(e) => onInputChange('bedType', e.target.value)}
              required
            >
              <option value="">Select bed type</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="queen">Queen</option>
              <option value="king">King</option>
              <option value="twin">Twin</option>
            </select>
            {getFieldError('bedType') && (
              <div className={styles.errorMessage}>
                {getFieldError('bedType')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Amenities</h3>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Room Amenities
          </label>
          <textarea
            className={styles.formTextarea}
            value={formData.amenities || ''}
            onChange={(e) => onInputChange('amenities', e.target.value)}
            placeholder="List the amenities available in this room"
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Additional Details</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Room View
            </label>
            <select
              className={styles.formSelect}
              value={formData.view || ''}
              onChange={(e) => onInputChange('view', e.target.value)}
            >
              <option value="">Select view type</option>
              <option value="city">City View</option>
              <option value="garden">Garden View</option>
              <option value="ocean">Ocean View</option>
              <option value="mountain">Mountain View</option>
              <option value="pool">Pool View</option>
            </select>
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
      </div>
    </>
  );
};

export default RoomForm; 