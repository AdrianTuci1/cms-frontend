import React from 'react';
import styles from '../AddService.module.css';

const PackageForm = ({ formData, onInputChange }) => {
  return (
    <>
      <div className={styles.formSection}>
        <h3>Package Information</h3>
        <div className={styles.formGroup}>
          <label htmlFor="name">
            Package Name<span className={styles.required}>*</span>
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

        <div className={styles.formGroup}>
          <label htmlFor="validity">
            Validity Period (days)<span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="validity"
            min="1"
            value={formData.validity || ''}
            onChange={(e) => onInputChange('validity', e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Package Contents</h3>
        <div className={styles.formGroup}>
          <label htmlFor="sessions">
            Number of Sessions<span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="sessions"
            min="1"
            value={formData.sessions || ''}
            onChange={(e) => onInputChange('sessions', e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="treatments">Included Treatments</label>
          <textarea
            id="treatments"
            value={formData.treatments || ''}
            onChange={(e) => onInputChange('treatments', e.target.value)}
            placeholder="List the treatments included in this package"
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
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
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

export default PackageForm; 