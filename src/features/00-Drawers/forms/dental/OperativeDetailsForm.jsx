import React, { useState, useEffect } from 'react';
import useDrawerStore from '../../store/drawerStore';
import styles from './OperativeDetailsForm.module.css';

const OperativeDetailsForm = ({ mode, data, onSubmit, onDelete, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    postOperativeNotes: '',
    prescription: '',
    price: '',
    paid: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        postOperativeNotes: data.postOperativeNotes || '',
        prescription: data.prescription || '',
        price: data.price || '',
        paid: data.paid || false
      });
    }
  }, [data]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.postOperativeNotes.trim()) {
      newErrors.postOperativeNotes = 'Post-operative notes are required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price is required and must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const processedData = {
        ...formData,
        price: parseFloat(formData.price),
        createdAt: mode === 'create' ? new Date().toISOString() : data?.createdAt,
        updatedAt: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(processedData, mode);
        console.log(`Operative details ${mode === 'create' ? 'created' : 'updated'} successfully`);
      }
    } catch (error) {
      console.error(`Failed to ${mode === 'create' ? 'create' : 'update'} operative details:`, error);
      alert(`Failed to ${mode === 'create' ? 'create' : 'update'} operative details. Please try again.`);
    }
  };



  return (
    <div className={styles.formContainer}>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formFields}>
          <div className={styles.formGroup}>
            <label htmlFor="postOperativeNotes" className={styles.label}>
              Post-Operative Notes *
            </label>
            <textarea
              id="postOperativeNotes"
              value={formData.postOperativeNotes}
              onChange={(e) => handleInputChange('postOperativeNotes', e.target.value)}
              className={`${styles.textarea} ${errors.postOperativeNotes ? styles.error : ''}`}
              placeholder="Enter post-operative notes and observations..."
              rows={4}
              disabled={isLoading}
            />
            {errors.postOperativeNotes && (
              <span className={styles.errorMessage}>{errors.postOperativeNotes}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="prescription" className={styles.label}>
              Prescription
            </label>
            <textarea
              id="prescription"
              value={formData.prescription}
              onChange={(e) => handleInputChange('prescription', e.target.value)}
              className={styles.textarea}
              placeholder="Enter prescription details..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>
              Price *
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className={`${styles.input} ${errors.price ? styles.error : ''}`}
              placeholder="Enter treatment price..."
              min="0"
              step="0.01"
              disabled={isLoading}
            />
            {errors.price && (
              <span className={styles.errorMessage}>{errors.price}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.paid}
                onChange={(e) => handleInputChange('paid', e.target.checked)}
                className={styles.checkbox}
                disabled={isLoading}
              />
              <span className={styles.checkboxText}>Paid</span>
            </label>
            <p className={styles.description}>Mark if the treatment has been paid for</p>
          </div>
        </div>


      </form>
    </div>
  );
};

export default OperativeDetailsForm; 