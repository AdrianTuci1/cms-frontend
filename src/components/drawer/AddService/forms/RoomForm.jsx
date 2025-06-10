import React from 'react';
import styles from '../AddService.module.css';

const RoomForm = ({ formData, onInputChange }) => {
  return (
    <>
      <div className={styles.formSection}>
        <h3>Room Information</h3>
        <div className={styles.formGroup}>
          <label htmlFor="name">
            Room Name/Number<span className={styles.required}>*</span>
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
          <label htmlFor="type">
            Room Type<span className={styles.required}>*</span>
          </label>
          <select
            id="type"
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
      </div>

      <div className={styles.formSection}>
        <h3>Room Details</h3>
        <div className={styles.formGroup}>
          <label htmlFor="capacity">
            Capacity (persons)<span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="capacity"
            min="1"
            value={formData.capacity || ''}
            onChange={(e) => onInputChange('capacity', e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">
            Price per Night<span className={styles.required}>*</span>
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

        <div className={styles.formGroup}>
          <label htmlFor="floor">Floor</label>
          <input
            type="number"
            id="floor"
            value={formData.floor || ''}
            onChange={(e) => onInputChange('floor', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Amenities</h3>
        <div className={styles.formGroup}>
          <label htmlFor="amenities">Room Amenities</label>
          <textarea
            id="amenities"
            value={formData.amenities || ''}
            onChange={(e) => onInputChange('amenities', e.target.value)}
            placeholder="List the amenities available in this room"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bedType">
            Bed Type<span className={styles.required}>*</span>
          </label>
          <select
            id="bedType"
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
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Additional Details</h3>
        <div className={styles.formGroup}>
          <label htmlFor="view">Room View</label>
          <select
            id="view"
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

export default RoomForm; 